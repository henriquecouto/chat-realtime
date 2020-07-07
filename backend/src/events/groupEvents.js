const { newMessage } = require("../controllers/MessageController");
const { loadUser } = require("../controllers/UserController");

const updateGroups = ({ io }) => async () => {
  io.emit("update groups");
};

const openGroup = ({ socket }) => async (groupId) => {
  socket.join(groupId);
};

const sendGroupMessage = ({ userId, socket }) => async (groupId, message) => {
  const objMessage = newMessage({
    body: { emitter: userId, group: groupId, text: message },
  });

  const { user } = await loadUser({ params: { userId } });

  socket.broadcast.to(groupId).emit("update group messages", {
    type: "received",
    groupId,
    message: objMessage,
    emitter: user,
  });

  socket.emit("update group messages", {
    type: "sended",
    groupId,
    message: objMessage,
  });
};

const updateGroupUsers = ({ socket }) => (groupId) => {
  socket.broadcast.to(groupId).emit("update group users", groupId);
  socket.emit("update group users", groupId);
};

module.exports = (params) => ({
  updateGroups: updateGroups(params),
  sendGroupMessage: sendGroupMessage(params),
  openGroup: openGroup(params),
  updateGroupUsers: updateGroupUsers(params),
});
