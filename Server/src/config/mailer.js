import nodeMailer from "nodemailer"

let adminEmail=process.env.MAIL_USER;
let adminPassword=process.env.MAIL_PASSWORD;
let mailHost=process.env.MAIL_HOST;
let mailPort=process.env.MAIL_PORT;


let sendMail=(to,subject,htmlContent)=>{

  let transporter=nodeMailer.createTransport({ // config mail serve
    host:mailHost,
    port:mailPort,
    secure:false, //use SSL_TLS
    auth:{
      user:adminEmail,
      pass: adminPassword
    }
  });
  let options={
    from:adminEmail,
    to:to,
    subject:subject,
    html:htmlContent
  };
  return transporter.sendMail(options);// returN  a Promise
}
module.exports=sendMail;
