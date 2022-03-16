const express = require("express")

const app = express()

const db = require("./db");

app.use(express.static(__dirname + '/public'))

app.use(express.json())

app.set("view engine", "ejs")

app.get("/", (req, res)=>{
    console.log(req.params)
    res.render("../views/pages/index")
})

app.get("/historia/:index/", (req, res)=>{
    console.log(req.params)
    res.json({"Titulo":"hello","Escolhas":[{"id":0,"História":"123","Opções":[{"Id":0,"Texto":"goog","link":null}]}]})
})

app.get("/criar_historia", (req, res)=>{
    res.render("../views/pages/json_creator")
})

app.get("/jogar_historia", (req, res)=>{
    res.render("../views/pages/json_instant_decoder")
})


app.listen(3000)