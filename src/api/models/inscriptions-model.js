const mongoose = require('mongoose');

const inscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'users',
      required: true
    },
    event: {
      type: mongoose.Types.ObjectId,
      ref: 'events',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    }
  },
  {
    timestamps: true,
    collection: 'inscriptions'
  }
);

const Inscriptions = mongoose.model(
  'inscriptions',
  inscriptionSchema,
  'inscriptions'
);

module.exports = Inscriptions;
