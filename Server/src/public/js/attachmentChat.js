function attachmentChat(divId){
  $(`#attachment-chat-${divId}`).unbind("change").on("change",function(){

    let fileData=$(this).prop("files")[0];
    let limit=2048576;
   

       if (fileData.size >limit ){
         alertify.notify("File qua lon","error",7);
         return false;
       }


       let targetId=$(this).data("chat");
       let isChatGroup=false;
       let messageFormData=new FormData();
       messageFormData.append("my-attachment-chat",fileData);
       messageFormData.append("uid",targetId);
       if($(this).hasClass("chat-in-group")){
           messageFormData.append("isChatGroup",true);
           isChatGroup=true;

      }

      $.ajax({
        url:"/message/add-new-attachment",
        type: "post",
        cache:false,
        contentType:false,
        processData:false,
        data:messageFormData,
        success:function(data){
          console.log(data);
          let dataToEmit={
            message:data.message
          } ;  
          let messageOfMe=$(` <div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}"></div>`);

          let attachmentChat=`<a href="data:${data.message.file.contentType};base64,${bufferToBase64(data.message.file.data)}" 
          download="${data.message.file.fileName}">
          ${data.message.file.fileName}
          </a>`;
        if(isChatGroup){
           let senderAvatar=`<img class="avatar-small"  title="${data.message.sender.name}" src="images/users/${data.message.sender.avatar}">`;
           dataToEmit.groupId=targetId;
           messageOfMe.html(`${senderAvatar}${attachmentChat}`)
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId=targetId;
        }
        else{
          messageOfMe.html(attachmentChat);
          dataToEmit.contactId=targetId;
        }
        
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);

        nineScrollRight(divId);


        // Thay doi du lieu tin nhan cuoi cung ben leftside

        $(`.person[data-chat=${divId}]`).removeClass("message-time-realtime").find("span.time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html("Bạn đã gửi 1 tệp");
        //di chuyen cuoc tro truyen gan nhat o lefside
        $(`.person[data-chat=${divId}]`).on("click.moveConversationToTheTop",function(){
           
          let dataToMove=$(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("click.moveConversationToTheTop");

        });
        $(`.person[data-chat=${divId}]`).click();


           //emit cho thang nhan
           
           socket.emit("chat-attachment",dataToEmit);

           //them file vao phan modal
           let attachmentChatToAddModal=` <li>
           <a href="data:${data.message.file.contentType};base64,${bufferToBase64(data.message.file.data)}" 
               download="${data.message.file.fileName}">
               ${data.message.file.fileName}
               </a>
         </li>`;
           $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal);//modal ow mainconfig  girdphotos
         
        },
        error:function(error){
          alertify.notify(error.responseText,"error",7);
        }
      })
  })
}

$(document).ready(function(){
  socket.on("response-chat-attachment",function(response){
    let divId="";
    let messageOfYou=$(` <div class="bubble you bubble-attachment-file" data-mess-id="${response.message._id}"></div>`);
    let attachmentChat=`<a href="data:${response.message.file.contentType};base64,${bufferToBase64(response.message.file.data)}" 
    download="${response.message.file.fileName}">
    ${response.message.file.fileName}
    </a>`;
  if(response.currentGroupId){
     let senderAvatar=`<img class="avatar-small"  title="${response.message.sender.name}" src="images/users/${response.message.sender.avatar}">`;
     divId=response.currentGroupId;
     messageOfYou.html(`${senderAvatar}${attachmentChat}`);
// trong tro truyen nhom currentUserId la thang gui-- trong tro truyen ca nhan curreUserId la thnag nhan

      increaseNumberMessageGroup(divId);
     
   

  }
  else{
    messageOfYou.html(attachmentChat);
    divId=response.currentUserId;
  }

  if(response.currentUserId !== $("#dropdown-navbar-user").data("uid"))
  {
    $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);

    nineScrollRight(divId);
    
      // Thay doi du lieu tin nhan cuoi cung ben leftside

      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
      $(`.person[data-chat=${divId}]`).find("span.preview").html("Bạn đã nhận một tệp đính kèm");
      //di chuyen cuoc tro truyen gan nhat o lefside
      $(`.person[data-chat=${divId}]`).on("topDown.moveConversationToTheTop",function(){
         
        
        let dataToMove=$(this).parent();
        $(this).closest("ul").prepend(dataToMove);
        $(this).off("topDown.moveConversationToTheTop");

      });
      $(`.person[data-chat=${divId}]`).trigger("topDown.moveConversationToTheTop");
      increaseNumberMessageGroup(divId);

      //them tep o phan modal realtime
      let attachmentChatToAddModal=`<li>
      <a href="data:${response.message.file.contentType};base64,${bufferToBase64(response.message.file.data)}" 
          download="${response.message.file.fileName}">
          ${response.message.file.fileName}
          </a>
    </li>`;
      $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal);//modal ow mainconfig  girdphotos
    
  }


  })
})