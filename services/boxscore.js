class BoxScore {
  constructor(data) {
    this.data = data;
    this.home = data.scoring.home;
    this.away = data.scoring.away;
    this.home.runsCount = data.scoring.home.runs;
    this.home.hitsCount = data.scoring.home.hits;
    this.home.errorsCount = data.scoring.home.errors;
    this.home.abbr = data.scoring.home.abbr;
    this.away.runsCount = data.scoring.away.runs;
    this.away.hitsCount = data.scoring.away.hits;
    this.away.errorsCount = data.scoring.away.errors;
    this.away.abbr = data.scoring.away.abbr;
    // this.generateBoxscore();
  }
  generateBoxscore() {
    const teams = [this.home, this.away];
    // console.log(teams);
    const boxItems = {};
    teams.forEach((a, b) => {
      boxItems[teams[b].abbr] = {
        runs: a.runs,
        hits: a.hits,
        errors: a.errors,
      };
    });
    console.log(boxItems);
    return boxItems;
  }

  getVenueDetails() {
    return `${this.data.venue.name} in ${this.data.venue.city} ${this.data.venue.state}`;
  }
}

module.exports = BoxScore;
