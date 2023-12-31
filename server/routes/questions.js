const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Questions = require("../models/questions");
const Tags = require("../models/tags");
const Answers = require("../models/answers");
const User = require("../models/users");
const Comments = require("../models/comments");

const auth = require("../middleware/auth");

// Error handling middleware
const handleError = (err, res) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
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

// Route to get questions asked by a specific user
router.get("/byUsername/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Fetch the user ID based on the provided username
    const user = await User.findOne({ username: username }).exec();
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Find questions asked by this user
    const questions = await Questions.find({ asked_by: user._id })
      .populate("asked_by", "username")
      .sort({ ask_date_time: -1 })
      .exec();

    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
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

// Route to get questions answered by the currently logged-in user
router.get("/questions-answered-by-current-user", async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).send("Unauthorized: No user logged in");
    }

    const userId = req.session.user.userId; // Or however you store the user's ID in the session

    const answersByUser = await Answers.find({ ans_by: userId }).exec();
    const answerIds = answersByUser.map((answer) => answer._id);
    const questions = await Questions.find({
      answers: { $in: answerIds },
    })
      .populate("asked_by", "username")
      .exec();

    res.json(questions);
  } catch (error) {
    handleError(error, res);
  }
});
// Route to get answers and comments by the currently logged-in user for a given question
router.get("/answers/byQuestion/:questionId/currentUser", async (req, res) => {
  try {
    // Check if a user is logged in using the 'loggedIn' property
    if (!req.session.user || !req.session.user.loggedIn) {
      return res.status(401).send("Unauthorized: No user logged in");
    }

    const { questionId } = req.params;
    const userId = req.session.user.userId;

    // Fetch the question to get its answers
    const question = await Questions.findById(questionId).exec();
    if (!question) {
      return res.status(404).send("Question not found");
    }

    // Find answers by the current user that are within the question's answers
    const answersByUser = await Answers.find({
      _id: { $in: question.answers },
      ans_by: userId,
    })
      .populate({
        path: "comments",
        match: { com_by: userId },
        populate: { path: "com_by", select: "username" },
      })
      .exec();

    res.json(answersByUser);
  } catch (err) {
    handleError(err, res);
  }
});

