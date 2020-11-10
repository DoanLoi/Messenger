import { notification, contact, message } from "./../services/index"
import { bufferToBase64, lastItemOfArray, convertTimestampsToHumanTime } from "./../helpers/clientHelper"

let getICETurnServer = () => {
  return new Promise(async (resolve, reject) => {
    // let o = {
    //   format: "urls"
    // };

    // let bodyString = JSON.stringify(o);
    // let https = require("https");
    // let options = {
    //   //request len xirsys de lay console.log(iceServerList);.log(iceServerList);E 
    //   url: "https://global.xirsys.net/_turn/DVLChat",
    //   // host: "global.xirsys.net",
    //   // path: "/_turn/DVLChat",
    //   method: "PUT",
    //   headers: {
    //     "Authorization": "Basic " + Buffer.from("DoanLoi:489c6d82-901d-11ea-9874-0242ac150003").toString("base64"),
    //     "Content-Type": "application/json",
    //     "Content-Length": bodyString.length
    //   }
    // };

    // //goi request
    // request(options, function (error, response, body) {
    //   if (error) {
    //     console.log("error when get ICE");
    //     return reject(error);
    //   }
    //   let bodyJson=JSON.parse(body);
    //   resolve(bodyJson.v.iceServers);
    // })
     resolve([]);
  })
}
let getFriend=async(req,res)=>{
  let friends= await contact.getContacts(req.user._id);
  return res.send({
    user:req.user,
    friends:friends
  })
}
let getInviteFriend=async(req,res)=>{
  let inviteFriends=await contact.getContactsReceived(req.user._id);
  let sendFriends = await contact.getContactsSent(req.user._id);
  console.log(inviteFriends);
  return res.send({
    user:req.user,
    inviteFriends:inviteFriends,
    sendFriends:sendFriends

  })
}
let getMessenger=async (req,res) =>{

  let getMess=await message.getMessenger(req.user._id,req.params.id);


  return res.send({
    user:req.user._id,
    message:getMess
  })
}
let getHome = async (req, res) => {
  // Lay thong bao
  // let notifications = await notification.getNotifications("5e65152719189c1a2eeff2d7");



  // // dem  tat ca so các thông báo chưa đọc

  // let countNotifUnread = await notification.countNotifUnread("5e65152719189c1a2eeff2d7");

  // // Lay ra danh sach ban be 
  // let contacts = await contact.getContacts("5e65152719189c1a2eeff2d7");

  // //Lay danh sach cac nguwoi minh da gui loi moi ket ban
  // let contactsSent = await contact.getContactsSent("5e65152719189c1a2eeff2d7");

  // //Lay danh sach loi moi ket ban cua nguoi khac gui cho minh
  // let contactsReceived = await contact.getContactsReceived("5e65152719189c1a2eeff2d7");

  // // Dem so loi moi ket ban 
  // let countAllContacts = await contact.countAllContacts("5e65152719189c1a2eeff2d7");
  // let countAllContactsSent = await contact.countAllContactsSent("5e65152719189c1a2eeff2d7");
  // let countAllContactsReceived = await contact.countAllContactsReceived("5e65152719189c1a2eeff2d7");


  //Lay cac cuoc tro chuyen

  let getAllConversationItems = await message.getAllConversationItems(req.user._id);

  // let allConversations = getAllConversationItems.allConversations;
  let userConversations = getAllConversationItems.userConversations;
  // let groupConversations = getAllConversationItems.groupConversations;
  // let allConversationsWithMessages = getAllConversationItems.allConversationsWithMessages;


  //get ICE list from xirsys


  let iceServerList=await getICETurnServer();
  return res.send({
    //Tra du lieu ve view
    // errors: req.flash("errors"),
    // success: req.flash("success"),
    user: req.user,
    // notifications: notifications,
    // countNotifUnread: countNotifUnread,
    // contacts: contacts,
    // contactsReceived: contactsReceived,
    // contactsSent: contactsSent,
    // countAllContacts: countAllContacts,
    // countAllContactsReceived: countAllContactsReceived,
    // countAllContactsSent: countAllContactsSent,
    // allConversations: allConversations,
    userConversations: userConversations,
    // groupConversations: groupConversations,
    // allConversationsWithMessages: allConversationsWithMessages,
    // bufferToBase64: bufferToBase64,
    // lastItemOfArray: lastItemOfArray,
    // convertTimestampsToHumanTime: convertTimestampsToHumanTime,
    // iceServerList:JSON.stringify(iceServerList)
  });
}
module.exports = {
  getHome: getHome,
  getMessenger:getMessenger,
  getFriend:getFriend,
  getInviteFriend:getInviteFriend
}