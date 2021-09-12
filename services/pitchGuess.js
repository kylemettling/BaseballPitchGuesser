module.exports = async function pitchGuess(
  sequence,
  pitchZone,
  userGuesses,
  name,
  matchupId
) {
  const correctGuess =
    userGuesses.pitchGuess === pitchZone &&
    userGuesses.sequencenumber === sequence
      ? true
      : false;
  console.log(userGuesses.pitchGuess, pitchZone);
  const currentGuess =
    userGuesses.sequencenumber === sequence && userGuesses.gameid === matchupId
      ? JSON.stringify(userGuesses)
      : [];
  const guessResult = !currentGuess.length ? "" : currentGuess[0].pitchGuess;
  const result = !correctGuess
    ? `Not this time ${name}, your selection ${userGuesses.pitchGuess} was not correct!`
    : `Wow!! Well done, ${name}! Correct Guess of ${userGuesses.pitchGuess}!`;
  // console.log(`result ${result}`);
  return result;
};
