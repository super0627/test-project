var express = require('express');
var util = require('../config/util.js');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('partials/play', {
        title: 'Chess Hub - Game',
        user: req.user,
        isPlayPage: true
    });
});

router.post('/', function(req, res) {
    const { side } = req.body;
    const token = util.randomString(20);
    res.redirect(`/game/${token}/${side}`);
});

module.exports = router;
