let SOCKET_IO = {};
SOCKET_IO.connect = function (io) {
    let listRoom = [];
    io.on('connection', function (socket) {
        SOCKET_IO.socket = socket;
        socket.on('join-room', function (data) {
            socket.idRoom = data.idConversation;
            socket.username = data.username;
            socket.join(data.idConversation);
            if(!listRoom[data.idConversation]) listRoom[data.idConversation] = [];
            let check = false;
            for(let username of listRoom[data.idConversation]) {
                if(username==data.username) {
                    check = true;
                    break;
                }
            }
            if(!check) listRoom[data.idConversation].push(data.username);
            io.in(data.idConversation).emit('send-members-online', listRoom[data.idConversation]);
        });
        socket.on('sendMessage', function (data) {
            io.in(data.idConversation).emit('sendMessage', data);
        });
        socket.on('off-project', function(data) {
            if(listRoom[data.idConversation]) {
                listRoom[data.idConversation].forEach(function(username, i) {
                    if(username == data.username) listRoom[data.idConversation].splice(i,1);
                    if(!listRoom[data.idConversation].length) delete listRoom[data.idConversation];
                })
            }
            io.in(data.idConversation).emit('off-project', data);
        });
        socket.on('disconnect', function() {
            listRoom.forEach(function(room, index){
                room.forEach(function(username, i) {
                    if(username == socket.username) room.splice(i, 1);
                })
                if(!room.length) listRoom.splice(index, 1);
            });
            socket.to(socket.idRoom).emit('disconnected', socket.username);
        });
    });
};
module.exports.socket_io = SOCKET_IO;