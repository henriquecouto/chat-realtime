const updateActivity = (event) => {
  event.preventDefault();
  const activity = event.target.elements[0].value;
  socket.emit("update activity", userId, activity);
};

const loadActivities = async (chatBar, partnerId) => {
  const { activities } = await (
    await fetch(`${baseUrl}/activities/${partnerId}`)
  ).json();
  const list = document.createElement("div");
  list.className = "chat-bar-list";
  list.style = "display: flex";
  list.innerHTML = activities.map(renderActivity).join("");

  chatBar.append(list);
  scrollToBottom(chatBar.lastElementChild);
  socket.emit("receive activities", partnerId);
};
