const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  emitter: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  text: { type: String, required: true },
  receptor: { type: mongoose.Types.ObjectId, ref: "User" },
  group: { type: mongoose.Types.ObjectId, ref: "Group" },
  registrationDate: { type: Date, default: Date.now },
});

module.exports = { Message: mongoose.model("Message", MessageSchema) };
