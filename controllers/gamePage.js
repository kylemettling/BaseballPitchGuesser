const fetch = require("node-fetch");
const { PLAYBYPLAY_ENDPOINT } = require("../config/endpoints");
const BoxScore = require("../services/boxscore");
const User = require("../models/User");
const pitchGuess = require("../services/pitchGuess");

module.exports = {
  getGamePage: async (req, res) => {
    let guesses,
      currentPitchNumber,
      currentPitchZone,
      filteredGuesses,
      guessResult;
    async function getPitchGuesses() {
      try {
        await User.findById(req.user.id)
          .lean()
          .then((body) => {
            guesses = body.pitchGuesses;
          });
      } catch (err) {
        console.log(err);
      }
    }
    async function getResults(name) {
      try {
        guessResult = await pitchGuess(
          currentPitchNumber,
          currentPitchZone,
          guesses,
          name
        );
      } catch (err) {
        console.log(err);
      }
      return guessResult;
    }
    try {
      const { matchupId } = req.params;
      console.log(PLAYBYPLAY_ENDPOINT.replace("gameId", matchupId));
      getPitchGuesses();
      await fetch(PLAYBYPLAY_ENDPOINT.replace("gameId", matchupId))
        .then((res) => res.json())
        .then((body) => {
          const boxscore = new BoxScore(body.game);
          currentPitchNumber = boxscore.currentPitchNumber;
          currentPitchZone = boxscore.currentPitchZone;
          getResults(req.user.firstName);
          return boxscore;
        })
        .then((boxscore) => {
          setTimeout(
            res.render("gameDetails.ejs", {
              box: boxscore,
              userGuess: guessResult,
            }),
            1500
          );
        });
    } catch (err) {
      console.log(err);
    }
  },
  postZoneChoice: async (req, res) => {
    const { pitchGuess, gameid, sequencenumber } = await req.body;
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
  getUserGuesses: async (req, res) => {
    User.findById(req.user.id)
      .lean()
      .then((data) => {
        res.json(data.pitchGuesses);
      })
      .catch((err) => console.log(err));
  },
};
