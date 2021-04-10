const GameList = require("../models/GameList");
const fetch = require("node-fetch");
const { SCHEDULE_ENDPOINT } = require("../config/endpoints");
const { getDay, getMonth } = require("../utils/getDate");

let gameData;

module.exports = {
  getGameList: async (req, res) => {
    try {
      const gameList = await GameList.find({ date: [getMonth, getDay] });
      // console.log(gameList[0].games);
      gameData = !gameList.length
        ? getAndStoreDailySchedule()
        : gameList[0].games;
      // console.log(gameData);
      // res.json(gameList);
      // console.log(gameList[0].date);
      // res.json(gameList);
      // .then((gameData) => {
      // res.render("games.ejs", {
      //   info: returnGameSchedule(gameList),
      //   gameLinks: getGameLinks(gameList),
      // });
      //   });
      res.render("games.ejs", {
        info: returnGameSchedule(gameData[0].gameData),
        gameLinks: getGameLinks(gameData),
      });
      // console.log(gameList);
    } catch (err) {
      console.log(err);
    }
  },
};
function returnGameSchedule(gameData) {
  return gameData.map((a) => (a = `${a.away.name} @ ${a.home.name}`));
}
function getGameLinks() {
  return gameData.map((a) => (a = `${a.id}`));
}
async function getAndStoreDailySchedule() {
  await fetch(SCHEDULE_ENDPOINT)
    .then((res) => res.json())
    .then((body) => {
      gameData = body.games;
      console.log(gameData);
      getGameLinks();
    });
  GameList.create({ games: { gameData }, date: [getMonth, getDay] });
  return gameData;
}
