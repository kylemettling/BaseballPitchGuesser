const express = require("express");
const router = express.Router();
const HomeController = require("../controllers/home");

router.get("/", HomeController.getIndex);

module.exports = router;
