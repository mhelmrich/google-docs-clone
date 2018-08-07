const express = require('express');
const User = require('../models/User.js');

const router = express.Router();

module.exports = (passport) => {

  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if (err) return res.json({success: false});
      if (!user) return res.json({success: false});
      req.logIn(user, (err) => {
        if (err) return res.json({success: false});
        return res.json({success: true});
      });
    })(req, res, next);
  });

  router.post('/register', (req, res) => {
    if (req.body.email && req.body.username && req.body.password) {
      (new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      }))
      .save().then(() => res.json({success: true}))
      .catch((err) => res.json({success: false}));
    } else res.json({success: false});
  });

  router.use((req, res, next) => {
    if (req.user) next();
    else res.json({success: false});
  });

  router.get('/username', (req, res) => {
    res.json({success: true, username: req.user.username});
  });

  router.post('/logout', (req, res) => {
    req.logout();
    res.json({success: true});
  });

  return router;
};
