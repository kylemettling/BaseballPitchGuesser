class BoxScore {
  constructor(data) {
    this.data = data;
    this.home = data.scoring.home;
    this.home.name = data.scoring.home.name;
    this.away = data.scoring.away;
    this.home.runsCount = data.scoring.home.runs;
    this.home.hitsCount = data.scoring.home.hits;
    this.home.errorsCount = data.scoring.home.errors;
    this.home.abbr = data.scoring.home.abbr;
    this.away.runsCount = data.scoring.away.runs;
    this.away.hitsCount = data.scoring.away.hits;
    this.away.errorsCount = data.scoring.away.errors;
    this.away.abbr = data.scoring.away.abbr;
    this.homeBox = [
      this.home.abbr,
      this.home.runsCount,
      this.home.hitsCount,
      this.home.errorsCount,
    ];
    this.innings = this.data.innings;
    this.halfs = this.data.innings[0].halfs[0];
    this.lengthOfInnings = this.data.innings.length;
    this.currentInning = this.data.innings[4].halfs[0].events;
    this.hitter = this.currentInning[
      this.currentInning.length - 1
    ].at_bat.hitter;
    this.pitcherDetails = this.currentInning[
      this.currentInning.length - 1
    ].at_bat.pitcher;
    // this.getHalfs();
  }
  generateHomeBox() {
    const homeTeam = this.home;
    const boxItems = {
      abbr: homeTeam.abbr,
      runs: homeTeam.runs,
      hits: homeTeam.hits,
      errors: homeTeam.errors,
    };
    return boxItems;
  }
  generateAwayBox() {
    const awayTeam = this.away;
    const boxItems = {
      abbr: awayTeam.abbr,
      runs: awayTeam.runs,
      hits: awayTeam.hits,
      errors: awayTeam.errors,
    };
    return boxItems;
  }

  getVenueDetails() {
    return `${this.data.venue.name} in ${this.data.venue.city} ${this.data.venue.state}`;
  }

  getHalfs() {
    console.log(this.data.innings[2].halfs[1].events[0].at_bat.events);
  }

  getCurrentInning() {
    const currentInning = this.innings.length - 1;
    console.log(currentInning);
    let currentHalf = JSON.stringify(
      this.innings[this.innings.length - 1].halfs
    );
    console.log(currentHalf[1].events);
    currentHalf[1].events === []
      ? (currentHalf = "Top")
      : (currentHalf = "Bot");
    const ending = "th";
    // currentHalf === "T" ? (currentHalf = "Top") : (currentHalf = "Bot");
    // return `Current Inning: ${currentHalf} of the ${currentInning}`;
    // let ending =
    return `${currentHalf} ${currentInning}${ending}`;
  }
}

module.exports = BoxScore;
