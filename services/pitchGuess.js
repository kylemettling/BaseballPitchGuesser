module.exports = async function pitchGuess(
  sequence,
  pitchZone,
  userGuesses,
  name
) {
  const correctGuess = userGuesses.filter(
    (item) => item.pitchGuess === pitchZone && item.sequencenumber === sequence
  );
  const currentGuess = userGuesses.filter(
    (item) => item.sequencenumber === sequence
  )[0].pitchGuess;
  const result = !correctGuess.length
    ? `Not this time ${name}, your selection of ${
        currentGuess || ""
      } missed the location!`
    : `Wow!! Well done, ${name}! Correct Guess!`;
  return result;
};
