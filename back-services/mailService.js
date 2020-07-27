"use strict";
const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "****", // generated ethereal user
    pass: "****", // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendRegisrationMail(recipientEmail, code ) {
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'smartclass@aegean.gr', // sender address
    to: recipientEmail, // list of receivers
    subject: "Registration ✔", // Subject line
    text: "This is an automated registration email", // plain text body
    html: `<b>This is an automated registration email?</b> <br/>
    Please click http://localhost:5000/verify?code=${code}&mail=${recipientEmail} to verify your email address`, // html body
  });
}


async function sendEndorsementRequestMail(recipientEmail, approveLink, rejectLink, credential ) {
  // send mail with defined transport object
  console.log(`sending email to ${recipientEmail} with ${approveLink} ${rejectLink} and ${credential}`)
  await transporter.sendMail({
    from: 'smartclass@aegean.gr', // sender address
    to: recipientEmail, // list of receivers
    subject: "Verifiable Credential Endorsement Request ✔", // Subject line
    text: "This a credential Endorsement request ", // plain text body
    html: `<h3>This a credential Endorsement request </h3> 
    <div> You have been asked to verify that the following information is accurate: </div>
    
    <div style="margin-Top: 3rem"> <b>${credential} </b> </div>
    
    <div style="margin-Top: 3rem">
    Please click ${approveLink} to approve this information or ${rejectLink} to reject it, 
    </div>`
    });
}



module.exports = { sendRegisrationMail, sendEndorsementRequestMail };
