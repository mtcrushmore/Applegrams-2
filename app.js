var express = require('express');
var app = require('express').createServer();
var io = require('socket.io')(app);

app.listen(3000);

// socket.on('news', function (data) {
//   console.log(data);
//   socket.emit('my other event', { my: 'data' });

// }
