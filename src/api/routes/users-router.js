const {
  registerUser,
  getUser,
  loginUser,
  putUser,
  deleteUser
} = require('../controllers/users-controller');
const {
  isAdmin,
  isAuth,
  canDeleteUser
} = require('../../middlewares/auth-middleware');

const usersRouter = require('express').Router();

usersRouter.get('/', [isAdmin], getUser);
usersRouter.post('/register', registerUser);
usersRouter.post('/login', loginUser);
usersRouter.put('/updateRolUser', [isAdmin], putUser);
usersRouter.delete('/deleteUser', [isAuth, canDeleteUser], deleteUser);

module.exports = usersRouter;
