const express = require('express');
const mongo = require("../db/mongo");
const pg = require("../db/postgre")
const router = express.Router();
const passport = require('passport');

router.get("/", async (req, res)=>{
    let vars = {
        stories: await mongo.selectTitles()
    }
    res.render("../views/pages/index", vars)
})

router.get("/jogar_historia/:index/", async (req, res)=>{
    let history_json = await mongo.loadHistory(req.params['index'])
    res.render('../views/pages/history', {"history_json": history_json})
})


router.get("/criar_historia", (req, res)=>{
    res.render("../views/pages/json_creator")
})

router.get("/jogar_historia", (req, res)=>{
    res.render("../views/pages/json_instant_decoder")
})

module.exports = router;