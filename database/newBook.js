const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newBook = new Schema({
  nomDuLivre: {
    type: String,
    required: true,
  },
  nomDuAuteur: {
    type: String,
    required: true,
  },

  annee: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  coverImage: {
    type: Buffer,
    required: true,
  },
  coverImageType: {
    type: String,
    required: true,
  },
  categories: {
    type: String,
    required: true,
  },
});
// mongoose.Promise = global.Promise;

newBook.virtual("coverImagePath").get(function () {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${
      this.coverImageType
    };charset=utf-8;base64,${this.coverImage.toString("base64")}`;
  }
});
module.exports = mongoose.model("Books", newBook);
