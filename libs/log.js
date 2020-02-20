const winston = require('winston');
const path = require('path');

const ENV = process.env.NODE_ENV;

const colorizer = winston.format.colorize();

module.exports = (module) => {
	let label = module.filename.split(path.sep).slice(-2).join(path.sep);

	return winston.createLogger({
		level: ENV == 'development' ? 'debug' : 'error',
		
		format: winston.format.combine(
			winston.format.timestamp({
				format: 'DD.MM.YYYY HH:mm:ss',
			}),
			winston.format.simple(),
			winston.format.printf(me => {
				return colorizer.colorize(
					me.level,
					`${me.timestamp} - [ ${label} ] - ${me.level}: ${me.message}`
				)
			})
		),

		transports: [
			new winston.transports.Console({})
		]
	});
};

// logger.silly();
// logger.debug();
// logger.verbose();
// logger.http();
// logger.info();
// logger.warn();
// logger.error();