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
    function getGameName(data){
        return 'game '+data.gameId;
    }
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });

    socket.on('join game', function(data){
        socket.username = data.username;
        socket.gameId = data.gameId;
        socket.join(getGameName(data));
        socket.emit('join game', {
            username: socket.username,
            gameId: socket.gameId,
        });
        socket.broadcast.to(getGameName(data)).emit('new user', data);
    });
    socket.on('new game', function(data){
        if (addedUser) return;
        socket.username = data.username;
        socket.gamename = data.gamename;
        socket.gameId = parseInt(Math.random() * 10000);
        addedUser = true;
        socket.join(getGameName(socket));
        socket.emit('new game', {
            username: socket.username,
            gamename: socket.gamename,
            gameId: socket.gameId,
        });
    });
    socket.on('start room', function(){
        var clients = io.nsps['/'].adapter.rooms[getGameName(socket)].sockets;
        socket.roundNumber = 1;
        socket.clients = clients;
        //Get first client
        var clientId = Object.keys(socket.clients)[0];
        var leaderUsername = (io.sockets.sockets[clientId].username);

        socket.broadcast.to(getGameName(socket)).emit('start room', {
            leaderUsername: leaderUsername,
            roundNumber: 1
        });
    });

    socket.on('start game', function(data){
        socket.number = data.number;
        console.log(getGameName(socket));
        io.in(getGameName(socket)).emit('start game');
    });
});

http.listen(8000, function(){
    console.log('listening on *:8000');
});