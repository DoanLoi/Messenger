import passport from "passport";
import passportFacebook from "passport-facebook";
import UserModel from "./../../models/usersModel";
import ChatGroupModel from "./../../models/chatGroupModel"
import { transErrors, transSuccess } from "../../../lang/vi";

let FacebookStrategy=passportFacebook.Strategy;
let fbAppId=process.env.FB_APP_ID;
let fbAppSecret=process.env.FB_APP_SECRET;
let fbCallbackUrl=process.env.FB_CALLBACK_URL;

/**
 * Valid user account type:local
 */
let initPassportFacebook=()=>{
  passport.use(new FacebookStrategy({
    clientID: fbAppId,
    clientSecret:fbAppSecret,
    callbackURL:fbCallbackUrl,
    passReqToCallback:true,
    profileFields:["email","gender","displayName"]
  },async (req,accessToken,refreshToken,profile,done)=>{
    try{
      let user=await UserModel.findByFacebookUid(profile.id);
      if (user){
        return done(null, user, req.flash("success",transSuccess.loginSuccess(user.username)))
      }
       console.log(profile);
      let newUser={
        username:profile.displayName,
        gender:profile.gender,
        local:{
          isActive:true
        },
        facebook:{
          uid:profile.id,
          token:accessToken,
          email:null
        }
      };
      let User=UserModel.createNew(newUser);
      return done(null, User, req.flash("success",transSuccess.loginSuccess(User.username)))
     
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
  passport.deserializeUser(async (id,done)=>{
    try{
      let user=UserModel.findUserByIdForSessionToUse(id);
      let getChatGroupIds=await ChatGroupModel.getChatGroupIdsByUser(id);
      user=user.toObject();
      user.chatGroupIds=getChatGroupIds;
      return done(null,user);
    }catch(err){
      return (err,null);
      
    }

  });// luu thong tin cua user tim duoc vao req,user
}
module.exports=initPassportFacebook;