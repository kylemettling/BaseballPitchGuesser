const mongoose = require("mongoose");

const PitchGuessSchema = new mongoose.Schema({
  zone: Number,
  sequenceNumber: Number,
  gameId: String,
  // id: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model("PitchGuess", PitchGuessSchema);
