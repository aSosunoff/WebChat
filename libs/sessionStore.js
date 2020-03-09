const mongoose = require('../libs/mongoose');

const expressSession = require('express-session');

const connectMongo = require('connect-mongo')(expressSession);

const sessionStore = new connectMongo({ mongooseConnection: mongoose.connection });

module.exports = sessionStore;