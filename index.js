var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    var addedUser = false;

    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
    socket.on('new user', function(username){
        if (addedUser) return;

        socket.username = username;

        addedUser = true;

        io.emit('new user', {
            username: socket.username
        });
    });
});

http.listen(8000,'192.168.1.17', function(){
    console.log('listening on *:3000');
});