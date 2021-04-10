const GameList = require("../models/GameList");
const fetch = require("node-fetch");
const SCHEDULE_ENDPOINT = require("../config/endpoints");
module.exports = {
  getGameList: async (req, res) => {
    try {
      //   const gameList = await GameList.find();
      await fetch(SCHEDULE_ENDPOINT)
        .then((res) => res.json())
        .then((body) => {
          gameData = body.games;
          getGameLinks();
          res.render("games.ejs", {
            info: returnGameSchedule(body),
            gameLinks: getGameLinks(gameData),
          });
        });
      console.log(gameList);
    } catch (err) {
      console.log(err);
    }
  },
};
