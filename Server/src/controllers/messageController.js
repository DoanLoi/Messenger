import {validationResult} from "express-validator/check";
import {message} from "./../services/index"

import {app} from "./../config/app"
import {transErrors,transSuccess} from "./../../lang/vi"
import fsExtra from "fs-extra"
import multer from "multer";



let addNewTextEmoji = async (req, res) =>{
  let errorArr=[];

 
  let validationErrors=validationResult(req);
 
  // console.log(req.body);
  if(!validationErrors.isEmpty()){
    let errors=Object.values(validationErrors.mapped());//tao thnah cac mang doi tuong
   
     errors.forEach(item =>{
         errorArr.push(item.msg);
     }),
     console.log(errorArr);
    return res.status(500).send(errorArr); 
    
  }
  try {
    let sender={
      id:req.user._id,
      name:req.user.username,
      avatar:req.user.avatar
      
    }
    let receiverId= req.body.uid;
    let messageVal=req.body.messageVal;
    let isChatGroup=req.body.isChatGroup;
    let newMessage = await  message.addNewTextEmoji(sender,receiverId,messageVal,isChatGroup);
    
    return res.status(200).send({message:newMessage})
  } catch (error) {
    return res.status(500).send(error); 
  }
}
let storageImageChat=multer.diskStorage({
  destination:(req,file, callback)=>{
    callback(null,app.image_message_directory);

  },
  filename:(req, file, callback)=>{
 
  let math=app.image_message_type;
    if (math.indexOf(file.mimetype)===-1){
      return callback(transErrors. image_message_type,null);
       }
    let imageName=`${file.originalname}`;
    callback(null,imageName);
      
  }

  
});
let imageMessageUploadFile=multer({
  storage:storageImageChat,
  limits:{fileSize:app.image_message_limit_size}
}).single("my-image-chat"); // ten trung voi ten khi noi vao formData



let addNewImage = async (req, res) =>{
  imageMessageUploadFile(req,res,async(error)=>{
    if(error){
      if(error.message){
        return res.status(500).send(error.message);
      }
      return res.status(500).send(error);
    }


    try {
      let sender={
        id:req.user._id,
        name:req.user.username,
        avatar:req.user.avatar
        
      }
      let receiverId= req.body.uid;
      let messageVal=req.file;// lay du lieu anh o fromData
      let isChatGroup=req.body.isChatGroup;
      let newMessage = await message.addNewImage(sender,receiverId,messageVal,isChatGroup);
      //Xoa anh, vi thuc chat luu anh tren co so du lieu
       

      await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.fileName}`)



      return res.status(200).send({message:newMessage})
    } catch (error) {
      return res.status(500).send(error); 
    }

  });

 
}

//Xu ly nhan tin tep

let storageAttachmentChat=multer.diskStorage({
  destination:(req,file, callback)=>{
    callback(null,app.attachment_message_directory);

  },
  filename:(req, file, callback)=>{
 
  let math=app.image_message_type;
    let attachmentName=`${file.originalname}`;
    callback(null,attachmentName);
      
  }

  
});
let attachmentMessageUploadFile=multer({
  storage:storageAttachmentChat,
  limits:{fileSize:app.attachment_message_limit_size}
}).single("my-attachment-chat"); // ten trung voi ten khi noi vao formData

let addNewAttachment = async (req, res) =>{
  attachmentMessageUploadFile(req,res,async(error)=>{
    if(error){
      if(error.message){
        return res.status(500).send(error.message);
      }
      return res.status(500).send(error);
    }


    try {
      let sender={
        id:req.user._id,
        name:req.user.username,
        avatar:req.user.avatar
        
      }
      let receiverId= req.body.uid;
      let messageVal=req.file;// lay du lieu anh o fromData
      let isChatGroup=req.body.isChatGroup;
      let newMessage = await message.addNewAttachment(sender,receiverId,messageVal,isChatGroup);
      //Xoa anh, vi thuc chat luu anh tren co so du lieu
       

      await fsExtra.remove(`${app.image_attachment_directory}/${newMessage.file.fileName}`)



      return res.status(200).send({message:newMessage})
    } catch (error) {
      return res.status(500).send(error); 
    }

  });

 
}

module.exports={
  addNewTextEmoji:addNewTextEmoji,
  addNewImage:addNewImage,
  addNewAttachment:addNewAttachment
}
