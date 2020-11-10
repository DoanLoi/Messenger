
function approveRequestContactReceived(){
   $(".user-approve-request-contact-received").unbind("click").on("click",function(){

    let targetId=$(this).data("uid");

    

   $.ajax({
     url:"/contact/approve-request-contact-received",
     type:"put",
     data:{uid:targetId},
     success:function(data){
      if(data.success){
        let userInfor=$("#request-contact-received").find(`ul li[data-uid=${targetId}]`);
        $(userInfor).find(`div.user-approve-request-contact-received`).remove();
        $(userInfor).find(`div.user-remove-request-contact-received`).remove();
        $(userInfor).find("div.contactPanel")
        .append(`
        <div class="user-talk" data-uid="${targetId}">Trò chuyện</div>
        <div class="user-remove-contact action-danger" data-uid="${targetId}">Xóa liên hệ </div>
        `)
        let userInforHtml=userInfor.get(0).outerHTML;
    
        $("#contacts").find(`ul`).prepend(userInforHtml);
        $(userInfor).remove();
    
        // Cong tru so o modal
        decreaseNumberNotifContact("count-request-contact-received");
        increaseNumberNotifContact("count-contacts");
        decreaseNumberNotification("noti_contact_counter",1);
        //Huy ket ban
        removeContact();
        //Phat ra cho su kien dong y ket ban voi du lieu la id cua thang nhan
        socket.emit("approve-request-contact-received",{contactId:targetId});
      }
     }
   })
  
  })
 
 
 }
 
 // ben nhan socket//  nhan su kien
 socket.on("response-approve-request-contact-received",function(user){
   //thong bao co nguoi dong y ket ban
   let notif=`<div class="notif-readed-false" data-uid="${ user.id }">
           <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
           <strong>${user.username}</strong> đã chấp nhận lời mời kết bạn của bạn!
          </div>`;

          $(".noti_content").prepend(notif);
          $(".list-notifications").prepend(`<li>${notif}</li>`)

          decreaseNumberNotification("noti_contact_counter",1);
          increaseNumberNotification("noti_counter",1);
          

          decreaseNumberNotifContact("count-request-contact-sent");
          increaseNumberNotifContact("count-contacts");


          $("#request-contact-sent").find(`ul li[data-uid=${user.id}]`).remove();
          $("#find-user").find(`ul li[data-uid=${user.id}]`).remove();

          let userInforHtml=`
          <li class="_contactList" data-uid="${user.id}">
          <div class="contactPanel">
              <div class="user-avatar">
                  <img src="images/users/${user.avatar}" alt="">
              </div>
              <div class="user-name">
                  <p>
                      ${user.username}
                  </p>
              </div>
              <br>
              <div class="user-address">
                  <span>&nbsp ${user.address}</span>
              </div>
              <div class="user-talk" data-uid="${user._id}">
                  Trò chuyện
              </div>
              <div class="user-remove-contact action-danger" data-uid="${user._id}">
                  Xóa liên hệ
              </div>
          </div>
      </li>
          `;
          $("#contacts").find(`ul`).prepend(userInforHtml);
          //Huy ket ban
        removeContact();
          
 });
 
 $(document).ready(function(){
 approveRequestContactReceived();
 })