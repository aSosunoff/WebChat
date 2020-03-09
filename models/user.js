const crypto = require('crypto');
const mongoose = require('../libs/mongoose');
const AuthError = require('../error').AuthError;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String, 
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.encryptPassword = function (password) {
    return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
};

userSchema.virtual('password')
    .set(function(password){
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function(){
        return this._plainPassword;
    });

userSchema.methods.checkPassword = function(password){
    return this.encryptPassword(password) === this.hashedPassword;
}

async function auth(UserModel, name, password){
    let user = await new Promise((resolve, reject) => {
        UserModel.findOne({name}, (err, user) => {
            if(err) {
                reject(err);
            }

            resolve(user);
        });
    });

    return await new Promise((resolve, reject) => {
        if (user) {
            if (!user.checkPassword(password)) {
                reject(new AuthError(403, 'Пароль не верен'))
            }

            resolve(user);
        }

        user = new UserModel({
            name,
            password
        });

        user.save(err => {
            if (err) {
                reject(err);
            }

            resolve(user);
        });
    });
}

userSchema.statics.authrize = function(name, password, callback){
    auth(this, name, password)
        .then(user => {
            callback(null, user);
        })
        .catch(callback);
}

module.exports = mongoose.model('User', userSchema);