const { Message } = require("../models/MessageModel");

exports.newMessage = (req, res) => {
  const message = new Message(req.body);
  message.save((error) => {
    if (res) {
      if (error) return res.status(500).send({ message: error });
      return res && res.send({ message: "message created", message });
    }
  });
  return message;
};

exports.loadMessages = async (req, res) => {
  const { userId, partnerId } = req.body;
  const messages = await Message.find({
    $or: [
      { emitter: userId, receptor: partnerId },
      { emitter: partnerId, receptor: userId },
    ],
  });
  return res.send({ messages });
};
