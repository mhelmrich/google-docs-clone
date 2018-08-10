const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('./models/User');
const Document = require('./models/Document');
const auth = require('./routes/auth');

mongoose.connection.on('connected', () => {
  console.log('Connected to database!');
});
mongoose.connect(process.env.MONGODB_URI);
const MongoStore = connectMongo(session);

app.use(bodyParser.json());
app.use(session({
  secret: process.env.SECRET,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    stringify: false
  })
}));

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({username}, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false);
    if (user.password !== password) return done(null, false);
    return done(null, user);
  });
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', auth(passport));

io.on('connection', (socket) => {
  socket.on('authenticate', (sessionID) => {
    mongoose.connection.db.collection('sessions', (err, sessions) => {
      sessions.findOne({_id: sessionID})
      .then((session) => {
        if (session) return User.findById(session.session.passport.user);
        throw new Error('session invalid');
      })
      .then((user) => {
        if (user) {
          socket.user = user;
          socket.emit('authenticated',
            {username: user.username,
              _id: user._id,
              docs: user.docs,
              sharedDocs: user.sharedDocs,
            });
        } else throw new Error('user not found');
      })
      .catch((err) => {
        socket.emit('authenticationFailed', err.message);
      });
    });
  });
  socket.on('doc', (docID) => {
    if (socket.user) {
      Document.findById(docID)
      .then((doc) => {
        socket.emit('doc', doc);
        socket.join(docID.toString(), () => {
          socket.docID = docID.toString();
        });
      })
      .catch((err) => socket.emit('err', err.message));
    }
  });
  socket.on('getDocs', () => {
    if (socket.user) {
      if (socket.docID) {
        socket.leave(socket.docID);
        socket.docID = null;
      }
      socket.emit('docs', {docs: socket.user.docs, sharedDocs: socket.user.sharedDocs});
    }
  });
  socket.on('share', (data) => {
    User.findOneAndUpdate(
      {username: data.username},
      {$push: {sharedDocs: data.doc}},
      {new: true},
    ).then((user) => {
      if (user) {
        Document.findByIdAndUpdate(
          data.doc.document,
          {$push: {sharedWith: user._id}},
        ).then(() => socket.emit('shareSuccessful', data.username));
      } else {
        socket.emit('shareUnsuccessful', data.username);
      }
    });
  });
  socket.on('delete', (docRef) => {
    if (socket.user._id.toString() === docRef.owner.toString()) {
      Document.findById(docRef.document)
      .then((doc) => {
        const promises = doc.sharedWith.map(id =>
          (User.findByIdAndUpdate(id, {$pull: {sharedDocs: {document: docRef.document}}})));
        Promise.all(promises)
        .then(() => (doc.remove()))
        .then(() => (User.findByIdAndUpdate(docRef.owner,
          {$pull: {docs: {document: docRef.document}}},
          {new: true},
        )))
        .then((user) => {
          socket.user = user;
          socket.emit('deleteSuccessful', docRef.title);
        })
        .catch(() => socket.emit('deleteUnSuccessful', docRef.title));
      }).catch(() => socket.emit('deleteUnSuccessful', docRef.title));
    }
  });
  socket.on('remove', (docRef) => {
    User.findByIdAndUpdate(socket.user._id,
      {$pull: {sharedDocs: {document: docRef.document}}})
    .then((user) => {
      socket.user = user;
      socket.emit('removeSuccessful', docRef.title);
    })
    .catch(() => socket.emit('removeUnSuccessful', docRef.title));
  });
  socket.on('newDoc', (title) => {
    if (socket.user) {
      const newDoc = new Document({
        title,
        content: 'new',
        owner: socket.user._id,
      });
      newDoc.save()
      .then(() => (
        User.findByIdAndUpdate(
          socket.user._id,
          {$push: {docs: {title: newDoc.title, document: newDoc._id, owner: socket.user._id}}},
          {new: true},
        ).then((user) => {
          socket.user = user;
        })
      ))
      .then(() => socket.emit('doc', newDoc))
      .catch((err) => socket.emit('err', err.message));
    }
  });
  socket.on('docChange', (update) => {
    if (socket.user) {
      socket.broadcast.emit('docChange', update.content);
      Document.findByIdAndUpdate(
        update.id,
        {$set: {content: update.content}},
        {new: true},
      )
      .then(() => (true));
    }
  });
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
 console.log(`Google Docs server listening on port ${port}!`);
});
