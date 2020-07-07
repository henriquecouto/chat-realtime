socket.on("connect", () => {
  console.log("connected");
});

socket.on("update users", async (users) => {
  await loadAllUsers();
  const ids = Object.keys(users);
  const elements = Array.from(
    document.getElementsByClassName("chat-bar-list-item")
  );
  elements.forEach((element) => {
    const elementId = element.getAttribute("user-id");

    if (users[elementId] && users[elementId].activity) {
      const activity = document.createElement("div");
      activity.className = "activity";
      activity.innerText = users[elementId].activity;
      element.append(activity);
    }

    if (ids.find((id) => id === elementId)) {
      const online = document.createElement("div");
      online.className = "online";
      element.append(online);
    }
  });
});

socket.on("update activities", ({ userId, activity }) => {
  const elements = Array.from(document.getElementsByClassName("chat-bar"));

  const element = elements.find(
    (element) => element.getAttribute("user-id") === userId
  );

  const activityElement = renderActivity(activity);

  element.lastElementChild.innerHTML += activityElement;
  scrollToBottom(element.lastElementChild);
});

socket.on("update messages", ({ userId, message, type }) => {
  const elements = Array.from(document.getElementsByClassName("chat-bar"));

  const element = elements.find(
    (element) => element.getAttribute("user-id") === userId
  );

  const messageList = Array.from(element.children)[2].firstElementChild;

  messageList.innerHTML += renderMessage(message, type);
  scrollToBottom(messageList);
});
