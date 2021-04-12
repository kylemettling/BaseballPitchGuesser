class BoxScore {
  constructor(data) {
    this.data = data;
    this.home = data.home;
    this.away = data.away;
    this.home.runsCount = data.home.runs;
    this.home.hitsCount = data.home.runs;
    this.home.errorsCount = data.home.runs;
    this.home.abbr = data.home.abbr;
    this.away.runsCount = data.away.runs;
    this.away.hitsCount = data.away.runs;
    this.away.errorsCount = data.away.runs;
    this.away.abbr = data.away.abbr;
    this.generateBoxscore();
  }
  generateBoxscore() {
    const { runs: hRuns, hHits, hErrors } = this.home;
    const { runs: aRuns, aHits, aErrors } = this.away;
    console.log(hRuns, aRuns);
    // console.log([this.home, this.away]);
  }
  getVenueDetails() {
    return `${this.data.venue.name} in ${this.data.venue.city} ${this.data.venue.state}`;
  }
}

module.exports = BoxScore;
