const bcrypt = require('bcrypt-nodejs');
const LocalStrategy = require('passport-local').Strategy;

const users = [{ 
    _id: 1, 
    username: "adm", 
    password: "$2a$10$MMUDAAWu2q4dRFdg7quDOeFD8/9kx6IXKfcfs27HzsQiz8LxlJbSC"
}];

module.exports = function(passport){
    function findUser(username){
        return users.find(user => user.username === username);
    }
    
    function findUserById(id){
        return users.find(user => user._id === id);
    }

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        try {
            const user = findUserById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    passport.use(new LocalStrategy(
        (username, password, done) => {
            try {
                const user = findUser(username);
    
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