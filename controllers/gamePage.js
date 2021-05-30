const fetch = require("node-fetch");
const { PLAYBYPLAY_ENDPOINT } = require("../config/endpoints");
const BoxScore = require("../services/boxscore");
const User = require("../models/User");

module.exports = {
  getGamePage: async (req, res) => {
    try {
      const { matchupId } = req.params;
      const userGuess = "Guess where the next pitch will go";
      console.log(PLAYBYPLAY_ENDPOINT.replace("gameId", matchupId));
      await fetch(PLAYBYPLAY_ENDPOINT.replace("gameId", matchupId))
        .then((res) => res.json())
        .then((body) => {
          const boxscore = new BoxScore(body.game);
          res.render("gameDetails.ejs", { box: boxscore, userGuess });
        });
    } catch (err) {
      console.log(err);
    }
  },
  postZoneChoice: async (req, res) => {
    try {
      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $push: {
            pitchGuesses: req.body,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
    // console.log(userGuess);
  },
};
