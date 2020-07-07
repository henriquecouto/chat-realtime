const { newMessage } = require("../controllers/MessageController");

const openChat = ({ userId, messageReceptors, socket }) => (partnerId) => {
  if (!messageReceptors[partnerId])
    messageReceptors[partnerId] = { [userId]: socket.id };
  else messageReceptors[partnerId][userId] = socket.id;
};

const sendMessage = ({ userId, messageReceptors, socket }) => (
  partnerId,
  message
) => {
  const objMessage = newMessage({
    body: { emitter: userId, receptor: partnerId, text: message },
  });

  socket.emit("update messages", {
    type: "sended",
    userId: partnerId,
    message: objMessage,
  });

  if (messageReceptors[userId]) {
    const receptor = messageReceptors[userId][partnerId];

    socket.broadcast.to(receptor).emit("update messages", {
      type: "received",
      userId,
      message: objMessage,
    });
  }
};

module.exports = (params) => ({
  openChat: openChat(params),
  sendMessage: sendMessage(params),
});
