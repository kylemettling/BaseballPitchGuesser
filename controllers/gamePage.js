const fetch = require("node-fetch");
const { PLAYBYPLAY_ENDPOINT } = require("../config/endpoints");
const BoxScore = require("../services/boxscore");

module.exports = {
  getGamePage: async (req, res) => {
    try {
      const { matchupId } = req.params;
      console.log(PLAYBYPLAY_ENDPOINT.replace("gameId", matchupId));
      await fetch(PLAYBYPLAY_ENDPOINT.replace("gameId", matchupId))
        .then((res) => res.json())
        .then((body) => {
          const boxscore = new BoxScore(body.game);
          res.render("gameDetails.ejs", { box: boxscore });
        });
    } catch (err) {
      console.log(err);
    }
  },
};
