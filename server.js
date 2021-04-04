const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = 5000;
// const dummyData = require("./data.json");
require("dotenv").config({ path: `${__dirname}/config/process.env` });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const API_KEY = process.env.API_KEY;
const API_ENDPOINT = `https://api.sportradar.us/mlb/trial/v7/en/games/2021/04/04/schedule.json?api_key=${API_KEY}`;

// dummyData manipulation
// let games = dummyData.games;

// games = games.map((a, b) => (a = `${a.away.name} @ ${a.home.name}`));
// console.log(games);

// @route Homepage
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// @route Game Schedule page
app.get("/getGames", async (req, res) => {
  const gameList = await fetch(API_ENDPOINT)
    .then((res) => res.json())
    .then((body) => {
      // returnGameSchedule(body);
      res.render("games.ejs", { info: returnGameSchedule(body) });
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, console.log(`Server running on port ${PORT}`));

// Get schedule games from JSON response
function returnGameSchedule(resBody) {
  return resBody.games.map((a) => (a = `${a.away.name} @ ${a.home.name}`));
  // res.render("games.ejs", { info: games });
  // res.render("games.ejs", { info: games });
}
