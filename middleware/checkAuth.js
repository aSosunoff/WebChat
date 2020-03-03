const HttpError = require('../error').HttpError;

module.exports = (req, res, next) => {
    if(!req.session.user) {
        return next(401, 'Вф не авторизованы');
    }

    next();
};