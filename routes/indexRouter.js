"use strict";

const express = require("express");
const router = express.Router();
let controller = require("../controllers/indexController");


// router.get('/createTables', (req, res) => {
//     let models = require('../models');
//     models.sequelize.sync().then(() => {
//         res.send('tables created successfully');
//     }) 
// });

router.get("/", controller.showHomepage);

router.get("/:page", controller.showPage);

module.exports = router;
