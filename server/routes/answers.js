const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Questions = require("../models/questions");
const Answers = require("../models/answers");
const User = require("../models/users");

// Error handling middleware
const handleError = (err, res) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
};

// Route to fetch all answers associated with a specific question ID
router.get("/:qid", async (req, res) => {
  try {
    const question = await Questions.findById(req.params.qid).exec();
    if (!question) {
      return res.status(404).send("Question not found");
    }
    const answers = await Answers.find({ _id: { $in: question.answers } })
      .populate('ans_by', 'username')
      .sort({ ans_date_time: -1 })
      .exec();
    res.send(answers);
  } catch (err) {
    handleError(err, res);
  }
});

router.post("/answerQuestion", async (req, res) => {
  
  const { text, ansBy, qid } = req.body;

  if (!text || !ansBy || !qid) {
    return res.status(400).send("Missing required fields");
  }

  if (!mongoose.Types.ObjectId.isValid(qid)) {
    return res.status(400).send("Invalid Question ID format");
  }

  const question = await Questions.findById(qid);
  if (!question) {
    return res.status(404).send("Question not found");
  }

  const user = await User.findOne({ username: ansBy });
  if (!user) {
    return res.status(404).send("User not found");
  }

  const newAnswer = new Answers({
    text: text,
    ans_by: user._id, 
    ans_date_time: new Date(),
  });

  await newAnswer.save();

  question.answers.push(newAnswer._id);
  await question.save();

  res
    .status(201)
    .send({ message: "Answer posted successfully", answerId: newAnswer._id });
});

router.use((err, req, res, next) => {
  handleError(err, res);
});
module.exports = router;
