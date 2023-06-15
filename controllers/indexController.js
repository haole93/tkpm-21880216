"use strict";

const controller = {};
const models = require("../models");
const passport = require('./passport');

controller.showHomepage = async (req, res) => {
  let categories = await models.Category.findAll();
  res.locals.categories = categories;
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      res.locals.isAdmin = true;
    }
  };
  res.render("index");;
};

controller.showPage = (req, res, next) => {
  const pages = [
    "cart",
    "product-list",
    "checkout",
    "product-detail",
    "login",
    "contact",
    "my-account",
  ];
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      res.locals.isAdmin = true;
    }
  };
  if (pages.includes(req.params.page)) {
    return res.render(req.params.page);
  }
  next();
};


module.exports = controller;
