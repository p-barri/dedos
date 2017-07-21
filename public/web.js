$(function () {
    var socket = io();
    $('form').submit(function () {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function (msg) {
        $('#messages').append($('<li>').text(msg));
    });

    socket.on('new game', function (data) {
        $('#usernameLogged').append(data.username);
        $('#gameId').append(data.gameId);
        $('#gameName').append(data.gameName);
    });
    socket.on('new user', function (data) {
        $('#users').append("<tr><td>"+data.username+"</td></tr>")
    });


    setUsername = function() {
        var usernameInput = $('#usernameInput').val();
        var gamenameInput = $('#gamenameInput').val();
        username = usernameInput.trim();
        gamename = gamenameInput.trim();

        if (username) {
            socket.emit('new game', {username: username, gamename: gamename});
            $('#chat-send').removeAttr('disabled');
            $('#loginInput').hide();
            $('#userBlock').css('display', '');
        }
    }
    joinGame = function() {
        var usernameInput = $('#usernameInput').val();
        var gamenameInput = $('#gamenameInput').val();
        username = usernameInput.trim();
        gamename = gamenameInput.trim();

        if (username) {
            socket.emit('new game', {username: username, gamename: gamename});
            $('#chat-send').removeAttr('disabled');
            $('#loginInput').hide();
            $('#userBlock').css('display', '');
        }
    }
});