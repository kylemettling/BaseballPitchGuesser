const express = require("express");
const fetch = require("node-fetch");
// const fs = require("fs");
const app = express();
const PORT = 5000;
const GamedayDetails = require("./models/gameday");
// Set date and month
let today = new Date();
const { month, day } = { day: today.getDate(), month: today.getMonth() + 1 };
// console.log(month, day);
// console.log(date);
// const dummyData = require("./data.json");
require("dotenv").config({ path: `${__dirname}/config/process.env` });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const API_KEY = process.env.API_KEY;
let requestType;
const SCHEDULE_ENDPOINT = `https://api.sportradar.us/mlb/trial/v7/en/games/2021/${month}/${day}/schedule.json?api_key=${API_KEY}`;
let gameData;
// getDummyGameLinks(dummyData);

function getBoxscore(gameId) {
  return `https://api.sportradar.us/mlb/trial/v7/en/games/${gameId}/boxscore.json?api_key=${API_KEY}`;
}

// @route Homepage
app.get("/", (req, res) => {
  res.render("index.ejs");
});
// @route Game Schedule page
app.get("/getGames", async (req, res) => {
  // Live API call
  await fetch(SCHEDULE_ENDPOINT)
    .then((res) => res.json())
    .then((body) => {
      gameData = body.games;
      // gameData = body.games;
      // console.log(gameData);
      getGameLinks();
      res.render("games.ejs", {
        info: returnGameSchedule(body),
        gameLinks: getGameLinks(gameData),
      });
    })
    .catch((err) => console.log(err));

  // Dummy API call
  // res.render("games.ejs", {
  //   info: returnDummyGameSchedule(dummyData),
  //   gameLinks,
  // });
});

app.get("/:matchupId", (req, res) => {
  const { matchupId } = req.params;
  const gamePage = new GamedayDetails(gameData.find((a) => a.id === matchupId));
  // console.log(gamePage);
  const { title, venue, scheduled, gameId } = gamePage;
  // console.log(venue, scheduled);
  res.render("gameDetails.ejs", { title, venue, scheduled, gameId });
});

app.get("/:matchId/box", async (req, res) => {
  const { matchId } = req.params;
  await fetch(getBoxscore(matchId))
    .then((res) => res.json())
    .then((data) => res.json(data));
});

app.listen(PORT, console.log(`Server running on port ${PORT}`));

function returnGameSchedule(resBody) {
  return resBody.games.map((a) => (a = `${a.away.name} @ ${a.home.name}`));
}
// function returnDummyGameSchedule(dummyData) {
//   return dummyData.games.map((a) => (a = `${a.away.name} @ ${a.home.name}`));
// }
function getGameLinks() {
  const gameLinks = gameData.map((a) => (a = `${a.id}`));
  return gameLinks;
}
// function getDummyGameLinks(resBody) {
//   gameLinks = dummyData.games.map((a) => (a = `${a.id}`));
// }
