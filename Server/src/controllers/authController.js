import {validationResult} from "express-validator/check";
import {auth} from "./../services/index";
import { transSuccess } from "../../lang/vi";


let getLoginRegister=(req,res)=>{
  return res.render("auth/master",{
    errors: req.flash("errors"),
    success: req.flash("success")
  });
};
let postRegister=async (req,res)=>{
  // console.log(validationResult(req).isEmpty());
  let errorArr=[];
  let successArr=[];

 
  let validationErrors=validationResult(req);
  // console.log(req.body);
  if(!validationErrors.isEmpty()){
    let errors=Object.values(validationErrors.mapped());//tao thnah cac mang doi tuong
     errors.forEach(item =>{
         errorArr.push(item.msg);
     })
     req.flash("errors",errorArr);
    return res.redirect("/login-register"); 
    
  }
  try{
   let createUserSuccess= await auth.register(req.body.email,req.body.gender,req.body.password,req.protocol,req.get("host"));
    successArr.push(createUserSuccess);
    req.flash("success",successArr);
    return res.redirect("/login-register"); 
  }catch(err){
    errorArr.push(err);
    req.flash("errors",errorArr);
    return res.redirect("/login-register"); 
  }
 
}

//Verify account 

let verifyAccount =async (req,res)=>{
  let errorArr=[];
  let successArr=[];
   try{
     let verifySucces=await auth.verifyAccount(req.params.token);
     successArr.push(verifySucces); 
     req.flash("success",successArr);
     return res.redirect("/login-register"); 
   }catch(err){
    errorArr.push(err);
    req.flash("errors",errorArr);
    return res.redirect("/login-register"); 
   }
}

//Logout
let getLogout=(req,res)=>{
  req.logout();//Xoa session
  req.flash("success",transSuccess.logout_success);
  return res.redirect("/login-register");
}

let checkLoggedIn=(req,res,next)=>{
  if(!req.isAuthenticated())// phuong thuc cua th passport de kiem tra xem login chua
  {
    return res.send(false);
  }
  return res.send(true);
  
}
let checkLoggedOut=(req,res,next)=>{
  if(req.isAuthenticated())// phuong thuc cua th passport de kiem tra xem login chua
  {
    return res.redirect("/");
  }
  next();// next sang req tiep theo
}
module.exports={
  getLoginRegister:getLoginRegister,
  postRegister:postRegister,
  verifyAccount: verifyAccount,
  getLogout:getLogout,
  checkLoggedIn:checkLoggedIn,
  checkLoggedOut:checkLoggedOut
}