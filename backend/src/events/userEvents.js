const { loadUser } = require("../controllers/UserController");

const connectUser = ({ io, users, socket, userId }) => async () => {
  const { user } = await loadUser({ params: { userId } });

  if (user) {
    users[userId] = { socket: socket.id, status: "online", ...user.toJSON() };
    io.emit("update users", users);
  } else {
    socket.disconnect();
  }
};

const disconnectUser = ({ io, users, userId }) => () => {
  delete users[userId];
  io.emit("update users", users);
};

module.exports = (params) => ({
  connectUser: connectUser(params),
  disconnectUser: disconnectUser(params),
});
