// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
const port = 8000;

let mongoose = require('mongoose');
let mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('error', (err) => console.log(`Error Connecting: ${err}`));
db.on('connected', () => console.log('Connected to database'));

process.on('SIGINT', async () => {
  if (db) {
    await db
      .close()
      .then(() => console.log('Server closed. Database instance disconnected'))
      .catch((err) => console.log(err));
  }
  process.exit(0);
});


const questionsRouter = require('./routes/questions.js');
const answersRouter = require('./routes/answers.js');
const tagsRouter = require('./routes/tags.js')

app.use("/posts/questions", questionsRouter);
app.use("/posts/answers", answersRouter);
app.use("/posts/tags", tagsRouter);

app.get('/posts', (req, res) => {
  res.redirect('/posts/questions');
});

app.listen(port, () => console.log(`listening on port ${port}`));