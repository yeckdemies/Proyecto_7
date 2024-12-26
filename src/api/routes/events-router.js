const { isOwnerEvents, isAuth } = require('../../middlewares/auth-middleware');
const {
  getEvents,
  putEvent,
  postEvent,
  deleteEvent
} = require('../controllers/events-controller');
const eventsRouter = require('express').Router();

eventsRouter.get('/', getEvents);
eventsRouter.post('/createEvent', [isAuth], postEvent);
eventsRouter.put('/updateEvent', [isAuth, isOwnerEvents], putEvent);
eventsRouter.delete('/deleteEvent', [isAuth, isOwnerEvents], deleteEvent);

module.exports = eventsRouter;
