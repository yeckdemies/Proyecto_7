const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const users = require('../data/users');
const events = require('../data/events');
const inscriptions = require('../data/inscriptions');
const User = require('../../api/models/users-model');
const Event = require('../../api/models/events-model');
const Inscription = require('../../api/models/inscriptions-model');

mongoose
  .connect(
    'mongodb+srv://admin:XpnlgfIOTtA5j4AE@cluster0.5qp2i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(async () => {
    // Insertar usuarios
    const usersWithHashedPasswords = users.map((user) => {
      return {
        ...user,
        password: bcrypt.hashSync(user.password, 10)
      };
    });

    await User.insertMany(usersWithHashedPasswords);
    console.log('Users inserted correctly');

    // Insertar eventos
    for (let event of events) {
      const organizer = await User.findOne({ userName: event.organizer });
      const participants = await User.find({ userName: { $in: event.users } });

      if (!organizer) throw new Error(`Organizer ${event.organizer} not found`);
      if (participants.length !== event.users.length) {
        throw new Error(`Users not found: ${event.users}`);
      }

      event.organizer = organizer._id;
      event.users = participants.map((user) => user._id);
    }

    await Event.insertMany(events);
    console.log('Events inserted correctly');

    // Insertar inscripciones
    for (let inscription of inscriptions) {
      const user = await User.findOne({ userName: inscription.user });
      const event = await Event.findOne({ title: inscription.event });

      if (!user) throw new Error(`User ${inscription.user} not found`);
      if (!event) throw new Error(`Event ${inscription.event} not found`);

      await Inscription.create({
        user: user._id,
        event: event._id,
        status: inscription.status
      });
    }

    console.log('Inscriptions inserted correctly');
  })
  .then(() => mongoose.connection.close())
  .catch((error) => {
    console.error('Error:', error.message);
    mongoose.connection.close();
  });
