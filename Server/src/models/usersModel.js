import mongoose from "mongoose";
import bcrypt from "bcrypt"
let Schema=mongoose.Schema;
let UserSchema= new Schema({
  username: String,
  gender:{type:String, default:"male"},
  phone:{type:String,default:null},
  address:{type:String, default:null},
  avatar:{type:String, default:"default-avatar-trungquandev-02.jpg"},
  role:{type:String, default:"user"},
  local:{
    email:{type:String, trim:true},
    password:String,
    isActive:{type:Boolean,default:false},
    verifyToken:String
  },
  facebook:{
    uid:String,
    token: String,
    email:{type:String, trim:true}
  },
  google:{
    uid:String,
    token: String,
    email:{type:String, trim:true}
  },
  createdAt:{type:Number, default:Date.now},
  updatedAt:{type:Number, default:null},
  deletedAt:{type:Number, default:null}
});
UserSchema.statics={
  createNew(item){
    return this.create(item); // tra ve 1 promise
  },
  findByEmail(email){
    return this.findOne({"local.email":email}).exec();
  },
  removedById(id){
    return this.findByIdAndRemove(id).exec();
  },
  verify(token){
    return this.findOneAndUpdate(
      {"local.verifyToken":token},
      {"local.isActive":true,"local.verifyToken":null},
    
    ).exec();
  },
  findByToken(token){
    return this.findOne({"local.verify":token}).exec();
  },
  findUserByIdToUpdatePassword(id){
    return this.findById(id).exec();
  },
  findUserByIdForSessionToUse(id){
   
    return this.findById(id,{"local.password":0}).exec();
  },
  findByFacebookUid(uid){
    return this.findOne({"facebook.uid":uid}).exec();
  },
  findByGoogleUid(uid){
    return this.findOne({"google.uid":uid}).exec();
  },
  updateUser(id,item){
   return this.findByIdAndUpdate(id,item).exec();// tra ve du lieu cu sau khi update
  },
  updatePassword(id,hashedPassword){
    return this.findByIdAndUpdate(id,{"local.password":hashedPassword});
  },
  // tim kiem nhung thang chua ket ban
  findAllForAddContact(deprecatedUserIds,keyword){
    return this.find({
      $and:[
        {"_id":{$nin:deprecatedUserIds}},// no in trong mang
        {"local.isActive":true},
        { $or:[
          {"username":{$regex:new RegExp(keyword,"i")}},// tim user co username gan giong voi keyword
          {"local.email":{$regex:new RegExp(keyword,"i")}},
          {"facebook.email":{$regex:new RegExp(keyword,"i")}}
          

        ]}
      ]
    },{_id:1,username:1,address:1,avatar:1}).exec()
  },

  getNormalUserDataById(id){
    return this.findById(id,{_id:1,username:1,address:1,avatar:1}).exec();
  },
};// no chi dung de tim cac ban ghi

UserSchema.methods={
  comparePassword(password){
     console.log(bcrypt.compare(password, this.local.password));
      return bcrypt.compare(password, this.local.password);// return promise
  }
}// tim duoc roi va ban ghi va so sanh mat khau cua ban ghi voi gia tri nh

 module.exports=mongoose.model("user",UserSchema);


