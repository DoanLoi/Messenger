import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from "./../../helpers/socketHelper"
let chatVideo = (io) => { //io tu thu vien cua socket.io
  let clients = {};// bien cuc bo luu tru tat ca socketid cua nguoi dung

  io.on("connection", (socket) => { // moi khi co 1 nguoi dung ket nois thi ham nay chay 1 lan

     console.log(clients);
    //luu socketId vao mang client
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
   
    // socket.request.user.chatGroupIds.forEach(group =>{
    //   clients = pushSocketIdToArray(clients,group._id, socket.id);
    // })
  
    socket.on("caller-check-listener-online-or-not", (data) => {
      console.log(clients);
      console.log(data);
       if(clients[data.listenerId]){
         //online
   
         let  response={
           callerId:socket.request.user._id,
           listenerId:data.listenerId,
           callerName:data.callerName
         };


         emitNotifyToArray(clients,data.listenerId,io,"server-request-peer-id-of-listener",response);

       }
       else{
         socket.emit("server-send-listener-is-offline");
       }

    });
    socket.on("listener-emit-peer-id-to-server", (data) => {
        console.log(data);
        let response={
          callerId:data.callerId,
          listenerId:data.listenerId,
          callerName:data.callerName,
          listenerName:data.listenerName,
          listenerPeerId:data.listenerPeerId
        }
        //gui peerId cua thang nhan cho thang gui
       if(clients[data.callerId]){
        emitNotifyToArray(clients,data.callerId,io,"server-send-peer-id-of-listener-to-caller",response)
       }
   });

  //su kien yeu cau cuoc goi cau caller
   socket.on("caller-request-call-to-server", (data) => {
    let response={
      callerId:data.callerId,
      listenerId:data.listenerId,
      callerName:data.callerName,
      listenerName:data.listenerName,
      listenerPeerId:data.listenerPeerId
    }
    //gui peerId cua thang nhan cho thang gui
   if(clients[data.callerId]){
     //gui yeu cau cuoc goi cho thang listener
    emitNotifyToArray(clients,data.listenerId,io,"server-send-request-call-to-listener",response);
   }
});
//yeu cau huy cuoc goi cua caller
socket.on("caller-cancel-request-call-to-server", (data) => {
  let response={
    callerId:data.callerId,
    listenerId:data.listenerId,
    callerName:data.callerName,
    listenerName:data.listenerName,
    listenerPeerId:data.listenerPeerId
  }
  //gui peerId cua thang nhan cho thang gui
 if(clients[data.callerId]){
   //gui yeu cau cuoc goi cho thang listener
  emitNotifyToArray(clients,data.listenerId,io,"server-send-cancel-request-call-to-listener",response);
 }
});
//Listener tu choi cuoc goi
socket.on("listener-reject-request-call-to-server", (data) => {
  let response={
    callerId:data.callerId,
    listenerId:data.listenerId,
    callerName:data.callerName,
    listenerName:data.listenerName,
    listenerPeerId:data.listenerPeerId
  }
  //gui peerId cua thang nhan cho thang gui
 if(clients[data.callerId]){
   //gui yeu cau cuoc goi cho thang listener
  emitNotifyToArray(clients,data.callerId,io,"server-send-reject-call-to-listener",response);
 }
});
//Listener dong y cuoc goi
socket.on("listener-accept-request-call-to-server", (data) => {
  let response={
    callerId:data.callerId,
    listenerId:data.listenerId,
    callerName:data.callerName,
    listenerName:data.listenerName,
    listenerPeerId:data.listenerPeerId
  }

 if(clients[data.callerId]){
   //gui  cuoc goi cho thang caller
  emitNotifyToArray(clients,data.callerId,io,"server-send-accept-call-to-listener",response);
 }
 if(clients[data.listenerId]){
  //gui  cuoc goi cho thang listener
 emitNotifyToArray(clients,data.listenerId,io,"server-send-accept-call-to-listener",response);
}
});





    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket)
      // socket.request.user.chatGroupIds.forEach(group =>{
      //   clients =removeSocketIdFromArray(clients, group._id, socket);
      // })
    });
  })

}
module.exports = chatVideo;