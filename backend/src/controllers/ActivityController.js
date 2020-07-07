const { Activity } = require("../models/ActivityModel");

exports.loadActivities = async (req, res) => {
  const { userId } = req.params;
  const activities = await Activity.find({ user: userId });
  return res.send({ activities });
};

exports.loadActivitiesAfterOne = async (req, res) => {
  const { activityId } = req.body;
  if (activityId) {
    try {
      const activities = await Activity.find({ _id: { $gt: activityId } });
      return res ? res.send({ activities }) : { activities };
    } catch (error) {
      return res ? res.status(400).send({ error }) : { error };
    }
  }
  return;
};

exports.newActivity = (req, res) => {
  const activity = new Activity(req.body);
  activity.save((error) => {
    if (res) {
      if (error) return res.status(500).send({ message: error });
      return res && res.send({ message: "activity created", activity });
    }
  });
  return activity;
};
