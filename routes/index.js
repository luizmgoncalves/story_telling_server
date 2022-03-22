const express = require('express');
const db = require("../db");
const router = express.Router();
const passport = require('passport');

router.get("/", async (req, res)=>{
    let vars = {
        stories: await db.selectTitles()
    }
    res.render("../views/pages/index", vars)
})

router.get("/jogar_historia/:index/", async (req, res)=>{
    let history_json = await db.loadHistory(req.params['index'])
    res.render('../views/pages/history', {"history_json": history_json})
})


router.get("/criar_historia", (req, res)=>{
    res.render("../views/pages/json_creator")
})

router.get("/jogar_historia", (req, res)=>{
    res.render("../views/pages/json_instant_decoder")
})

module.exports = router;