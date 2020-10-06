const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const admin = new Schema({
  user: {
    type: String,
    required: true,
  },
  accessCode: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});
// mongoose.Promise = global.Promise;
admin.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashcode = await bcrypt.hash(this.accessCode, salt);
    this.accessCode = hashcode;
    // console.log("pre save");
    next();
  } catch (err) {
    console.log(err);
    console.log("Password unable to hash");
  }
});

module.exports = mongoose.model("Admin", admin);
