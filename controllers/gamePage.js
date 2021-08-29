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
          guesses,
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
      let playerImages;
      const boxscoreData = fetch(
        PLAYBYPLAY_ENDPOINT.replace("gameId", matchupId)
      )
        .then((res) => res.json())
        .then(async (body) => {
          const boxscore = new BoxScore(body.game);
          username = req.user.firstName;
          currentPitchNumber = await boxscore.currentPitchNumber;
          currentPitchZone = await boxscore.currentPitchZone;
          // console.log("AWAITED BOXSCORE", await boxscore.getCurrentBatterImg());
          playerImages = await boxscore.getPlayerImages();
          return boxscore;
        });

      // .then(async (boxscore) => {
      // console.log(await boxscoreData).getCurrentBatterImg();
      // console.log("Hmm", await boxscoreData);
      const data = await boxscoreData;
      // console.log("AWAITED BOXSCORE", image);
      res.render("gameDetails.ejs", {
        box: data,
        images: playerImages,
        userGuess: await getResults(username),
        // });
      });
      // try {
      //   fetch(PLAYBYPLAY_ENDPOINT.replace("gameId", matchupId))
      //     .then((res) => res.json())
      //     .then(async (body) => {
      //       const boxscore = new BoxScore(body.game);
      //       username = req.user.firstName;
      //       currentPitchNumber = await boxscore.currentPitchNumber;
      //       currentPitchZone = await boxscore.currentPitchZone;
      //       console.log(await boxscore.getCurrentBatterImg());

      //       return await boxscore;
      //     })
      //     .then(async (boxscore) => {
      //       res.render("gameDetails.ejs", {
      //         box: await boxscore,
      //         userGuess: await getResults(username),
      //       });
      //     });
    } catch (err) {
      console.log(err);
    }
  },
  postZoneChoice: async (req, res) => {
    let getCurrentPitch;
    // console.log(`=== REQUESTING USER: ${req.user} ===`);
    async function postUpdate(req, currentPitch) {
      try {
        const { pitchGuess, gameid } = req.body;
        console.log(`POST UPDATE: ${currentPitch} ${pitchGuess}`);
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
          return data.json();
        })
        .then(async (body) => {
          const boxscore = new BoxScore(body.game);
          const { matchupId } = req.params;
          await postUpdate(req, boxscore.currentPitchNumber);
          console.log(`=== Sending status ===`);
          res.sendStatus(200);
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
