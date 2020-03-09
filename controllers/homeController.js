exports.index = (req, res) => {
    res.render('home/index.hbs', {
        isHome: true
    });
}