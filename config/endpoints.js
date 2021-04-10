require("dotenv").config({ path: `${__dirname}/process.env` });
const { getDay, getMonth } = require("../utils/getDate");
const API_KEY = process.env.API_KEY;
module.exports = {
  SCHEDULE_ENDPOINT: `https://api.sportradar.us/mlb/trial/v7/en/games/2021/${getMonth}/${getDay}/schedule.json?api_key=${API_KEY}`,
};
