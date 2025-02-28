var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var util = require('../config/util.js');
var router = express.Router();
var moment = require('moment');

/* GET user account details. */
router.get('/', function(req, res) {
    res.render('partials/account', {
        title: 'Chess Hub - Account',
        user: req.user,
        isAccountPage: true,
        lastConnection: moment(req.user.lastConnection).fromNow(),
        updateStatus: req.flash('updateStatus'),
        updateMessage: req.flash('updateMessage')
    });
});

/* Update user account. */
router.post('/', function(req, res) {
    var User = mongoose.model('User');
    var currentPassword = req.body.password;
    var newPassword = req.body.newPassword;
    var confirmNewPassword = req.body.confirmNewPassword;

    bcrypt.compare(currentPassword, req.user.password, function(err, isMatch) {
        if (err) {
            return res.status(500).send('Internal server error');
        }
        if (isMatch) {
            if (newPassword === confirmNewPassword) {
                const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // Example regex for strong password
                if (!passwordRegex.test(newPassword)) {
                    req.flash('updateStatus', false);
                    req.flash('updateMessage', 'Your new password does not meet the strength requirements');
                    return res.redirect('/account');
                }

                bcrypt.hash(newPassword, 10, function(err, hashedPassword) {
                    if (err) {
                        return res.status(500).send('Internal server error');
                    }

                    User.findOneAndUpdate({ _id: req.user._id }, { password: hashedPassword }, function(err, user) {
                        if (err) {
                            return res.status(500).send('Error updating user');
                        }
                        req.user = user;
                        req.flash('updateStatus', true);
                        req.flash('updateMessage', 'Your password has been updated successfully');
                        res.redirect('/account');
                    });
                });
            } else {
                req.flash('updateStatus', false);
                req.flash('updateMessage', 'The confirmation password does not match the new password');
                res.redirect('/account');
            }
        } else {
            req.flash('updateStatus', false);
            req.flash('updateMessage', 'The current password is incorrect');
            res.redirect('/account');
        }
    });
});

module.exports = router;