// Route to fetch a question by its ID
router.get("/:question", async (req, res) => {
  try {
    const question = await Questions.findById(req.params.question)
      .populate("asked_by", "username")
      .exec();
    res.send(question);
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

router.use(auth);

// Route to get answers and comments by a specific user for a given question
router.get(
  "/answers/byQuestion/:questionId/user/:username",
  async (req, res) => {
    try {
      const { questionId, username } = req.params;

      // Fetch the user ID based on the provided username
      const user = await User.findOne({ username }).exec();
      if (!user) {
        return res.status(404).send("User not found");
      }

      // Fetch the question to get its answers
      const question = await Questions.findById(questionId).exec();
      if (!question) {
        return res.status(404).send("Question not found");
      }

      // Find answers by the user that are within the question's answers
      const answersByUser = await Answers.find({
        _id: { $in: question.answers },
        ans_by: user._id,
      })
        .populate({
          path: "comments",
          match: { com_by: user._id },
          populate: { path: "com_by", select: "username" },
        })
        .exec();

      res.json(answersByUser);
    } catch (err) {
      handleError(err, res);
    }
  }
);
router.post("/askQuestion", async (req, res) => {
  const { title, summary, text, tagIds, askedBy } = req.body;

  if (!title || !summary || !text || !Array.isArray(tagIds) || !askedBy) {
    console.log("Error: Missing required fields");
    return res.status(400).send("Missing required fields");
  }

  const user = await User.findOne({ username: askedBy });
  if (!user) {
    return res.status(404).send("User not found");
  }

  if (user.reputation < 50) {
    return res.status(403).send("Insufficient reputation to post tags.");
  }

  let validTagIds = [];
  for (const tagName of tagIds) {
    let tag = await Tags.findOne({ name: tagName });

    if (!tag) {
      // Create a new tag
      tag = new Tags({ name: tagName, created_by: user._id });
      await tag.save();
    }

    validTagIds.push(tag._id);
  }

  const newQuestion = new Questions({
    title,
    summary,
    text,
    tags: validTagIds,
    asked_by: user._id,
  });

  await newQuestion.save();

  res.status(201).send(newQuestion);
});

router.use((err, req, res, next) => {
  handleError(err, res);
});


router.put("/editQuestion/:questionId", async (req, res) => {
  const { questionId } = req.params;
  const { title, summary, text, tagIds } = req.body; // tagIds are tag names

  if (!title || !summary || !text || !Array.isArray(tagIds)) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const question = await Questions.findById(questionId).exec();
    if (!question) {
      return res.status(404).send("Question not found.");
    }

    const requestingUser = req.session.user;
    if (!requestingUser) {
      return res.status(401).send("User is not logged in.");
    }

    if (!question.asked_by.equals(requestingUser.userId)) {
      return res.status(403).send("Unauthorized to edit this question.");
    }

    let validTagIds = [];
    for (const tagName of tagIds) {
      let tag = await Tags.findOne({ name: tagName });

      if (!tag) {
        // Create new tag
        tag = new Tags({ name: tagName, created_by: requestingUser.userId });
        await tag.save();
      } else {
        const isTagUsedByAnotherUser = await Questions.exists({
          tags: tag._id,
          asked_by: { $ne: requestingUser.userId },
        });

        const isTagCreatedByCurrentUser = tag.created_by.equals(requestingUser.userId);

        if (!isTagUsedByAnotherUser && isTagCreatedByCurrentUser) {
          // Update the tag name if it's not used by other users and created by the current user
          tag.name = tagName;
          await tag.save();
        } else if (isTagUsedByAnotherUser && !requestingUser.isAdmin) {
          return res.status(400).send(`Tag "${tagName}" is currently in use by another user and cannot be edited.`);
        }
      }

      validTagIds.push(tag._id);
    }

    // Update the question
    question.title = title;
    question.summary = summary;
    question.text = text;
    question.tags = validTagIds;

    await question.save();

    res.status(200).send({ message: "Question updated successfully", question });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


// Route to delete a question by its ID
router.delete("/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
    const requestingUser = req.session.user;

    if (!requestingUser) {
      return res.status(401).send("User is not logged in.");
    }

    const question = await Questions.findById(questionId).exec();

    if (!question) {
      return res.status(404).send("Question not found.");
    }

    if (
      !requestingUser.isAdmin &&
      !question.asked_by.equals(requestingUser.userId)
    ) {
      return res.status(403).send("Unauthorized to delete this question.");
    }

    // Delete all answers related to this question
    const answerIds = question.answers;
    await Answers.deleteMany({ _id: { $in: answerIds } });

    // Delete all comments related to the answers of this question
    await Comments.deleteMany({
      _id: { $in: answerIds.map((a) => a.comments).flat() },
    });

    // Delete all comments directly related to this question
    await Comments.deleteMany({ _id: { $in: question.comments } });

    // Finally, delete the question
    await Questions.findByIdAndDelete(questionId);

    res.send({
      message:
        "Question and all related answers and comments deleted successfully.",
    });
  } catch (err) {
    handleError(err, res);
  }
});

// Route to upvote a question
router.patch("/upvote/:questionId", async (req, res) => {
  try {
    const { username } = req.body;
    const questionId = req.params.questionId;

    const user = await User.findOne({ username });
    const question = await Questions.findById(questionId);

    if (!question || !user) {
      return res.status(404).send("Question or User not found.");
    }

    const voterIndex = question.voters.findIndex(
      (voter) => voter.userWhoVoted && voter.userWhoVoted.equals(user._id)
    );

    if (voterIndex !== -1) {
      const voter = question.voters[voterIndex];
      if (voter.voteChanged) {
        return res.status(400).send("You cannot change your vote again.");
      }

      if (voter.voteIncrement === -1) {
        // Switch from downvote to upvote
        question.votes += 1;
        user.reputation += 15; // Remove downvote penalty and apply upvote gain
      } else {
        // If already upvoted, don't allow to upvote again
        return res.status(400).send("You have already upvoted this question.");
      }

      voter.voteIncrement = 1;
      voter.voteChanged = true; // Indicate that the user has changed their vote
    } else {
      // New upvote
      question.votes += 1;
      user.reputation += 5;
      question.voters.push({
        userWhoVoted: user._id,
        voteIncrement: 1,
        voteChanged: false,
      });
    }

    await question.save();
    await user.save();

    res
      .status(200)
      .send({ votes: question.votes, userReputation: user.reputation });
  } catch (err) {
    handleError(err, res);
  }
});

// Route to downvote a question
router.patch("/downvote/:questionId", async (req, res) => {
  try {
    const { username } = req.body;
    const questionId = req.params.questionId;

    const user = await User.findOne({ username });
    const question = await Questions.findById(questionId);

    if (!question || !user) {
      return res.status(404).send("Question or User not found.");
    }

    const voterIndex = question.voters.findIndex(
      (voter) => voter.userWhoVoted && voter.userWhoVoted.equals(user._id)
    );

    if (voterIndex !== -1) {
      const voter = question.voters[voterIndex];
      if (voter.voteChanged) {
        return res.status(400).send("You cannot change your vote again.");
      }

      if (voter.voteIncrement === 1) {
        // Switch from upvote to downvote
        question.votes -= 1;
        user.reputation -= 15; // Remove upvote gain and apply downvote penalty
      } else {
        // If already downvoted, don't allow to downvote again
        return res
          .status(400)
          .send("You have already downvoted this question.");
      }

      voter.voteIncrement = -1;
      voter.voteChanged = true; // Indicate that the user has changed their vote
    } else {
      // New downvote
      question.votes -= 1;
      user.reputation -= 10;
      question.voters.push({
        userWhoVoted: user._id,
        voteIncrement: -1,
        voteChanged: false,
      });
    }

    await question.save();
    await user.save();

    res
      .status(200)
      .send({ votes: question.votes, userReputation: user.reputation });
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
