const session = require("express-session");

module.exports = (req, res, next) => {
  let Cart = require(".controller/cart");
  req.session.cart = new Cart(req.session.cart ? req.session.cart : {});
  res.locals.quantity = req.session.cart.quantity;
  next();
};
