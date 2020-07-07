const activityEvents = require("./activityEvents");
const userEvents = require("./userEvents");
const chatEvents = require("./chatEvents");
const groupEvents = require("./groupEvents");

module.exports = (params) => ({
  ...activityEvents(params),
  ...userEvents(params),
  ...chatEvents(params),
  ...groupEvents(params),
});
