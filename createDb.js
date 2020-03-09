const mongoose = require("./libs/mongoose");
const UserModel = require("./models/user.js");

async function createDb(){
    await new Promise((resolve, reject) => {
        mongoose.connection.on("open", resolve);
    });

    await mongoose.connection.db.dropDatabase();

    let user1 = new UserModel({ name: "Alex", password: "qwerty" });
	let user2 = new UserModel({ name: "Bill", password: "123456" });
    let user3 = new UserModel({ name: "Shon", password: "654321" });
    
    return await new Promise((resolve, reject) => {
        UserModel.insertMany([user1, user2, user3], (err, users) => {
            if(err) {
                reject(err);
            }
            
            resolve(users);
        });
    })
}

createDb()
    .then(console.log)
    .catch(console.log)
    .finally(() => {
        process.exit(1);
    });