const fetch = require("node-fetch");
const { PLAYBYPLAY_ENDPOINT } = require("../config/endpoints");
const BoxScore = require("../services/boxscore");
const User = require("../models/User");
// const PitchGuess = require("../models/PitchGuess");
const pitchGuess = require("../services/pitchGuess");
const { post } = require("../routes/home");

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
            guesses = body.pitchGuesses[body.pitchGuesses.length - 1];
          });
      } catch (err) {
        console.log(err);
      }
    }
    async function getResults(name) {
      try {
        const { matchupId } = req.params;
        guessResult = await pitchGuess(
          currentPitchNumber,
          currentPitchZone,
          await guesses,
          username,
          matchupId
        );
      } catch (err) {
        console.log(err);
      }
      return guessResult;
    }
    const { matchupId } = req.params;
    console.log(PLAYBYPLAY_ENDPOINT.replace("gameId", matchupId));
    getPitchGuesses();
    try {
      fetch(PLAYBYPLAY_ENDPOINT.replace("gameId", matchupId))
        .then((res) => res.json())
        .then((body) => {
          const boxscore = new BoxScore(body.game);
          username = req.user.firstName;
          currentPitchNumber = boxscore.currentPitchNumber;
          currentPitchZone = boxscore.currentPitchZone;

          return boxscore;
        })
        .then(async (boxscore) => {
          res.render("gameDetails.ejs", {
            box: boxscore,
            userGuess: await getResults(username),
          });
        });
    } catch (err) {
      console.log(err);
    }
  },
  postZoneChoice: async (req, res) => {
    let getCurrentPitch;
    console.log(`=== REQUESTING USER: ${req.user} ===`);
    async function postUpdate(req, currentPitch) {
      try {
        const { pitchGuess, gameid } = req.body;
        console.log(`POST UPDATE: ${currentPitch}`);
        await User.findOneAndUpdate(
          { _id: req.user.id },
          {
            $push: {
              pitchGuesses: {
                pitchGuess: pitchGuess,
                sequencenumber: currentPitch,
                gameid,
              },
            },
          }
          // ,
          // { new: true }
        );
      } catch (err) {
        console.log(err);
      }
    }
    try {
      const { matchupId } = req.params;
      getCurrentPitch = await fetch(
        PLAYBYPLAY_ENDPOINT.replace("gameId", matchupId)
      )
        .then((data) => {
          // console.log(data);
          return data.json();
        })
        .then((body) => {
          const boxscore = new BoxScore(body.game);
          // return boxscore.currentPitchNumber;
          const { matchupId } = req.params;
          postUpdate(req, boxscore.currentPitchNumber);
          // res.redirect(`/game/${matchupId}`);
          // return matchupId;
          // res.render(`/game/${matchupId}`);
          // res.sendStatus(200);
          // res.render("Hello");
          res.end();
        })
        .catch((err) => console.log(err));
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
