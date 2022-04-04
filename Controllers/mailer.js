const nodemailer = require('nodemailer');

function data(){
    try{
        const email_login = require('./login_email')
        return email_login
    }catch(err){
        return {
            service: process.env.MAILER_SERVICE,
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASSWORD
        }
    }
}

const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

function isEmailValid(email) {
    if (!email)
        return false;

    if(email.length>254)
        return false;

    var valid = emailRegex.test(email);
    if(!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if(parts[0].length>64)
        return false;

    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;

    return true;
}

const transporter = nodemailer.createTransport({
    service: email_login.service,
    auth: {
        user: email_login.user,
        pass: email_login.pass
    }
});

async function sendMail(mailOptions){
    try{
        info = await transporter.sendMail(mailOptions)
        console.log('Email sent: ' + info.response)
        return true
    }
    catch(error){
        console.log(error)
        return false
    }
}

module.exports = { sendMail, isEmailValid }