const express = require("express")

const app = express()

const db = require("./db");

app.use(express.static(__dirname + '/public'))

app.use(express.json())

app.set("view engine", "ejs")

app.get("/", async (req, res)=>{
    let vars = {
        stories: await db.selectTitles()
    }
    res.render("../views/pages/index", vars)
})

app.get("/carregar_historia/:index/", async (req, res)=>{
    let value = await db.loadHistory(req.params['index'])
    res.json(value)
})

app.get("/jogar_historia/:index/", (req, res)=>{
    res.render('../views/pages/history', {"history_id": req.params.index})
})


app.get("/criar_historia", (req, res)=>{
    res.render("../views/pages/json_creator")
})

app.get("/jogar_historia", (req, res)=>{
    res.render("../views/pages/json_instant_decoder")
})



app.listen(process.env.PORT || 3000, () => console.log("Server is running..."))