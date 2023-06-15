"use strict";

const passport = require("passport");
const localStrategy = require("passport-local");
const models = require("../models");
const bcrypt = require("bcryptjs");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let user = await models.User.findOne({
      attributes: ["id", "name", "email", "phone", 'isAdmin'],
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  "local-login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      if (email) {
        email = email.toLowerCase();
      }
      try {
        if (!req.user) {
          let user = await models.User.findOne({ where: { email } });
          if (!user) {
            return done(
              null,
              false,
              req.flash("loginMessage", "Email does not exist!")
            );
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return done(
              null,
              false,
              req.flash("loginMessage", "Invalid password!")
            );
          }
          return done(null, user);
        }
        done(null, req.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

//register
passport.use('local-register', new localStrategy({
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      if (email) {
        email = email.toLowerCase();
      }
      if (req.user) { return done(null, req.user)}
      try {
        let user = await models.User.findOne({where: {email}});
        if (user) {return done(null, false, req.flash('registerMessage', 'Email is already existed!'))};

        user = await models.User.create({email: email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
          name: req.body.name,
          phone: req.body.phone,
          isAdmin: null});
                  
        done(null, false, req.flash('registerMessage', 'Register successfully. Please login!'));
      } catch (error) {
        done(error);
      }
    }));

module.exports = passport;
