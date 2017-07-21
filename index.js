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

    socket.on('join game', function(data){
        socket.join('game '+data.gameId);
        socket.broadcast.to('game '+data.gameId).emit('new user', data);
    });
    socket.on('new game', function(data){
        if (addedUser) return;
        socket.username = data.username;
        socket.gamename = data.gamename;
        socket.gameId = parseInt(Math.random() * 10000);
        addedUser = true;
        socket.broadcast.to('game '+data.gameId).emit('new user',data);
        socket.emit('new game', {
           username: socket.username,
           gamename: socket.gamename,
           gameId: socket.gameId,
        });
    });
    socket.on('start game', function(data){
        var clients = io.sockets.clients('game '+data.gameId);

        socket.broadcast.to('game '+data.gameId).emit('game starting', data);
        socket.username = data.username;
        socket.gamename = data.gamename;
        socket.gameId = parseInt(Math.random() * 10000);
        addedUser = true;
    });
});

http.listen(8000, function(){
    console.log('listening on *:3000');
});