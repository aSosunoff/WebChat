const express = require('./node_modules/express');
const path = require('path');
const faviconMiddleware = require('./node_modules/express-favicon');
const bodyParser = require('./node_modules/body-parser');
const morganMiddleware = require('./node_modules/morgan');

const coocieParserMiddleware = require('./node_modules/cookie-parser');
const expressSession = require('./node_modules/express-session');
const connectMongo = require('./node_modules/connect-mongo')(expressSession);

const config = require('../config');
const mongoose = require('../libs/mongoose');

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
            store: new connectMongo({
                mongooseConnection: mongoose.connection
            }),
            resave: true,
            saveUninitialized: true
        }))
        /* .use((req, res, next) => {
            req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
            res.send("Visits:" + req.session.numberOfVisits);
        }) */
        .use(express.static(path.join(rootDirName, 'public')))
        .use(require('./middlewareHelper/sendHttpError'))
        .use(require('./middlewareHelper/loadUserFromSession'));
}