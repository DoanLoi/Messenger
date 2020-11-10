import ContactModel from "./../models/contactModel"
import UserModel from "./../models/usersModel"
import NotificationModel from "./../models/notificationModel"
import _ from "lodash"
import { contact } from ".";
import { read } from "fs-extra";


const LIMIT_NUMBER_TAKEN=1;
let findUserContact=(currentUserId,keyword)=>{
   return new Promise(async (resolve,reject)=>{
       let deprecatedUserIds=[currentUserId];
       let contactsByUser= await ContactModel.findAllByUser(currentUserId);
       contactsByUser.forEach(contact => {
         deprecatedUserIds.push(contact.userId);
         deprecatedUserIds.push(contact.contactId)
       });
       deprecatedUserIds=_.uniqBy(deprecatedUserIds);
    
       let users= await UserModel.findAllForAddContact(deprecatedUserIds,keyword);
       resolve(users);
   })
  }
  let addNew= (currentUserId,contactId)=>{
    return new Promise(async (resolve,reject)=>{
      let contactExist= await ContactModel.checkExists(currentUserId,contactId);
      if(contactExist){
        return reject(false);
      }
      //createContact
      let newContactItem={
        userId:currentUserId,
        contactId:contactId
      };

      let newContact= await ContactModel.createNew(newContactItem);
      //create Notification
       let notificationItems={
         senderId:currentUserId,
         receiverId:contactId,
         type:NotificationModel.types.ADD_CONTACT
       }

       await NotificationModel.model.createNew(notificationItems);


      resolve(newContact);
        
    })
   }


   let removeRequestContactSent= (currentUserId,contactId)=>{
    return new Promise(async (resolve,reject)=>{
     
      let removeReq=await ContactModel.removeRequestContactSent(currentUserId,contactId);
       if(removeReq.result.n ===0)//kiem tra xem co loi k
       {
          return reject(false);
       }
       //Xoa thong bao da luu trong csdl
        let notifTypeContact=NotificationModel.types.ADD_CONTACT;
       await NotificationModel.model.removeRequestContactSentNotification(currentUserId,contactId,notifTypeContact);


       resolve(true);
          })
   }
   let removeRequestContactReceived= (currentUserId,contactId)=>{
    return new Promise(async (resolve,reject)=>{
     
      let removeReq=await ContactModel.removeRequestContactReceived(currentUserId,contactId);
       if(removeReq.result.n ===0)//kiem tra xem xoa co loi k
       {
          return reject(false);
       }
      //  //Xoa thong bao da luu trong csdl
      //   let notifTypeContact=NotificationModel.types.ADD_CONTACT;
      //  await NotificationModel.model.removeRequestContactReceivedNotification(currentUserId,contactId,notifTypeContact);


       resolve(true);
          })
   }
   let approveRequestContactReceived= (currentUserId,contactId)=>{
    return new Promise(async (resolve,reject)=>{
     
      let approveReq=await ContactModel.approveRequestContactReceived(currentUserId,contactId);
       if(approveReq.nModified ===0)//kiem tra xem chinh sua co loi k
       {
          return reject(false);
       }
       //create Notification
       let notificationItems={
         senderId:currentUserId,
         receiverId:contactId,
         type:NotificationModel.types.APPROVE_CONTACT
       }
      //  tao thong bao dong y ket ban
      await NotificationModel.model.createNew(notificationItems);


       resolve(true);
          })
   }


   //Xoa ban be khoi danh sach ban be
   let removeContact= (currentUserId,contactId)=>{
    return new Promise(async (resolve,reject)=>{
     
      let removeContact=await ContactModel.removeContact(currentUserId,contactId);
       if(removeContact.result.n ===0)//kiem tra xem xoa co loi k
       {
          return reject(false);
       }
       resolve(true);
          })
   }


   // Lay danh sach ban be

   let getContacts= (currentUserId)=>{
    return new Promise(async (resolve,reject)=>{
     try{
         let contacts=await ContactModel.getContacts(currentUserId,LIMIT_NUMBER_TAKEN);
         let users=contacts.map( async (contact)=>{
             return await UserModel.getNormalUserDataById(currentUserId==contact.contactId?contact.userId:contact.contactId);
        })
       resolve(await Promise.all(users));
     }catch(error){

     }
          })
   }



   let getContactsSent= (currentUserId)=>{
    return new Promise(async (resolve,reject)=>{
     try{
      let contacts=await ContactModel.getContactsSent(currentUserId,LIMIT_NUMBER_TAKEN);
   
      let users=contacts.map( async (contact)=>{
          return await UserModel.getNormalUserDataById(contact.contactId);
     })
    resolve(await Promise.all(users));
     }catch(error){
       
     }
          })
   }


   let getContactsReceived= (currentUserId)=>{
    return new Promise(async (resolve,reject)=>{
     try{
      let contacts=await ContactModel.getContactsReceived(currentUserId,LIMIT_NUMBER_TAKEN);

      let users=contacts.map( async (contact)=>{
          return await UserModel.getNormalUserDataById(contact.userId)// ai la nguoi gui thi nguoi do la userID
                                                                  // ai la nguoi nhan se la contactID
     })
    resolve(await Promise.all(users));
     }catch(error){
       
     }
          })
   }


   let countAllContacts= (currentUserId)=>{
    return new Promise(async (resolve,reject)=>{
     try{
      
      let count= await ContactModel.countAllContacts(currentUserId);
      resolve(count);
  
     }catch(error){
       
     }
          })
   }

   let countAllContactsReceived= (currentUserId)=>{
    return new Promise(async (resolve,reject)=>{
     try{
      
      let count= await ContactModel.countAllContactsReceived(currentUserId);
      resolve(count);
  
     }catch(error){
       
     }
          })
   }

   let countAllContactsSent= (currentUserId)=>{
    return new Promise(async (resolve,reject)=>{
     try{
      
      let count= await ContactModel.countAllContactsSent(currentUserId);
      resolve(count);
  
     }catch(error){
       
     }
          })
   }
  //  lay them danh sach ban be
   let readMoreContacts=(currentUserId,skipNumberContacts)=>{
    return new Promise( async(resolve, reject)=>{
      try{
       
        let newContacts= await ContactModel.readMoreContacts(currentUserId,skipNumberContacts,LIMIT_NUMBER_TAKEN);
  
        //dung id cua nguoi do de lay thong tin nguoi do
        let users=newContacts.map( async (contact)=>{
          return await UserModel.getNormalUserDataById(currentUserId==contact.contactId?contact.userId:contact.contactId);
        })
       resolve(await Promise.all(users));
       
      }catch(error){
        console.log(error);
      }
    })
   }
   let readMoreContactsSent=(currentUserId,skipNumberContacts)=>{
    return new Promise( async(resolve, reject)=>{
      try{
       
        let newContacts= await ContactModel.readMoreContactsSent(currentUserId,skipNumberContacts,LIMIT_NUMBER_TAKEN);
  
        //dung id cua nguoi do de lay thong tin nguoi do
        let users=newContacts.map( async (contact)=>{
          return await UserModel.getNormalUserDataById(contact.contactId);
        })
       resolve(await Promise.all(users));
       
      }catch(error){
        console.log(error);
      }
    })
   }

   let readMoreContactsReceived=(currentUserId,skipNumberContacts)=>{
    return new Promise( async(resolve, reject)=>{
      try{
       
        let newContacts= await ContactModel.readMoreContactsReceived(currentUserId,skipNumberContacts,LIMIT_NUMBER_TAKEN);
  
        //dung id cua nguoi do de lay thong tin nguoi do
        let users=newContacts.map( async (contact)=>{
          return await UserModel.getNormalUserDataById(contact.userId);
        })
       resolve(await Promise.all(users));
       
      }catch(error){
        console.log(error);
      }
    })
   }

   

  module.exports={
    findUserContact:findUserContact,
    addNew:addNew,
    removeRequestContactSent:removeRequestContactSent,
    removeRequestContactReceived:removeRequestContactReceived,
    getContacts:getContacts,
    getContactsReceived:getContactsReceived,
    getContactsSent:getContactsSent,
    countAllContacts:countAllContacts,
    countAllContactsReceived:countAllContactsReceived,
    countAllContactsSent:countAllContactsSent,
    readMoreContacts:readMoreContacts,
    readMoreContactsSent:readMoreContactsSent,
    readMoreContactsReceived:readMoreContactsReceived,
    approveRequestContactReceived:approveRequestContactReceived,
    removeContact:removeContact
  }