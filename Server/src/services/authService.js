import UserModel from "./../models/usersModel";
import bcrypt, { compare } from "bcrypt";
import uuidv4 from "uuid/v4"
import {transErrors,transSuccess,transMail} from "./../../lang/vi"
import { resolve, reject } from "bluebird";
import sendMail from "./../config/mailer"


let saltRound=7;
let register=(email,gender,password,protocol,host)=>{
  return new Promise(async (resolve,reject)=>{
    let userByEmail= await UserModel.findByEmail(email);
    if(userByEmail){
      if(userByEmail.deleteAt!= null){
        return reject(transErrors.account_in_remove);
      }
      if(!userByEmail.local.isActive){
        return reject(transErrors.account_not_active);
      }
      return reject(transErrors.account_in_use);
    }
    let salt=bcrypt.genSaltSync(saltRound);
    let userItem={
      username:email.split("@")[0],
      gender:gender,
      local:{
        email:email,
        password:bcrypt.hashSync(password,salt),
        verifyToken:uuidv4()
      }
    }
    let user= await UserModel.createNew(userItem);
    //create link active
    let linkVerify=`${protocol}://${host}/verify/${user.local.verifyToken}`;
    //send Mail
    sendMail(email,transMail.subject,transMail.template(linkVerify))
     .then(success =>{
       resolve(transSuccess.userCreated(user.local.email))
     })
     .catch(async (error)=>{
        //remove user
        await UserModel.removedById(user._id);
        console.log(error);
        reject(transMail.send_failed);
     });
  
  
  });
  
};

let verifyAccount= (token)=>{
  return new Promise( async (resolve,reject)=>{
    let userByToken=await UserModel.findByToken(token);
    if (userByToken){
      return resolve(transErrors.token_undefinded);
    }
    await UserModel.verify(token);
    resolve(transSuccess.account_active);
  })
}
module.exports={
  register:register,
  verifyAccount:verifyAccount

}
