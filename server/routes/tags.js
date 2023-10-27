const express = require('express');
const router = express.Router();

const Questions = require('../models/questions');
const Tags = require('../models/tags');

// Error handling middleware
const handleError = (err, res) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
};

// Route to fetch all tags
router.get('/', async (req, res) => {
    try {
        const tags = await Tags.find().exec();
        res.send(tags);
    } catch (err) {
        handleError(err, res);
    }
});

// Route to fetch a specific tag by its name
router.get('/:tag', async (req, res) => {
    try {
        const tag = await Tags.find({ name: req.params.tag }).exec();
        res.send(tag);
    } catch (err) {
        handleError(err, res);
    }
});

// Route to fetch a specific tag by its ID
router.get('/tag_id/:tag_id', async (req, res) => {
    try {
        const tag = await Tags.findById(req.params.tag_id).exec();
        res.send(tag);
    } catch (err) {
        handleError(err, res);
    }
});

// Route to fetch all questions associated with a specific tag ID
router.get('/tag_id/:tag_id/questions', async (req, res) => {
    try {
        const questions = await Questions.find({ tags: req.params.tag_id }).exec();
        res.send(questions);
    } catch (err) {
        handleError(err, res);
    }
});


module.exports = router;
