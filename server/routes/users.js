const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/users");
const Question = require("../models/questions");
const Answer = require("../models/answers");
const Tag = require("../models/tags");
const Comment = require("../models/comments");

router.post("/signup", async (req, res) => {
  let newUser = req.body;
  try {
    const emailFound = await User.findOne({ email: newUser.email }).exec();
    if (emailFound) {
      res.send("An account with that email address already exists.");
      return;
    }
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    const user = new User({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword,
      isAdmin: false,
    });
    user.save();
    res.status(200).send("success");
  } catch (err) {
    console.log(err);
    res.send("Internal Server Error occurred. Please try again.");
  }
});

router.post("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  try {
    const userFound = await User.findOne({ email: email }).exec();
    if (userFound) {
      try {
        if (await bcrypt.compare(password, userFound.password)) {
          const sessionUser = {
            loggedIn: true,
            username: userFound.username,
            email: userFound.email,
            userId: userFound._id,
            reputation: userFound.reputation,
            created_at: userFound.created_at,
            isAdmin: userFound.isAdmin,
          };
          req.session.user = sessionUser;
          res.send("success");
          return;
        } else {
          res.send("Incorrect password. Please try again.");
          return;
        }
      } catch {
        res.send("Internal Server Error occurred. Please try again.");
        return;
      }
    } else {
      res.send("An account with the given Email Address does not exist.");
      return;
    }
  } catch (err) {
    console.log(err);
    res.send("Internal Server Error occurred. Please try again.");
    return;
  }
});

router.get("/session", (req, res) => {
  res.send(req.session.user);
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.send(err);
    return;
  });
  res.send("success");
});

router.get("/admin", async (req, res) => {
  try {
    const users = await User.find({}).exec();
    users.forEach((user) => {
      user.password = undefined;
    });
    res.send(users);
  } catch (err) {
    res.send("Internal Server Error occurred. Please try again.");
  }
});

// New route to get user reputation
router.get("/userReputation/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username: username }).exec();
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json({ reputation: user.reputation });
  } catch (error) {
    console.error("Error fetching user reputation:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete('/deleteUser/:username', async (req, res) => {
  try {
      const username = req.params.username;
      const user = await User.findOne({ username: username });
      if (!user) {
          return res.status(404).send('User not found.');
      }
      const userId = user._id;

      // Update Answers: Decrement votes and remove user from voters array
      await Answer.updateMany(
          { 'voters.userWhoVoted': userId },
          {
              $inc: { votes: -1 },
              $pull: { voters: { userWhoVoted: userId } }
          }
      );

      // Update Comments: Decrement votes and remove user from voters array
      await Comment.updateMany(
          { 'voters.userWhoVoted': userId },
          {
              $inc: { votes: -1 },
              $pull: { voters: { userWhoVoted: userId } }
          }
      );

      // Delete all comments by the user
      const userComments = await Comment.find({ com_by: userId });
      const userCommentIds = userComments.map(c => c._id);
      await Comment.deleteMany({ com_by: userId });

      // Remove user's comments from Answers and Questions
      await Answer.updateMany(
          {},
          { $pull: { comments: { $in: userCommentIds } } }
      );
      await Question.updateMany(
          {},
          { $pull: { comments: { $in: userCommentIds } } }
      );

      // Find all answers by the user
      const userAnswers = await Answer.find({ ans_by: userId });
      const userAnswerIds = userAnswers.map(a => a._id);

      // Delete these answers
      await Answer.deleteMany({ ans_by: userId });

      // Remove these answers from any questions they're a part of
      await Question.updateMany(
          {},
          { $pull: { answers: { $in: userAnswerIds } } }
      );

      // Delete comments associated with these answers
      await Comment.deleteMany({ _id: { $in: userAnswerIds } });

      // Delete questions asked by the user
      const userQuestions = await Question.find({ asked_by: userId });
      const userQuestionIds = userQuestions.map(q => q._id);
      await Question.deleteMany({ asked_by: userId });

      // Delete comments associated with these questions
      await Comment.deleteMany({ _id: { $in: userQuestionIds } });

      // Update tags (remove tags with no associated questions)
      const tags = await Tag.find();
      for (const tag of tags) {
          const questionCount = await Question.countDocuments({ tags: tag._id });
          if (questionCount === 0) {
              await Tag.deleteOne({ _id: tag._id });
          }
      }

      // Finally, delete the user
      await User.deleteOne({ _id: userId });

      res.status(200).send('User and all associated data deleted successfully.');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error occurred while deleting the user.');
  }
});


module.exports = router;
