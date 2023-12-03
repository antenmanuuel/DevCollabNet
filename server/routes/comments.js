const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Comment = require("../models/comments");
const Question = require("../models/questions");
const Answer = require("../models/answers");
const User = require("../models/users");

// Error handling utility
const handleError = (err, res) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
};
// Route to comment on a question
router.post("/commentQuestion", async (req, res) => {
  const { text, comBy, questionId } = req.body;

  if (!text || !comBy || !mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(400).send("Missing or invalid required fields");
  }

  try {
    const user = await User.findById(comBy);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).send("Question not found");
    }

    const newComment = new Comment({
      text,
      com_by: user._id,
      com_date_time: new Date(),
    });

    await newComment.save();
    question.comments.push(newComment._id);
    await question.save();

    res.status(201).send(newComment);
  } catch (error) {
    handleError(error, res);
  }
});

// Route to comment on an answer
router.post("/commentAnswer", async (req, res) => {
  const { text, comBy, answerId } = req.body;

  if (!text || !comBy || !mongoose.Types.ObjectId.isValid(answerId)) {
    return res.status(400).send("Missing or invalid required fields");
  }

  const user = await User.findById(comBy);
  if (!user) {
    return res.status(404).send("User not found");
  }

  const answer = await Answer.findById(answerId);
  if (!answer) {
    return res.status(404).send("Answer not found");
  }

  const newComment = new Comment({
    text,
    com_by: user._id,
    com_date_time: new Date(),
  });

  await newComment.save();
  answer.comments.push(newComment._id);
  await answer.save();

  res.status(201).send(newComment);
});

// Route to get comments for a specific question
router.get("/byQuestion/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).send("Invalid question ID");
    }

    
    const question = await Question.findById(questionId).populate({
      path: "comments",
      populate: {
        path: "com_by",
        select: "username",
      },
    });

    if (!question) {
      return res.status(404).send("Question not found");
    }

    // Send back the populated comments
    res.status(200).json(question.comments);
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;