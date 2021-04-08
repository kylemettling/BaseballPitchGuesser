const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = 5000;
const GamedayDetails = require("./models/gameday");

// Set date and month
let today = new Date();
const date = { day: today.getDate(), month: today.getMonth() + 1 };
const dummyData = require("./data.json");
require("dotenv").config({ path: `${__dirname}/config/process.env` });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const API_KEY = process.env.API_KEY;
const API_ENDPOINT = `https://api.sportradar.us/mlb/trial/v7/en/games/2021/${date.day}/${date.month}/schedule.json?api_key=${API_KEY}`;
let gameLinks, gameData;
// console.log(date);
getDummyGameLinks(dummyData);
// console.log(gameLinks);

// @route Homepage
app.get("/", (req, res) => {
  res.render("index.ejs");
});
// @route Game Schedule page
app.get("/getGames", async (req, res) => {
  // Live API call
  // const gameList = await fetch(API_ENDPOINT)
  //   .then((res) => res.json())
  //   .then((body) => {
  //     getGameLinks(body);
  //     res.render("games.ejs", { info: returnGameSchedule(body), gameLinks });
  //   })
  //   .catch((err) => console.log(err));

  // Dummy API call
  res.render("games.ejs", {
    info: returnDummyGameSchedule(dummyData),
    gameLinks,
  });
});

app.get("/:game", (req, res) => {
  const game = req.params;
  const [home, away] = game.game.split("-");
  // res.json(home, away);
  // console.log(home, away);
  const GamePage = new GamedayDetails(
    dummyData.games.find((a) => (a.id = game))
  );
  const { title, venue, scheduled } = GamePage;
  console.log(venue, scheduled);
  // console.log(GamePage);
  res.render("gameDetails.ejs", { title, venue, scheduled });
  // res.json(GamePage);
});

app.listen(PORT, console.log(`Server running on port ${PORT}`));

function returnGameSchedule(resBody) {
  return resBody.games.map((a) => (a = `${a.away.name} @ ${a.home.name}`));
}
function returnDummyGameSchedule(dummyData) {
  return dummyData.games.map((a) => (a = `${a.away.name} @ ${a.home.name}`));
}
function getGameLinks(resBody) {
  gameData = resBody.games;
  console.log(gameData.length);
  gameLinks = resBody.games.map((a) => (a = `${a.home.abbr}-${a.away.abbr}`));
}
function getDummyGameLinks(resBody) {
  // gameLinks = dummyData.games.map((a) => (a = `${a.home.abbr}-${a.away.abbr}`));
  gameLinks = dummyData.games.map((a) => (a = `${a.id}`));
}
