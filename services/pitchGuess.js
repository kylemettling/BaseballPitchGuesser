module.exports = function pitchGuess(sequenceNumber, pitchZone, userGuesses) {
  //   console.log(userGuesses);
  console.log(
    userGuesses.filter((item) => item.sequenceNumber === sequenceNumber)
  );
  return sequenceNumber, pitchZone, userGuesses;
};
