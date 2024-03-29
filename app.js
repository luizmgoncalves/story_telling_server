const express = require("express")

const loginRouter = require('./routes/login')
const indexRouter = require('./routes/index')
const cadastroRouter = require('./routes/cadastro')
const adminRouter = require('./routes/admin')
const favicon = require('serve-favicon');

const app = express()

app.use(express.static(__dirname + '/public'))
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.set("view engine", "ejs")


const passport = require('passport');
const session = require('express-session');

require('./auth')(passport);
app.use(session({  
    secret: '123',//configure um segredo seu aqui,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 }//30min
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/login', loginRouter);

app.use('/cadastro', cadastroRouter);

app.use('/admin', adminRouter);

app.use('/', indexRouter);

app.listen(process.env.PORT || 3000, () => console.log("Server is running..."))