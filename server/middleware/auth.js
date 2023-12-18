function auth(req, res, next) {
    if (req.session.user && req.session.user.loggedIn) {
      next();
    } else {
      res.status(401).send('Unauthorized');
    }
  }
  
  module.exports = auth;
  