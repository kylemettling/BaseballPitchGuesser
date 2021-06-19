module.exports = async function pitchGuess(
  sequence,
  pitchZone,
  userGuesses,
  name,
  matchupId
) {
  // const correctGuess = userGuesses.filter(
  //   (item) => item.pitchGuess === pitchZone && item.sequencenumber === sequence
  // );
  const correctGuess =
    userGuesses.pitchGuess === pitchZone &&
    userGuesses.sequencenumber === sequence
      ? userGuesses
      : [];
  // const currentGuess = userGuesses.filter(
  //   (item) => item.sequencenumber === sequence && item.gameid === matchupId
  // );
  const currentGuess =
    userGuesses.sequencenumber === sequence && userGuesses.gameid === matchupId
      ? userGuesses
      : [];
  // console.log(userGuesses, correctGuess, currentGuess, sequence);
  console.log(currentGuess, correctGuess);
  const guessResult = !currentGuess.length ? "" : currentGuess[0].pitchGuess;
  const result =
    correctGuess === []
      ? `Not this time ${name}, your selection ${guessResult} was not correct!`
      : `Wow!! Well done, ${name}! Correct Guess!`;
  console.log(`result ${result}`);
  return result;
};
