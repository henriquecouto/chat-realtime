const formatDate = (date) =>
  new Intl.DateTimeFormat("pt-BR", {
    hour: "numeric",
    minute: "numeric",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(new Date(date));

const renderActivity = (activity) => {
  const date = formatDate(activity.registrationDate);

  return `
  <div class='chat-activity'>
    ${activity.name}
    <div 
      data-tooltip="${date}"
      data-tooltip-location="left">
        <i class='material-icons' style="font-size: 15px">info</i>
    </div>
  </div>`;
};

const renderMessage = (message, type, emitter) => {
  const date = formatDate(message.registrationDate);

  return `
  <div class="chat-message ${type}">
      ${type !== "sended" && emitter ? `<b>${emitter.name}: </b>` : ""}
      ${message.text}
    <div>
      ${date}
    </div>
  </div>`;
};

const renderUser = (
  { name, _id },
  clickable = true,
  classNames = "chat-bar-list-item"
) => {
  const element = document.createElement("div");
  element.className = classNames;
  element.onclick = clickable && openUser({ name, _id });
  element.innerHTML = name;
  element.setAttribute("user-id", _id);

  return element;
};

const scrollToBottom = (element) => {
  element.scrollTop = element.scrollHeight;
};

const activeTab = (event) => {
  const tab = event.target.getAttribute("tab-id");
  const tabs = event.target.parentElement;
  const chatBar = tabs.parentElement;
  const chatId =
    event.target.getAttribute("partner-id") ||
    event.target.getAttribute("group-id");

  Array.from(tabs.children).forEach((v) => v.classList.remove("active"));
  event.target.classList.add("active");

  if (Array.from(chatBar.children)[2])
    chatBar.removeChild(chatBar.lastElementChild);

  const tabSwitch = {
    messages: () => loadMessages(chatBar, chatId),
    activities: () => loadActivities(chatBar, chatId),
    "group-messages": () => loadGroupMessages(chatBar, chatId),
    participants: () => loadGroupUsers(chatBar, chatId),
  };

  tabSwitch[tab]();
};
