module.exports = (req, res, next) => {
    res.sendHttpError = (error) => {        
        res.status(error.status);

        if(req.headers['x-requested-with'] == 'XMLHttpRequest'){
            res.send(error);
        } else {
            res.render('error.hbs', { error })
        }
    }

    next();
};