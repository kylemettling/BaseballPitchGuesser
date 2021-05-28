const express = require("express");
const router = express.Router();
const GamesController = require("../controllers/games");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/", ensureAuth, GamesController.getGameList);
module.exports = router;
