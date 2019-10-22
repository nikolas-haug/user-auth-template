const User = require('../models/user');
const passport = require('passport');

module.exports = {

    // GET /register - Show the sign up page
    getRegister(req, res, next) {
        res.render('register', { username: '', email: '' });
    },
    // POST /register - Register the new user
    async postRegister(req, res, next) {
        try {
            const user = await User.register(new User(req.body), req.body.password);
            req.login(user, function(err) {
                if(err) return next(err);
                req.session.success = `New user, ${user.username} was created successfully!`;
                res.redirect('/');
            });
        } catch(err) {
            const { username, email } = req.body;
            let error = err.message;
            if(error.includes('duplicate') && error.includes('index: email_1 dup key')) {
                error = 'A user with the given email is already registered';
            } 
            res.render('register', { username, email, error });
        }
        
    },
    // GET /login - Show the login page
    getLogin(req, res, next) {
        res.render('login');
    },
    // POST /login - Log the registered user in
    async postLogin(req, res, next) {
        const { username, password } = req.body;
        const { user, error } = await User.authenticate()(username, password);
        if(!user && error) return next(error);
        req.login(user, function(err) {
            if(err) return next(err);
            req.session.success = `Welcome back, ${username}!`;
            const redirectUrl = req.session.redirectTo || '/';
            delete req.session.redirectUrl;
            res.redirect(redirectUrl);
        });
    },
    // GET /logout - Log the user out
    getLogout(req, res, next) {
        req.logout();
        res.redirect('/');
      }

}