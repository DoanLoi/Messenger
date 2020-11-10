import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from "./../../helpers/socketHelper"
let userOnlineOffline = (io) => { //io tu thu vien cua socket.io
  let clients = {};// bien cuc bo luu tru tat ca socketid cua nguoi dung
  
  io.on("connection", (socket) => { // moi khi co 1 nguoi dung ket nois thi ham nay chay 1 lan


    //luu socketId vao mang client
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
    socket.request.user.chatGroupIds.forEach(group =>{
      clients = pushSocketIdToArray(clients,group._id, socket.id);
    })
    let listUserOnline=Object.keys(clients);
    //B1:Emit cho nguoi dung sau khi login
    socket.emit("server-send-list-users-online",listUserOnline);
    //B2: khi co 1 thang online se emit cho tat ca cac th online con lai
    socket.broadcast.emit("server-send-when-new-user-online",socket.request.user._id);
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket)
      socket.request.user.chatGroupIds.forEach(group =>{
        clients =removeSocketIdFromArray(clients, group._id, socket);
      })

      //B3:    //B2: khi co 1 thang offline se emit cho tat ca cac th onine con lai
    socket.broadcast.emit("server-send-when-new-user-offline",socket.request.user._id);
    });
  })

}
module.exports = userOnlineOffline;