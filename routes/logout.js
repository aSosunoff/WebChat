exports.post = (req, res, next) => {
	req.session.destroy();
	res.redirect('/');
};
