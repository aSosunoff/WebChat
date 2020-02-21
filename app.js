const express = require('express');
// const http = require('http');
const path = require('path');
const errorhandlerMiddleware = require('errorhandler');
const faviconMiddleware = require('express-favicon');
const morganMiddleware = require('morgan');
const coocieParserMiddleware = require('cookie-parser');

const expressHbs = require('express-handlebars');
const hbs = require('hbs');
const bodyParser = require ('body-parser');

const config = require('./config');
const logger = require('./libs/log')(module);

// -----------------------------------------

const app = express();

const exphbs = expressHbs.create({
    layoutsDir: "views/layouts", 
    defaultLayout: "master",
    extname: "hbs",
    helpers: {
        section: function(name, options) { 
            if (!this._sections) 
                this._sections = {};
                
            this._sections[name] = options.fn(this); 
            return null;
		},
		blocks: function(name, options) { 
            if (!this._blocks) 
                this._blocks = {};
                
            this._blocks[name] = options.fn(this); 
            return null;
        },
    }
});

hbs.registerPartials(path.join(__dirname, "views/partials"));

const skip = (req, res)  => res.statusCode < 400;

if(app.get('env') == 'development'){
	app.use(morganMiddleware(':remote-addr :method :url :status :response-time ms - :res[content-length]', { skip }));
} else {
	app.use(morganMiddleware('tiny', { skip }));
}

const pageNotFound = (req, res, next) => {
	res.status(404).send('Page not found');
}

app
	.set("view engine", "hbs")
	.engine('hbs', exphbs.engine)
	.set("views", path.join(__dirname, 'views'))

	.use(faviconMiddleware(__dirname + '/public/favicon.png'))
	.use(bodyParser.json()) 									// req.body parse application/json
	.use(bodyParser.urlencoded({ extended: false })) 			// req.body parse application/x-www-form-urlencoded 
	.use(coocieParserMiddleware()) 								// req.cookies
	.use(express.static(path.join(__dirname, 'public')))

	.use((req, res, next) => {
		if(req.url == '/'){
			res.render('index.hbs', {
				// title: 'Главная страница',
				// isHome: true
			});
		}
		else
			next();
	})
	.use((req, res, next) => {
		if(req.url == '/error')
			next(new Error('Ошибка'));
		else
			next();
	})
	.use((err, req, res, next) => {
		if(app.get('env') == 'development'){
			const errorHandler = errorhandlerMiddleware()
			errorHandler(err, req, res, next);
		} else {
			res.sendStatus(500);
		}
	})
	.use(pageNotFound)
	.listen(config.get('port'), () => {
		logger.info(`Сервер запущен на порту ${config.get('port')}`);
	});