socket.on("update groups", loadGroups);

socket.on("update group messages", ({ groupId, message, type, emitter }) => {
  const elements = Array.from(document.getElementsByClassName("chat-bar"));

  const element = elements.find(
    (element) => element.getAttribute("group-id") === groupId
  );

  const messageList = Array.from(element.children)[2].firstElementChild;

  messageList.innerHTML += renderMessage(message, type, emitter);
  scrollToBottom(messageList);
});

socket.on("update group users", (groupId) => {
  loadGroupUsers(
    Array.from(document.getElementsByClassName("chat-bar")).find(
      (v) => v.getAttribute("group-id") === groupId
    ),
    groupId
  );
});
