module.exports = async function pitchGuess(
  sequence,
  pitchZone,
  userGuesses,
  name
) {
  const currentGuess = userGuesses.filter(
    (item) => item.pitchGuess === pitchZone && item.sequencenumber === sequence
  );
  const result = !currentGuess.length
    ? `Not this time ${name}, you missed the location!`
    : `Woo!! Well placed, ${name}! Correct Zone :)`;
  return result;
};
