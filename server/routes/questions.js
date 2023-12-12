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
const createOrFetchTag = async (tagName, username) => {
  let tag = await Tags.findOne({ name: tagName }).exec();
  if (!tag) {
    // Find the user based on the username
    let user = await User.findOne({ username: username }).exec();

    // If no user is found, handle accordingly
    if (!user) {
      throw new Error("User not found");
    }

    tag = new Tags({
      name: tagName,
      created_by: user._id,
    });

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
router.post("/askQuestion", async (req, res) => {
  const { title, summary, text, tagIds, askedBy } = req.body; // Continue using tagIds

  if (!title || !summary || !text || !Array.isArray(tagIds) || !askedBy) {
    console.log("Error: Missing required fields");

    return res.status(400).send("Missing required fields");
  }

  const user = await User.findOne({ username: askedBy });
  if (!user) {
    return res.status(404).send("User not found");
  }

  // Process each tagName to create or fetch a tag, along with the username
  const validTagIds = await Promise.all(
    tagIds.map((tagName) => createOrFetchTag(tagName, askedBy))
  );

  const newQuestion = new Questions({
    title,
    text,
    summary,
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
  const { title, summary, text, tagIds } = req.body;

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

    // Check if the user who asked the question is making the request or if the user is an admin
    if (
      !requestingUser.isAdmin &&
      !question.asked_by.equals(requestingUser.userId)
    ) {
      return res.status(403).send("Unauthorized to edit this question.");
    }

    // Fetch the username of the requesting user
    const user = await User.findById(requestingUser.userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    const username = user.username;

    // Update the question fields
    question.title = title;
    question.summary = summary;
    question.text = text;

    // Handle tags: create new ones if they don't exist
    const validTagIds = await Promise.all(
      tagIds.map((tagName) => createOrFetchTag(tagName, username))
    );
    question.tags = validTagIds;

    await question.save();

    res
      .status(200)
      .send({ message: "Question updated successfully", question });
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

    await Questions.findByIdAndRemove(questionId);
    res.send({ message: "Question deleted successfully." });
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

    const hasVoted = question.voters.some((voter) =>
      voter.userWhoVoted && voter.userWhoVoted.equals(user._id)
    );

    if (hasVoted) {
      return res.status(400).send("User has already voted.");
    }

    question.votes += 1;
    question.voters.push({ userWhoVoted: user._id, voteIncrement: 1 });
    await question.save();

    res.status(200).send({ votes: question.votes });
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

    const hasVoted = question.voters.some((voter) =>
      voter.userWhoVoted && voter.userWhoVoted.equals(user._id)
    );

    if (hasVoted) {
      return res.status(400).send("User has already voted.");
    }

    question.votes -= 1;
    question.voters.push({ userWhoVoted: user._id, voteIncrement: -1 });
    await question.save();

    res.status(200).send({ votes: question.votes });
  } catch (err) {
    handleError(err, res);
  }
});


module.exports = router;
