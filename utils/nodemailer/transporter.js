const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host :"smtp.gmail.com",
  port:587,
  secure: false,
  service: 'gmail',
  auth: {
    user: 'coolgujjarboyabhinav@gmail.com', 
    pass: 'wivvjkaihaiellwx'       
}   
});

module.exports = {transporter};
