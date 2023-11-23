const express = require('express');
const router = express.Router();

const Questions = require('../models/questions');
const Answers = require('../models/answers');

// Error handling middleware
const handleError = (err, res) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
};

// Route to fetch all answers associated with a specific question ID
router.get('/:qid', async (req, res) => {
    try {
        const question = await Questions.findById(req.params.qid).exec();
        if (!question) {
            return res.status(404).send('Question not found');
        }
        const answers = await Answers.find({ _id: { $in: question.answers } }).sort({ ans_date_time: -1 }).exec();
        res.send(answers);
    } catch (err) {
        handleError(err, res);
    }
});

// Route to post an answer to a specific question
router.post('/answerQuestion', async (req, res) => {
    try {
        const { text, ansBy, qid } = req.body;

        if (!qid) {
            return res.status(400).send('Missing qid parameter');
        }

        const question = await Questions.findById(qid).exec();

        if (!question) {
            return res.status(404).send('Question not found');
        }

        const newAnswer = new Answers({ text, ans_by: ansBy });
        await newAnswer.save();

        question.answers.push(newAnswer._id);
        await question.save();

        res.send(question);
    } catch (err) {
        handleError(err, res);
    }
});

module.exports = router;
