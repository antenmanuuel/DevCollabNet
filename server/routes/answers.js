const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Questions = require("../models/questions");
const Answers = require("../models/answers");
const Users = require("../models/users");
const Comments = require("../models/comments");

const auth = require("../middleware/auth");

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
      .populate("ans_by", "username")
      .sort({ ans_date_time: -1 })
      .exec();
    res.send(answers);
  } catch (err) {
    handleError(err, res);
  }
});

router.use(auth);

// Route to fetch all answers and comments associated with a specific question ID made by the current user
router.get("/:qid/current-user-answers-comments", async (req, res) => {
  try {
    // Ensure there is a logged-in user
    if (!req.session || !req.session.user) {
      return res.status(401).send("Unauthorized: No user logged in.");
    }

    const questionId = req.params.qid;
    const userId = req.session.user.userId; // Accessing user ID from session

    const question = await Questions.findById(questionId).exec();
    if (!question) {
      return res.status(404).send("Question not found.");
    }

    const answers = await Answers.find({ 
      _id: { $in: question.answers },
      ans_by: userId // Filter answers by the logged-in user
    })
    .populate({
      path: 'comments',
      match: { com_by: userId }, // Filter comments by the logged-in user
      populate: { path: 'com_by', select: 'username' }
    })
    .populate("ans_by", "username")
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

  const user = await Users.findOne({ username: ansBy });
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

router.patch("/upvote/:answerId", async (req, res) => {
  try {
    const { username } = req.body;
    const answerId = req.params.answerId;

    const user = await Users.findOne({ username });
    const answer = await Answers.findById(answerId);

    if (!answer || !user) {
      return res.status(404).send("Answer or User not found.");
    }

    const voter = answer.voters.find(
      (voter) => voter.userWhoVoted && voter.userWhoVoted.equals(user._id)
    );

    if (voter) {
      // Change from downvote to upvote
      if (voter.voteIncrement === -1) {
        voter.voteIncrement = 1;
        answer.votes += 1; // Adjust vote count by 2
        user.reputation += 15; // Gain 15 reputation (loss of 10 from downvote and gain of 5 from upvote)
      } else {
        return res.status(400).send("User has already upvoted.");
      }
    } else {
      // First-time voting
      answer.votes += 1;
      answer.voters.push({ userWhoVoted: user._id, voteIncrement: 1 });
      user.reputation += 5;
    }

    await answer.save();
    await user.save();

    res
      .status(200)
      .send({ votes: answer.votes, userReputation: user.reputation });
  } catch (err) {
    handleError(err, res);
  }
});

// Route to downvote an answer
router.patch("/downvote/:answerId", async (req, res) => {
  try {
    const { username } = req.body;
    const answerId = req.params.answerId;

    const user = await Users.findOne({ username });
    const answer = await Answers.findById(answerId);

    if (!answer || !user) {
      return res.status(404).send("Answer or User not found.");
    }

    const voter = answer.voters.find(
      (voter) => voter.userWhoVoted && voter.userWhoVoted.equals(user._id)
    );

    if (voter) {
      // Change from upvote to downvote
      if (voter.voteIncrement === 1) {
        voter.voteIncrement = -1;
        answer.votes -= 1; // Adjust vote count by 2
        user.reputation -= 15; 
      } else {
        return res.status(400).send("User has already downvoted.");
      }
    } else {
      // First-time voting
      answer.votes -= 1;
      answer.voters.push({ userWhoVoted: user._id, voteIncrement: -1 });
      user.reputation -= 10;
    }

    await answer.save();
    await user.save();

    res
      .status(200)
      .send({ votes: answer.votes, userReputation: user.reputation });
  } catch (err) {
    handleError(err, res);
  }
});

// route to edit an answer
router.patch("/editAnswer/:answerId", async (req, res) => {
  try {
    const { answerId } = req.params;
    const { newText } = req.body;

    const updatedAnswer = await Answers.findByIdAndUpdate(
      answerId,
      { text: newText },
      { new: true }
    );

    if (!updatedAnswer) {
      return res
        .status(404)
        .json({ message: "Unable to locate the answer to update." });
    }

    res.json({ message: "Answer updated successfully", updatedAnswer });
  } catch (error) {
    console.error("Update Error:", error);
    res
      .status(500)
      .json({ message: "Error encountered while updating answer." });
  }
});

//route to delete an answer
router.delete("/deleteAnswer/:answerId", async (req, res) => {
  const { answerId } = req.params;
  const { questionId } = req.body;

  try {
    const answer = await Answers.findById(answerId);

    if (!answer) {
      return res
        .status(404)
        .json({ error: "No answer found with the provided ID." });
    }

    const commentIds = answer.comments || [];
    await Comments.deleteMany({ _id: { $in: commentIds } });

    await Answers.findByIdAndDelete(answerId);

    await Questions.findByIdAndUpdate(
      questionId,
      { $pull: { answers: answerId } },
      { new: true }
    );

    res.status(200).json({
      message: "Successfully removed the answer and its related comments.",
    });
  } catch (error) {
    console.error("Deletion Error:", error);
    res.status(500).json({
      error: "Failed to process deletion request due to a server issue.",
    });
  }
});

router.use((err, req, res, next) => {
  handleError(err, res);
});
module.exports = router;
