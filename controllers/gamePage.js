const fetch = require("node-fetch");
const { PLAYBYPLAY_ENDPOINT } = require("../config/endpoints");
const BoxScore = require("../services/boxscore");
const User = require("../models/User");
// const PitchGuess = require("../models/PitchGuess");
const pitchGuess = require("../services/pitchGuess");

module.exports = {
  getGamePage: async (req, res) => {
    let guesses,
      currentPitchNumber,
      currentPitchZone,
      filteredGuesses,
      guessResult;
    async function getPitchGuesses() {
      // console.log(req.body);
      try {
        await User.findById(req.user.id)
          .lean()
          .then((body) => {
            // console.log(body.pitchGuesses);
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
          name,
          matchupId
        );
      } catch (err) {
        console.log(err);
      }
      // console.log(guessResult);
      return guessResult;
    }
    try {
      const { matchupId } = req.params;
      // console.log(PLAYBYPLAY_ENDPOINT.replace("gameId", matchupId));
      getPitchGuesses();
      // console.log(guessResult);
      // await setTimeout(
      //   () =>
      fetch(PLAYBYPLAY_ENDPOINT.replace("gameId", matchupId))
        .then((res) => res.json())
        .then((body) => {
          const boxscore = new BoxScore(body.game);
          currentPitchNumber = boxscore.currentPitchNumber;
          currentPitchZone = boxscore.currentPitchZone;
          // console.log(currentPitchNumber, currentPitchZone);
          getResults(req.user.firstName);

          // console.log(guessResult, req.user.firstName);
          return boxscore;
        })
        .then(async (boxscore, name) =>
          res.render("gameDetails.ejs", {
            box: boxscore,
            // userGuess: guessResult,
            userGuess: await getResults(name),
          })
        );
      //   1000
      // );
    } catch (err) {
      console.log(err);
    }
  },
  postZoneChoice: async (req, res) => {
    const { matchupId } = req.params;
    // const { pitchGuess, gameid, sequencenumber } = await req.body;
    // const { pitchGuess, gameid } = JSON.stringify(req.body);
    const getCurrentPitch = await fetch(
      PLAYBYPLAY_ENDPOINT.replace("gameId", matchupId)
    )
      .then((res) => res.json())
      .then((body) => {
        const boxscore = new BoxScore(body.game);
        currentPitchNumber = boxscore.currentPitchNumber;
        currentPitchZone = boxscore.currentPitchZone;
        // console.log(currentPitchNumber, currentPitchZone);
        // getResults(req.user.firstName);
        return boxscore.currentPitchNumber;
      });
    // .then(
    //   (boxscore) =>
    //   res.render("gameDetails.ejs", {
    //     box: boxscore,
    //     userGuess: guessResult,
    //   })
    // );
    console.log(`current pitch: ${await getCurrentPitch}`);
    try {
      const { pitchGuess, gameid } = req.body;
      // console.log(`body: ${JSON.stringify(req.body)}`);
      // console.log([pitchGuess, await getCurrentPitch, gameid]);
      // const {}
      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $push: {
            pitchGuesses: {
              pitchGuess: pitchGuess,
              sequencenumber: await getCurrentPitch,
              gameid,
            },
            // pitchGuesses: req.body,
          },
        },
        { new: true }
      );
      // res.redirect("back");
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
