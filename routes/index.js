const express = require('express');
const mongo = require("../db/mongo");
const pg = require("../db/postgre")
const story_validator = require('../Models/story_json_objects/story')
const router = express.Router();

function authenticationMiddleware(req, res, next) {
    if (req.isAuthenticated()){
        return next()
    }
    res.redirect('/login?fail=true');
  }

router.get("/", async (req, res)=>{
    let vars = {
        stories: await mongo.selectTitles(), 
        'user': req.user ? req.user.username: null
    }
    res.render("../views/pages/index", vars)
})

router.get("/jogar_historia/:index/", async (req, res)=>{
    let history_json = await mongo.loadHistory(req.params['index'])
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
    result = req.body
    result.owner = req.user.id
    sucess = false
    if (story_validator.validate(result)){
        if(mongo.insertStory(result)){
            sucess = true
        }
    }

    res.json({'sucess': sucess})
})

router.post("/delete", authenticationMiddleware, async (req, res)=>{
    let sucess = false

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
    console.log(history_json)
    r_params = {
        'user': req.user ? req.user.username: null,
        story: history_json,
        story_index: req.params['index']
    }
    res.render('../views/pages/edit_story', r_params)
})

router.post("/editar_historia", authenticationMiddleware, async(req, res)=>{
    let sucess = false

    if(req.body.id){
        let history_json = await mongo.loadHistory(req.body.id)
        if (history_json && history_json.owner === req.user.id && story_validator.validate(req.body.json)){
            sucess = mongo.updateStory(req.body.id, req.body.json)
        }
    }

    res.json({sucess: sucess})
})

module.exports = router;