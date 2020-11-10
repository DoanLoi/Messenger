import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper"
let approveRequestContactReceived=(io)=>{ //io tu thu vien cua socket.io
  let clients={};// bien cuc bo luu tru tat ca socketid cua nguoi dung
  
  io.on("connection",(socket)=>{ // moi khi co 1 nguoi dung ket nois thi ham nay chay 1 lan
    let currentUserId=socket.request.user._id;


  //luu socketId vao mang client
  clients=pushSocketIdToArray(clients,socket.request.user._id,socket.id)
  // console.log(clients);
    socket.on("approve-request-contact-received",(data)=>{
      // console.log(data);
      // console.log(socket.request.user);
      let currentUser={
        id:socket.request.user._id,
        username:socket.request.user.username,
        avatar:socket.request.user.avatar,
        address:socket.request.user.address == null ?"":socket.request.user.address
      };
      if (clients[data.contactId])//Neu nguoi muon ket ban dang onl
      {
        //gui du lieu den cac socket cua nguoi ban muon ket ban
        emitNotifyToArray(clients,data.contactId,io,"response-approve-request-contact-received",currentUser);
      }
      
    });
    socket.on("disconnect",()=>{
      clients= removeSocketIdFromArray(clients,socket.request.user._id,socket)
    });
  })

}
module.exports=approveRequestContactReceived;