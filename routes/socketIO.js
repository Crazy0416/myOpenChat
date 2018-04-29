const roomModel = require('../models/room');

exports = module.exports = function(io){

    let socketRoom = {};      // 'socketId' : ['roomKey', 'name']가 property로 등록
    let count = 1;
    io.on('connection', function(socket){
        console.log('user connected : ', socket.id);
        let name = "user" + count++;
        console.log('user name : ', name);
        io.to(socket.id).emit('change name', name);

        socket.on('joinRoom', function(roomKey){
            console.log('joinRoom : ' + roomKey);
            socket.join(roomKey);
            socketRoom[socket.id] = [roomKey, name];
            let clientNumber = io.sockets.adapter.rooms[roomKey].length;        // 클라이언트 수
            console.log(roomKey + " room client count : " + clientNumber);
        });

        socket.on('disconnect', function(){
            console.log('user disconnected : ', socket.id);
            console.log('room : ', socketRoom[socket.id][0]);
            let clientNumber = getAllRoomMembers(socketRoom[socket.id][0]);        // 그 방의 클라이언트 수
            console.log(socketRoom[socket.id][0] + " room client count : " + clientNumber.length);
            if(clientNumber.length == 0){    // room 안에 client가 없다면 room이 있을 이유가 없으므로..
                console.log("delete room now");
                roomModel.find({_id: socketRoom[socket.id][0]}).remove((err) => {
                    if(err) console.error("ERR: ", err);
                });
            }
            socket.in(socketRoom[socket.id][0]).emit('receive message', socketRoom[socket.id][1] + "님께서 방을 나가셨습니다.");
            socket.leave(socketRoom[socket.id][0]);          // roomKey 방 탈출
            delete socketRoom[socket.id];                 // socketRoom의 property 삭제
        });
        socket.on('send message', function(name, text, roomKey){
            let msg = name + ' : ' + text;
            console.log(msg);
            io.sockets.in(roomKey).emit('receive message', msg);
        });
    });

    function getAllRoomMembers(room, _nsp) {
        let roomMembers = [];
        let nsp = (typeof _nsp !== 'string') ? '/' : _nsp;

        for( let member in io.nsps[nsp].adapter.rooms[room] ) {
            roomMembers.push(member);
        }

        return roomMembers;
    }
};