import passport from "passport";
import passportLocal from "passport-local";
import UserModel from "./../../models/usersModel";
import ChatGroupModel from "./../../models/chatGroupModel";
import { transErrors, transSuccess } from "../../../lang/vi";

let LocalStrategy=passportLocal.Strategy;

/**
 * Valid user account type:local
 */
let initPassportLocal=()=>{

  passport.use(new LocalStrategy({
    usernameField:"email",
    passwordField:"password",
    passReqToCallback:true
  },async (req,email,password,done)=>{
    try{
      console.log("aaaa");
      console.log(email+"_"+password);
      let user=await UserModel.findByEmail(email);
      if (!user){
        return done(null,false,req.flash("errors",transErrors.login_failed));
      }
      if (!user.local.isActive){
        return done(null, false, req.flash("errors",transErrors.account_not_active));
       
      }
      let checkPassword= await user.comparePassword(password);
      if (!checkPassword){
        return done(null, false,req.flash("errors",transErrors.login_failed))
      }
      req.flash("success",transSuccess.loginSuccess(user.username))
      return done(null, user, req.flash("success",transSuccess.loginSuccess(user.username)))
    }catch(err){
      console.log(err);
      return done(null, false, req.flash("errors",transErrors.server_error))
    }
  }));


// Luu Userid vao session
  passport.serializeUser((user,done)=>{
     done(null,user._id);
  });
  //passport session goi deserializeUser
  // gan du lieu vao request.user
  passport.deserializeUser(async (id,done)=>{
    try{
      let user= await UserModel.findUserByIdForSessionToUse(id);
   
      let getChatGroupIds=await ChatGroupModel.getChatGroupIdsByUser(user._id);
      user=user.toObject();
      user.chatGroupIds=getChatGroupIds;
      
      return done(null,user);
    }catch(err){
      return (err,null);
      
    }
   

  });// luu thong tin cua user tim duoc vao req,user
}
module.exports=initPassportLocal;