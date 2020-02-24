const path = require('path');
const expressHbs = require('express-handlebars');
const hbs = require('hbs');

const exphbs = expressHbs.create({
    layoutsDir: "views/layouts", 
    defaultLayout: "master",
    extname: "hbs",
    helpers: {
        section: function(name, options) { 
            if (!this._sections) 
                this._sections = {};
                
            this._sections[name] = options.fn(this); 
            return null;
		},
		blocks: function(name, options) { 
            if (!this._blocks) 
                this._blocks = {};
                
            this._blocks[name] = options.fn(this); 
            return null;
        },
    }
});

module.exports = (app, module) => {
    const rootDirName = path.parse(module.filename).dir;

    hbs.registerPartials(path.join(rootDirName, "views/partials"));

    app
        .set("view engine", "hbs")
        .engine('hbs', exphbs.engine)
        .set("views", path.join(rootDirName, 'views'))
}