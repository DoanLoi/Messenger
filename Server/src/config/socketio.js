import passportSocketIo from "passport.socketio"
let configSocket=(io,cookieParser,sessionStore)=>{
  io.use(passportSocketIo.authorize({
    cookieParser:cookieParser,
    key:process.env.SESSION_KEY,
    secret:process.env.SESSION_SECRET,
    store:sessionStore,
    success:(data,acept)=>{
      if(!data.user.logged_in){
        return accept("Invalid user",false);
  
      }
      return acept(null,true);
  
    },
    fail: (data,message,error,accept)=>{
      if(error){
         console.log("Failed connection to socket.io",message);
         return accept(new Error(message),false)
      };
      
    }
  
  }))
}
module.exports=configSocket;