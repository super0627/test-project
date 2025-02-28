var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

// Utility function to handle errors
const handleError = (res, err, statusCode = 500) => {
    console.error(err);
    res.status(statusCode).send({ error: err.message });
};

/* Display game by ID */
router.get('/game/:id', async (req, res) => {
    try {
        const game = await mongoose.model('Game').findById(req.params.id);
        if (!game) {
            return res.status(404).send({ error: 'Game not found' });
        }
        res.send(game);
    } catch (err) {
        handleError(res, err);
    }
});

/* Display user by name */
router.get('/user/:name', async (req, res) => {
    try {
        const user = await mongoose.model('User').findOne({ name: req.params.name });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send(user);
    } catch (err) {
        handleError(res, err);
    }
});

/* Get all ranks */
router.post('/rankAll', async (req, res) => {
    try {
        const rankData = await mongoose.model('Rank').find().exec();
        res.status(200).send({ rankData });
    } catch (err) {
        handleError(res, err);
    }
});

/* API status endpoint for monitoring */
router.get('/', (req, res) => {
    res.status(200).send({ status: 'OK' });
});

module.exports = router;
