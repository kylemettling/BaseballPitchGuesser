class BoxScore {
  constructor(data) {
    this.home = data.home;
    this.away = data.away;
    this.homeRunsCount = data.home.runs;
    this.homeHitsCount = data.home.runs;
    this.homeErrorsCount = data.home.runs;
    this.awayRunsCount = data.away.runs;
    this.awayHitsCount = data.away.runs;
    this.awayErrorsCount = data.away.runs;
  }
}

module.exports = BoxScore;
