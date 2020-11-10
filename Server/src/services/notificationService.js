import NotificationModel from "./../models/notificationModel";
import UserModel from './../models/usersModel'

const  LIMIT_NUMBER_TAKEN=10;
//Lay cac thong bao moi nhat
let getNotifications=(currentId, limit= 10)=>{
   return new Promise( async(resolve, reject)=>{
     try{

      let notifications= await NotificationModel.model.getByUserIdAndLimit(currentId, limit);

      //Lay thong tin cua thang gui loi moi ket ban hoac nhan tin
       let getNotifContents=notifications.map( async (notification)=>{
         let sender=await UserModel.getNormalUserDataById(notification.senderId);
         console.log(sender);
         return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
       })
      resolve(await Promise.all(getNotifContents));

     }catch(error){
       console.log(error);
     }
   })
}

let countNotifUnread=(currentId)=>{
  return new Promise( async(resolve, reject)=>{
    try{

     let notificationsUnread= await NotificationModel.model.countNotifUnread(currentId);
     resolve(notificationsUnread);
    }catch(error){
      console.log(error);
    }
  })
}

let readMore=(currentId,skipNumber)=>{
  return new Promise( async(resolve, reject)=>{
    try{
     
      let newNotification= await NotificationModel.model.readMore(currentId,skipNumber,LIMIT_NUMBER_TAKEN);

      //dung id cua nguoi do de lay thong tin nguoi do
      let getNotifContents=newNotification.map( async (notification)=>{
        let sender=await UserModel.getNormalUserDataById(notification.senderId);
        return NotificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
      })
     resolve(await Promise.all(getNotifContents));
     
    }catch(error){
      console.log(error);
    }
  })
}

//danh dau tat ca cac tin nhan la da doc
let markAllAsRead=(currentId,targetUsers)=>{
  console.log(targetUsers);
  return new Promise( async(resolve, reject)=>{
    try{
     
    await NotificationModel.model.markAllAsRead(currentId, targetUsers);
    resolve(true);
    }catch(error){
      console.log(` Error when mark notifications as read ${error}`)
      reject(false);
    }
  })
}
module.exports={
  getNotifications:getNotifications,
  countNotifUnread:countNotifUnread,
  readMore:readMore,
  markAllAsRead:markAllAsRead
}