const winston = require('winston');
const path = require('path');
const ENV = process.env.NODE_ENV;

module.exports = (module) => {
	let label = module.filename.split(path.sep).slice(-2).join(path.sep);

	return winston.createLogger({
		level: ENV == 'development' ? 'debug' : 'error',
		transports: [
			new winston.transports.Console({
				level: 'warn'
			})
		]
	});
};