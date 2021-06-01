const express = require("express");
const router = express.Router();
const GamePageController = require("../controllers/gamePage");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/:matchupId", ensureAuth, GamePageController.getGamePage);
router.post("/:matchupId", ensureAuth, GamePageController.postZoneChoice);
router.get("/:matchupId/userGuesses", GamePageController.getUserGuesses);
module.exports = router;
