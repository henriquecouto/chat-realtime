const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: { type: "String", required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  users: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
  registrationDate: { type: Date, default: Date.now },
});

module.exports = { Group: mongoose.model("Group", GroupSchema) };
