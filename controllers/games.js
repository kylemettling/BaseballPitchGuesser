const GameList = require("../models/GameList");
const fetch = require("node-fetch");
const { SCHEDULE_ENDPOINT } = require("../config/endpoints");
const { getDay, getMonth } = require("../utils/getDate");
const currentDay = `${getMonth}/${getDay}`;
console.log(currentDay);
let gameData;

module.exports = {
  getGameList: async (req, res) => {
    try {
      const storedGameData = await GameList.find({ date: currentDay });
      gameData =
        storedGameData.length === 0
          ? getAndStoreDailySchedule(res)
          : storedGameData;
      res.render("games.ejs", {
        matchups: returnGameSchedule(gameData),
        gameLinks: getGameLinks(gameData),
      });
    } catch (err) {
      console.log(err);
    }
  },
};
function returnGameSchedule() {
  return gameData[0].games.map((a) => (a = `${a.away.name} @ ${a.home.name}`));
}
function getGameLinks() {
  return gameData[0].games.map((a) => (a = `${a.id}`));
}
// function processStored(res, storedGameData) {
//   res.render({
//     matchups: returnGameSchedule(gameData),
//     gameLinks: getGameLinks(gameData),
//   });
// }
async function getAndStoreDailySchedule(res) {
  await fetch(SCHEDULE_ENDPOINT)
    .then((res) => res.json())
    .then((body) => {
      const { games } = body;
      gameData = games;
      GameList.create({ games, date: currentDay });
    });
}
