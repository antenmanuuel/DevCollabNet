const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Questions = require("../models/questions");
const Tags = require("../models/tags");
const Answers = require("../models/answers");
const Users = require("../models/users");

const auth = require("../middleware/auth");

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
    let query = Questions.find({ tags: tag._id }).populate('asked_by');

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


router.use(auth);
// Route to fetch tags created by a specific user along with the count of questions for each tag
router.get("/createdByUser/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Fetch the user based on the provided username
    const user = await Users.findOne({ username: username }).exec();
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Find tags created by this user
    const tags = await Tags.find({ created_by: user._id })
      .populate("created_by", "username")
      .exec();

    // For each tag, count the number of questions associated with it
    const tagsWithQuestionCount = await Promise.all(
      tags.map(async (tag) => {
        const questionCount = await Questions.countDocuments({
          tags: tag._id,
        }).exec();
        return {
          ...tag.toObject(),
          count: questionCount,
        };
      })
    );

    res.json(tagsWithQuestionCount);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to edit a tag by its ID
router.put("/tag_id/:tagId", async (req, res) => {
  const { tagId } = req.params;
  const { newName } = req.body;

  if (!newName) {
    return res.status(400).send("New tag name is required");
  }

  try {
    const tag = await Tags.findById(tagId).exec();
    if (!tag) {
      return res.status(404).send("Tag not found.");
    }

    // Update the tag name
    tag.name = newName.trim();
    await tag.save();

    res.status(200).send({ message: "Tag updated successfully", tag });
  } catch (err) {
    handleError(err, res);
  }
});

// Route to delete a tag by its ID
router.delete("/tag_id/:tag_id", async (req, res) => {
  try {
    const { tag_id } = req.params;
    const requestingUser = req.session.user;

    if (!requestingUser) {
      return res.status(401).send("User is not logged in.");
    }

    // Find the tag to be deleted
    const tag = await Tags.findById(tag_id).exec();
    if (!tag) {
      return res.status(404).send("Tag not found.");
    }
    // Delete the tag
    await Tags.findByIdAndDelete(tag_id);

    // Find all questions that have this tag and remove it from their tags array
    await Questions.updateMany({ tags: tag_id }, { $pull: { tags: tag_id } });

    res.send({
      message: "Tag deleted successfully and removed from all questions.",
    });
  } catch (err) {
    handleError(err, res);
  }
});
module.exports = router;
