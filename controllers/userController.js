"use strict";

const controller = {};
const models = require("../models");
const bcrypt = require("bcryptjs");

controller.viewAccount = async (req, res) => {
  let userId = req.user.id;
  let user = await models.User.findByPk(userId);
  let addresses = await models.Address.findAll({where: {userId: userId}});
  let orders = await models.Order.findAll({where: {userId: userId}});
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
      res.locals.isAdmin = true;
    }
  };

  res.locals.user = user;
  res.locals.orders = orders;
  res.locals.addresses = addresses;
  res.locals.userId = userId;

  res.render('my-account');
};

controller.checkout = async (req, res) => {
  if (req.session.cart.quantity > 0) {
    let userId = req.user.id;
    res.locals.addresses = await models.Address.findAll({ where: { userId } });
    res.locals.cart = req.session.cart.getCart();
    return res.render("checkout");
  }
  res.redirect("/products");
};

controller.placeorders = async (req, res) => {
  let userId = req.user.id;
  //let {addressId, payment} = req.body;
  let addressId = isNaN(req.body.addressId) ? 0 : parseInt(req.body.addressId);
  let address = await models.Address.findByPk(addressId);
  if (!address) {
    address = await models.Address.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.mobile,
      address: req.body.address,
      city: req.body.city,
      userId: userId,
    });
  }
  let cart = req.session.cart;
  cart.shippingAddress = `${address.name}, Email: ${address.email}, Mobile: ${address.phone}, Address: ${address.address}, ${address.city}`;
  cart.paymentMethod = req.body.payment;

  switch (req.body.payment) {
    case "PAYPAL":
      saveOrders(req, res, "PAID");
      break;
    case "COD":
      saveOrders(req, res, "UNPAID");
      break;
  }
  //return res.redirect('/users/checkout');
};

async function saveOrders(req, res, status) {
  let userId = req.user.id;
  let { items, ...others } = req.session.cart.getCart();
  let order = await models.Order.create({
    userId,
    ...others,
    status,
    process: 'Processing',
  });
  let orderdetails = [];
  items.forEach(item => {
    orderdetails.push({
      orderId: order.id,
      productId: item.product.id,
      price: item.product.price,
      quantity: item.quantity,
      total: item.total,
    });
  });
  await models.OrderDetail.bulkCreate(orderdetails);
  req.session.cart.clear();
  return res.render("error", { message: "Thank you for your order!" });
}

//give reviews
controller.giveReview = async (req, res) => {
  let userId = req.user.id;
  let id = isNaN(req.params.id) ? 0 : req.params.id;
  await models.Review.create({
    review: req.body.review,
    stars: req.body.stars,
    productId: id,
    userId: userId
  })
  res.redirect(`/products/${id}`)
};

//order management
controller.viewOrder = async (req, res) => {
  let id = isNaN(req.params.id) ? 0 : req.params.id;
  let orders = await models.OrderDetail.findAll({
        attributes: ['orderId', 'quantity', 'price', 'total'],
        where: {
                    orderId: id
                },
        include: [{model: models.Product,
                    attributes: ['name']}],
        });
    res.locals.orders = orders;
  res.render('my-order');
};

controller.cancelOrder = async (req, res) => {
  let id = isNaN(req.params.id) ? 0 : req.params.id;
  let order = await models.Order.findByPk(id);
  if (order) {
    if (order.process == 'Completed') {
      res.render('error', {message:"Cancel failed. Your order has been completed."})
  }
  else if (order.process == 'Cancelled') {
      res.render('error', {message:"Cancel failed. Your order has been cancelled by Naoki Shop."})
  }
  else {
    await models.Order.update({process: 'Cancelled'}, {where: {id: id}});
  }
  res.render('error', {message:"Cancel successful"});
}};

//address management
controller.showAddress = async (req, res) => {
    let id = isNaN(req.params.id) ? 0 : req.params.id;
    let address = await models.Address.findByPk(id);
    res.locals.address = address;
    res.render('edit-address');
};

controller.showAddressTemplate = (req, res) => {
  let userId = isNaN(req.params.id) ? 0 : req.params.id;;
  res.locals.userId = userId;
  res.render('add-address');
}

controller.editAddress = async (req, res) => {
    let id = isNaN(req.params.id) ? 0 : req.params.id;
    await models.Address.update({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
    }, {
        where: {
            id: id
        }
    });
    res.render("error", { message: "Updated address successfully!" });
};

controller.deleteAddress = async (req, res) => {
    let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
    let address = await models.Address.findByPk(id);
    if (address) {
        await models.Address.destroy({where: {id: id}});
        res.render("error", { message: "Deleted successfully." })
    }
    else
    {
    res.render("error", { message: "Address not found, delete failed." });
    }
};

controller.addAddress = async (req, res) => {
  let userId = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
    await models.Address.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        userId
    });
    res.render("error", { message: "Added new address successfully!" });
};

//update account

controller.updateAccount = async (req, res) => {
  let id = isNaN(req.params.id) ? 0 : req.params.id;
    await models.User.update({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    }, {
        where: {
            id: id
        }
    });
    res.render("error", { message: "Updated account successfully!" });
};

controller.changePassword = async (req, res) => {
  let userId = isNaN(req.params.id) ? 0 : req.params.id;
  let user = await models.User.findByPk(userId);
  let oldpassword = req.body.oldpassword;
  let newpassword = req.body.password;
  if (oldpassword == newpassword) {
    res.render("error", { message: "New password must be different from old password. Changed password failed." });
  };
  if (!bcrypt.compareSync(oldpassword, user.password)) {
    res.render("error", { message: "Wrong password." });
  }
  else {
    await models.User.update({
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8)),
    }, {
      where: { id: userId }
    })
    res.render("error", { message: "Changed password successfully!" });
  }
};

module.exports = controller;
