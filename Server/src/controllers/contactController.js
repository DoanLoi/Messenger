import {contact} from "./../services/index";
let findUserContact=async (req,res)=>{
//
try {
  let keyword= req.params.keyword;
  console.log(keyword);
  let currentUserId=req.user._id;
 
  
  
  let users=await contact.findUserContact(currentUserId,keyword);

  return res.send({
     users:users
  })
} catch (error) {
  return res.status(500).send(error);
}

}
let addNew=async (req,res)=>{
  //
  try {
    let currentUserId=req.user._id;
    let contactId= req.body.uid;
    let newContact=await contact.addNew(currentUserId,contactId);

    
    
    
    res.status(200).send({success:!!newContact});
  } catch (error) {
    return res.status(500).send(error);
  }
  
  };
let removeRequestContactSent=async (req,res)=>{
    //
    try {
      let currentUserId=req.user._id;
      let contactId= req.body.uid;
      let removeReq=await contact.removeRequestContactSent(currentUserId,contactId);
  
      
      

      res.status(200).send({success:!!removeReq});
    } catch (error) {
      return res.status(500).send(error);
    }
    
  };
let removeRequestContactReceived=async (req,res)=>{
    //
    try {
      let currentUserId=req.user._id;
      let contactId= req.body.uid;
      let removeReq=await contact.removeRequestContactReceived(currentUserId,contactId);
  
      
      

      res.status(200).send({success:!!removeReq});
    } catch (error) {
      return res.status(500).send(error);
    }
    
    };  


let approveRequestContactReceived=async (req,res)=>{
      //
      try {
        let currentUserId=req.user._id;
        let contactId= req.body.uid;
        let approveReq=await contact.approveRequestContactReceived(currentUserId,contactId);
    
        
        
  
        res.status(200).send({success:!!approveReq});
      } catch (error) {
        return res.status(500).send(error);
      }
      
      };  

//Xoa ban be trong danh sach ban be
let removeContact=async (req,res)=>{
  //
  try {
    let currentUserId=req.user._id;
    let contactId= req.body.uid;
    let removeContact=await contact.removeContact(currentUserId,contactId);

    
    

    res.status(200).send({success:!!removeContact});
  } catch (error) {
    return res.status(500).send(error);
  }
  
  };        

let readMoreContacts= async(req, res)=>{
  try{
    //bo qua cac ban be da duoc load o lan truoc
    
      let skipNumberContacts=+req.query.skipNumber; 
      // lay cac ban be moi
       let newContactUsers= await  contact.readMoreContacts(req.user._id,skipNumberContacts);
       return res.status(200).send(newContactUsers);
    }catch (error){
      return res.status(500).send(error);
    }
}
let readMoreContactsSent= async(req, res)=>{
  try{
    //bo qua cac ban be da duoc load o lan truoc
    
      let skipNumberContacts=+req.query.skipNumber; 
      // lay cac ban be moi
       let newContactUsers= await  contact.readMoreContactsSent(req.user._id,skipNumberContacts);
       return res.status(200).send(newContactUsers);
    }catch (error){
      return res.status(500).send(error);
    }
}
let readMoreContactsReceived= async(req, res)=>{
  try{
    //bo qua cac ban be da duoc load o lan truoc
    
      let skipNumberContacts=+req.query.skipNumber; 
      // lay cac ban be moi
       let newContactUsers= await  contact.readMoreContactsReceived(req.user._id,skipNumberContacts);
       return res.status(200).send(newContactUsers);
    }catch (error){
      return res.status(500).send(error);
    }
}
module.exports={
  findUserContact:findUserContact,
  addNew:addNew,
  removeRequestContactSent:removeRequestContactSent,
  removeRequestContactReceived:removeRequestContactReceived,
  readMoreContacts:readMoreContacts,
  readMoreContactsSent:readMoreContactsSent,
  readMoreContactsReceived:readMoreContactsReceived,
  approveRequestContactReceived:approveRequestContactReceived,
  removeContact:removeContact
}