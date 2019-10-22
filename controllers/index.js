const User = require('../models/user');
const passport = require('passport');

module.exports = {

    // GET /register - Show the sign up page
    getRegister(req, res, next) {
        res.render('register');
    },
    // POST /register - Register the new user
    async postRegister(req, res, next) {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            image: req.body.image
        });
        let user = await User.register(newUser, req.body.password);
        req.login(user, function(err) {
            if(err) return next(err);
            req.session.success = `New user, ${user.username} was created successfully!`;
        });
        res.redirect('/');
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