const User = require('../models/user');

module.exports = {

    // General asynchronous error handler
    asyncErrorHandler: (fn) =>
        (req, res, next) => {
            Promise.resolve(fn(req, res, next))
                .catch(next);
        },
    // Check if user is logged in
    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()) return next();
        req.session.error = 'You need to be logged in to do that!';
        req.session.redirectTo = req.originalUrl;
        res.redirect('/login');
    },
    // Check for valid password on update profile form
    isValidPassword: async (req, res, next) => {
        const { user } = await User.authenticate()(req.user.username, req.body.currentPassword);
        if(user) {
            // add user to res.locals
            res.locals.user = user;
            next();
        } else {
            // if user is false - password is incorrect - flash message
            req.session.error = 'Incorrect current password!';
            return res.redirect('/profile');
        }
    },
    // Update the user profile with the new password
    changePassword: async (req, res, next) => {
        const {
            newPassword,
            passwordConfirmation
        } = req.body;

        if(newPassword && !passwordConfirmation) {
            req.session.error = 'Missing password confirmation!';
            res.redirect('/profile');
        } else if(newPassword && passwordConfirmation) {
            const { user } = res.locals;
            if(newPassword === passwordConfirmation) {
                await user.setPassword(newPassword);
                next();
            } else {
                req.session.error = 'New passwords must match!';
                return res.redirect('/profile');
            }
        } else {
            next();
        }
    }

    }