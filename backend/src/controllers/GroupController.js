const { Group } = require("../models/GroupModel");
const { Message } = require("../models/MessageModel");

exports.newGroup = (req, res) => {
  const group = new Group(req.body);
  group.save((error) => {
    if (res) {
      if (error) return res.status(500).send({ message: error });
      return res && res.send({ message: "group created", group });
    }
  });
  return group;
};

exports.loadGroups = async (req, res) => {
  const { userId } = req.params;
  const groups = await Group.find({ users: { $in: userId } });
  if (res) {
    return res.send(groups);
  }

  return groups;
};

exports.loadMessages = async (req, res) => {
  const { groupId } = req.params;
  const messages = await Message.find({ group: groupId }).populate("emitter");
  res.send({ messages });
};

exports.loadGroup = async (req, res) => {
  const { groupId } = req.params;
  const group = await Group.findOne({ _id: groupId }).populate("users");
  res.send(group);
};

exports.update = async (req, res) => {
  const { id, update } = req.body;
  delete update.creator;
  const group = await Group.findByIdAndUpdate(id, update);
  res.send({ group });
};
