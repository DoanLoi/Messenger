
function removeRequestContactReceived(){
 
 $(".user-remove-request-contact-received").unbind("click").on("click",function(){
   let targetId=$(this).data("uid");
  $.ajax({
    url:"/contact/remove-request-contact-received",
    type:"delete",
    data:{uid:targetId},
    success:function(data){
     if(data.success){
          
    //   // xoa o thong bao
    //   $(".noti_content").find(`div[data-uid=${user.id}]`).remove();

    // //Xoa o modal
    // $(".list-notifications").find(` li>div[data-uid=${user.id}]`).parent().remove();
         decreaseNumberNotifContact("count-request-contact-received");

         //Khi huy loi moi ket ban cua minh da gui di thi tru thong bao ben ngaoi di 1
         decreaseNumberNotification("noti_counter",1);
         //Phat ra su kien
         socket.emit("remove-request-contact-received",{contactId:targetId});

         //Xoa o modal dang cho xac nhan voi thang gui
         $("#request-contact-received").find(`li[data-uid=${targetId}]`).remove();

     }
    }
  })
 
 })


}

// ben nhan socket//  nhan su kien
socket.on("response-remove-request-contact-received",function(user){
  //an hien nut them ban va xoa 
  $("#find-user").find(`div.user-remove-request-contact-sent[data-uid=${user.id}]`).hide();
  $("#find-user").find(`div.user-add-new-contact[data-uid=${user.id}]`).css("display","inline-block");
      
      decreaseNumberNotifContact("count-request-contact-sent");
      decreaseNumberNotification("noti_contact_counter",1);
      // decreaseNumberNotification("noti_counter",1);
        // Khi th kia an huy ket ban se xoa realtime loi kb ben nay
      $("#request-contact-sent").find(`li[data-uid=${user.id}]`).remove();
});

$(document).ready(function(){
removeRequestContactReceived();
})