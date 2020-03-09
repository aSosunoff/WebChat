const config = require("../config");
const cookie = require('cookie');
const coocieParserMiddleware = require('cookie-parser');
const sessionStore = require('../libs/sessionStore');
const HttpError = require('../error').HttpError;
const logger = require("./log")(module);
const User = require('../models/user');

async function authSocket(socket, next) {
    try {
        const session = await new Promise((resolve, reject) => {
            socket.handshake.cookie = cookie.parse(socket.handshake.headers.cookie);
            let sidCookie = socket.handshake.cookie[config.get('session:key')];
            let sid = coocieParserMiddleware.signedCookie(sidCookie, config.get('session:secret'));
    
            sessionStore.load(sid, (err, session) => {
                if(err){
                    reject(new HttpError(401, 'Сессий нет'));
                } else {
                    socket.handshake.session = session;
                    resolve(session);
                }                    
            });
        });
        
        await new Promise((resolve, reject) => {
            if(!session.user){
                logger.debug(`Анонимная сессия ${session.id}`);
                reject(new HttpError(403, 'Анонимная сессия'));
            }

            logger.debug(`Подключен пользователь ${session.user}`);

            User.findById(session.user, (err, user) => {
                if(err) {
                    return callback(err);
                }

                if(!user) {
                    reject(new HttpError(403, 'Анонимная сессия'));
                }

                logger.debug(`Пользователь найден ${user}`);

                socket.handshake.user = user;

                resolve();
            })
        });

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = (server) => {
    const io = require("socket.io")(server, {
        origins: `localhost:${config.get("port")}`,
    });

    io.use(authSocket);
    
    io.on("connection", function(socket) {
        let userName = socket.handshake.user.get('name');
        
        logger.info(`${userName} connected`);
    
        socket.broadcast.emit('join', userName);

        socket.on("message", function(msg, cb) {
            socket.broadcast.emit("message", userName, msg);
            cb && cb(msg);
        });
    
        socket.on("disconnect", function() {
            logger.info(`user ${userName} disconnected`);

            socket.broadcast.emit("leave", userName);
        });
    });

    io.on('session:reload', sid => {
        let client = Object.values(io.sockets.sockets).find(socket => socket.handshake.session.id == sid);

        sessionStore.load(sid, (err, session) => {
            if(err){
                client.emit('error', 'Ошибка сервера');
                client.disconnect();
                return;
            } 
            
            if(!session){
                client.emit('logout', 'Вы не авторизованы');
                client.disconnect();
                return;
            }

            client.handshake.session = session;
        });
    });

    return io;
}