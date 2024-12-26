const User = require('../api/models/users-model');
const Event = require('../api/models/events-model');
const { verifyToken } = require('../config/jwt');

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const parsedToken = token.replace('Bearer ', '');

    const { id } = verifyToken(parsedToken);
    const user = await User.findById(id);

    user.password = null;
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json('Unauthorized');
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const parsedToken = token.replace('Bearer ', '');

    const { id } = verifyToken(parsedToken);
    const user = await User.findById(id);

    if (user.role === 'admin') {
      user.password = null;
      req.user = user;
      next();
    } else {
      return res.status(401).json('Unauthorized');
    }
  } catch (error) {
    return res.status(401).json('Unauthorized');
  }
};

const canDeleteUser = async (req, res, next) => {
  try {
    const { user } = req;
    const { userName } = req.body;

    if (!user) {
      return res.status(401).json('Unauthorized: No user found in request');
    }

    if (!userName) {
      return res
        .status(400)
        .json('Bad Request: Username is required in the body');
    }
    if (user.role === 'admin') {
      return next();
    }

    if (user.userName !== userName) {
      return res
        .status(403)
        .json('Forbidden: You can only delete your own account');
    }

    next();
  } catch (error) {
    return res.status(500).json('Internal Server Error');
  }
};

const isOwnerEvents = async (req, res, next) => {
  try {
    const { user } = req;
    const { id } = req.body;

    if (!user) {
      return res.status(401).json('Unauthorized: No user found in request');
    }
    const event = await Event.findById(id);
    console.log(event);

    if (!event) {
      return res.status(404).json('Not Found: Event not found');
    }

    if (event.organizer.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json('Forbidden: You are not the owner of this event');
    }

    next();
  } catch (error) {
    return res.status(500).json('Internal Server Error');
  }
};

module.exports = { isAuth, isAdmin, canDeleteUser, isOwnerEvents };
