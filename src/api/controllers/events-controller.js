const Event = require('../models/events-model');

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
    const { title, description, date } = req.body;
    const organizer = req.user._id;
    const newEvent = new Event({
      title,
      description,
      date,
      organizer,
      users: []
    });

    if (users) {
      return res.status(400).json({
        message: 'You cannot add users during event creation'
      });
    }

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
    const newEvent = new Event(req.body);
    newEvent._id = id;
    newEvent.organizer = oldEvent.organizer;
    newEvent.users = oldEvent.users;

    if (organizer || users) {
      return res.status(400).json({
        message: 'You cannot change the organizer or the users of the event'
      });
    }

    if (title) newEvent.title = oldEvent.title ? title : oldEvent.title;
    if (description)
      newEvent.description = oldEvent.description
        ? description
        : oldEvent.description;
    if (date) newEvent.date = oldEvent.date ? date : oldEvent.date;

    const eventUpdated = await Event.findByIdAndUpdate(id, newEvent, {
      new: true
    });

    return res.status(200).json(eventUpdated);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.body;
    const eventToDelete = await Event.findById(id);

    if (!eventToDelete) {
      return res.status(400).json('Event not found');
    }
    const eventDeleted = await Event.findByIdAndDelete(eventToDelete._id);
    return res.status(200).json('Event deleted: ' + eventDeleted.title);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = { getEvents, postEvent, putEvent, deleteEvent };
