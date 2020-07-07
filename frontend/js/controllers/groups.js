const createGroup = async (event) => {
  event.stopPropagation();

  const users = (await (await fetch(`${baseUrl}/users`)).json()).users.filter(
    (v) => v._id !== userId
  );

  console.log("create group");
  const modal = generateGroupModal("Criar grupo", users, {
    function: "groupEvent('form-modal-group')",
    name: "Criar",
  });
  document.body.append(modal);
};

const manageGroup = async (groupId, users) => {
  console.log("manage group: ", groupId);

  const groupName = Array.from(document.getElementsByClassName("chat-bar"))
    .filter((v) => v.getAttribute("group-id") === groupId)[0]
    .getAttribute("group-name");

  const existingUsers = users.map((v) => v._id);

  const allUsers = (await (await fetch(`${baseUrl}/users`)).json()).users
    .map((v) => {
      if (existingUsers.includes(v._id)) return { ...v, active: true };
      else return { ...v, active: false };
    })
    .filter((v) => v._id !== userId);

  const modal = generateGroupModal(
    "Gerenciar grupo",
    allUsers,
    {
      function: `groupEvent('form-modal-group', '${groupId}')`,
      name: "Salvar",
    },
    groupName
  );

  document.body.append(modal);
};

const groupEvent = async (formId, groupId) => {
  const form = Array.from(document.getElementById(formId).elements);

  const groupName = form.shift().value;
  const users = form
    .filter((v) => {
      if (v.checked) return true;
      else return false;
    })
    .map((v) => v.value);

  users.push(userId);

  if (!groupName) {
    alert("Você precisa dar um nome ao grupo");
    return;
  }

  if (users.length < 2) {
    alert("Você precisa adicionar participantes ao grupo");
    return;
  }

  const group = { name: groupName, users, creator: userId };

  const result = groupId
    ? await (
        await fetch(`${baseUrl}/groups`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: groupId, update: group }),
        })
      ).json()
    : await (
        await fetch(`${baseUrl}/groups`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(group),
        })
      ).json();

  if (!result.group) {
    alert("Ocorreu um erro");
    return;
  }

  closeModal(
    document.getElementById(formId).parentElement.parentElement.parentElement.id
  );

  socket.emit("update groups");
  socket.emit("update group users", groupId);
};

const loadGroups = async () => {
  const groups = await (await fetch(`${baseUrl}/groups/${userId}`)).json();

  groups.map(({ _id, name }) => {
    const opened = Array.from(
      document.getElementsByClassName("chat-bar")
    ).filter((v) => v.getAttribute("group-id") === _id)[0];
    if (opened) {
      opened.setAttribute("group-name", name);
      console.log((opened.children[0].children[0].innerHTML = name));
    }
  });

  const div = ({ name, _id }) => {
    const element = document.createElement("div");
    element.className = "chat-bar-list-item";
    element.onclick = () => openGroup(_id, name);
    element.innerHTML = name;
    element.setAttribute("group-id", _id);

    return element;
  };

  const groupList = document.getElementById("chat-bar-list-groups");

  if (!groups.length) {
    groupList.innerHTML = `<div class="chat-bar-list-item" onclick="createGroup(event)">Criar seu primeiro grupo</div>`;
  } else {
    groupList.innerHTML = "";

    groups.forEach((group) => groupList.append(div(group)));
  }
};

const openGroup = (groupId, name) => {
  const opened = Array.from(document.getElementsByClassName("chat-bar"))
    .map((v) => v.getAttribute("group-id"))
    .includes(groupId);

  if (!opened) {
    console.log("open group", groupId);
    const chatBar = document.createElement("div");
    chatBar.className = "chat-bar";
    chatBar.style = "height: 500px";
    chatBar.setAttribute("group-id", groupId);
    chatBar.setAttribute("group-name", name);
    chatBar.innerHTML = `
  <div class="chat-bar-header" onclick="handleExpand(event, '500px')">
    <span>${name}</span>
    <i class="material-icons btn" onclick="event.stopPropagation(); handleClose(event)">close</i>
  </div>
  <div class="chat-bar-tabs">
    <div tab-id="group-messages" class="chat-bar-tabs-tab active" group-id=${groupId} onclick="activeTab(event)">Mensagens</div>
    <div tab-id="participants" class="chat-bar-tabs-tab" group-id=${groupId} onclick="activeTab(event)">Participantes</div>
  </div>
  `;

    const chat = document.getElementById("chat");
    chat.insertBefore(chatBar, chat.childNodes[0]);
    loadGroupMessages(chatBar, groupId);
  }
};

const loadGroupUsers = async (chatBar, groupId) => {
  const { users, creator } = await (
    await fetch(`${baseUrl}/groups/${groupId}/info`)
  ).json();
  const list = document.createElement("div");
  list.className = "chat-bar-list";
  list.style = "display: flex";

  users.forEach((user) => {
    if (user._id !== userId) {
      list.append(renderUser(user, true, "chat-bar-list-group-users"));
    } else {
      list.append(
        renderUser(
          { ...user, name: "Você" },
          false,
          "chat-bar-list-group-users"
        )
      );
    }
  });

  if (creator === userId) {
    const manage = document.createElement("div");
    manage.className = "chat-bar-list-item";
    manage.onclick = () => manageGroup(groupId, users);
    manage.innerHTML = 'Gerenciar grupo <i class="material-icons">settings</i>';
    list.append(manage);
  }

  if (Array.from(chatBar.children)[2])
    chatBar.removeChild(chatBar.lastElementChild);

  chatBar.append(list);
  console.log(chatBar);
  scrollToBottom(chatBar.lastElementChild);
};

const markUser = async (event, groupId) => {
  const form = event.target.parentElement.parentElement;
  const marker = form.firstElementChild;

  if (event.key !== "@") {
    marker.innerHTML = "";
    return;
  }

  let { users, creator } = await (
    await fetch(`${baseUrl}/groups/${groupId}/info`)
  ).json();

  const div = document.createElement("div");
  div.className = "chat-mark-user";

  users = users.filter((user) => user._id !== userId);

  div.innerHTML = users
    .map(
      (v) =>
        `<span onclick="insertMarkedUser(event)" value="${v.name}" class="chat-mark-user-item">${v.name}</span>`
    )
    .join("");

  marker.append(div);
};

const insertMarkedUser = (event) => {
  const user = event.target.getAttribute("value");
  const input =
    event.target.parentElement.parentElement.parentElement.lastElementChild
      .firstElementChild;
  const marker = event.target.parentElement;

  input.value += user;
  input.focus();
  marker.innerHTML = "";
};
