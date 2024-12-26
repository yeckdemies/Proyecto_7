const Inscription = require('../models/inscriptions-model');
const Event = require('../models/events-model');
const User = require('../models/users-model');

const getInscriptions = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      const inscriptions = await Inscription.find()
        .populate('user')
        .populate('event');
      return res.status(200).json(inscriptions);
    }

    const userInscriptions = await Inscription.find({ user: req.user._id })
      .populate('user')
      .populate('event');

    if (userInscriptions.length === 0) {
      return res.status(200).json('This user has not inscriptions');
    }
    return res.status(200).json(userInscriptions);
  } catch (error) {
    return res.status(500).json({ error: 'Error retrieving inscriptions' });
  }
};

const postInscription = async (req, res, next) => {
  try {
    const { user: userName, event: title, status } = req.body;
    const authenticatedUser = req.user;

    const eventObject = await Event.findOne({ title });

    if (!eventObject) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const userObject = await User.findOne({ userName });

    if (!userObject) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (
      authenticatedUser.role !== 'admin' &&
      authenticatedUser.userName !== userName
    ) {
      return res.status(403).json({
        message: 'You do not have permission to register another user'
      });
    }

    const existingInscription = await Inscription.findOne({
      user: userObject._id,
      event: eventObject._id
    });

    if (existingInscription) {
      return res
        .status(400)
        .json({ message: 'The user is already registered for this event' });
    }

    const newInscription = await Inscription.create({
      user: userObject._id,
      event: eventObject._id,
      status: status || 'pending'
    });

    if (status === 'confirmed') {
      await Event.findByIdAndUpdate(eventObject._id, {
        $push: { users: userObject._id }
      });
    }

    res.status(201).json({
      message: 'Inscription created successfully',
      inscription: newInscription
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error creating inscription' });
  }
};

const putInsciption = async (req, res, next) => {
  try {
    const { id, status } = req.body;
    const authenticatedUser = req.user;
    const inscriptionObject = await Inscription.findById(id);
    const user = await User.findById(inscriptionObject.user);

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    if (
      status !== 'confirmed' &&
      status !== 'cancelled' &&
      status !== 'pending'
    ) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (!inscriptionObject) {
      return res.status(404).json({ message: 'Inscription not found' });
    }

    if (
      authenticatedUser.role !== 'admin' &&
      authenticatedUser.userName !== user.userName
    ) {
      return res.status(403).json({
        message:
          'You do not have permission to modified inscription of another user'
      });
    }

    if (status === inscriptionObject.status) {
      return res.status(404).json({ message: 'Inscription not changed' });
    }

    if (status === 'confirmed') {
      const eventToUpdate = await Event.findById(inscriptionObject.event._id);

      if (!eventToUpdate.users.includes(inscriptionObject.user._id)) {
        await Event.findByIdAndUpdate(inscriptionObject.event._id, {
          $push: { users: inscriptionObject.user._id }
        });
      }
      inscriptionObject.status = status;
    } else if (status === 'cancelled' || status === 'pending') {
      await Event.findByIdAndUpdate(inscriptionObject.event, {
        $pull: { users: inscriptionObject.user }
      });
      inscriptionObject.status = status;
    }

    await inscriptionObject.save();

    res.status(200).json({
      message: 'Inscription modified successfully',
      inscriptionObject
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error updating inscription' });
  }
};

const deleteInscription = async (req, res, next) => {
  try {
    const { id } = req.body;
    const authenticatedUser = req.user;
    const inscriptionObject = await Inscription.findById(id);
    const user = await User.findById(inscriptionObject.user);

    if (!inscriptionObject) {
      return res.status(404).json({ message: 'Inscription not found' });
    }

    if (
      authenticatedUser.role !== 'admin' &&
      authenticatedUser.userName !== user.userName
    ) {
      return res.status(403).json({
        message: 'You do not have permission to delete another user inscription'
      });
    }

    await Event.findByIdAndUpdate(inscriptionObject.event, {
      $pull: { users: inscriptionObject.user }
    });

    await Inscription.findByIdAndDelete(id);

    res.status(200).json({ message: 'Inscription deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting inscription' });
  }
};

module.exports = {
  getInscriptions,
  postInscription,
  putInsciption,
  deleteInscription
};
