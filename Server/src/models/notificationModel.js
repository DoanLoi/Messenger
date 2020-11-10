import mongoose from "mongoose";
import { notification } from "../services";
let Schema=mongoose.Schema;
let NotificationSchema= new Schema({
senderId:String,
receiverId:String,
type:String,
isRead:{type:Boolean, default:false},
file:{data:Buffer, contentType:String, fileName:String},
createdAt:{type:Number, default:Date.now},

});

NotificationSchema.statics={

    createNew(item){
      return this.create(item); // tra ve 1 promise
    },
    // Xoa thong bao luu trong csdl
    removeRequestContactSentNotification(senderId,receiverId,type){
      
      return this.remove({
        $and:[
          {"senderId":senderId},
          {"receiverId":receiverId},
          {"type":type}

        ]
      }).exec();
    },
    // Lay 1 so thong bao moi nhat
    getByUserIdAndLimit(userId,limit){

      return this.find({
        "receiverId":userId  //Thong bao cua minh thi minh la thang duoc nhan thong bao
      }).sort({"createdAt":-1}).limit(limit).exec(); //sap xap theo createAt va theo kieu giam dan// -1

    },
    //dem thong bao chua doc
    countNotifUnread(userId){
      return this.count({
        $and:[
          {"receiverId": userId},
          {"isRead":false}
        ]
      }).exec();
    },
    // Lay them thong bao
    readMore(userId,skip, limit){
      return this.find({
        "receiverId":userId  //Thong bao cua minh thi minh la thang duoc nhan thong bao
      }).sort({"createdAt":-1}).skip(skip).limit(limit).exec()
    },

    // Danh dau da doc thong bao
    markAllAsRead(userId,targetUser){
    
      return this.updateMany({
        $and:[
          {"receiverId":userId},
          {"senderId":{$in: targetUser}}
        ]
      },{
        "isRead":true
      }).exec();
    }
}

const NOTIFICATION_TYPES={
  ADD_CONTACT:"add_contact",
  APPROVE_CONTACT:"approve_contact"
};
const NOTIFICATION_CONTENT={
  //Tra ve template thong bao ket ban
  getContent:(notificationType,isRead,userId,username,userAvatar)=>{
    if(notificationType==NOTIFICATION_TYPES.ADD_CONTACT){
      if(!isRead){
        return `<div class="notif-readed-false" data-uid="${ userId }">
        <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
        <strong>${username}</strong> đã gui lời mời kết bạn cho bạn!
       </div>`
      }
      return `<div data-uid="${ userId }">
      <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
      <strong>${username}</strong> đã gui lời mời kết bạn cho bạn!
     </div>`
     

    }
    if(notificationType==NOTIFICATION_TYPES.APPROVE_CONTACT){
      if(!isRead){
        return `<div class="notif-readed-false" data-uid="${ userId }">
        <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
        <strong>${username}</strong> đã đồng ý lời mời kết bạn của bạn!
       </div>`
      }
      return `<div data-uid="${ userId }">
      <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
      <strong>${username}</strong> đã đồng ý lời mời kết bạn của bạn!
     </div>`
     

    }
    return "No matching";
  }
}
 module.exports={
   model:mongoose.model("notification",NotificationSchema),
   types:NOTIFICATION_TYPES,
   contents:NOTIFICATION_CONTENT

 }

