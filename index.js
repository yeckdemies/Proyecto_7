require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/db');
const usersRouter = require('./src/api/routes/users-router');
const eventsRouter = require('./src/api/routes/events-router');
const inscriptionRouter = require('./src/api/routes/inscriptions-router');

const app = express();

app.use(express.json());

connectDB();

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/events', eventsRouter);
app.use('/api/v1/inscriptions', inscriptionRouter);

app.use('*', (req, res, next) => {
  return res.status(404).json('Route not found');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
