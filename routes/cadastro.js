const express = require('express');
const router = express.Router();
const mailer = require('../Controllers/mailer');
const postgre = require('../db/postgre')
const xss = require('xss')

/* GET cadastro page. */
router.get('/', (req, res) => {
    res.render('../views/pages/cadastro', { message: null, message_err: '', sucess: false});
});

/* POST cadastro page */
router.post('/', async (req, res) => {
    let data = { message: null, message_err: '', sucess: true}
    let secured = xss(JSON.stringify(req.body))
    req.body = JSON.parse(secured)

    let valid = true

    if (!mailer.isEmailValid(req.body.email)){
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
            let mailOptions = {
                from: 'story-trees@80ff.com.br',
                to: `${req.body["email"]}`,
                subject: 'Confirmação', 
                html: `Olá ${req.body['username']}. Clique nesse link para confirmar seu cadastro na plataforma storytelling
                <a href='http://${req.get('Host')}${req.originalUrl}/confirmar?conid=${res.id}'>confirmar</a>
                `
            };
            
            if(await mailer.sendMail(mailOptions)){
                data['message'] = `Um e-mail foi enviado para ${req.body["email"]} confirmação`
            }
            else{
                valid = false
                data['message_err'] += "Erro ao enviar email"
                data['sucess'] = false
            }
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

router.get('/forget', async (req, res) => {
    let data = { message: null, message_err: '', sucess: false}
    res.render("../views/pages/forget", data)
});

router.post('/forget', async (req, res) => {
    let data = { message: null, message_err: '', sucess: true}
    let secured = xss(JSON.stringify(req.body))
    req.body = JSON.parse(secured)

    let valid = true

    if (!mailer.isEmailValid(req.body.email)){
        valid = false
        data['message_err'] += "email inválido<br/>"
        data['sucess'] = false
    }
    let user = await postgre.find_user_by_email(req.body.email)
    if (!user){
        valid = false
        data['message_err'] += "usuário não existente<br/>"
        data['sucess'] = false
    }
    if(req.body.password.length == 0){
        valid = false
        data['message_err'] += "A senha precisa ser preenchida<br/>"
        data['sucess'] = false
    }


    if (valid){
        let res = await postgre.redefine_pass(req.body.email, req.body.password)
        if (res.id){
            let mailOptions = {
                from: 'story-trees@80ff.com.br',
                to: `${req.body.email}`,
                subject: 'Confirmação', 
                html: `Olá ${user.username}. Clique nesse link para confirmar seu cadastro na plataforma storytelling
                <a href='http://${req.get('Host')}/cadastro/confirmar-f?conid=${res.id}'>confirmar</a>
                `
            };
            
            if(await mailer.sendMail(mailOptions)){
                data['message'] = `Um e-mail foi enviado para ${req.body.email} confirmação`
            }
            else{
                valid = false
                data['message_err'] += "Erro ao enviar email"
                data['sucess'] = false
            }
        }else{
            valid = false
            data['message_err'] += "Erro ao realizar o cadastro"
            data['sucess'] = false
        }

    }
    res.render('../views/pages/forget', data)
})

router.get('/confirmar-f', async (req, res) => {
    let sucess = false
    if (req.query.conid){
        sucess = await postgre.redefine_pass_efetivo(req.query.conid)
    }
    res.render("../views/pages/register_sucess", {sucess: sucess})
});


module.exports = router;