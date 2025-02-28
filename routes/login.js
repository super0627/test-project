var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

var router = express.Router();

router.get('/', function(req, res) {
    const error = req.flash('error')[0] || '';

    res.render('partials/login', {
        title: 'Chess Hub - Login',
        error,
        isLoginPage: true
    });
});

router.post('/',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    async function(req, res) {
        try {
            const user = await User.findByIdAndUpdate(req.user._id, { lastConnection: new Date() });
            req.flash('welcomeMessage', `Welcome ${user.name}!`);
            res.redirect('/');
        } catch (err) {
            res.status(500).send('Error updating user connection');
        }
    });

module.exports = router;

