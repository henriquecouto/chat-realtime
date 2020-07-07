const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  registrationDate: { type: Date, default: Date.now },
});

module.exports = { Activity: mongoose.model("Activity", ActivitySchema) };
