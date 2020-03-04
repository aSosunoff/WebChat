const { HttpError } = require('../error');
const User = require('../models/user');
const { ObjectID } = require('mongodb');

const homeRouter = require('./homeRouter');
const authRouter = require('./authRouter');
const chatRouter = require('./chatRouter');

module.exports = (app) => {
	app.use('/', homeRouter);
	app.use('/auth', authRouter);
	app.use('/chat', chatRouter);
}