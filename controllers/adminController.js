'use strict';
const models = require('../models');
const sequelize = require("sequelize");
const Op = sequelize.Op;

let adminController = {};

adminController.showIndex = async (req, res) => {
    if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      res.locals.isAdmin = true;
    }
    };
    let orders = await models.Order.findAll({where: {process : 'Processing'}});
    res.locals.orders = orders;
    res.render('admin');
};

adminController.show = async (req, res) => {
    let categories = await models.Category.findAll();
    if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      res.locals.isAdmin = true;
    }
  };
    res.locals.categories = categories;
    res.render('add-product')
}

adminController.showAll = async (req, res) => {
    let products = await models.Product.findAll();
    let keyword = req.query.keyword || "";
    if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      res.locals.isAdmin = true;
    }
  };

    if (keyword.trim() != "") {
    products = await models.Product.findAll({where: {name: {
      [Op.iLike]: `%${keyword}%`,
    }}});
    }

    res.locals.products = products;
    res.render('all-products');
}

adminController.showProduct = async (req, res) => {
    let id = isNaN(req.params.id) ? 0 : req.params.id;
    let product = await models.Product.findByPk(id);
    let categories = await models.Category.findAll();
    if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      res.locals.isAdmin = true;
    }
  };
    res.locals.categories = categories;
    res.locals.product = product;
    res.render('edit-product')
};

adminController.showAllCategory = async (req, res) => {
    let categories = await models.Category.findAll();
    if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      res.locals.isAdmin = true;
    }
  };
    res.locals.categories = categories;
    res.render('all-category')
};

adminController.showAddCategory = async (req, res) => {
    if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      res.locals.isAdmin = true;
    }
  };
    res.render('add-category');
};

adminController.showOrders = async (req, res) => {
    let orders = await models.Order.findAll();
    let sort = req.query.sort;
    if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      res.locals.isAdmin = true;
    }
  };

//     let options = {
//     attributes: ["id", "quantity", "total", "shippingAddress", "paymentMethod","status", 'process'],
//     where: {},
//   };

    switch (sort) {
    case "Unpaid":
      orders = await models.Order.findAll({where: {status: 'UNPAID'}});
      break;
    case "Processing":
      orders = await models.Order.findAll({where: {process: "Processing"}});
      break;
    case "Cancelled":
      orders = await models.Order.findAll({where: {process: "Cancelled"}});
    }

    res.locals.sort = sort;

    res.locals.originalUrl = removeParam("sort", req.originalUrl);

    if (Object.keys(req.query).length == 0) {
    res.locals.originalUrl = res.locals.originalUrl + "?";
    }

    res.locals.orders = orders;
    res.render('all-orders');
};

adminController.showOrderDetails = async (req, res) => {
    let id = isNaN(req.params.id)? 0 : req.params.id;
    if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      res.locals.isAdmin = true;
    }
    };
    let orders = await models.OrderDetail.findAll({
        attributes: ['orderId', 'quantity', 'price', 'total'],
        where: {
                    orderId: id
                },
        include: [{model: models.Product,
                    attributes: ['name']}],
        });
    res.locals.orders = orders;
    res.render('order-details');
};

adminController.addProduct = async (req, res) => {
    await models.Product.create({
        name: req.body.name,
        imagePath: req.body.imagePath,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        categoryId: req.body.categoryId
    });
    res.render("error", { message: "Added new product successfully!" });
}

adminController.updateProduct = async (req, res) => {
    let id = isNaN(req.params.id)? 0 : req.params.id;
    await models.Product.update({
        name: req.body.name,
        imagePath: req.body.imagePath,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        categoryId: req.body.categoryId
    }, {
        where: {
            id: id
        }
    });
    res.render("error", { message: "Updated product successfully!" });
};

adminController.deleteProduct = async (req, res) => {
    let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
    let product = await models.Product.findOne({where: {id: id}});
    if (product) {
        await models.Product.destroy({where: {id: id}});
    }
    let products = await models.Product.findAll();
    res.locals.products = products;
    res.render('all-products');
}

adminController.addCategory = async (req, res) => {
    await models.Category.create({
        name: req.body.name,
        imagePath: req.body.imagePath,
    });
    res.render("error", { message: "Added new category successfully!" });
};

adminController.deleteCategory = async (req, res) => {
    let id = isNaN(req.params.id)? 0 : parseInt(req.params.id);
    let category = await models.Category.findOne({where: {id: id}});
    if (category) {
            await models.Category.destroy({where: {id: id}});
        };
    let categories = await models.Category.findAll();
    res.locals.categories = categories;
    res.render('all-category');
};

adminController.updateCategory = async (req, res) => {
    let id = isNaN(req.params.id)? 0 : parseInt(req.params.id);
    await models.Category.update({
        name: req.body.name
    }, {
        where: {
            id: id
        }
    });
    res.render("error", { message: "Updated category successfully!" });
};

adminController.deleteOrder = async (req, res) => {
    let id = isNaN(req.params.id)? 0 : parseInt(req.params.id);
    let order = await models.Order.findOne({where: {id: id}});
    let orderDetails = await models.OrderDetail.findAll({where: {orderId: id}});
    if (order) {
        await models.Order.destroy({where: {id: id}});
        await models.OrderDetail.destroy({where: {orderId: id}});
    }
    let orders = await models.Order.findAll();
    res.locals.orders = orders;
    res.render('all-orders');
};

adminController.completeOrder = async (req, res) => {
    let id = isNaN(req.params.id)? 0 : parseInt(req.params.id);
    let order = await models.Order.findOne({where: {id: id}});
    await models.Order.update({process: "Complete", order}, {where: {id: id}});
    res.render("error", { message: "Updated order successfully!" });
};

adminController.cancelOrder = async (req, res) => {
    let id = isNaN(req.params.id)? 0 : parseInt(req.params.id);
    let order = await models.Order.findOne({where: {id: id}});
    await models.Order.update({process: "Cancelled", order}, {where: {id: id}});
    res.render("error", { message: "Cancelled order successfully!" });
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

module.exports = adminController;
