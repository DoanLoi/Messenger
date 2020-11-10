
function removeRequestContactSent(){
     console.log("A");
    $(".user-remove-request-contact-sent").unbind("click").on("click",function(){
      let targetId=$(this).data("uid");
      console.log(targetId);
     $.ajax({
       url:"/contact/remove-request-contact-sent",
       type:"delete",
       data:{uid:targetId},
       success:function(data){
        if(data.success){
          //Neu gui roi thi chuyen sang mau do
          $("#find-user").find(`div.user-remove-request-contact-sent[data-uid=${targetId}]`).hide();
          $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).css("display","inline-block");
            decreaseNumberNotifContact("count-request-contact-sent");

            //Khi huy loi moi ket ban cua minh da gui di thi tru thong bao ben ngaoi di 1
            decreaseNumberNotification("noti_counter",1);
            //Phat ra su kien
            socket.emit("remove-request-contact-sent",{contactId:targetId});

            //Xoa o modal dang cho xac nhan voi thang gui
            $("#request-contact-sent").find(`li[data-uid=${targetId}]`).remove();

        }
       }
     })
    
    })
  
  
}

// ben nhan socket//  nhan su kien
socket.on("response-remove-request-contact-sent",function(user){
         // xoa o thong bao
         $(".noti_content").find(`div[data-uid=${user.id}]`).remove();

       //Xoa o modal
       $(".list-notifications").find(` li>div[data-uid=${user.id}]`).parent().remove();
         decreaseNumberNotifContact("count-request-contact-received");
         decreaseNumberNotification("noti_contact_counter",1);
         decreaseNumberNotification("noti_counter",1);
           // Khi th kia an huy ket ban se xoa realtime loi kb ben nay
         $("#request-contact-received").find(`li[data-uid=${user.id}]`).remove();
});

$(document).ready(function(){
  removeRequestContactSent();
})