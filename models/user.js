const crypto = require('crypto');
const async = require("async");
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

userSchema.statics.authrize = function(name, password, callback){
    const UserModel = this;

    async.waterfall(
        [
            callback => {
                UserModel.findOne({name}, callback);
            },
            (user, callback) => {
                if (user) {
                    if (user.checkPassword(password)) {
                        callback(null, user);
                    } else {
                        callback(new AuthError(403, 'Пароль не верен'));
                    }
                } else {
                    let newUser = new UserModel({
                        name,
                        password
                    });
    
                    newUser.save(err => {
                        if (err) {
                            return callback(err);
                        }
    
                        callback(null, newUser);
                    });
                }
            }
        ], callback);
}

module.exports = mongoose.model('User', userSchema);