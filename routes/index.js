const { HttpError } = require('../error');
const User = require('../models/user');
const { ObjectID } = require('mongodb');

module.exports = (app) => {
    app.use((req, res, next) => {
		if(req.url == '/'){
			res.render('index.hbs', {
				// title: 'Главная страница',
				// isHome: true
			});
		}
		else
			next();
	})
	.get('/users', (req, res, next) => {
		User.find({}, (err, users) => {
			if(err) 
				return next(err);
			
			if(!users.length)
				return next(new HttpError(404, 'User not found'));
				
			res.send(users);
		});
	})
	.get('/user/:id', (req, res, next) => {
		let id;
		try {
			id = new ObjectID(req.params['id']);	
		} catch (error) {
			return next(404);
		}

		User.findById(id, (err, user) => {
			if(err) 
				return next(err);
			
			if(!user) 
				return next(new HttpError(404, 'User not found'));

			res.send(user);
		});
	});
}