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
    this.currentInningNumber = this.data.innings.length - 1;
    this.currentInningInfo = this.data.innings[this.currentInningNumber];
    this.currentInningHalf = Number;
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
    return `${this.data.venue.name} in ${this.data.venue.city}, ${this.data.venue.state}`;
  }

  getCurrentInning() {
    this.bottomOrTop = () => {
      return JSON.stringify(this.currentInningInfo.halfs[1].events) ===
        JSON.stringify([])
        ? "Top"
        : "Bot";
    };
    this.halfInfo = this.currentInning;
    return `${this.bottomOrTop()} of inning ${this.currentInningNumber}`;
  }

  getInningHalf() {
    this.currentInningHalf =
      JSON.stringify(this.currentInningInfo.halfs[1].events) ===
      JSON.stringify([])
        ? 0
        : 1;
  }

  getCurrentAtBat() {
    this.getInningHalf();
    const currentInfo = this.currentInningInfo.halfs[this.currentInningHalf];
    const currentAtBat = currentInfo.events.length - 1;
    return currentInfo.events[currentAtBat].at_bat;
    // const { preferred_name, last_name } = currentInfo.events[
    //   currentAtBat - 1
    // ].at_bat.hitter;
    // return JSON.stringify(currentInfo.events[currentAtBat - 1]);
  }
  getCurrentPitcher() {
    const { preferred_name, last_name } = this.getCurrentAtBat().pitcher;
    return `${preferred_name} ${last_name}`;
  }

  getCurrentBatter() {
    const { preferred_name, last_name } = this.getCurrentAtBat().hitter;
    return `${preferred_name} ${last_name}`;
  }
  getAtBatDetails() {
    return Object.keys(this.currentInningInfo.halfs[1].events);
  }
  getCurrentCount() {
    const atBatLength = this.getCurrentAtBat().events.length - 1;
    const { balls, strikes, outs } = !this.getCurrentAtBat().events[atBatLength]
      ? { balls: 0, strikes: 0, outs: this.getCurrentOuts() }
      : this.getCurrentAtBat().events[atBatLength].count;
    return `balls: ${balls}, strikes: ${strikes}, outs: ${outs}`;
  }
  getPitcherStats() {
    const atBatLength = this.getCurrentAtBat().events.length - 1;
    const { speed, zone, code, description } = !this.getCurrentAtBat().events[
      atBatLength
    ]
      ? { speed: 0, zone: "N/A", code: "N/A", description: "No Pitch Data" }
      : this.getCurrentAtBat().events[atBatLength].mlb_pitch_data;
    return `speed: ${speed}, zone: ${zone}, code: ${code}, description: ${description}`;
  }

  getCurrentOuts() {
    const currentInfo = this.currentInningInfo.halfs[this.currentInningHalf];
    const previousAtBat = currentInfo.events.length - 2;
    const previousAtBatLength =
      currentInfo.events[previousAtBat].at_bat.events.length - 1;
    const { outs } = currentInfo.events[previousAtBat].at_bat.events[
      previousAtBatLength
    ].count;
    return outs;
  }
}

module.exports = BoxScore;
