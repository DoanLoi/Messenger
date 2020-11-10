import ContactModel from "./../models/contactModel"
import UserModel from "./../models/usersModel"
import ChatGroupModel from "./../models/chatGroupModel"
import _ from "lodash"
import { transErrors } from "./../../lang/vi"
import MessageModel from "./../models/messageModel"
import { app } from './../config/app'
import fsExtra from  "fs-extra"
const LIMIT_CONVERSATIONS_TAKEN = 15;
const LIMIT_MESSAGES_TAKEN = 30;
//Lay tat ca cac cuoc tro truyen
let getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATIONS_TAKEN);

      let userConversationPromise = contacts.map(async (contact) => {
        let getUserContact = await UserModel.getNormalUserDataById(currentUserId == contact.contactId ? contact.userId : contact.contactId);
        getUserContact.updatedAt = contact.updatedAt;
        return getUserContact;
      });
      let userConversations = await Promise.all(userConversationPromise);
      let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
      let allConversations = userConversations.concat(groupConversations);
      allConversations = _.sortBy(allConversations, (item) => {
        return -item.updatedAt;
      })
      // lay message de in ra man hinh
      let allConversationWithMessagesPromise = allConversations.map(async (conversation) => {
        conversation = conversation.toObject();

        if (conversation.members) {
          let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
          conversation.messages = _.reverse(getMessages);
          return conversation;
        }
        else {
          let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
          conversation.messages = _.reverse(getMessages);
          return conversation;
        }

      })

      let allConversationsWithMessages = await Promise.all(allConversationWithMessagesPromise);
      // sap xep theo cac tin nhan moi nhat truong updatedAt
      allConversationsWithMessages = _.sortBy(allConversationsWithMessages, (item) => {
        return -item.updatedAt;
      })

      resolve({
        userConversations: userConversations,
        groupConversations: groupConversations,
        allConversations: allConversations,
        allConversationsWithMessages: allConversationsWithMessages

      });

    } catch (error) {
      reject(error);
    }
  })
}


let getMessenger = (currentUserId,conversationId) => {
  return new Promise(async (resolve, reject) => {
console.log(currentUserId);
console.log(conversationId);
      try {


       let getMessage = await MessageModel.model.getMessagesInPersonal(currentUserId, conversationId, 20);
       let getMessages=_.reverse(getMessage);
        resolve(getMessages);
      } catch (error) {
        reject(error);
      }


  })}
    



