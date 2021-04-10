const express = require("express");
const app = express();
// const fs = require("fs");
const connectDB = require("./config/database");
const homeRoutes = require("./routes/home");
const gameListRoutes = require("./routes/gamesList");
const fetch = require("node-fetch");
const PORT = 5000;
const GamedayDetails = require("./models/gameday");
// Set date and month
let today = new Date();
const { month, day } = { day: today.getDate(), month: today.getMonth() + 1 };
// const dummyData = require("./data.json");
require("dotenv").config({ path: `${__dirname}/config/process.env` });

connectDB();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const API_KEY = process.env.API_KEY;
const SCHEDULE_ENDPOINT = `https://api.sportradar.us/mlb/trial/v7/en/games/2021/${month}/${day}/schedule.json?api_key=${API_KEY}`;
// getDummyGameLinks(dummyData);

function getBoxscore(gameId) {
  return `https://api.sportradar.us/mlb/trial/v7/en/games/${gameId}/boxscore.json?api_key=${API_KEY}`;
}

// @route Homepage
app.get("/", homeRoutes);
// @route Game Schedule page
app.get("/getGames", gameListRoutes);

// Dummy API call
// res.render("games.ejs", {
//   info: returnDummyGameSchedule(dummyData),
//   gameLinks,
// });
// }

app.get("/game/:matchupId", (req, res) => {
  const { matchupId } = req.params;
  console.log(gameData);
  const foundGame = gameData.find((a) => a.id === matchupId);
  const gamePage = new GamedayDetails(foundGame);
  res.render("gameDetails.ejs", { gamePage });
});

app.get("/game/:matchId/box", async (req, res) => {
  const { matchId } = req.params;
  await fetch(getBoxscore(matchId))
    .then((res) => res.json())
    .then((data) => res.json(data));
});

app.listen(PORT, console.log(`Server running on port ${PORT}`));

// function returnGameSchedule(resBody) {
//   return resBody.games.map((a) => (a = `${a.away.name} @ ${a.home.name}`));
// }
// function getGameLinks() {
//   const gameLinks = gameData.map((a) => (a = `${a.id}`));
//   return gameLinks;
// }
