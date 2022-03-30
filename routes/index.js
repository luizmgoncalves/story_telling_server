const express = require('express');
const mongo = require("../db/mongo");
const pg = require("../db/postgre")
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

router.get("/minhas_historias", authenticationMiddleware, async (req, res)=>{
    let result = 
    res.render("../views/pages/my_stories", 
               {
                   'user': req.user ? req.user.username: null, 
                   stories: await mongo.getMyTitles(req.user.id)
            })
})

module.exports = router;