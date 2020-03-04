const AuthError = require('../error').AuthError;
const HttpError = require('../error').HttpError;
const UserModel = require("../models/user");

exports.getLogin = (req, res) => {
	res.render("auth/login.hbs");
};

exports.postLogin = (req, res, next) => {
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

exports.postLogout = (req, res, next) => {
	req.session.destroy();
	res.redirect('/');
};
