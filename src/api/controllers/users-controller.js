const { signGenerate } = require('../../config/jwt');
const User = require('../models/users-model');
const Event = require('../models/events-model');
const Inscriptions = require('../models/inscriptions-model');
const bcrypt = require('bcrypt');

const searchUser = async (userName) => {
  const user = await User.findOne({ userName });
  return user;
};

const getUser = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const newUser = new User({
      userName: req.body.userName,
      password: req.body.password,
      role: 'user'
    });

    const validateUser = await searchUser(newUser.userName);

    if (validateUser) {
      return res.status(400).json('User already exists');
    }
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const user = await searchUser(req.body.userName);

    if (!user) {
      return res.status(400).json('User not found');
    }

    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = signGenerate(user);
      return res.status(200).json({ user, token });
    } else {
      return res.status(400).json('Invalid password');
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const putUser = async (req, res, next) => {
  try {
    const oldUser = await searchUser(req.body.userName);

    if (!oldUser) {
      return res.status(400).json('User not found');
    }
    const newUser = new User(req.body);
    newUser._id = oldUser._id;

    if (req.body.password) {
      return res
        .status(400)
        .json('You cannot change the user name or password');
    }

    newUser.role = req.body.role;
    const updatedUser = await User.findByIdAndUpdate(oldUser._id, newUser, {
      new: true
    });
    return res
      .status(200)
      .json(
        `The user ${updatedUser.userName} was updated to ${updatedUser.role}`
      );
  } catch (error) {
    return res.status(400).json('Error updating user');
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userToDelete = await searchUser(req.body.userName);
    const userId = userToDelete._id;

    if (!userToDelete) {
      return res.status(400).json('User not found');
    }

    /* Eliminar los datos relacionados */
    await Event.deleteMany({ organizer: userId });
    await Event.updateMany({ users: userId }, { $pull: { users: userId } });
    await Inscriptions.deleteMany({ user: userId });
    /* Fin Eliminación datos relacionados */

    const userDeleted = await User.findByIdAndDelete(userId);

    return res
      .status(200)
      .json('User and related data deleted' + userDeleted.userName);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = { registerUser, getUser, loginUser, putUser, deleteUser };
