const express = require('express');
const chatController = require('../controllers/chatController');

const chatRouter = express.Router();
chatRouter.get('/', require('../middleware/middlewareHelper/checkAuth'), chatController.index);

module.exports = chatRouter;