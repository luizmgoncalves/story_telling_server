const express = require('express');
const router = express.Router();
const passport = require('passport');

function unAuthenticationMiddleware(req, res, next) {
    if (!req.isAuthenticated()){
        return next()
    }
    res.redirect('/');
  }

/* GET login page. */
router.get('/', unAuthenticationMiddleware, (req, res) => {
    if (req.query.fail)
        res.render('../views/pages/login', { message: 'Usuário e/ou senha incorretos!'});
    else
        res.render('../views/pages/login', { message: null});
});

/* POST login page */
router.post('/', unAuthenticationMiddleware,
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