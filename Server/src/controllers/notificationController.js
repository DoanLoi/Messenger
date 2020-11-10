import {notification} from "./../services/index"
let readMore= async (req, res)=>{
try{
//bo qua cac tin nhan da duoc load o lan truoc

  let skipNumberNotif=+req.query.skipNumber; 
  // lay cac thong bao moi
   let newNotification= await  notification.readMore(req.user._id,skipNumberNotif);
   return res.status(200).send(newNotification);
}catch (error){
  return res.status(500).send(error);
}
};
let markAllAsRead= async (req, res)=>{
  try{
    let mark= await notification.markAllAsRead(req.user._id,req.body.targetUsers);
    return res.status(200).send(mark);
  }catch (error){
    return res.status(500).send(error);
  }
  };
module.exports={
  readMore:readMore,
  markAllAsRead:markAllAsRead
}