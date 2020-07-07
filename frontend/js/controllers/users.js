const loadAllUsers = async () => {
  const { users } = await (await fetch(`${baseUrl}/users`)).json();
  const chatList = document.getElementById("chat-bar-list-users");
  chatList.innerHTML = "";
  users.forEach((user) => {
    if (user._id !== userId) {
      chatList.append(renderUser(user));
    } else {
      document.title = user.name;
    }
  });
};

const openUser = ({ name, _id }) => async () => {
  const opened = Array.from(document.getElementsByClassName("chat-bar"))
    .map((v) => v.getAttribute("user-id"))
    .includes(_id);
  if (!opened) {
    const chatBar = document.createElement("div");
    chatBar.className = "chat-bar";
    chatBar.style = "height: 500px";
    chatBar.setAttribute("user-id", _id);
    chatBar.innerHTML = `
  <div class="chat-bar-header" onclick="handleExpand(event, '500px')">
    ${name}
    <i class="material-icons btn" onclick="event.stopPropagation(); handleClose(event)">close</i>
  </div>
  <div class="chat-bar-tabs">
    <div tab-id="messages" class="chat-bar-tabs-tab active" partner-id=${_id} onclick="activeTab(event)">Mensagens</div>
    <div tab-id="activities" class="chat-bar-tabs-tab" partner-id=${_id} onclick="activeTab(event)">Atividades</div>
  </div>
  `;

    const chat = document.getElementById("chat");
    chat.insertBefore(chatBar, chat.childNodes[0]);
    loadMessages(chatBar, _id);
  }
};
