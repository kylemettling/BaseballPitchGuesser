const mongoose = require("mongoose");

const PitchGuessSchema = new mongoose.Schema({
  zone: Number,
  sequenceNumber: Number,
  gameId: String,
});

module.exports = mongoose.model("PitchGuess", PitchGuessSchema);
