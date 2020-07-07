const { User } = require("../models/UserModel");

exports.loadUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res ? res.send({ users }) : { users };
  } catch (error) {
    return res ? res.status(400).send({ error }) : { error };
  }
};

exports.loadUser = async (req, res) => {
  const { userId } = req.params;
  if (userId) {
    try {
      const user = await User.findOne({ _id: userId });
      return res ? res.send({ user }) : { user };
    } catch (error) {
      return res ? res.status(400).send({ error }) : { error };
    }
  }
  return;
};

exports.newUser = async (req, res) => {
  const user = new User(req.body);
  user.save((error) => {
    if (error) return res.status(500).send({ message: error });
    return res.send({ message: "user created", user });
  });
};
