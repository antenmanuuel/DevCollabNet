require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("./models/users");
const Tag = require("./models/tags");
const Question = require("./models/questions");
const Answer = require("./models/answers");
const Comment = require("./models/comments");

let mongoDB = "mongodb+srv://antenmanuuel:anten2001@cluster1.tzxpxjc.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoDB);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let userArgs = process.argv.slice(2);
if (userArgs.length < 2) {
  throw new Error(
    "Must provide 2 arguments: an email address and password for Admin."
  );
}

const adminEmail = userArgs[0];
const adminPassword = userArgs[1];

const frontendKeywords = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Express",
  "MongoDB",
  "Webpack",
  "Sass",
  "Redux",
  "TypeScript",
  "Bootstrap",
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomUsers(users) {
  const numUsers = getRandomInt(1, users.length);
  const randomUsers = [];
  while (randomUsers.length < numUsers) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    if (!randomUsers.includes(randomUser)) {
      randomUsers.push(randomUser);
    }
  }
  return randomUsers;
}

function getRandomNumberOfComments() {
  return Math.floor(Math.random() * 11);
}

async function createUser(
  username,
  email,
  password,
  isAdmin,
  created_at,
  reputation
) {
  let user = new User({
    username: username,
    email: email,
    password: password,
    isAdmin: isAdmin,
    created_at: created_at,
    reputation: reputation,
  });
  return user.save();
}

async function createTag(name, createdBy) {
  let tag = new Tag({
    name: name,
    created_by: createdBy._id,
  });
  return tag.save();
}

async function createQuestion(
  title,
  summary,
  text,
  tags,
  answers,
  asked_by,
  ask_date_time,
  views,
  votes,
  comments,
  voters
) {
  let question = new Question({
    title: title,
    summary: summary,
    text: text,
    tags: tags,
    answers: answers,
    asked_by: asked_by._id,
    ask_date_time: ask_date_time,
    views: views,
    votes: votes,
    comments: comments,
    voters: voters,
  });
  return question.save();
}

async function createAnswer(
  text,
  ans_by,
  ans_date_time,
  votes,
  comments,
  voters
) {
  let answer = new Answer({
    text: text,
    ans_by: ans_by._id,
    ans_date_time: ans_date_time,
    votes: votes,
    comments: comments,
    voters: voters,
  });
  return answer.save();
}

async function createComment(text, com_by, com_date_time, votes, voters) {
  let comment = new Comment({
    text: text,
    com_by: com_by._id,
    com_date_time: com_date_time,
    votes: votes,
    voters: voters,
  });
  return comment.save();
}

async function getRandomTags(tags, num) {
  let randomTags = [];
  while (randomTags.length < num) {
    const randomTag = tags[Math.floor(Math.random() * tags.length)];
    if (!randomTags.includes(randomTag)) {
      randomTags.push(randomTag);
    }
  }
  return randomTags.map((tag) => tag._id);
}

function getRandomVotes() {
  return getRandomInt(-10, 10);
}

async function addCommentsToEntity(entity, users) {
  for (let i = 0; i < getRandomNumberOfComments(); i++) {
    let commentVotes = getRandomInt(0, 10);
    let commentVoters = getRandomUsers(users);
    let comment = await createComment(
      `Comment ${i} on ${entity.constructor.modelName}`,
      users[Math.floor(Math.random() * users.length)],
      new Date(),
      commentVotes,
      commentVoters
    );

    if (entity.constructor.modelName === "Question") {
      entity.comments.push(comment);
    } else if (entity.constructor.modelName === "Answer") {
      entity.comments.push(comment);
    }
  }
}

async function populateDatabase() {
  try {
    const hashedPasswordAdmin = await bcrypt.hash(adminPassword, 10);
    let admin = await createUser(
      "admin",
      adminEmail,
      hashedPasswordAdmin,
      true,
      new Date(),
      200
    );

    let tags = [];
    let users = [admin];

    const fixedReputations = [30, 55, 100, 75, 25];

    for (let i = 1; i <= 5; i++) {
      const hashedPassword = await bcrypt.hash("pwd123", 10);
      let reputation = fixedReputations[i - 1];
      let user = await createUser(
        `user${i}`,
        `user${i}@example.com`,
        hashedPassword,
        false,
        new Date(),
        reputation
      );
      users.push(user);
    }

    for (let keyword of frontendKeywords) {
      let tagCreator = users[getRandomInt(0, users.length - 1)];
      let tag = await createTag(keyword, tagCreator);
      tags.push(tag);
    }

    for (let i = 0; i < frontendKeywords.length; i++) {
      let questionTags = await getRandomTags(tags, getRandomInt(1, 5));
      let questionUser = users[i % users.length];
      let questionVotes = getRandomInt(-10, 10);
      let questionComments = [];
      let questionVoters = getRandomUsers(users);

      let question = await createQuestion(
        `${frontendKeywords[i % frontendKeywords.length]}`,
        `Summary about ${frontendKeywords[i % frontendKeywords.length]}`,
        `This is a detailed description about ${
          frontendKeywords[i % frontendKeywords.length]
        }.`,
        questionTags,
        [],
        questionUser,
        new Date(),
        getRandomInt(0, 100),
        questionVotes,
        questionComments,
        questionVoters
      );

      await addCommentsToEntity(question, users);

      let numAnswers = getRandomInt(0, 10);
      for (let j = 0; j < numAnswers; j++) {
        let answerUser = users[j % users.length];
        let answerVotes = getRandomVotes();
        let answerComments = [];
        let answerVoters = getRandomUsers(users);

        let answer = await createAnswer(
          `Answer to Question about ${
            frontendKeywords[i % frontendKeywords.length]
          }`,
          answerUser,
          new Date(),
          answerVotes,
          answerComments,
          answerVoters
        );

        await addCommentsToEntity(answer, users);
        question.answers.push(answer);
        await answer.save();
      }

      await question.save();
    }

    console.log("Database populated successfully.");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error populating database:", err);
  }
}

populateDatabase();
