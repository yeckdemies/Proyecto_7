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

    if (!userName || !title) {
      return res.status(400).json({ message: 'User and event are required' });
    }

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
      return res.status(400).json({
        message: 'The user is already registered for this event'
      });
    }

    const validStatuses = ['pending', 'confirmed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const newInscription = await Inscription.create({
      user: userObject._id,
      event: eventObject._id,
      status: status || 'pending'
    });

    if (status === 'confirmed') {
      if (!eventObject.users.includes(userObject._id)) {
        await Event.findByIdAndUpdate(eventObject._id, {
          $push: { users: userObject._id }
        });
      }
    }

    res.status(201).json({
      message: 'Inscription created successfully',
      inscription: newInscription
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || 'Error creating inscription' });
  }
};

const putInsciption = async (req, res, next) => {
  try {
    const { id, status } = req.body;
    const authenticatedUser = req.user;

    if (!id) {
      return res.status(400).json({ message: 'Inscription ID is required' });
    }

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['confirmed', 'cancelled', 'pending'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const inscriptionObject = await Inscription.findById(id);
    if (!inscriptionObject) {
      return res.status(404).json({ message: 'Inscription not found' });
    }

    const user = await User.findById(inscriptionObject.user);
    if (
      authenticatedUser.role !== 'admin' &&
      authenticatedUser.userName !== user.userName
    ) {
      return res.status(403).json({
        message:
          'You do not have permission to modify the inscription of another user'
      });
    }

    if (status === inscriptionObject.status) {
      return res
        .status(400)
        .json({ message: 'No changes made to the inscription' });
    }

    const eventObject = await Event.findById(inscriptionObject.event);

    if (!eventObject) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (status === 'confirmed') {
      if (!eventObject.users.includes(inscriptionObject.user.toString())) {
        eventObject.users.push(inscriptionObject.user);
        await eventObject.save();
      }
    } else {
      if (eventObject.users.includes(inscriptionObject.user.toString())) {
        eventObject.users = eventObject.users.filter(
          (userId) => userId.toString() !== inscriptionObject.user.toString()
        );
        await eventObject.save();
      }
    }

    // Actualizar estado de inscripción
    inscriptionObject.status = status;
    await inscriptionObject.save();

    res.status(200).json({
      message: 'Inscription modified successfully',
      inscription: inscriptionObject
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || 'Error updating inscription' });
  }
};

const deleteInscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const authenticatedUser = req.user;
    const inscriptionObject = await Inscription.findById(id);

    if (!inscriptionObject) {
      return res.status(404).json({ message: 'Inscription not found' });
    }

    const user = await User.findById(inscriptionObject.user);

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

    console.log('id' + id);
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
