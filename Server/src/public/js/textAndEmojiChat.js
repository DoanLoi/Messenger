function textAndEmojiChat(divId){
$(".emojionearea").unbind("keyup").on("keyup",function(element){
  let currentEmojioneArea=$(this);
  if(element.which ===13){
    let targetId=$(`#write-chat-${divId}`).data("chat");// thnag nhan
    let messsageVal=$(`#write-chat-${divId}`).val();
    if(!targetId.length || !messsageVal ){
      return false;
    }
    
    let dataTextEmojiForSend={
      uid:targetId,
      messageVal:messsageVal

    };
    if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
      dataTextEmojiForSend.isChatGroup=true;
    }
    // luu tin nhan len csdl
    $.post("/message/add-new-text-emoji",dataTextEmojiForSend,function(data){

        let dataToEmit={
          message:data.message
        } ;  

        let messageOfMe=$(` <div class="bubble me data-mess-id="${data.message._id}></div>`);
          messageOfMe.text(data.message.text);
        if(dataTextEmojiForSend.isChatGroup){
           let senderAvatar=`<img class="avatar-small"  title="${data.message.sender.name}" src="images/users/${data.message.sender.avatar}">`;
           dataToEmit.groupId=targetId;
           messageOfMe.html(`${senderAvatar}${messageOfMe.text()}`)
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId=targetId;
        }
        else{
          dataToEmit.contactId=targetId;
        }

        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);

          nineScrollRight(divId);
          //Xoa du lieu o the input
          $(`#write-chat-${divId}`).val("");
          //Xoa du lieu o emojiArea
          currentEmojioneArea.find(".emojionearea-editor").text("");
      
            // Thay doi du lieu tin nhan cuoi cung ben leftside

            $(`.person[data-chat=${divId}]`).removeClass("message-time-realtime").find("span.time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
            $(`.person[data-chat=${divId}]`).find("span.preview").html(data.message.text);
            //di chuyen cuoc tro truyen gan nhat o lefside
            $(`.person[data-chat=${divId}]`).on("click.moveConversationToTheTop",function(){
               
              
              let dataToMove=$(this).parent();
              $(this).closest("ul").prepend(dataToMove);
              $(this).off("click.moveConversationToTheTop");

            });
            $(`.person[data-chat=${divId}]`).click();

            //Emit realtime de neu th nhan online thif se hien thi tin nhan luon
              socket.emit("chat-text-emoji",dataToEmit);

              //tat su kien dang nhap ben kia di
                typingOff(divId);
               
            
    }).fail(function(response){
      //err
      alertify.notify(response.responseText,"error",7);
    })
  }

})
}


$(document).ready(function(){
  socket.on("response-chat-text-emoji",function(data){
    // lay divId de tim toi tin nhan co divId de append vao
    let divId="";  
    let messageOfYou=$(` <div class="bubble you  data-mess-id="${data.message._id}></div>`);
    messageOfYou.text(data.message.text);
  
  if(data.currentGroupId){
     let senderAvatar=`<img class="avatar-small"  title="${data.message.sender.name}" src="images/users/${data.message.sender.avatar}">`;
     messageOfYou.html(`${senderAvatar}${messageOfYou.text()}`)
  
    //divId chinh la id cua nhom
    divId=data.currentGroupId;
  }else{
    //divId chinh la id cua ca nhan
    divId=data.currentUserId;
  }



  if(data.currentUserId !== $("#dropdown-navbar-user").data("uid"))
  {
    $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);

    nineScrollRight(divId);
    
      // Thay doi du lieu tin nhan cuoi cung ben leftside

      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
      $(`.person[data-chat=${divId}]`).find("span.preview").html(data.message.text);
      //di chuyen cuoc tro truyen gan nhat o lefside
      $(`.person[data-chat=${divId}]`).on("topDown.moveConversationToTheTop",function(){
         
        
        let dataToMove=$(this).parent();
        $(this).closest("ul").prepend(dataToMove);
        $(this).off("topDown.moveConversationToTheTop");

      });
      $(`.person[data-chat=${divId}]`).trigger("topDown.moveConversationToTheTop");
      increaseNumberMessageGroup(divId);
  }

  

  })
})