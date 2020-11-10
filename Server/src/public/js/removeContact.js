
function removeContact(){
  $(".user-remove-contact").unbind("click").on("click",function(){

   let targetId=$(this).data("uid");
  let   username=$(this).parent().find(`div.user-name p`).text();
   Swal.fire({
    title: `Bạn có muốn xóa ${username} khỏi danh sách bạn bè k?`,
    text: "You will delete friend!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'

  }).then((result) => {
   if(!result.value){
      return false;
   }
   $.ajax({
    url:"/contact/remove-contact",
    type:"delete",
    data:{uid:targetId},
    success:function(data){
     if(data.success){
      $("#contacts").find(`ul li[data-uid=${targetId}]`).remove();
   
       // Cong tru so o modal
       decreaseNumberNotifContact("count-contacts");

       //Sau nay lam phan chat

       //Phat ra cho su kien xoa ban be voi du lieu la id cua thang nhan
       socket.emit("remove-contact",{contactId:targetId});
     }
    }
  })
  })

  
 
 })


}

// ben nhan socket//  nhan su kien
socket.on("response-remove-contact",function(user){
  $("#contacts").find(`ul li[data-uid=${user.id}]`).remove();
   
  // Cong tru so o modal
  decreaseNumberNotifContact("count-contacts");

         
});

$(document).ready(function(){
removeContact();
})