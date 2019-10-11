const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: String,
    comments: []
})

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;