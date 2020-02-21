const User = require('./models/user');

let user = new User({
    name: 'Alex',
    password: "secret"
});

user.save((err, doc) => {
    if(err){
        switch(err.code){
            case 11000: 
                throw new Error('Не уникальное имя'); 
            break;
            default: 
                throw err;
        }
    }
        
    console.log(doc);

    User.findOne({name: 'Alex'}, (err, doc) => {
        if(err)
            throw err;
        
            console.log(doc);
    });
});