"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminController");
const authController = require("../controllers/authController");

router.use(authController.isLoggedIn); 
router.use(authController.isAdmin); 

router.get("/", controller.showIndex);
//product management

router.get('/addProduct', controller.show);

router.post('/addProduct', controller.addProduct);

router.get('/allProducts', controller.showAll);

router.get('/deleteProduct/:id', controller.deleteProduct);

router.get('/editProduct/:id', controller.showProduct);

router.post('/editProduct/:id', controller.updateProduct);

//category management

router.get('/allCategories', controller.showAllCategory);

router.get('/addCategory', controller.showAddCategory);

router.post('/addCategory', controller.addCategory);

router.get('/deleteCategory/:id', controller.deleteCategory);

router.get('/editCategory/:id', controller.updateCategory);

//order management

router.get('/allOrders', controller.showOrders);

router.get('/allOrders/:id', controller.showOrderDetails);

router.get('/completeOrder/:id', controller.completeOrder);

router.get('/cancelOrder/:id', controller.cancelOrder);

router.get('/deleteOrder/:id', controller.deleteOrder);

module.exports = router;
