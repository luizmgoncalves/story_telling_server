const express = require('express');
const router = express.Router();
const mailer = require('../Controllers/mailer');
const postgre = require('../db/postgre')

/* GET cadastro page. */
router.get('/', (req, res) => {
    res.render('../views/pages/cadastro', { message: null, message_err: '', sucess: false});
});

/* POST cadastro page */
router.post('/', async (req, res) => {
    let data = { message: null, message_err: '', sucess: true}

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
                from: 'Story Telling',
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

module.exports = router;