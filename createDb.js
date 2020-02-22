const async = require('async');
const mongoose = require("./libs/mongoose");
const User = require("./models/user.js");

async.series([
    open,
    dropDatabase,
    createUsers
], (err) => {
    if(err)
        console.log('Error', err);

    mongoose.disconnect();
});

function open(callback) {
	mongoose.connection.on("open", callback);
}

function dropDatabase(callback) {
    mongoose.connection.db
        .dropDatabase(callback);
}

function createUsers(callback) {
	let user1 = new User({ name: "Alex", password: "qwerty" });
	let user2 = new User({ name: "Bill", password: "123456" });
	let user3 = new User({ name: "Shon", password: "654321" });

	User.insertMany([user1, user2, user3], callback);
}