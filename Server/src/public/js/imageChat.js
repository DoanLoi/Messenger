function bufferToBase64(buffer){
  return btoa(
    new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  )
  
}


function imageChat(divId){
  //khi chon anh--> gia tri o input thay doi
  $(`#image-chat-${divId}`).unbind("change").on("change",function(){
    let fileData=$(this).prop("files")[0];
    console.log(fileData);
    let math=["image/png","image/jpg","image/jpeg"];
    let limit=5048576;
   
    if ($.inArray(fileData.type,math)===-1){
      alertify.notify("Khong dung dinh dang","error",7);
      $(this).val(null);
      return false;
       }
       if (fileData.size >limit ){
         alertify.notify("File qua lon","error",7);
         return false;
       }


       let targetId=$(this).data("chat");
       let isChatGroup=false;
       let messageFormData=new FormData();
       messageFormData.append("my-image-chat",fileData);
       messageFormData.append("uid",targetId);
       if($(this).hasClass("chat-in-group")){
           messageFormData.append("isChatGroup",true);
           isChatGroup=true;

      }
            $.ajax({
        url:"/message/add-new-image",
        type: "post",
        cache:false,
        contentType:false,
        processData:false,
        data:messageFormData,
        success:function(data){
          //realtime hinh anh
            //them hinh anh  real time ben thnag gui
          let dataToEmit={
            message:data.message
          } ;  
          let messageOfMe=$(` <div class="bubble me bubble-image-file" data-mess-id="${data.message._id}"></div>`);
          let imageChat=`<img src="data:${data.message.file.contentType};base64,${bufferToBase64(data.message.file.data.data)}" class="show-image-chat">`;
        if(isChatGroup){
           let senderAvatar=`<img class="avatar-small"  title="${data.message.sender.name}" src="images/users/${data.message.sender.avatar}">`;
           dataToEmit.groupId=targetId;
           messageOfMe.html(`${senderAvatar}${imageChat}`)
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId=targetId;
        }
        else{
          messageOfMe.html(imageChat);
          dataToEmit.contactId=targetId;
        }
        
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);

        nineScrollRight(divId);


           // Thay doi du lieu tin nhan cuoi cung ben leftside

           $(`.person[data-chat=${divId}]`).removeClass("message-time-realtime").find("span.time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
           $(`.person[data-chat=${divId}]`).find("span.preview").html("Bạn đã gửi 1 hình ảnh");
           //di chuyen cuoc tro truyen gan nhat o lefside
           $(`.person[data-chat=${divId}]`).on("click.moveConversationToTheTop",function(){
              
             
             let dataToMove=$(this).parent();
             $(this).closest("ul").prepend(dataToMove);
             $(this).off("click.moveConversationToTheTop");

           });
           $(`.person[data-chat=${divId}]`).click();


              //emit cho thang nhan
              
              socket.emit("chat-image",dataToEmit);

              //them anh vao phan modal

              let imageChatToAddModal=`<img src="data:${data.message.file.contentType};base64,${bufferToBase64(data.message.file.data.data)}">`;
              $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);//modal ow mainconfig  girdphotos
        },
        error:function(error){
          alertify.notify(error.responseText,"error",7);
        }
      })

  })
}


$(document).ready(function(){
  socket.on("response-chat-image",function(response){
    let divId="";
    let messageOfYou=$(` <div class="bubble you bubble-image-file" data-mess-id="${response.message._id}"></div>`);
          let imageChat=`<img src="data:${response.message.file.contentType};base64,${bufferToBase64(response.message.file.data.data)}" class="show-image-chat">`;
        if(response.currentGroupId){
           let senderAvatar=`<img class="avatar-small"  title="${response.message.sender.name}" src="images/users/${response.message.sender.avatar}">`;
           divId=response.currentGroupId;
           messageOfYou.html(`${senderAvatar}${imageChat}`);
      // trong tro truyen nhom currentUserId la thang gui-- trong tro truyen ca nhan curreUserId la thnag nhan
      
            increaseNumberMessageGroup(divId);
           
         
  
        }
        else{
          messageOfYou.html(imageChat);
          divId=response.currentUserId;
        }
       
  if(response.currentUserId !== $("#dropdown-navbar-user").data("uid"))
  {
    $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);

    nineScrollRight(divId);
    
      // Thay doi du lieu tin nhan cuoi cung ben leftside

      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
      $(`.person[data-chat=${divId}]`).find("span.preview").html("Bạn đã nhận một hình ảnh");
      //di chuyen cuoc tro truyen gan nhat o lefside
      $(`.person[data-chat=${divId}]`).on("topDown.moveConversationToTheTop",function(){
         
        
        let dataToMove=$(this).parent();
        $(this).closest("ul").prepend(dataToMove);
        $(this).off("topDown.moveConversationToTheTop");

      });
      $(`.person[data-chat=${divId}]`).trigger("topDown.moveConversationToTheTop");
      increaseNumberMessageGroup(divId);

      //them anh o phan modal

      let imageChatToAddModal=`<img src="data:${response.message.file.contentType};base64,${bufferToBase64(response.message.file.data.data)}">`;
      $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);//modal ow mainconfig  girdphotos

      
  }
  })
})