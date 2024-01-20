const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');

require('dotenv').config();

// MongoDB Atlas Connection
let mongoDB = "mongodb+srv://antenmanuuel:anten2001@cluster1.tzxpxjc.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('error', (err) => console.log(`Error Connecting: ${err}`));
db.on('connected', () => console.log('Connected to MongoDB Atlas'));

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['POST', 'PUT', 'GET', 'DELETE', 'PATCH'],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Session Configuration
let secretKey = process.argv.slice(2)[0];
if (!secretKey) {
    console.error('Session secret key is missing!');
    process.exit(1); 
}

app.use(session({
    secret: secretKey,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 5 }, 
    resave: false,
    saveUninitialized: false,
}));

// Router Setup
const questionsRouter = require('./routes/questions.js');
const answersRouter = require('./routes/answers.js');
const tagsRouter = require('./routes/tags.js');
const usersRouter = require('./routes/users.js');
const commentsRouter = require('./routes/comments.js');

app.use('/posts/questions', questionsRouter);
app.use('/posts/answers', answersRouter);
app.use('/posts/tags', tagsRouter);
app.use('/users/', usersRouter);
app.use('/posts/comments', commentsRouter);

app.get('/posts', (req, res) => {
  res.redirect('/posts/questions');
});

// 404 Not Found Middleware
app.use((req, res, next) => {
    res.status(404).send('Sorry, page not found');
});

// Server Setup
const port = 8000;
app.listen(port, () => console.log(`Listening on port ${port}`));

// Graceful Shutdown Handling
process.on('SIGINT', async () => {
    await db.close()
        .then(() => console.log('Server closed. Database instance disconnected'))
        .catch((err) => console.log(err));
    process.exit(0);
});
