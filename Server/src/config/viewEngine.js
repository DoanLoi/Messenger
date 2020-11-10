import express from "express";
import expressEjsExtend from "express-ejs-extend";
/**
 * Cau hinh view engine cho app
 */
 let configViewEngine=(app)=>{
   app.use(express.static("./src/public"));// cho phep client tai cac file trong thu muc public
   app.engine("ejs",expressEjsExtend);
   app.set("view engine","ejs"); // set loai view dang hien thi
   app.set("views","./src/views");
 }
 module.exports=configViewEngine;

 