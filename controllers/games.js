const GameList = require("../models/GameList");
const fetch = require("node-fetch");
const { SCHEDULE_ENDPOINT } = require("../config/endpoints");
const { getDay, getMonth } = require("../utils/getDate");
const currentDay = `${getMonth}/${getDay}`;

module.exports = {
  getGameList: async (req, res) => {
    try {
      const storedGameData = await GameList.find({ date: currentDay });
      let gameData;
      storedGameData.length === 0
        ? (gameData = await getAndStoreDailySchedule(res))
        : (gameData = storedGameData[0].games);
      res.render("games.ejs", {
        matchups: returnGameSchedule(gameData),
        gameLinks: getGameLinks(gameData),
      });
    } catch (err) {
      console.log(err);
    }
  },
};
function returnGameSchedule(data) {
  return data.map((a) => (a = `${a.away.name} @ ${a.home.name}`));
}
function getGameLinks(data) {
  return data.map((a) => (a = `${a.id}`));
}
function procesStoredDailySchedule(dbData) {
  gameData = dbData;
}
async function getAndStoreDailySchedule(res) {
  await fetch(SCHEDULE_ENDPOINT)
    .then((res) => res.json())
    .then((body) => {
      const { games } = body;
      gameData = body.games;
      GameList.create({ games, date: currentDay });
    });
  return gameData;
}
