exports.index = (req, res, next) => {
    res.render('chat/index.hbs', {
        isChat: true
    });
}