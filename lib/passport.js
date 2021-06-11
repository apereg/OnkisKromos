const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');


passport.use('local.signin', new LocalStrategy({
    usernameField: 'user',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
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
            done(null, user, req.flash('success', 'Welcome ' + user.username));
        } else {
            done(null, false, req.flash('message', 'Incorrect Password'));
        }
    } else {
        return done(null, false, req.flash('message', 'The Username does not exists.'));
    }
}));


passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    console.log(req.body);
    console.log("Llegamos");
    console.log(req.body);
    console.log("Llegamos");
    console.log(req.body);
    let name='Pablo', surnames='javier', username='holaas8', city='leon', country='España', address='C/Hola', rol='Socio';
    console.log(name);
    console.log(password);
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
    console.log(newUser.password);
    const result = await pool.query('INSERT INTO users SET ? ', newUser);

    console.log(result);
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
