const mongoose = require("mongoose");

const GameListSchema = new mongoose.Schema({
  games: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("GameList", GameListSchema);
