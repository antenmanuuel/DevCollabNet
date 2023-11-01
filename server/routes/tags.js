const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Questions = require("../models/questions");
const Tags = require("../models/tags");
const Answers = require("../models/answers");

// Error handling middleware
const handleError = (err, res) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
};

// Route to fetch all tags
router.get("/", async (req, res) => {
  try {
    const tags = await Tags.find().exec();
    res.send(tags);
  } catch (err) {
    handleError(err, res);
  }
});

// Route to fetch a specific tag by its ID
router.get("/tag_id/:tag_id", async (req, res) => {
  try {
    const tag = await Tags.findById(req.params.tag_id).exec();
    res.send(tag);
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
  ); // Only fetch the ans_date_time field

  return Math.max(...answerDates.map((a) => a.ans_date_time));
}

// Route to fetch all questions associated with a specific tag ID or tag name, with an optional filter
router.get("/tag_id/:tag_id/questions/:filter?", async (req, res) => {
  try {
    let tagIdOrName = req.params.tag_id;
    let tag;

    // Check if the provided tagIdOrName is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(tagIdOrName)) {
      tag = await Tags.findById(tagIdOrName).exec();
    }

    // If not found by ObjectId or not a valid ObjectId, try to get the tag by name
    if (!tag) {
      tag = await Tags.findOne({ name: tagIdOrName }).exec();
    }

    if (!tag) {
      return res.status(404).send("Tag not found");
    }

    // Base query to fetch questions associated with this tag's ObjectId
    let query = Questions.find({ tags: tag._id });

    let finalQuestions;

    // filtering based on route parameters for tags
    
    switch (req.params.filter) {
      case "newest":
        query = query.sort({ ask_date_time: -1 });
        break;
      case "active":
        const allQuestions = await query.sort({ ask_date_time: -1 }).exec();
        for (let question of allQuestions) {
          if (question.answers && question.answers.length > 0) {
            question.latestAnswerDate = await getLatestAnswerDate(
              question.answers
            );
          }
        }
        const questionsWithAnswers = allQuestions.filter(
          (q) => q.latestAnswerDate
        );
        const questionsWithoutAnswers = allQuestions.filter(
          (q) => !q.latestAnswerDate
        );

        questionsWithAnswers.sort(
          (a, b) => b.latestAnswerDate - a.latestAnswerDate
        );

        res.send([...questionsWithAnswers, ...questionsWithoutAnswers]);
        return;
      case "unanswered":
        query = query.where({ answers: { $size: 0 } });
        break;
      default:
        break;
    }

    if (finalQuestions) {
      res.send(finalQuestions);
    } else {
      const questions = await query.exec();
      res.send(questions);
    }
  } catch (err) {
    handleError(err, res);
  }
});

// Route to fetch a specific tag by its name
router.get("/:tag", async (req, res) => {
  try {
    const tag = await Tags.find({ name: req.params.tag }).exec();
    res.send(tag);
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;