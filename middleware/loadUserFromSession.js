const HttpError = require('../error').HttpError;
const UserModel = require('../models/user');

module.exports = (req, res, next) => {
    req.user = null;

    if(!req.session.user) {
        next();
    }

    UserModel.findById(req.session.user, (err, user) => {
        if(err){
            return next(new HttpError(404, 'Пользователь не найден'))
        }

        if(user) {
            req.user = res.locals.user = user.toObject();
        }

        next();
    });
};