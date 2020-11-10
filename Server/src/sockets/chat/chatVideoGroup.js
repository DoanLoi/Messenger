
let chatVideoGroup = (io) => {

const users = {};

const socketToRoom = {};

io.on('connection', socket => {
    //1 th moi tham gia cuoc goi
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
        //gui lai cho th moi tham gia socketID cua tat cac cac thang da trong cuoc goi
        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        //gui den 1 th da trong cuoc goi // signal la stream cua th moi// callerId la socket cua th moi
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });

})};



