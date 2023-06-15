"use strict";

let controller = {};
const models = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;

controller.getData = async (req, res, next) => {
  let categories = await models.Category.findAll({
    include: [
      {
        model: models.Product,
      },
    ],
  });
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      res.locals.isAdmin = true;
    }
  };
  res.locals.categories = categories;
  next();
};

controller.showAll = async (req, res) => {
  let category = isNaN(req.query.category) ? 0 : parseInt(req.query.category);
  let keyword = req.query.keyword || "";
  let sort = ["Price", "Popular", "Newest"].includes(req.query.sort)
    ? req.query.sort
    : "Price";

  let page = isNaN(req.query.page) ? 1 : Math.max(1, parseInt(req.query.page));
  let options = {
    attributes: ["id", "name", "imagePath", "price", "description"],
    where: {},
  };

  if (category > 0) {
    options.where.categoryId = category;
  }

  if (keyword.trim() != "") {
    options.where.name = {
      [Op.iLike]: `%${keyword}%`,
    };
  }

  switch (sort) {
    case "Newest":
      options.order = [["createdAt", "DESC"]];
      break;
    case "Popular":
      options.order = [["createdAt", "DESC"]];
      break;
    default:
      options.order = [["price", "ASC"]];
  }

  res.locals.sort = sort;
  res.locals.originalUrl = removeParam("sort", req.originalUrl);

  if (Object.keys(req.query).length == 0) {
    res.locals.originalUrl = res.locals.originalUrl + "?";
  }

  const limit = 6;
  options.limit = limit;
  options.offset = limit * (page - 1);

  let { rows, count } = await models.Product.findAndCountAll(options);

  res.locals.pagination = {
    page: page,
    limit: limit,
    totalRows: count,
    queryParams: req.query,
  };

  res.locals.products = rows;
  res.render("product-list");
};

controller.showDetails = async (req, res) => {
  let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);

  let product = await models.Product.findOne({
    attributes: ["id", "name", "price", "description"],
    where: { id },
    include: [
      {
        model: models.Image,
        attributes: ["name", "imagePath"],
      },
      {
        model: models.Review,
        attributes: ["id", "review", "stars", "createdAt"],
        include: [
          {
            model: models.User,
            attributes: ["name"],
          },
        ],
      },
    ],
  });
  res.locals.product = product;
  res.render("product-detail");
};

function removeParam(key, sourceURL) {
  var rtn = sourceURL.split("?")[0],
    param,
    params_arr = [],
    queryString = sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";
  if (queryString !== "") {
    params_arr = queryString.split("&");
    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split("=")[0];
      if (param === key) {
        params_arr.splice(i, 1);
      }
    }
    if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
  }
  return rtn;
}

module.exports = controller;
