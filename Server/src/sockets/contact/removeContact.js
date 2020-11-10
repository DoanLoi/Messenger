import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "../../helpers/socketHelper"


let removeContact=(io)=>{ //io tu thu vien cua socket.io
  let clients={};// bien cuc bo luu tru tat ca socketid cua nguoi dung
  
  io.on("connection",(socket)=>{ // moi khi co 1 nguoi dung ket nois thi ham nay chay 1 lan
    
  //luu socketId vao mang client
    clients=pushSocketIdToArray(clients,socket.request.user._id,socket.id)
  
    socket.on("remove-contact",(data)=>{
      // console.log(data);
      // console.log(socket.request.user);
      let currentUser={
        id:socket.request.user._id
      };
      if (clients[data.contactId])//Neu nguoi muon ket ban dang onl
      {
        // phat di su kien xoa yc ket ban
        emitNotifyToArray(clients,data.contactId,io,"response-remove-contact",currentUser);
        
      }
      
    });
    socket.on("disconnect",()=>{
     clients= removeSocketIdFromArray(clients,socket.request.user._id,socket)
    });
  })
 

}
module.exports=removeContact;