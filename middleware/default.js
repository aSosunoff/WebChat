const express = require('express');
const path = require('path');
const faviconMiddleware = require('express-favicon');
const bodyParser = require('body-parser');
const morganMiddleware = require('morgan');

const coocieParserMiddleware = require('cookie-parser');
const expressSession = require('express-session');

const config = require('../config');

const sessionStore = require('../libs/sessionStore');

const skip = (req, res)  => res.statusCode < 400;

module.exports = (app, module) => {
    const rootDirName = path.parse(module.filename).dir;

    if(app.get('env') == 'development'){
        app.use(morganMiddleware(':remote-addr :method :url :status :response-time ms - :res[content-length]', { skip }));
    } else {
        app.use(morganMiddleware('tiny', { skip }));
    }

    app
        .use(faviconMiddleware(rootDirName + '/public/favicon.png'))
        .use(bodyParser.json()) 									// req.body parse application/json
        .use(bodyParser.urlencoded({ extended: false })) 			// req.body parse application/x-www-form-urlencoded 
        .use(coocieParserMiddleware()) 								// req.cookies
        .use(expressSession({
            secret: config.get('session:secret'),
            key: config.get('session:key'),
            cookie: config.get('session:cookie'),
            store: sessionStore,
            resave: true,
            saveUninitialized: true
        }))
        .use(express.static(path.join(rootDirName, 'public')))
        .use(require('./middlewareHelper/sendHttpError'))
        .use(require('./middlewareHelper/loadUserFromSession'));
}