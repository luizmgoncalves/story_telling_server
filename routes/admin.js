const express = require('express')
const mongo = require("../db/mongo")
const pg = require("../db/postgre")
const story_validator = require('../Models/story')
const mailer = require('../Controllers/mailer')
const router = express.Router();

async function adminAuthenticationMiddleware(req, res, next) {
    if (req.isAuthenticated()){
        if((await pg.is_admin(req.user.id))){
            return next()
        }
    }
    res.send('Cannot GET '+ req.originalUrl);
}

router.get("/editar_historia/:index/", adminAuthenticationMiddleware, async(req, res, next)=>{
    let history_json = await mongo.loadHistory(req.params['index'])
    if(!history_json.owner){
        res.send('Não existe uma história ' + req.params['index'])
    }else{
        r_params = {
            'user': req.user ? req.user.username: null,
            story: history_json,
            story_index: req.params['index']
        }
        res.render('../views/pages/edit_story', r_params)
    }
})

module.exports = router;