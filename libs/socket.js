const config = require("../config");
const async = require('async');
const cookie = require('cookie');
const coocieParserMiddleware = require('cookie-parser');
const sessionStore = require('../libs/sessionStore');
const HttpError = require('../error').HttpError;
const logger = require("./log")(module);
const User = require('../models/user');

module.exports = (server) => {
    const io = require("socket.io")(server, {
        origins: `localhost:${config.get("port")}`,
    });

    io.use((socket, next) =>{
        async.waterfall([
            callback => {
                socket.handshake.cookie = cookie.parse(socket.handshake.headers.cookie);
                let sidCookie = socket.handshake.cookie[config.get('session:key')];
                let sid = coocieParserMiddleware.signedCookie(sidCookie, config.get('session:secret'));

                sessionStore.load(sid, (err, session) => {
                    if(err){
                        callback(null, null);
                    } else {
                        callback(null, session);
                    }                    
                });
            },
            (session, callback) => {
                if(!session){
                    callback(new HttpError(401, 'Сессий нет'))
                }

                socket.handshake.session = session;

                if(!session.user){
                    logger.debug(`Анонимная сессия ${session.id}`);
                    return callback(null, null);
                }

                logger.debug(`Подключен пользователь ${session.user}`);

                User.findById(session.user, (err, user) => {
                    if(err) {
                        return callback(err);
                    }

                    if(!user) {
                        return callback(null, null);
                    }

                    logger.debug(`Пользователь найден ${user}`);

                    callback(null, user);
                })
            },
            (user, callback) => {
                if(!user) {
                    return callback(new HttpError(403, 'Анонимная сессия'));
                }

                socket.handshake.user = user;

                callback(null);
            }
        ], err => {
            if(err) {
                return next(err);
            }
        
            next();
        });
    });
    
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