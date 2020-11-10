import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from "./../../helpers/socketHelper"
let typingOn = (io) => { //io tu thu vien cua socket.io
  let clients = {};// bien cuc bo luu tru tat ca socketid cua nguoi dung
  
  io.on("connection", (socket) => { // moi khi co 1 nguoi dung ket nois thi ham nay chay 1 lan


    //luu socketId vao mang client
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
    socket.request.user.chatGroupIds.forEach(group =>{
      clients = pushSocketIdToArray(clients,group._id, socket.id);
    })
  
    socket.on("user-is-typing", (data) => {
      if (data.groupId) {
        // thong tin nguoi gui va tin nhan
        let response = {
          currentGroupId:data.groupId,
          currentUserId: socket.request.user._id
        };
        if (clients[data.groupId])//Neu nguoi muon ket ban dang onl
        {
          emitNotifyToArray(clients,data.groupId,io, "response-user-is-typing",response);
        }
      }
      if (data.contactId) {
        // thong tin nguoi gui va tin nhan
        let response = {
          currentUserId: socket.request.user._id
        };

        if (clients[data.contactId])//Neu nguoi muon ket ban dang onl
        {
          //gui du lieu den cac socket cua nguoi ban muon ket ban
          emitNotifyToArray(clients,data.contactId, io, "response-user-is-typing",response);
        }
      }



    });
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket)
      socket.request.user.chatGroupIds.forEach(group =>{
        clients =removeSocketIdFromArray(clients, group._id, socket);
      })
    });
  })

}
module.exports = typingOn;