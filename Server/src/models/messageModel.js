import mongoose from "mongoose";
let Schema=mongoose.Schema;
let MessageSchema= new Schema({
senderId:String,
receiverId:String,
conversationType:String,//nhom hay ca nhan
messageType:String,// kieu ki tu hay hinh anh      
sender:{
  id:String,
  name:String,
  avatar:String
},
receiver:{
  id:String,
  name:String,
  avatar:String
},
text:String,
file:{data:Buffer, contentType:String,fileName:String},//luu tep hoac hinh anh
createdAt:{type:Number, default:Date.now},
updatedAt:{type:Number, default:Date.now},
deletedAt:{type:Number, default:null},
});
MessageSchema.statics={
  //luu tin nhan vao csdl
  createNew(item){
    console.log(item);
    return this.create(item); // tra ve 1 promise
  },
  //lay cac tin nhan da gui
  getMessagesInPersonal(senderId,receiverId,limit){

    return this.find({
       $or:[
         {$and:[
           {"senderId":senderId},
           {"receiverId":receiverId},
           {"messageType":"text"}

         ]},
         {
           $and:[
          {"senderId":receiverId},
          {"receiverId":senderId},

   {"messageType":"text"}
        ]}
       ]
    }).sort({"createdAt":-1}).limit(limit).exec();
  },
  //Lay tin nhan trong nhom receiverId la id cua nhom
  getMessagesInGroup(receiverId,limit){ // nguoi nhan bay gio la 1 nhom
    return this.find({"receiverId":receiverId}).sort({"createdAt":-1}).limit(limit).exec();
  }
}
const MESSAGE_CONVERSATION_TYPES={
  PERSONAL:"personal",
  GROUP:"group"
}
const MESSAGE_TYPES={
  TEXT:"text",
  IMAGE:"image",
  FILE:"file"
};
 module.exports={
   model:mongoose.model("message",MessageSchema),
    conversationTypes:MESSAGE_CONVERSATION_TYPES,
    messageTypes:MESSAGE_TYPES
 }

