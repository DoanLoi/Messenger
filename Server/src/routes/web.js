import express from "express";
import {home,auth,user,contact,notification,message} from "../controllers/index"
import {authValid,userValid,contactValid, messageValid} from "./../validation/index";
import initPassportLocal from "./../controllers/passportController/local"
import passport from "passport";
import initPassportFacebook from "./../controllers/passportController/facebook"
import crawlData from "../controllers/crawlData"



//Init  all passport
initPassportLocal();

//Init Facebook login
initPassportFacebook();



 let router=express.Router();

 //Init all router
 let initRoutes=(app)=>{

 router.get("/",home.getHome);// cac req xep theo thu tu
                                              //checkLoggin thuc hien truoc 
                                              // neu sai thi return hoac next() sang req tiep

 router.get("/checkLogin",auth.checkLoggedIn);                                           
 router.get("/login-register",auth.checkLoggedOut,auth.getLoginRegister );
 router.post("/register",auth.checkLoggedOut,authValid.register,auth.postRegister);
 router.get("/verify/:token",auth.checkLoggedOut,auth.verifyAccount);
 router.post("/login",(req,res,next)=>{
   console.log(req.body);
   next();
 },passport.authenticate("local",{
  successRedirect: "/login-success",
  failureRedirect:"/login-false",
  successFlash:true,
  failureFlash:true
}))
router.get("/login-success",(req,res)=>{
  return res.send(true);
})
router.get("/login-false",(req,res)=>{
  return res.send(false);
})


router.get("/friends",home.getFriend);
router.get("/invite-friends",home.getInviteFriend)

  // router.get("/auth/facebook",auth.checkLoggedOut,passport.authenticate("facebook",{scope:["email"]}));
  // router.get("/auth/facebook/callback",auth.checkLoggedOut,passport.authenticate("facebook",{
  //   successRedirect: "/login_success",
  //   failureRedirect:"/login_fail",
  //   successFlash:true,
  //   failureFlash:true
  // }))



  router.get("/logout",auth.checkLoggedIn,auth.getLogout);


  //Update avatar
  router.put("/user/update-avatar",auth.checkLoggedIn,user.updateAvatar);
  //Update UserInfo
  router.put("/user/update-info",auth.checkLoggedIn,userValid.updateInfo,user.updateInfo);
  router.put("/user/update-password",auth.checkLoggedIn,user.updatePassword);



 
  //Lay them danh sach ban be
  router.get("/contact/read-more-contacts",auth.checkLoggedIn,contact.readMoreContacts);
  router.get("/contact/read-more-contacts-sent",auth.checkLoggedIn,contact.readMoreContactsSent);
  router.get("/contact/read-more-contacts-received",auth.checkLoggedIn,contact.readMoreContactsReceived);
  //Lay them thong bao

  router.get("/notification/read-more",auth.checkLoggedIn,notification.readMore);
  router.put("/notification/mark-all-as-read",auth.checkLoggedIn,notification.markAllAsRead);
  



  router.delete("/contact/remove-request-contact-sent",auth.checkLoggedIn,contact.removeRequestContactSent);
  router.delete("/contact/remove-contact",auth.checkLoggedIn,contact.removeContact);
  router.delete("/contact/remove-request-contact-received",auth.checkLoggedIn,contact.removeRequestContactReceived);
  router.put("/contact/approve-request-contact-received",auth.checkLoggedIn,contact.approveRequestContactReceived);



  //Lam viec voi tin nhan

  router.post("/message/add-new-text-emoji",message.addNewTextEmoji);



  router.post("/message/add-new-image",auth.checkLoggedIn,message.addNewImage);
  router.post("/message/add-new-attachment",auth.checkLoggedIn,message.addNewAttachment);




  router.get("/contact/find-users/:keyword",contact.findUserContact);
  router.post("/contact/add-new",contact.addNew);

  //chat
  router.get("/chat/:id",home.getMessenger);

  //article

  router.get("/article",crawlData);
 return app.use("/",router);
 };
 module.exports=initRoutes;