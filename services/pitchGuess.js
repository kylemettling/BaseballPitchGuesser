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
      ? true
      : false;
  // const currentGuess = userGuesses.filter(
  //   (item) => item.sequencenumber === sequence && item.gameid === matchupId
  // );
  console.log(userGuesses.pitchGuess, pitchZone);
  const currentGuess =
    userGuesses.sequencenumber === sequence && userGuesses.gameid === matchupId
      ? JSON.stringify(userGuesses)
      : [];
  // console.log(
  //   `zone: ${pitchZone}userGuesses${JSON.stringify(
  //     userGuesses
  //   )}, currentGuess${currentGuess}, correctGuess${correctGuess}`
  // );
  // console.log(userGuesses, correctGuess, currentGuess, sequence);
  // console.log(currentGuess, correctGuess);
  const guessResult = !currentGuess.length ? "" : currentGuess[0].pitchGuess;
  const result = !correctGuess
    ? `Not this time ${name}, your selection ${userGuesses.pitchGuess} was not correct!`
    : `Wow!! Well done, ${name}! Correct Guess of ${userGuesses.pitchGuess}!`;
  // console.log(`result ${result}`);
  return result;
};
