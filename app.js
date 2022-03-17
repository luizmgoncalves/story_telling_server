const express = require("express")

const app = express()

const db = require("./db");

app.use(express.static(__dirname + '/public'))

app.use(express.json())

app.set("view engine", "ejs")

app.get("/", (req, res)=>{
    let historias = {
        histories: [
            //{id: 0, title: "oi leticio"},
            //{id: 1, title: "hey leticio"}
        ]
    }
    db.selectTitles().then((row_list)=>{
        console.log(row_list)
        row_list.forEach(row => {
            let list = JSON.parse(row.row.replace('(', "[").replace(")", "]"))
            let res = {id: list[0], title: list[1]}
            console.log(res)
            historias["histories"].push(res)
        });
        console.log(historias)
    
        res.render("../views/pages/index", historias)
    })
})

app.get("/carregar_historia/:index/", (req, res)=>{
    db.loadHistory(req.params['index']).then((row_list)=>{
        console.log(row_list)
        let history = JSON.parse(row_list[0]['historia'])
        
        res.json(history)
    })
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


app.listen(3000)