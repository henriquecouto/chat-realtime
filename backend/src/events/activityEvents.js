const { newActivity } = require("../controllers/ActivityController");

const updateActivities = ({ io, users, activitiesReceptors, socket }) => (
  userId,
  activity
) => {
  users[userId].activity = activity;
  const objActivity = newActivity({
    body: { user: userId, name: activity },
  });
  io.emit("update users", users);
  for (i in activitiesReceptors[userId]) {
    socket.broadcast
      .to(activitiesReceptors[userId][i])
      .emit("update activities", { userId, activity: objActivity });
  }
};

const receiveActivities = ({ activitiesReceptors, socket }) => (from) => {
  activitiesReceptors[from] = activitiesReceptors[from] || [];
  const includes = activitiesReceptors[from].includes(socket.id);
  if (!includes) {
    activitiesReceptors[from].push(socket.id);
  }
};

module.exports = (params) => ({
  updateActivities: updateActivities(params),
  receiveActivities: receiveActivities(params),
});
