const express = require('express');
const loginController = require('../controllers/authController');

const authRouter = express.Router();
authRouter.get('/', loginController.getLogin);
authRouter.post('/', loginController.postLogin);
authRouter.post('/logout', loginController.postLogout);

module.exports = authRouter;