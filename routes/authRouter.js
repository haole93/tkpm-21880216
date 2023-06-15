const express = require("express");
const authController = require("../controllers/authController");
const models = require("../models");
const {body, getErrorMessage} = require('../controllers/validator');
const router = express.Router();

router.get('/login', authController.show);

router.post("/login",
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email address'),
  body('password').trim().notEmpty().withMessage('Password is required'),
    (req, res, next) => {
      let message = getErrorMessage(req);
      if (message) {
        return res.render('login', {loginMessage: message});
      }
      next();
    },
authController.login);

router.get('/logout', authController.logout);

router.get('/register', authController.showRegister);

router.post('/register',
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email address'),
  body('password').trim().notEmpty().withMessage('Password is required'),
  body('password').matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).withMessage('Password must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters'),
  body('confirmpassword').custom((confirmpassword, {req}) => {
      if(confirmpassword != req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
  }),
  (req, res, next) => {
    let message = getErrorMessage(req);
      if (message) {
        return res.render('register', {registerMessage: message});
      }
      next();
  },
   authController.register);

module.exports = router;
