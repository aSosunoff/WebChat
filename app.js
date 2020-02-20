const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), () => {
	console.log(`Сервер запущен на порту ${app.get('port')}`);
});