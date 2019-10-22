const User = require('../models/user');
const passport = require('passport');

module.exports = {
    // Register the new user
    async postRegister(req, res, next) {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            image: req.body.image
        });
        await User.register(newUser, req.body.password);
        req.session.success = 'New User Created Successfully!';
        res.redirect('/');
    },
    // Log the registered user in
    postLogin(req, res, next) {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login'    
        })(req, res, next);
    },
    // Log the user out
    getLogout(req, res, next) {
        req.logout();
        res.redirect('/');
      }

}