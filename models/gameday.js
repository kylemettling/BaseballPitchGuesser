class GamedayDetails {
  constructor(inputData) {
    this.gameId = inputData.id;
    this.scheduled = Date(inputData.scheduled).split(" ").slice(1, 5).join(" ");
    this.venue = `${inputData.venue.name} in ${inputData.venue.market  || inputData.venue.city}, ${inputData.venue.state}`;
    this.home = inputData.home.name;
    this.away = inputData.away.name;
    this.title = `${this.away} @ ${this.home}`;
  }
  //   matchup() {
  //     return `${this.away} @ ${this.home}`;
  //   }
}

module.exports = GamedayDetails;
