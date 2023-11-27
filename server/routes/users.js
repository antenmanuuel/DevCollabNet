const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/users');

router.post('/signup', async (req, res) => {
  let newUser = req.body;
  try {
    const emailFound = await User.findOne({ email: newUser.email }).exec();
    if (emailFound) {
      res.send('An account with that email address already exists.');
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
    res.status(200).send('success');
  } catch (err) {
    console.log(err);
    res.send('Internal Server Error occurred. Please try again.');
  }
});

router.post('/login', async (req, res) => {
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
          res.send('success');
          return;
        } else {
          res.send('Incorrect password. Please try again.');
          return;
        }
      } catch {
        res.send('Internal Server Error occurred. Please try again.');
        return;
      }
    } else {
      res.send('An account with the given Email Address does not exist.');
      return;
    }
  } catch (err) {
    console.log(err);
    res.send('Internal Server Error occurred. Please try again.');
    return;
  }
});

router.get('/session', (req, res) => {
  res.send(req.session.user);
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.send(err);
    return;
  });
  res.send('success');
});

router.get('/admin', async (req, res) => {
  try {
    const users = await User.find({}).exec();
    users.forEach((user) => {
      user.password = undefined;
    });
    res.send(users);
  } catch (err) {
    res.send('Internal Server Error occurred. Please try again.');
  }
});

router.get('/getUsername/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();
    res.send(user.username);
  } catch (err) {
    res.send('Internal Server Error occurred. Please try again.');
  }
});

router.get('/getUserData/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();
    user.password = undefined;
    res.send(user);
  } catch (err) {
    res.send('Internal Server Error occurred. Please try again.');
  }
});

module.exports = router;