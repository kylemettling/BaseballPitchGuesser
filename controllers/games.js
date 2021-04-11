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
      console.log(storedGameData);
      // console.log(gameList[0].games);
      // console.log(returnGameSchedule(storedGameData));
      // console.log(getGameLinks(storedGameData));
      storedGameData.length === 0
        ? getAndStoreDailySchedule(res)
        : res.render("games.ejs", processStored(storedGameData));
      console.log(gameData);
      // res.render("games.ejs", {
      //   info: returnGameSchedule(gameData),
      //   gameLinks: getGameLinks(gameData),
      // });
      // console.log(gameList);
    } catch (err) {
      console.log(err);
    }
  },
};
function returnGameSchedule() {
  return games.map((a) => (a = `${a.away.name} @ ${a.home.name}`));
}
function getGameLinks() {
  return games.map((a) => (a = `${a.id}`));
}
function processStored(storedGameData) {
  return {
    info: returnGameSchedule(storedGameData),
    gameLinks: getGameLinks(storedGameData),
  };
}
async function getAndStoreDailySchedule(res) {
  await fetch(SCHEDULE_ENDPOINT)
    .then((res) => res.json())
    .then((body) => {
      const { games: games, date } = body;
      console.log(games, date);
      // gameData = { games } body.games;
      // console.log(gameData);
      // getGameLinks();
    });
  res.render("games.ejs", {
    info: returnGameSchedule(),
    gameLinks: getGameLinks(),
  });
  // GameList.create({ games: { gameData }, date: [getMonth, getDay] });
  GameList.create({ games: gameData, date: currentDay });
  // return gameData;
}
