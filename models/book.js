const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  commentcount: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Array,
    default: [],
  },
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
