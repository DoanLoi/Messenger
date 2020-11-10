
function addContact(){
  $(".user-add-new-contact").bind("click",function(){
    let targetId=$(this).data("uid");
    $.post("/contact/add-new",{uid:targetId},function(data){
      console.log(data);
      if(data.success){
        //Neu gui roi thi chuyen sang mau do
        $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).hide();
        $("#find-user").find(`div.user-remove-request-contact-sent[data-uid=${targetId}]`).css("display","inline-block");
        increaseNumberNotifContact("count-request-contact-sent");

        //Khi them ban thi thong bao ben ngoai cung phai them 1
        increaseNumberNotification("noti_contact_counter",1);

        let userInforHtml=$("#find-user").find(`ul li[data-uid=${targetId}]`).get(0).outerHTML;



        // console.log(userInforHtml);
          //Them o modal dang cho xac nhan
          $("#request-contact-sent").find("ul").prepend(userInforHtml);
          removeRequestContactSent();  // Huy ket ban
         socket.emit("add-new-contact",{contactId:targetId});
         

      }
    })
  
  })
}
socket.on("response-add-new-contact",function(user){
   let notif=`<div class="notif-readed-false" data-uid="${ user.id }">
           <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
           <strong>${user.username}</strong> đã gui lời mời kết bạn cho bạn!
          </div>`;

          $(".noti_content").prepend(notif);
          $(".list-notifications").prepend(`<li>${notif}</li>`)
          increaseNumberNotifContact("count-request-contact-received");
          increaseNumberNotification("noti_contact_counter",1);
          increaseNumberNotification("noti_counter",1);
  
//khi co loi moi ket ban moi thi realtime thong tin cua nguoi do ve modal
          let userInforHtml=` <li class="_contactList" data-uid="${user.id}">
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
              <div class="user-approve-request-contact-received" data-uid=${user.id}>
                  Chấp nhận
              </div>
              <div class="user-remove-request-contact-received action-danger"
                  data-uid="${user.id}">
                  Xóa yêu cầu
              </div>
          </div>
      </li>`;

      $("#request-contact-received").find("ul").prepend(userInforHtml);
        removeRequestContactReceived();
        approveRequestContactReceived();
});
