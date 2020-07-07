const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
});

module.exports = { User: mongoose.model("User", UserSchema) };
