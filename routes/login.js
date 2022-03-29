const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET login page. */
router.get('/', (req, res, next) => {
    if (req.query.fail)
        res.render('../views/pages/login', { message: 'Usuário e/ou senha incorretos!'});
    else
        res.render('../views/pages/login', { message: null});
});

/* POST login page */
router.post('/',
    passport.authenticate('local', { 
        successRedirect: '/', 
        failureRedirect: '/login?fail=true'
    })
);


router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
});


module.exports = router;