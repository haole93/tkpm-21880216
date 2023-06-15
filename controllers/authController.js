const { validationResult } = require("express-validator");
const passport = require('./passport');
const jwt = require("jsonwebtoken");

let authController = {};

authController.show = (req, res) => {
  if (req.isAuthenticated()) {
     res.redirect('/');
  };
  res.render('login', {loginMessage: req.flash('loginMessage'), reqUrl: req.query.reqUrl});
};

authController.showRegister = (req, res) => {
  if (req.isAuthenticated()) {
     res.redirect('/');
  };
  res.render('register', {registerMessage: req.flash('registerMessage'), reqUrl: req.query.reqUrl});
};

authController.login = (req, res, next) => {
  let reqUrl = req.body.reqUrl ? req.body.reqUrl : '/';
  let keepSignedIn = req.body.keepSignedIn;
  let cart = req.session.cart;
  passport.authenticate('local-login', (error, user) => {
    if (error) {
          return next(error);
        }
        if (!user) {
          return res.redirect(`/users/login?reqUrl=${reqUrl}`);
        }
        req.logIn(user, (error) => {
          if (error) {
            return next(error);
          }
          req.session.cookie.maxAge = keepSignedIn ? (1000 * 60 * 60 * 24) : null;
          req.session.cart = cart;
          return res.redirect(reqUrl);
        });
  })(req, res, next);
  };

  //logout
authController.logout = (req, res, next) => {
  let cart = req.session.cart;
  req.logout((error) => {
    if (error) {
      return next(error);
    };
    req.session.cart = cart;
    res.redirect('/');
  })
};

authController.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  };
  res.redirect(`/users/login?reqUrl=${req.originalUrl}`);
};

authController.isAdmin = (req, res, next) => {
  if (!req.user.isAdmin || req.user.isAdmin == null) {
    return res.render('error', {message: 'Access Denied'});
}
next()
};

authController.register = (req, res, next) => {
  let cart = req.session.cart;
  let reqUrl = req.body.reqUrl ? req.body.reqUrl : '/users/my-account';
  passport.authenticate('local-register', (error, user) => {
    if (error) {
          return next(error);
        }
    if (!user) { return res.redirect(`/users/register?reqUrl=${reqUrl}`); }
    req.logIn(user, (error) => {
      if (error) { return next(error); }
      req.session.cart = cart;
      res.redirect(reqUrl);
    });
  }) (req, res, next);
};

module.exports = authController;
