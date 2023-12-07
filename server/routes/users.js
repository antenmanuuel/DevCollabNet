const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/users");
const Question = require("../models/questions");
const Answer = require("../models/comments");
const Tag = require("../models/tags");
const Comment = require("../models/answers");

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

router.get("/getUsername/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();
    res.send(user.username);
  } catch (err) {
    res.send("Internal Server Error occurred. Please try again.");
  }
});

router.get("/getUserData/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();
    user.password = undefined;
    res.send(user);
  } catch (err) {
    res.send("Internal Server Error occurred. Please try again.");
  }
});

router.delete("/deleteUserByEmail/:email", async (req, res) => {
  // Check for admin permission
  if (!req.session.user.isAdmin) {
    return res.send("You do not have permission to delete users.");
  }

  const userEmail = req.params.email;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send("User with the given email not found.");
    }
    const userId = user._id;

    // Delete user's questions, answers, and comments
    await Question.deleteMany({ asked_by: userId });
    await Answer.deleteMany({ ans_by: userId });
    await Comment.deleteMany({ com_by: userId });

    // Remove user's votes from Questions, Answers, and Comments
    await Question.updateMany(
      {},
      { $pull: { voters: { userWhoVoted: userId } } }
    );
    await Answer.updateMany(
      {},
      { $pull: { voters: { userWhoVoted: userId } } }
    );
    await Comment.updateMany(
      {},
      { $pull: { voters: { userWhoVoted: userId } } }
    );

    // Handle tags created by the user
    const tags = await Tag.find({ created_By: userId }).exec();
    for (const tag of tags) {
      const questionsUsingTag = await Question.find({
        tags: tag._id.toString(),
      }).exec();

      let shouldDeleteTag = true;
      for (const question of questionsUsingTag) {
        if (question.asked_by.toString() !== userId.toString()) {
          shouldDeleteTag = false;
          break;
        }
      }

      if (shouldDeleteTag) {
        await Tag.deleteOne({ _id: tag._id }).exec();
      } else {
        await Tag.updateOne(
          { _id: tag._id },
          { $set: { created_By: req.session.user.userId } }
        ).exec();
      }
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Invalidate session if the deleted user is the one in the current session
    if (req.session.user && req.session.user.userId === userId.toString()) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
          return res.status(500).send("Error in session destruction.");
        }
        res.send({
          message: "Current user deleted, session destroyed",
          sessionDestroyed: true,
        });
      });
    } else {
      res.send({
        message: "User and all related content successfully deleted",
        sessionDestroyed: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error occurred while deleting user.");
  }
});

module.exports = router;
