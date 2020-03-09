const config = require("../config");

module.exports = (server) => {
    var io = require("socket.io")(server, {
        origins: `localhost:${config.get("port")}`,
    });

    io.use((socket, next) =>{
        debugger;
        //socket.request.headers.cookie
        next();
    });
    
    io.on("connection", function(socket) {
        debugger;
        console.log("a user connected");
    
        socket.on("message", function(msg, cb) {
            socket.broadcast.emit("message", msg);
            cb && cb(msg);
        });
    
        socket.on("disconnect", function() {
            console.log("user disconnected");
        });
    });
}