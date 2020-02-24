
const { HttpError } = require('../error');
const errorhandlerMiddleware = require('errorhandler');

module.exports = (app) => {
    app
        .use((err, req, res, next) => {
            if(typeof err == "number"){
                err = new HttpError(err);
            }

            if(err instanceof HttpError){
                res.sendHttpError(err);
            } else {
                if(app.get('env') == 'development'){
                    errorhandlerMiddleware()(err, req, res, next);
                } else {
                    logger.error(err);
                    err = new HttpError(500);
                    res.sendHttpError(err);
                }
            }
        })
        .use((req, res, next) => {
            res.status(404);
            res.render('pageNotFound.hbs', { text: 'Страница не найдена' })
        });
}