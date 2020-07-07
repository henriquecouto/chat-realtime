const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const eventsHandler = require("./events/index");

const port = 3030;
const db = mongoose.connection;
const users = {},
  activitiesReceptors = {},
  messageReceptors = {};

mongoose.connect("mongodb://localhost:27017/mw-chat", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

db.on("error", (error) => {
  console.log(error);
});
db.once("open", () => {
  console.log("db connected");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send({ working: true });
});
app.use("/users", require("./routes/UserRoutes"));
app.use("/activities", require("./routes/ActivityRoutes"));
app.use("/messages", require("./routes/MessageRoutes"));
app.use("/groups", require("./routes/GroupRoutes"));

io.on("connection", async (socket) => {
  const userId = socket.handshake.query._id;

  const {
    connectUser,
    disconnectUser,
    updateActivities,
    receiveActivities,
    openChat,
    sendMessage,
    updateGroups,
    sendGroupMessage,
    openGroup,
    updateGroupUsers,
  } = eventsHandler({
    io,
    users,
    activitiesReceptors,
    socket,
    userId,
    messageReceptors,
  });

  connectUser();
  updateGroups();

  socket.on("disconnect", disconnectUser);

  socket.on("update activity", updateActivities);
  socket.on("receive activities", receiveActivities);

  socket.on("open chat", openChat);
  socket.on("send message", sendMessage);

  socket.on("update groups", updateGroups);
  socket.on("open group", openGroup);
  socket.on("send group message", sendGroupMessage);
  socket.on("update group users", updateGroupUsers);
});

http.listen(port, () => {
  console.log(`app listening on http://localhost:${port}`);
});