let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
  
    // try {
      if (isChatGroup) {
 
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
        if (!getChatGroupReceiver) return reject(transErrors.conversation_not_found);
        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.general_avatar_group_chat
        }
        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType:MessageModel.conversationTypes.GROUP,
          messageType: MessageModel.messageTypes.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createdAt: Date.now()
        }
        //luu tin nhan
        let newMessage=await MessageModel.model.createNew(newMessageItem);
        // cap nhat thoi gian nhan tin
        await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id,getChatGroupReceiver.messageAmount+1);
        resolve(newMessage);
      } else {
         
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
        if (!getUserReceiver) return reject(transErrors.conversation_not_found);
        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        }


   
     
        let newMessageItem ={
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType:MessageModel.conversationTypes.PERSONAL,
          messageType: MessageModel.messageTypes.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createdAt: Date.now()
        }

        //luu tin nhan tao tin nhan moi
        let newMessage=await MessageModel.model.createNew(newMessageItem);
        // cap nhat thoi gian nhan tin
        await ContactModel.updateWhenHasNewMessage(sender.id,getUserReceiver._id)
        resolve(newMessage);

      }

    // } catch (error) {
    //   reject(error);
    // }
  })
}
let addNewImage = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
  
    // try {
      if (isChatGroup) {
 
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
        if (!getChatGroupReceiver) return reject(transErrors.conversation_not_found);
        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.general_avatar_group_chat
        }
        let imageBuffer= await fsExtra.readFile(messageVal.path);// anh da luu vao trong file//lay path de doc anh
        let imageContentType=messageVal.mimetype;
        let imageName=messageVal.originalname;


   
     
        let newMessageItem ={
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType:MessageModel.conversationTypes.GROUP,
          messageType: MessageModel.messageTypes.IMAGE,
          sender: sender,
          receiver: receiver,
          file:{data:imageBuffer, contentType:imageContentType, imageName},
          createdAt: Date.now()
        }

        //luu tin nhan
        let newMessage=await MessageModel.model.createNew(newMessageItem);
        // cap nhat thoi gian nhan tin
        await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id,getChatGroupReceiver.messageAmount+1);
        resolve(newMessage);
      } else {
         
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
        if (!getUserReceiver) return reject(transErrors.conversation_not_found);
        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        }
        

        let imageBuffer= await fsExtra.readFile(messageVal.path);// anh da luu vao trong file//lay path de doc anh
        let imageContentType=messageVal.mimetype;
        let imageName=messageVal.originalname;


   
     
        let newMessageItem ={
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType:MessageModel.conversationTypes.PERSONAL,
          messageType: MessageModel.messageTypes.IMAGE,
          sender: sender,
          receiver: receiver,
          file:{data:imageBuffer, contentType:imageContentType,fileName:imageName},
          createdAt: Date.now()
        }

        //luu tin nhan tao tin nhan moi
        let newMessage=await MessageModel.model.createNew(newMessageItem);
        // cap nhat thoi gian nhan tin
        await ContactModel.updateWhenHasNewMessage(sender.id,getUserReceiver._id)
        resolve(newMessage);

      }

    // } catch (error) {
    //   reject(error);
    // }
  })
}
let addNewAttachment = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
  
    // try {
      if (isChatGroup) {
 
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
        if (!getChatGroupReceiver) return reject(transErrors.conversation_not_found);
        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.general_avatar_group_chat
        }
        let attachmentBuffer= await fsExtra.readFile(messageVal.path);// anh da luu vao trong file//lay path de doc anh
        let attachmentContentType=messageVal.mimetype;
        let attachmentName=messageVal.originalname;


   
     
        let newMessageItem ={
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType:MessageModel.conversationTypes.GROUP,
          messageType: MessageModel.messageTypes.FILE,
          sender: sender,
          receiver: receiver,
          file:{data:attachmentBuffer, contentType:attachmentContentType,fileName:attachmentName},
          createdAt: Date.now()
        }

        //luu tin nhan
        let newMessage=await MessageModel.model.createNew(newMessageItem);
        // cap nhat thoi gian nhan tin
        await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id,getChatGroupReceiver.messageAmount+1);
        resolve(newMessage);
      } else {
         
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
        if (!getUserReceiver) return reject(transErrors.conversation_not_found);
        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        }
        
        let attachmentBuffer= await fsExtra.readFile(messageVal.path);// anh da luu vao trong file//lay path de doc anh
        let attachmentContentType=messageVal.mimetype;
        let attachmentName=messageVal.originalname;

   
     
        let newMessageItem ={
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType:MessageModel.conversationTypes.PERSONAL,
          messageType: MessageModel.messageTypes.FILE,
          sender: sender,
          receiver: receiver,
          file:{data:attachmentBuffer, contentType:attachmentContentType,fileName:attachmentName},
          createdAt: Date.now()
        }

        //luu tin nhan tao tin nhan moi
        let newMessage=await MessageModel.model.createNew(newMessageItem);
        // cap nhat thoi gian nhan tin
        await ContactModel.updateWhenHasNewMessage(sender.id,getUserReceiver._id)
        resolve(newMessage);

      }

    // } catch (error) {
    //   reject(error);
    // }
  })
}
module.exports = {
  getAllConversationItems: getAllConversationItems,
  addNewTextEmoji: addNewTextEmoji,
  addNewImage:addNewImage,
  addNewAttachment:addNewAttachment,
  getMessenger:getMessenger
}