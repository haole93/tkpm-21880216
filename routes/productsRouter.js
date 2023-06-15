"use strict";

const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const cartController = require("../controllers/cartController");

router.get("/", productController.getData, productController.showAll);

router.get("/cart", cartController.show);

router.get("/:id", productController.getData, productController.showDetails);

router.post("/cart", cartController.add);

router.put("/cart", cartController.update);

router.delete("/cart", cartController.remove);

router.delete("/cart/all", cartController.clear);

module.exports = router;
