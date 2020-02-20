const express = require('express');
const http = require('http');
const path = require('path');
const errorhandler = require('errorhandler');

const config = require('./config/index');

const app = express();

const exception = (err, req, res, next) => {
	if(app.get('env') == 'development'){
		const errorHandler = errorhandler()
		errorHandler(err, req, res, next);
	} else {
		res.sendStatus(500);
	}
}

const pageNotFound = (req, res, next) => {
	res.status(404).send('Page not found');
}

app
	.use((req, res, next) => {
		if(req.url == '/')
			res.end('Hello');
		else
			next();
	})
	.use((req, res, next) => {
		if(req.url == '/error')
			next(new Error('Ошибка'));
		else
			next();
	})
	.use(exception)
	.use(pageNotFound)
	.listen(config.get('port'), () => {
	console.log(`Сервер запущен на порту ${config.get('port')}`);
});