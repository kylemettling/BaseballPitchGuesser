const fetch = require("node-fetch");
const { BOXSCORE_ENDPOINT } = require("../config/endpoints");
const BoxScore = require("../services/boxscore");

module.exports = {
  getGamePage: async (req, res) => {
    try {
      const { matchupId } = req.params;
      const box = await fetch(BOXSCORE_ENDPOINT.replace("gameId", matchupId))
        .then((res) => res.json())
        .then((body) => {
          //    const boxscore = new BoxScore(body)
          res.json(body);
        });
      // .then((body) => res.json(body));
    } catch (err) {
      console.log(err);
    }
  },
};