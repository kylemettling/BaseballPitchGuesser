const fetch = require("node-fetch");
const { PLAYBYPLAY_ENDPOINT } = require("../config/endpoints");
const BoxScore = require("../services/boxscore");
const User = require("../models/User");
const pitchGuess = require("../services/pitchGuess");

module.exports = {
  getGamePage: async (req, res) => {
    let guesses;
    async function getPitchGuesses() {
      try {
        await User.findById(req.user.id)
          .lean()
          .then((body) => {
            guesses = JSON.stringify(body.pitchGuesses);
          });
      } catch (err) {
        console.log(err);
      }
    }
    try {
      const { matchupId } = req.params;
      // console.log(PLAYBYPLAY_ENDPOINT.replace("gameId", matchupId));
      getPitchGuesses();
      await fetch(PLAYBYPLAY_ENDPOINT.replace("gameId", matchupId))
        .then((res) => res.json())
        .then((body) => {
          const boxscore = new BoxScore(body.game);
          const { currentPitchNumber, currentPitchZone } = boxscore;
          console.log(guesses);
          res.render("gameDetails.ejs", {
            box: boxscore,
            userGuess: guesses,
          });
        });
    } catch (err) {
      console.log(err);
    }
    // function getPitchGuesses() {
    //   try {
    //     const guesses = User.findById(req.user.id)
    //       .lean()
    //       .then((body) => {
    //         console.log(body.pitchGuesses);
    //         return body.pitchGuesses;
    //       });
    //     return guesses;
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
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
  getUserGuesses: async (req, res) => {
    const guesses = User.findById(req.user.id)
      .lean()
      .then((data) => {
        console.log(data.pitchGuesses);
        // return data.pitchGuesses;
        res.json(data.pitchGuesses);
      })
      .catch((err) => console.log(err));
  },
};
