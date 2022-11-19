const bcrypt = require('bcrypt-nodejs');
const LocalStrategy = require('passport-local').Strategy;
const {find_user_by_id, find_user_by_email} = require('./db/postgre')


module.exports = function(passport){
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await find_user_by_id(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                const user = await find_user_by_email(username);
    
                // usuário inexistente
                if (!user) { 
                    return done(null, false) 
                }
    
                // comparando as senhas
                const isValid = bcrypt.compareSync(password, user.password);
                if (!isValid){ 
                    return done(null, false)
                }
                
                return done(null, user)
            } catch (err) {
                done(err, false);
            }
        }
    ));

}