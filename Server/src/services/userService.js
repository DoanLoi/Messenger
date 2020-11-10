import UserModel from "./../models/usersModel"
import { resolve, reject } from "bluebird";
import { transErrors } from "../../lang/vi";
import bcrypt from "bcrypt";
 
const saltRound=7;



let updateUser=(id,dataUpdate)=>{
return UserModel.updateUser(id,dataUpdate);//update UserInfo
}
let updatePassword=async (id,dataUpdate)=>{
  return new Promise(async (resolve,reject)=>{
   let currentUser=await UserModel.findUserByIdToUpdatePassword(id);
   if (!currentUser){
     return  reject(transErrors.account_undefinded);
   }

   let checkCurrentPassword = await currentUser.comparePassword(dataUpdate.currentPassword);
    if(!checkCurrentPassword){
      reject(transErrors.user_current_password_failed);
    }
   let salt=bcrypt.genSaltSync(saltRound);
   await  UserModel.updatePassword(id,bcrypt.hashSync(dataUpdate.newPassword,salt));
   resolve(true);
  });
}
module.exports={
  updateUser:updateUser,
  updatePassword:updatePassword
}