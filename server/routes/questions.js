const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Questions = require("../models/questions");
const Tags = require("../models/tags");
const Answers = require("../models/answers");
const User = require("../models/users");

// Error handling middleware
const handleError = (err, res) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
};

// helper function to create or fetch a tag based on its name
const createOrFetchTag = async (tagName) => {
  let tag = await Tags.findOne({ name: tagName }).exec();
  if (!tag) {
    tag = new Tags({ name: tagName });
    await tag.save();
  }
  return tag._id;
};

// Route to fetch all questions
router.get("/", async (_, res) => {
  try {
    const questions = await Questions.find()
      .populate("asked_by", "username")
      .exec();
    res.send(questions);
  } catch (err) {
    handleError(err, res);
  }
});

// Route to get the count of unanswered questions
router.get("/unanswered/count", async (_, res) => {
  try {
    const unansweredCount = await Questions.countDocuments({
      answers: { $size: 0 },
    }).exec();
    res.send({ count: unansweredCount });
  } catch (err) {
    handleError(err, res);
  }
});

// Route to get the questions by newest filter
router.get("/newest", async (req, res) => {
  try {
    const questions = await Questions.find()
      .sort({ ask_date_time: -1 })
      .populate("asked_by", "username")
      .exec();
    res.send(questions);
  } catch (err) {
    handleError(err, res);
  }
});

// Get the latest answer date for a list of answer ids corresponding to a particular question
async function getLatestAnswerDate(answerIds) {
  const answerDates = await Answers.find(
    {
      _id: { $in: answerIds },
    },
    "ans_date_time"
  );

  return Math.max(...answerDates.map((a) => a.ans_date_time));
}

// route to filter by active questions filter
router.get("/active", async (req, res, next) => {
  try {
    const allQuestions = await Questions.find()
      .sort({ ask_date_time: -1 })
      .populate("asked_by", "username")
      .lean()
      .exec();
    for (let question of allQuestions) {
      if (question.answers && question.answers.length > 0) {
        question.latestAnswerDate = await getLatestAnswerDate(question.answers);
      }
    }
    const questionsWithAnswers = allQuestions.filter((q) => q.latestAnswerDate);
    const questionsWithoutAnswers = allQuestions.filter(
      (q) => !q.latestAnswerDate
    );
    questionsWithAnswers.sort(
      (a, b) => b.latestAnswerDate - a.latestAnswerDate
    );
    const sortedQuestions = [
      ...questionsWithAnswers,
      ...questionsWithoutAnswers,
    ];
    res.send(sortedQuestions);
  } catch (err) {
    handleError(err, res);
  }
});

// route to unanswered questions filter
router.get("/unanswered", async (req, res) => {
  try {
    const questions = await Questions.find({ answers: { $size: 0 } })
      .sort({ ask_date_time: -1 })
      .populate("asked_by", "username")
      .exec();
    res.send(questions);
  } catch (err) {
    handleError(err, res);
  }
});

// Route to fetch a question by its ID
router.get("/:question", async (req, res) => {
  try {
    const question = await Questions.findById(req.params.question)
      .populate('asked_by', 'username')
      .exec();
    res.send(question);
  } catch (err) {
    handleError(err, res);
  }
});
router.post("/askQuestion", async (req, res) => {

  const { title, text, tagIds, askedBy } = req.body;


  if (!title || !text || !Array.isArray(tagIds) || !askedBy) {
    console.log("Error: Missing required fields");

    return res.status(400).send("Missing required fields");
  }

  const user = await User.findOne({ username: askedBy });
  if (!user) {
    return res.status(404).send("User not found");
  }

  const validTagIds = await Promise.all(tagIds.map(createOrFetchTag));

  const newQuestion = new Questions({
    title,
    text,
    tags: validTagIds,
    asked_by: user._id,
    views: 0
  });

  await newQuestion.save();

  res.status(201).send(newQuestion);
});

router.use((err, req, res, next) => {
  handleError(err, res);
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
