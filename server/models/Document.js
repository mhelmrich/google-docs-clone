const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  sharedWith: [mongoose.Schema.ObjectId],
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
