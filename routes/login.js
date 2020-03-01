const async = require("async");
const HttpError = require('../error').HttpError;
const UserModel = require("../models/user");

exports.get = (req, res) => {
	res.render("login.hbs");
};

exports.post = (req, res, next) => {
	async.waterfall(
		[
			callback => {
				UserModel.findOne({name: req.body.name}, callback);
			},
			(user, callback) => {
				if (user) {
					if (user.checkPassword(req.body.password)) {
						callback(null, user);
					} else {
                        callback(new HttpError(403, 'Пароль не верен'));
					}
				} else {
					let newUser = new UserModel({
						name: req.body.name,
						password: req.body.password
					});

					newUser.save(err => {
						if (err) return callback(err);

						callback(null, newUser);
					});
				}
			}
		],
		(err, user) => {
            if (err) return next(err);
            
            req.session.user = user._id;
            
            res.send({});
		}
	);
};
