const app = require("express")();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

const config = require("./config");
const logger = require("./libs/log")(module);

// -----------------------------------------

require("./middleware/default")(app, module);
require("./middleware/template")(app, module);
require("./routes")(app);
require("./middleware/error")(app);

io.on("connection", function(socket) {
	console.log("a user connected");

	socket.on("message", function(msg, cb) {
		socket.broadcast.emit("message", msg);
		cb(msg);
	});

	socket.on("disconnect", function() {
		console.log("user disconnected");
	});
});

server.listen(config.get("port"), () => {
	console.log(`Сервер запущен на порту ${config.get("port")}`);
	/* logger.info(`Сервер запущен на порту ${config.get('port')}`); */
});
