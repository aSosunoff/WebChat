const http = require('http');

class HttpError extends Error{
    constructor(status, message){
        super(message || http.STATUS_CODES[status] || 'Error');
        Error.captureStackTrace(this, HttpError);

        this.status = status;
        this.name = 'HttpError';
    }

    toString(){
        return this.message;
    }
}

module.exports.HttpError = HttpError;