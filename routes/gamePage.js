const express = require("express");
const router = express.Router();
const GamePageController = require("../controllers/gamePage");

router.get("/:matchupId", GamePageController.getGamePage);
router.post("/:matchupId", GamePageController.postZoneChoice);
module.exports = router;
