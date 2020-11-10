
export const transValidation={
  email_incorrect:"Email phai co dang example@sadaa.com",
  gender_incorrect:"Gender",
  password_incorrect:"Mat khau pahi chua 8 ki tu chu hoa chu thuong va so",
  password_confirmation_incorrect:"Nhap lai mat khau khong chinh xac",
  update_username:"Username chua 3-17 ki tu va khong chua ki tu dac biet",
  update_gender:"Oops!Du lieu gioi tinh co van de",
  update_address:"Dia chi gioi han 3-30 ki tu",
  update_phone:"Dinh dang so dien thoai Viet Nam",
  keyword_find_user:"Loi tu khoa  tim kiem",
  message_text_emoji_incorrect:"Tin nhắn khôn hợp lệ"
 

};
export const transErrors={
  account_in_use:"Email da duoc su dung",
  account_in_remove:"Tai khoan nay da bi xoa",
  account_not_active:"Tai khoan chua duoc active",
  account_undefinded:"Tai khoan khong ton tai",
  token_undefinded:"Tai khoan nay da duoc active truoc do",
  login_failed:"Wrong email or password",
  server_error:"This is error of server",
  avatar_type:"File khong hop le",
  avatar_size:"File qua lon khong the tai",
  user_current_password_failed:"Mat khau hien tai khong chinh xac",
  conversation_not_found:"Cuộc trò truyện không tồn tại"
}
export const transSuccess= {
  userCreated : (userEmail)=>{
    return `Account <strong>${userEmail}</strong> created successly`
  },
  account_active:"Account actived. You can use app after login",
  loginSuccess:(username)=>{
     return `Hello ${username}`
  },
  logout_success:"Logout success",
  avatar_updated:"Cap nhat anh dai dien thnah cong",
  user_info_update:"cap nhat thong tin thanh congt mat khau",
  user_password_updated:"Cap nhap mat khau thanh cong"
}
export const transMail={
  subject: "Active Account",
  template: (linkVerify) =>{
    return `
    <h2>Email active tài khoản DVLChat".</h2>
    <h3>Click vào đây để active tài khoản</h3>
    <h3><a href=${linkVerify} target="blank">${linkVerify}</a></h3>
    `
  },
  send_failed:"Failed in process send active mail"
}