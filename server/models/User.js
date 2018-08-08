const mongoose = require('mongoose');

const documentRef = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  document: {
    type: mongoose.Schema.ObjectId,
    ref: 'Document',
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  docs: [documentRef],
  sharedDocs: [documentRef],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
