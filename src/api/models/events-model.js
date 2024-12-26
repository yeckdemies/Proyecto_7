const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    organizer: {
      type: mongoose.Types.ObjectId,
      ref: 'users'
    },
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'users'
      }
    ]
  },
  {
    timestamps: true,
    collection: 'events'
  }
);

const Event = mongoose.model('events', eventSchema, 'events');
module.exports = Event;
