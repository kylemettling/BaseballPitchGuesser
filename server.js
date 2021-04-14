const express = require("express");
const app = express();
// const fs = require("fs");
const connectDB = require("./config/database");
const homeRoutes = require("./routes/home");
const gameListRoutes = require("./routes/gamesList");
const gamePageRoutes = require("./routes/gamePage");
const fetch = require("node-fetch");
const PORT = 5000;
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
// getDummyGameLinks(dummyData);

function getBoxscore(gameId) {
  return `https://api.sportradar.us/mlb/trial/v7/en/games/${gameId}/boxscore.json?api_key=${API_KEY}`;
}

// @route Homepage
app.get("/", homeRoutes);
// @route Game Schedule page
app.get("/getGames", gameListRoutes);

app.get("/game/:matchupId", gamePageRoutes);

app.listen(PORT, console.log(`Server running on port ${PORT}`));
