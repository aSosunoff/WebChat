const express = require('express');

const config = require('./config');
const logger = require('./libs/log')(module);

// -----------------------------------------

const app = express();

require('./middleware/default')(app, module);
require('./middleware/template')(app, module);
require('./routes')(app);
require('./middleware/error')(app);

app
	.listen(config.get('port'), () => {
		console.log(`Сервер запущен на порту ${config.get('port')}`);
		/* logger.info(`Сервер запущен на порту ${config.get('port')}`); */
	});