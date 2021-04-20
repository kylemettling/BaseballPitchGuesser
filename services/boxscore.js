const { json } = require("express");

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
    // this.currentInning = this.data.innings.length - 1;
    // this.inningInfo = JSON.stringify(
    //   this.data.innings[this.currentInning].halfs.length
    // );
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

  getInningHalf() {
    // console.log(this.currentInning.events[]);
    JSON.stringify(this.currentInning.events);
  }

  getCurrentInning() {
    this.currentInningNumber = this.data.innings.length - 1;
    this.currentInningInfo = this.data.innings[this.currentInningNumber];
    this.bottomOrTop = () => {
      return JSON.stringify(this.currentInningInfo.halfs[1].events) === []
        ? "Top"
        : "Bot";
    };
    this.halfInfo = this.currentInning;
    //   const currentInning = this.innings.length - 1;
    //   console.log(currentInning);
    // let currentHalf = this.inningInfo[this.currentInning];
    // console.log(currentHalf[1]);
    //   currentHalf[1].events === []
    //     ? (currentHalf = "Top")
    //     : (currentHalf = "Bot");
    //   const ending = "th";
    return `${this.bottomOrTop()} of inning ${this.currentInningNumber}  ${
      JSON.stringify(this.currentInningInfo.halfs[1].events) === []
    }`;
  }
}

module.exports = BoxScore;
