const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.get('mongoose:uris'), config.get('mongoose:options'));

module.exports = mongoose;