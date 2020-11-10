import { remove } from "fs-extra";

export let pushSocketIdToArray=(clients, userId, socketId)=>{
  if(clients[userId]){
    clients[userId].push(socketId); // them socketid ket noi
  }else{
   clients[userId]=[socketId];
  }
  return clients;
}


export let emitNotifyToArray=(clients,contactId,io,eventName,data)=>{

   clients[contactId].forEach(socketId => {
     io.sockets.connected[socketId].emit(eventName,data)

});
}

export let removeSocketIdFromArray=(clients,userId,socket)=>{
   clients[userId]=clients[userId].filter((socketId)=>{
        return socketId !==socket.id; // loai bo thang socketid da ket noi
      });
      if(!clients[userId].length){
        delete clients[userId]; // xoa mang neu user do khong con ket noi
      }
   return clients;
}