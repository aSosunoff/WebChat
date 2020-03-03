module.exports = (req, res, next) => {
    res.sendHttpError = (error) => {        
        res.status(error.status);

        if(req.xhr 
            || req.headers['x-requested-with'] == 'XMLHttpRequest' 
            || req.headers.accept.indexOf('json') > -1){
            res.send(error);
        } else {
            res.render('error.hbs', { error })
        }
    }

    next();
};