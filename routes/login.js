const AuthError = require('../error').AuthError;
const HttpError = require('../error').HttpError;
const UserModel = require("../models/user");

exports.get = (req, res) => {
	res.render("login.hbs");
};

exports.post = (req, res, next) => {
	let name = req.body.name;
	let password = req.body.password;

	UserModel.authrize(name, password, (err, user) => {
		if(err) {
			if(err instanceof AuthError) {
				return next(new HttpError(403, err.message));
			} else {
				return next(err);
			}
		}

		req.session.user = user._id;
            
		res.send({});
	});
};
