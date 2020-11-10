
let userAvatar=null;
let userInfo={};
let originAvatarSrc=null;//de luu cac thong tin ban dau
let originUserInfo=null; // cua User
let userUpdatePassword={};
function updateUserInfo(){
  $("#input-change-avatar").bind("change",function(){
    let fileData=$(this).prop("files")[0];
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
       if (typeof FileReader != "undefined"){
            let imagePreview=$("#image-edit-profile");
            imagePreview.empty();
            let fileReader= new FileReader();
            fileReader.onload= function(element){  // khi da doc xong du lieu
              $("<img>",{
                "src":element.target.result,
                "class":"avatar img-circle",
                "id":"user-modal-avatar",
                "alt":"avatar"

              }).appendTo(imagePreview);
            }
            imagePreview.show();
            fileReader.readAsDataURL(fileData);
            let formData=new FormData();
            formData.append("avatar",fileData);
            userAvatar=formData;


       }else{
        alertify.notify("Web brower don't support","error",7);
       }
  });
  $("#input-change-username").bind("change",function(){
    let username=$(this).val();
    let regexUsername= new RegExp("^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$");
    if (!regexUsername.test(username) || username.length<3 || username.length>30){
      alertify.notify("Username co 3-17 tu va khong chua ki tu dac biet","error",7);
      $(this).val(originUserInfo.username);
      delete user.username;
      return false;
    }
    userInfo.username=$(this).val();
  })
  $("#input-change-gender-male").bind("click",function(){
    let gender=$(this).val();
    if(gender!=="male"){
      alertify.notify("Loi gioi tinh","error",7);
      $(this).val(originUserInfo.gender);
      delete user.gender;
      return false;
    }
    userInfo.gender=gender;
  });
  $("#input-change-gender-female").bind("click",function(){
    let gender=$(this).val();
    if(gender!=="female"){
      alertify.notify("Loi gioi tinh","error",7);
      $(this).val(originUserInfo.gender);
      delete user.gender;
      return false;
    }
    userInfo.gender=$(this).val();
  })

  $("#input-change-address").bind("change",function(){
    let address=$(this).val();
    if (address.length<3 || address.length >30){
      alertify.notify("Dia chi chua tu 3-30 ki tu","error",7);
    }
    userInfo.address=$(this).val();
  })
  $("#input-change-phone").bind("change",function(){
    let phone=$(this).val();
    let regexPhone= new RegExp("^(0)[0-9]{9,10}$");
    if (!regexPhone.test(phone) ){
      alertify.notify("So dien thoai khong dung","error",7);
      $(this).val(originUserInfo.phone);
      delete user.phone;
      return false;
    }
    userInfo.phone=$(this).val();
  });


  $("#input-change-current-password").bind("change",function(){
    let currentPassword=$(this).val();
    let regexCurrentPass= new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
   
    if (!regexCurrentPass.test(currentPassword) ){
      alertify.notify("Mat khau khong dung dinh dang","error",7);
      $(this).val("");
      delete userUpdatePassword.currentPassword;
      return false;
    }
    userUpdatePassword.currentPassword=currentPassword;
  });

  $("#input-change-new-password").bind("change",function(){
    let newPassword=$(this).val();
    let regexPass= new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
   
    if (!regexPass.test(newPassword) ){
      alertify.notify("Mat khau khong dung dinh dang","error",7);
      $(this).val("");
      delete userUpdatePassword.newPassword;
      return false;
    }
    userUpdatePassword.newPassword=newPassword;
  });

  $("#input-change-confirm-new-password").bind("change",function(){
    let confirmNewPassword=$(this).val();
    if(!userUpdatePassword.newPassword){
      alertify.notify("Ban chua nhap mat khau moi","error",7);
      $(this).val(null);
      delete userUpdatePassword.confirmNewPassword;
      return false
    }
    if (confirmNewPassword!==userUpdatePassword.newPassword){
      alertify.notify("Nhap lai mat khau khong chinh xac","error",7);
      delete userUpdatePassword.confirmNewPassword;
      return false;
    }
    userUpdatePassword.confirmNewPassword=confirmNewPassword;
  });
}

