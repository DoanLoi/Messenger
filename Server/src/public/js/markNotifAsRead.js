function markNotificationsAsRead(targetUsers){
  $.ajax({
    url:"/notification/mark-all-as-read",
    type:"put",
    data:{targetUsers},
    success:function(result){
      if(result){
        targetUsers.forEach(function(uid){
          $(".noti_content").find(`div[data-uid=${uid}]`).removeClass("notif-readed-false"); 
          $(".list-notifications").find(`li>div[data-uid=${uid}]`).removeClass("notif-readed-false");
        });
        decreaseNumberNotification("noti_counter",targetUsers.length)
      }
    }
  })
}

$(document).ready(function(){
  //link at popup notification
  $("#popup-mark-notif-as-read").bind("click",function(){
   
    let targetUsers=[];
    $(".noti_content").find("div.notif-readed-false").each(function(index,notification){
      targetUsers.push($(notification).data("uid"));
    });
    if(!targetUsers.length){
      alertify.notify("Bạn hết thông báo chưa đọc");
      return false;
    }
    markNotificationsAsRead(targetUsers);
  })
  //link at modal notification
  $("#modal-mark-notif-as-read").bind("click",function(){
    let targetUsers=[];
    $(".list-notifications").find("li>div.notif-readed-false").each(function(index,notification){
      targetUsers.push($(notification).data("uid"));
    });
    if(!targetUsers.length){
      alertify.notify("Bạn hết thông báo chưa đọc");
      return false;
    }
    markNotificationsAsRead(targetUsers);
  })
})