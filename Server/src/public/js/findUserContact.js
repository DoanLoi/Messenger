

$(document).ready(function(){
$("#input-find-user-contact").bind("keypress",callFindUser);
$("#btn-find-user-contact").bind("click",callFindUser);
});

function callFindUser(element){
  if(element.which===13 || element.type==="click"){
    let keyword=$("#input-find-user-contact").val();
    let regexKeyword= new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);

    if(!keyword.length){
      alertify.notify("Chua nhap noi dung tim kiem","error",7);
      return false;
    }
    if(!regexKeyword.test(keyword)){
      alertify.notify("Ten nguoi dung tim kiem khong dung dinh dang","error",7);
      return false;
    }
    $.get(`/contact/find-users/${keyword}`,function(data){

      $("#find-user ul").html(data);
      addContact(); //js/addContact
      removeRequestContactSent();
    })
  }
}