function callLogout(){
  $.get("/logout",function(){
    location.reload();
  });
}
function callUpdateUserInfo(){
  $.ajax({
    url:"/user/update-info",
    type: "put",
    data:userInfo,
    success:function(result){
      console.log(result);
      $(".user-modal-alert-success").find("span").text(result.message);
      $(".user-modal-alert-success").css("display","block");
       
      originUserInfo=Object.assign(originUserInfo,userInfo);//truong nao cua userInfo khac null thi
                                                            // se ghi de nen gia tri cua origin
      //update username
      $("#navbar-username").text(originUserInfo.username);                                                      

      $(".input-btn-cancel-update-user").click();
      
 
    },
    error:function(error){
      //Diplay err
      $(".user-modal-alert-error").find("span").text(error.responeText);
      $(".user-modal-alert-error").css("display","block");
      $(".input-btn-cancel-update-user").click();
    }
  })
}

function callUpdateUserAvatar(){
  $.ajax({
    url:"/user/update-avatar",
    type: "put",
    cache:false,
    contentType:false,
    processData:false,
    data:userAvatar,
    success:function(result){
      console.log(result);
      $(".user-modal-alert-success").find("span").text(result.message);
      $(".user-modal-alert-success").css("display","block");
      $(".input-btn-cancel-update-user").click();
      //Update nav avartar
      $("#nav-avatar").attr("src",result.imageSrc);
      originAvatarSrc=result.imageSrc;
    },
    error:function(error){
      //Diplay err
      $(".user-modal-alert-error").find("span").text(error.responeText);
      $(".user-modal-alert-error").css("display","block");
      $(".input-btn-cancel-update-user").click();
    }
  })
}
function callUpdateUserPassword(){
  $.ajax({
    url:"/user/update-password",
    type: "put",
    data:userUpdatePassword,
    success:function(result){
      console.log(result);
      $(".user-modal-password-alert-success").find("span").text(result.message);
      $(".user-modal-password-alert-success").css("display","block");
       
     
     
      $("#input-btn-cancel-update-user-password").click();

      //Logout after change password
      callLogout();
 
    },
    error:function(error){
      //Diplay err
      $(".user-modal-password-alert-error").find("span").text(error.responeText);
      $(".user-modal-password-alert-error").css("display","block");
      $(".input-btn-cancel-update-user").click();
    }
  })
}


$(document).ready(function(){
  originAvatarSrc=$("#user-modal-avatar").attr("src");
  originUserInfo={
    username: $("#input-change-username").val(),
    gender:($("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val() ,
    address: $("#input-change-address").val(),
    phone: $("#input-change-phone").val()
  }
  //update userInfor
  updateUserInfo();

  
  $("#input-btn-update-user").bind("click",function(){
    if($.isEmptyObject(userInfo) && !userAvatar){
      alertify.notify("Ban chua thay doi thong tin","error",7);
      return false;
    }
    if (userAvatar){
      callUpdateUserAvatar();
    }
    
    if(!$.isEmptyObject(userInfo)){
      console.log(userInfo);
      callUpdateUserInfo();
    }
    
  });
  $("#input-btn-cancel-update-user").bind("click",function(){
    let userAvatar=null;
    let userInfo={};
    $("#user-modal-avatar").attr("src",originAvatarSrc);
    $("#input-change-username").val(originUserInfo.username);
    (originUserInfo.gender === "male") ? $("#input-change-gender-male").click() : $("#input-change-gender-male").click();
    $("#input-change-address").val(originUserInfo.address);
    $("#input-change-phone").val(originUserInfo.phone);
 });
   

 $("#input-btn-update-user-password").bind("click",function(){
   if(!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmNewPassword){
     alertify.notify("Ban phai dien day du thong tin","error",7);
     return false;
   }
   Swal.fire({
    title: 'Are you sure?',
    text: "You will change password!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, change it!'
  }).then((result) => {
   if(!result.value){
      $("#input-btn-cancel-update-user-password").click();
      return false;
   }
   callUpdateUserPassword();
  })
  
  
 })
 $("input-btn-cancel-update-user-password").bind("click",function(){
  userUpdatePassword={};
  $("#input-change-confirm-new-password").val(null);
  $("#input-new-password").val(null);
  $("#input-change-current-password").val(null);
  

})
})