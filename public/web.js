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

    socket.on('new user', function (username) {
        $('#usernameLogged').append(username.username);
    });

    setUsername = function() {
        var usernameInput = $('#usernameInput').val();
        username = usernameInput.trim();

        if (username) {
            socket.emit('new user', username);
            $('#chat-send').removeAttr('disabled');
            $('#loginInput').hide();
            $('#userBlock').css('display', '');
        }
    }
});