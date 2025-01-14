const Event = require('../models/events-model');
const Inscriptions = require('../models/inscriptions-model');

const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate('users').populate('organizer');

    return res.status(200).json(events);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const postEvent = async (req, res) => {
  try {
    const { title, description, date, users } = req.body;
    const organizer = req.user._id;

    if (users && users.length > 0) {
      return res.status(400).json({
        message: 'You cannot add users during event creation'
      });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      organizer,
      users: []
    });

    const eventSaved = await newEvent.save();

    return res.status(201).json({
      message: 'Event created',
      event: eventSaved
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error creating event',
      error: error.message
    });
  }
};

const putEvent = async (req, res, next) => {
  try {
    const { id, title, description, date, organizer, users } = req.body;

    const oldEvent = await Event.findById(id);
    if (!oldEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (organizer || users) {
      return res.status(400).json({
        message: 'You cannot change the organizer or the users of the event'
      });
    }

    const updatedEvent = {
      title: title || oldEvent.title,
      description: description || oldEvent.description,
      date: date || oldEvent.date,
      organizer: oldEvent.organizer,
      users: oldEvent.users
    };

    const eventUpdated = await Event.findByIdAndUpdate(id, updatedEvent, {
      new: true
    });

    return res.status(200).json({
      message: 'Event updated successfully',
      event: eventUpdated
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error updating event', error: error.message });
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.body;
    const eventToDelete = await Event.findById(id);
    const eventId = eventToDelete._id;

    if (!eventToDelete) {
      return res.status(400).json('Event not found');
    }
    /*Eliminar datos relacionados */
    await Inscriptions.deleteMany({ event: eventId });

    const eventDeleted = await Event.findByIdAndDelete(eventId);
    return res.status(200).json('Event deleted: ' + eventDeleted.title);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = { getEvents, postEvent, putEvent, deleteEvent };
