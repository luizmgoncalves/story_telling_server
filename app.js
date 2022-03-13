const express = require("express")

const app = express()

app.use(express.static(__dirname + '/public'))

app.set("view engine", "ejs")

app.get("/", (req, res)=>{
    res.render("../views/index")
})

app.get("/criar_historia", (req, res)=>{
    res.render("../views/json_creator")
})

app.get("/jogar_historia", (req, res)=>{
    res.render("../views/json_instant_decoder")
})


app.listen(3000)