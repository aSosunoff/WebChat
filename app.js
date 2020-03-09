const app = require("express")();
var server = require("http").createServer(app);

const config = require("./config");
const logger = require("./libs/log")(module);

require('./libs/socket')(server);
// -----------------------------------------

require("./middleware/default")(app, module);
require("./middleware/template")(app, module);
require("./routes")(app);
require("./middleware/error")(app);

server.listen(config.get("port"), () => {
	console.log(`Сервер запущен на порту ${config.get("port")}`);
	/* logger.info(`Сервер запущен на порту ${config.get('port')}`); */
});
