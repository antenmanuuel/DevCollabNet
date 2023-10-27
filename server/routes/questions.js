const express = require("express");
const router = express.Router();

const Questions = require("../models/questions");
const Tags = require("../models/tags");

// Error handling middleware
const handleError = (err, res) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
};

// Utility function to create or fetch a tag based on its name
const createOrFetchTag = async (tagName) => {
  let tag = await Tags.findOne({ name: tagName }).exec();
  if (!tag) {
    tag = new Tags({ name: tagName });
    await tag.save();
  }
  return tag._id;
};

// Route to fetch all questions
router.get("/", async ( _, res) => {
  try {
    const questions = await Questions.find().exec();
    res.send(questions);
  } catch (err) {
    handleError(err, res);
  }
});

// Route to get the count of unanswered questions
router.get("/unanswered/count", async ( _ , res) => {
    try {
      const unansweredCount = await Questions.countDocuments({ answers: { $size: 0 } }).exec();
      res.send({ count: unansweredCount });
    } catch (err) {
      handleError(err, res);
    }
  });

// Route to fetch a question by its ID
router.get("/:question", async (req, res) => {
  try {
    const question = await Questions.findById(req.params.question).exec();
    res.send(question);
  } catch (err) {
    handleError(err, res);
  }
});

// Route to post a new question
router.post("/askQuestion", async (req, res) => {
  try {
    const tagIds = await Promise.all(req.body.tagIds.map(createOrFetchTag));
    const newQuestion = new Questions({
      title: req.body.title,
      text: req.body.text,
      tags: tagIds,
      asked_by: req.body.askedBy,
    });
    await newQuestion.save();
    res.send(newQuestion);
  } catch (error) {
    handleError(error, res);
  }
});

// Route to get the questions by newest filter
router.get("/newest", async (req, res) => {
  try {
    const result = await Questions.find().sort({ ask_date_time: -1 }).exec();
    res.send(result);
  } catch (err) {
    handleError(err, res);
  }
});

// Route to increment the view count for a question
router.patch("/incrementViews/:question", async (req, res) => {
  try {
    const question = await Questions.findById(req.params.question).exec();
    question.views += 1;
    await question.save();
    res.send(question);
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
