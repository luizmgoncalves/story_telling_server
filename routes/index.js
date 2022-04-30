const express = require('express')
const mongo = require("../db/mongo")
const pg = require("../db/postgre")
const story_validator = require('../Models/story')
const mailer = require('../Controllers/mailer')
const router = express.Router()
const xss = require('xss')

function authenticationMiddleware(req, res, next) {
    if (req.isAuthenticated()){
        return next()
    }
    res.redirect('/login?fail=true');
  }

router.get("/home", (req, res)=>{
    let vars = {
        'user': req.user ? req.user.username: null
    }
    res.render("../views/pages/home", vars)
})

router.get("/", async (req, res)=>{
    stories = await mongo.selectTitles()
    let vars = {
        stories: stories, 
        'user': req.user ? req.user.username: null
    }
    res.render("../views/pages/index", vars)
})

router.get("/jogar_historia/:index/", async (req, res)=>{
    let history_json = await mongo.loadHistory(req.params['index'])

    if (!history_json.published && (!req.user || req.user.id !== history_json.owner)){
        history_json = {}
    }

    if(req.user !== undefined){
        history_json['have_liked'] = await pg.my_likes(history_json._id.toHexString(), req.user.id)
    }

    res.render('../views/pages/history', {"history_json": history_json, 'user': req.user ? req.user.username: null})
})


router.get("/criar_historia", (req, res)=>{
    res.render("../views/pages/json_creator", {'user': req.user ? req.user.username: null})
})

router.get("/jogar_historia", (req, res)=>{
    res.render("../views/pages/json_instant_decoder", {'user': req.user ? req.user.username: null})
})

router.get("/submit_story", authenticationMiddleware, (req, res)=>{
    res.render('../views/pages/submit_story', {'user': req.user ? req.user.username: null})
})

router.post("/submit_story", authenticationMiddleware, (req, res)=>{
    let secured = xss(JSON.stringify(req.body))
    req.body = JSON.parse(secured)

    result = req.body
    result.owner = req.user.id
    result.published = false
    sucess = false
    
    if (story_validator.validate(result)){
        result.likes = 0
        result.owner_name = req.user.username
        if(mongo.insertStory(result)){
            sucess = true
        }
    }

    res.json({'sucess': sucess})
})

router.post("/like", authenticationMiddleware, async (req, res)=>{
    let secured = xss(JSON.stringify(req.body))
    req.body = JSON.parse(secured)
    let state = await pg.like(req.body.story_id, req.user.id, !req.body.value)

    res.json({'sucess': state})
})

router.post("/delete", authenticationMiddleware, async (req, res)=>{
    let sucess = false
    let secured = xss(JSON.stringify(req.body))
    req.body = JSON.parse(secured)

    if(req.body.id){
        let history_json = await mongo.loadHistory(req.body.id)
        if (history_json && history_json.owner === req.user.id){
            sucess = mongo.deleteStory(req.body.id)
        }
    }

    res.json({sucess: sucess})
})


router.get("/minhas_historias", authenticationMiddleware, async (req, res)=>{
    res.render("../views/pages/my_stories", 
               {
                   'user': req.user ? req.user.username: null, 
                   stories: await mongo.getMyTitles(req.user.id)
            })
})

router.get("/editar_historia/:index/", authenticationMiddleware, async(req, res)=>{
    let history_json = await mongo.loadHistory(req.params['index'])
    if ((!req.user || req.user.id !== history_json.owner)){
        history_json = {}
    }
    r_params = {
        'user': req.user ? req.user.username: null,
        story: history_json,
        story_index: req.params['index']
    }
    res.render('../views/pages/edit_story', r_params)
})

router.post("/editar_historia", authenticationMiddleware, async(req, res)=>{
    let sucess = false
    let secured = xss(JSON.stringify(req.body))
    req.body = JSON.parse(secured)

    if(req.body.id){
        let history_json = await mongo.loadHistory(req.body.id)
        if (history_json && history_json.owner === req.user.id && story_validator.validate(req.body.json)){
            sucess = mongo.updateStory(req.body.id, req.body.json)
        }
    }

    res.json({sucess: sucess})
})

router.post("/publicar", authenticationMiddleware, async(req, res)=>{
    let sucess = false
    let secured = xss(JSON.stringify(req.body))
    req.body = JSON.parse(secured)

    if(req.body.id){
        let history_json = await mongo.loadHistory(req.body.id)
        if (history_json && history_json.owner === req.user.id){
            let mailOptions = {
                from: 'Story Telling',
                to: 'lm4academy@gmail.com',
                subject: 'Solicitação de publicar', 
                html: `Olá, o usuário ${req.user.username} está solicitando a publicação da história "${history_json.Titulo}", cujo id é ${req.body.id}, acesse em <a href='http://${req.get('Host')}/admin/editar_historia/${req.body.id}/'>consultar</a>   .
                `
            };

            sucess = mailer.sendMail(mailOptions)
        }
    }

    res.json({sucess: sucess})
})

module.exports = router;