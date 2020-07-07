const sendMessage = (event) => {
  event.preventDefault();
  const message = event.target.elements[0].value;
  if (!message) return;
  const type = event.target.getAttribute("type");

  if (type === "group") {
    const groupId = event.target.getAttribute("group-id");
    socket.emit("send group message", groupId, message);
  } else if (type === "direct") {
    const partnerId = event.target.getAttribute("partner-id");
    socket.emit("send message", partnerId, message);

    // const messageList = Array.from(event.target.parentElement.children)[0];
    // messageList.innerHTML += renderMessage(message, "sended");
    // scrollToBottom(messageList);
  }
  event.target.elements[0].value = "";
};

const handleExpand = (event, height) => {
  if (event.path[1].style.height === height) {
    // event.srcElement.children[0].innerText =  "unfold_more";
    event.path[1].style.height = "60px";
    event.path[1].children[1].style.display = "none";
    if (event.path[1].children[2])
      event.path[1].children[2].style.display = "none";
  } else {
    // event.srcElement.children[0].innerText = "unfold_less";
    event.path[1].style.height = height;
    event.path[1].children[1].style.display = "flex";
    if (event.path[1].children[2])
      event.path[1].children[2].style.display = "flex";
  }
};

const handleClose = (event) => {
  document.getElementById("chat").removeChild(event.path[2]);
};

const loadMessages = async (chatBar, partnerId) => {
  const { messages } = await (
    await fetch(`${baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ partnerId: partnerId, userId }),
    })
  ).json();

  const container = document.createElement("div");
  container.className = "chat-container-messages";
  container.innerHTML = `
  <div class='chat-message-list'>
  ${messages
    .map((v) => renderMessage(v, v.emitter === userId ? "sended" : "received"))
    .join("")}
  </div>
  <form class="chat-form-input-message" onsubmit="sendMessage(event)" partner-id="${partnerId}" type="direct">
    <input placeholder="Digitar mensagem..." />
    <button type="submit"><i class="material-icons">send</i></button>
  </form>
  `;
  chatBar.append(container);
  socket.emit("open chat", partnerId);
  scrollToBottom(chatBar.lastElementChild.firstElementChild);
};

const loadGroupMessages = async (chatBar, groupId) => {
  const { messages } = await (
    await fetch(`${baseUrl}/groups/${groupId}/messages`)
  ).json();

  const container = document.createElement("div");
  container.className = "chat-container-messages";
  container.innerHTML = `
  <div class='chat-message-list'>
  ${messages
    .map((v) =>
      renderMessage(
        v,
        v.emitter._id === userId ? "sended" : "received",
        v.emitter
      )
    )
    .join("")}
  </div>
  <form class="chat-form-send-message" onsubmit="sendMessage(event)" group-id="${groupId}" type="group">
    <div style="position:relative; height:0;"></div>
    <div class="chat-form-input-message">
      <input placeholder="Digitar mensagem..." onkeypress="markUser(event, '${groupId}')" />
      <button type="submit"><i class="material-icons">send</i></button>
    </div>
  </form>
  `;

  chatBar.append(container);
  socket.emit("open group", groupId);
  scrollToBottom(chatBar.lastElementChild.firstElementChild);
};
