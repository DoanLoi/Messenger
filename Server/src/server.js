// let express= require("express");
import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRouter from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import session from "./config/session";
import passport from "passport";
import http from "http";
import socketio from "socket.io"
import initSockets from  "./sockets/index";

import cookieParser from "cookie-parser";
import  configSocketIo  from "./config/socketio";
import events from "events";
import * as configApp from "./config/app"
import { fromNode } from "bluebird";
// import pem from "pem";
// import https from "https"


// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err
//   }
 

//  //Khoi tao appp
// let app=express();
// //Connect to MongoDB
// ConnectDB();

// //Connfig session

// session.config(app);

// //config view Enigine
// configViewEngine(app);


// //Enable post data for request
// app.use(bodyParser.urlencoded({extended:true}));


// //Enable flash message
// app.use(connectFlash());//tra message ve cho client


// // Config passport js
// app.use(passport.initialize());
// app.use(passport.session());

// initRouter(app);


//   https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.APP_PORT,process.env.APP_HOST,()=>{
//     console.log("Helllo TRung quan");
//   })
// })



//Khoi tao appp
let app=express();
//Dat gioi gian cho so listener
events.EventEmitter.defaultMaxListeners=configApp.app.max_event_listener;


// khoi tao server voi socketip va express

let server=http.createServer(app);// tao server http su dung express
                                  // vi socketio chi ket hop duoc voi http
let io=socketio(server);
//Connect to MongoDB
ConnectDB();

//Connfig session

session.config(app);

//config view Enigine
configViewEngine(app);


//Enable post data for request
app.use(bodyParser.json());


//Enable flash message
app.use(connectFlash());//tra message ve cho client

//Su dung cookie Parser
app.use(cookieParser());
// Config passport js
app.use(passport.initialize());
app.use(passport.session());

initRouter(app);
//Cau hing de lay lieu trong session
configSocketIo(io,cookieParser,session.sessionStore);


//Khoi tao cac sockets

initSockets(io);

//file: index.js




    




server.listen(process.env.APP_PORT,process.env.APP_HOST,()=>{
  console.log("Hello DoanLoi");
}
);