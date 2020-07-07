const chat = document.getElementById("chat");

const baseUrl = "http://localhost:3030";

const { userId } = loadSearch();

const socket = io(baseUrl, {
  query: { _id: userId },
});
