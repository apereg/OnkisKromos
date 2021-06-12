const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log("Estamos");
    console.log(req.body);
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    console.log(rows);
    if (rows.length > 0) {
        console.log("Tamo activo");
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password)
        console.log("Vamos bien: ",validPassword);
        if (validPassword) {
            req.user = user;
            done(null, user, req.flash('success', 'Bienvenido ' + user.username));
        } else {
            done(null, false, req.flash('message', 'Contraseña Incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'El usuario no existe!'));
    }
}));



passport.use('local.signup', new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, name, password, done) => {
    console.log("Comprobar datos");
    console.log(req.body);
    console.log(name, password);
    let email = req.body.email, surnames = req.body.surname, city = req.body.city;
    let country = req.body.country, address = req.body.address;
    let rol='Socio', username = email.substring(0, email.indexOf('@'));
    let newUser = {
        name,
        surnames,
        username,
        password,
        email,
        city,
        country,
        address,
        rol
    };

    newUser.password = await helpers.encryptPassword(password);
    try{
        const result = await pool.query('INSERT INTO users SET ? ', newUser);
    }catch (error){
        return done(null, false, req.flash('message', 'The Username does not exists.'));
    }
    

    console.log("este es el resultado", result);
    console.log(newUser);

    newUser.idusers = result.insertId;
    console.log(result);
    return done(null, newUser);
}));


passport.serializeUser((user, done) => {
    done(null, user.idusers);
});
  
passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE idusers = ?', [id]);
    done(null, rows[0]);
});