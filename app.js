const express = require("express")
const app = express()
const db = require("./db");
const loginRouter = require('./routes/login');

const passport = require('passport');
const session = require('express-session');

app.use(express.static(__dirname + '/public'))

app.use(express.json())

require('./auth')(passport);
app.use(session({  
    secret: '01234567890123456789',//configure um segredo seu aqui,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 }//30min
}))

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs")

app.use('/login', loginRouter);

app.get("/", async (req, res)=>{
    let vars = {
        stories: await db.selectTitles()
    }
    res.render("../views/pages/index", vars)
})

app.get("/jogar_historia/:index/", async (req, res)=>{
    let history_json = await db.loadHistory(req.params['index'])
    res.render('../views/pages/history', {"history_json": history_json})
})


app.get("/criar_historia", (req, res)=>{
    res.render("../views/pages/json_creator")
})

app.get("/jogar_historia", (req, res)=>{
    res.render("../views/pages/json_instant_decoder")
})



app.listen(process.env.PORT || 3000, () => console.log("Server is running..."))