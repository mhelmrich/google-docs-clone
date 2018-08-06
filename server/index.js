const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('./models/User.js');
const auth = require('./routes/auth');

mongoose.connection.on('connected', () => {
  console.log('Connected to database!');
});
mongoose.connect(process.env.MONGODB_URI);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: process.env.SECRET}));

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
 console.log('connected', socket);
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
 console.log(`Google Docs server listening on port ${port}!`);
});
