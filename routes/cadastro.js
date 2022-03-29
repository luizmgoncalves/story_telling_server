const express = require('express');
const router = express.Router();
const passport = require('passport');
const nodemailer = require('nodemailer');
const postgre = require('../db/postgre')
const email_login = require('./login_email')


var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

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

/* GET cadastro page. */
router.get('/', (req, res) => {
    res.render('../views/pages/cadastro', { message: null, message_err: '', sucess: false});
});

/* POST cadastro page */
router.post('/', async (req, res) => {
    let data = { message: null, message_err: '', sucess: true}

    let valid = true

    if (!isEmailValid(req.body.email)){
        valid = false
        data['message_err'] += "email inválido<br/>"
        data['sucess'] = false
    }
    if(req.body.password.length == 0){
        valid = false
        data['message_err'] += "A senha precisa ser preenchida<br/>"
        data['sucess'] = false
    }
    if(req.body.username.length == 0){
        valid = false
        data['message_err'] += "O nome de usuário precisa estar preenchido<br/>"
        data['sucess'] = false
    }


    if (valid){
        let res = await postgre.criar_novo_cadastro(req.body.username, req.body.email, req.body.password)
        if (res.id){
            let transporter = nodemailer.createTransport({
                service: email_login.service,
                auth: {
                    user: email_login.user,
                    pass: email_login.pass
                }
            });
            
            let mailOptions = {
                from: 'Story Telling',
                to: `${req.body["email"]}`,
                subject: 'Confirmação', 
                html: `Olá ${req.body['username']}. Clique nesse link para confirmar seu cadastro na plataforma storytelling
                <a href='http://${req.get('Host')}${req.originalUrl}/confirmar?conid=${res.id}'>confirmar</a>
                `
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error)
                }
                else{
                    console.log('Email sent: ' + info.response);
                }
            });
            
            data['message'] = `Um e-mail foi enviado para ${req.body["email"]} confirmação`
        }else{
            valid = false
            data['message_err'] += "Erro ao realizar o cadastro"
            data['sucess'] = false
        }

    }
    res.render('../views/pages/cadastro', data)
})

router.get('/confirmar', async (req, res) => {
    let sucess = false
    if (req.query.conid){
        sucess = await postgre.cadastrar_efetivo(req.query.conid)
    }
    res.render("../views/pages/register_sucess", {sucess: sucess})
});

module.exports = router;