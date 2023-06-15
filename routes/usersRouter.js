"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const { body, validationResult } = require("express-validator");
const authController = require("../controllers/authController");

router.use(authController.isLoggedIn); 

router.get("/checkout", controller.checkout);

router.post(
  "/placeorders",
  body("name").notEmpty().withMessage("Full Name is required!"),
  body("mobile").notEmpty().withMessage("Mobile is required!"),
  body("email")
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Invalid email address!"),
  body("address").notEmpty().withMessage("Address is required!"),
  (req, res, next) => {
    let errors = validationResult(req);
    if (req.body.addressId == "0" && !errors.isEmpty()) {
      let errorArray = errors.array();
      let message = "";
      for (let i = 0; i < errorArray.length; i++) {
        message += errorArray[i].msg + "<br/>";
      }
      return res.render("error", { message });
    }
    next();
  },
  controller.placeorders
);

router.post('/giveReview/:id', controller.giveReview);

//orders management

router.get('/my-account', controller.viewAccount);

router.get('/my-account/viewOrder/:id', controller.viewOrder);

router.get('/my-account/cancelOrder/:id', controller.cancelOrder);

//address management

router.get('/my-account/editAddress/:id', controller.showAddress);

router.post('/my-account/editAddress/:id', controller.editAddress);

router.get('/my-account/deleteAddress/:id', controller.deleteAddress);

router.get('/my-account/addAddress/:id', controller.showAddressTemplate);

router.post('/my-account/addAddress/:id', controller.addAddress);

//update account

router.post('/my-account/updateAccount/:id', controller.updateAccount);
router.post('/my-account/changePassword/:id', controller.changePassword);

module.exports = router;
