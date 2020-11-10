import mongoose from "mongoose";
let Schema=mongoose.Schema;
let ChatGroupSchema= new Schema({
name: String,
userAmount:{type:Number,min:3,max:100},
messageAmount:{type:Number , default:0},
userId:String,
members:[
  {
    userId:String
  }
],
createdAt:{type:Number, default:Date.now},
updatedAt:{type:Number, default:Date.now},// thoi gian moi nhat co tin nhan hoac vua moi tao
deletedAt:{type:Number, default:null},
});

ChatGroupSchema.statics={
  //Lay cac nhom chat cuar user
  getChatGroups(userId, limit){
     return this.find({
       "members":{$elemMatch:{"userId":userId}}
     }).sort({"updateAt":-1}).limit(limit).exec();
  },
   //lay ra group co id
   getChatGroupById(id){
     return this.findById(id).exec();
   },
    //update chat group
  updateWhenHasNewMessage(id,newMessageAmount){
    return this.findByIdAndUpdate(id,{
      "messageAmount":newMessageAmount,
      "updatedAt":Date.now()
    }).exec();
  },
  //lay thong tin ve nhom de luu vao session
  getChatGroupIdsByUser(id){
    return this.find({
      "members":{$elemMatch:{"userId":id}}
    },{_id:1}).exec();
  }
}

 module.exports=mongoose.model("chat-group",ChatGroupSchema);