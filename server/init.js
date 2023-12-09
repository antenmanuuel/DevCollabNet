const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/users');
const Tag = require('./models/tags');
const Question = require('./models/questions');
const Answer = require('./models/answers');
const Comment = require('./models/comments');

let mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let userArgs = process.argv.slice(2);
if (userArgs.length < 2) {
  throw new Error('Must provide 2 arguments: an email address and password for Admin.');
}

const adminEmail = userArgs[0];
const adminPassword = userArgs[1];

const frontendKeywords = [
  'HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue.js', 'Node.js',
  'Express', 'MongoDB', 'Webpack', 'Sass', 'Redux', 'TypeScript', 'Bootstrap'
];

async function createUser(username, email, password, isAdmin, reputation) {
  let user = new User({ username, email, password, isAdmin, reputation });
  return user.save();
}

async function createTag(name) {
  let tag = new Tag({ name });
  return tag.save();
}

async function createQuestion(title,summary, text, tags, asked_by, votes, views) {
  let question = new Question({ title, summary, text, tags, asked_by, votes, views });
  return question.save();
}

async function createAnswer(text, ans_by, votes) {
  let answer = new Answer({ text, ans_by, votes });
  return answer.save();
}

async function createComment(text, com_by, votes) {
  let comment = new Comment({ text, com_by, votes });
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
  return randomTags;
}

function getRandomVotes() {
  return Math.floor(Math.random() * 16) - 5;
}

function getRandomNumberOfComments() {
  return Math.floor(Math.random() * 11);
}

async function addCommentsToEntity(entity, users) {
  for (let i = 0; i < getRandomNumberOfComments(); i++) {
    let commentVotes = Math.floor(Math.random() * 5);
    let comment = await createComment(`Comment ${i} on ${entity.constructor.modelName}`, users[Math.floor(Math.random() * users.length)], commentVotes);
    entity.comments.push(comment);
  }
}

async function populateDatabase() {
  try {
    await db.dropDatabase();

    const hashedPasswordAdmin = await bcrypt.hash(adminPassword, 10);
    await createUser('admin', adminEmail, hashedPasswordAdmin, true, 1000);

    let tags = [];
    for (let keyword of frontendKeywords) {
      let tag = await createTag(keyword);
      tags.push(tag);
    }

    let users = [];
    for (let i = 1; i <= 5; i++) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      let user = await createUser(`User${i}`, `user${i}@example.com`, hashedPassword, false, Math.floor(Math.random() * 100));
      users.push(user);
    }

    for (let i = 0; i < 30; i++) {
      let numberOfTags = Math.floor(Math.random() * 5) + 1;
      let questionTags = await getRandomTags(tags, numberOfTags);
      let questionVotes = getRandomVotes();
      let questionViews = Math.floor(Math.random() * 100);
      let question = await createQuestion(`Question about ${frontendKeywords[i % frontendKeywords.length]}`, `summary about ${frontendKeywords[i % frontendKeywords.length]}`, `This is a detailed description about ${frontendKeywords[i % frontendKeywords.length]}.`, questionTags, users[i % users.length], questionVotes, questionViews);

      await addCommentsToEntity(question, users);

      // Randomly decide if the question should have answers
      if (Math.random() < 0.7) {
        let answerVotes = getRandomVotes();
        let answer = await createAnswer(`Answer to ${question.title}`, users[(i + 1) % users.length], answerVotes);
        question.answers.push(answer);

        await addCommentsToEntity(answer, users);
        await answer.save();
      }

      await question.save();
    }

    console.log('Database populated successfully with frontend content');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    mongoose.disconnect();
  }
}

populateDatabase();
