const express = require("express");
const router = express.Router();
const GamePageController = require("../controllers/gamePage");

router.get("/game/:matchupId", GamePageController.getGamePage);

module.exports = router;
