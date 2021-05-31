const fetch = require("node-fetch");
const { PLAYBYPLAY_ENDPOINT } = require("../config/endpoints");
const BoxScore = require("../services/boxscore");
const User = require("../models/User");
const pitchGuess = require("../services/pitchGuess");

module.exports = {
  getGamePage: async (req, res) => {
    // let pitchGuesses;
    try {
      const { pitchGuesses } = await User.findById(req.user.id).lean();
      console.log(pitchGuesses);
    } catch (err) {
      console.log(err);
    }
    try {
      const { matchupId } = req.params;
      // console.log(PLAYBYPLAY_ENDPOINT.replace("gameId", matchupId));
      await fetch(PLAYBYPLAY_ENDPOINT.replace("gameId", matchupId))
        .then((res) => res.json())
        .then((body) => {
          const boxscore = new BoxScore(body.game);
          const { currentPitchNumber, currentPitchZone } = boxscore;
          const userGuess = pitchGuess(
            currentPitchNumber,
            currentPitchZone,
            pitchGuesses
          );
          res.render("gameDetails.ejs", {
            box: boxscore,
            userGuess,
          });
        });
    } catch (err) {
      console.log(err);
    }
  },
  postZoneChoice: async (req, res) => {
    const { pitchGuess, gameid, sequencenumber } = await req.body;
    console.log(pitchGuess, gameid, sequencenumber);
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
  },
  getUserGuesses: async (req, res) => {},
};
