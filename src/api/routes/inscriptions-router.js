const { isAuth, isAdmin } = require('../../middlewares/auth-middleware');
const {
  getInscriptions,
  postInscription,
  putInsciption,
  deleteInscription
} = require('../controllers/inscriptions-controller');
const inscriptionRouter = require('express').Router();

inscriptionRouter.get('/', [isAuth], getInscriptions);
inscriptionRouter.post('/createInscription', [isAuth], postInscription);
inscriptionRouter.put('/updateInscription', [isAuth], putInsciption);
inscriptionRouter.delete('/deleteInscription', [isAuth], deleteInscription);

module.exports = inscriptionRouter;
