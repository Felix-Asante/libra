const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const recommend = new Schema({
  userName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  bookTitle: {
    type: String,
    required: true,
  },
  Author: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});
// mongoose.Promise = global.Promise;

module.exports = mongoose.model("recommended", recommend);
