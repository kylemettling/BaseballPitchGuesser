const fetch = require("node-fetch");
const cheerio = require("cheerio");
const pretty = require("pretty");
const { html } = require("cheerio/lib/api/manipulation");
const { each } = require("cheerio/lib/api/traversing");

class BoxScore {
  constructor(data) {
    this.data = data;
    this.gameId = data.id;
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
    this.getPlayerImages = async () => {
      const players = [
        { name: this.getCurrentBatter().split(" ") },
        { name: this.getCurrentPitcher().split(" ") },
      ];
      function encodeName(name) {
        console.log("INSIDE", name);
        const [first, last] = [name[0], name[1]];
        console.log(first, last);
        let lastFive = "";
        let firstTwo = "";
        for (let i = 0; i < 5; i++) {
          if (i < 2) {
            firstTwo += first[i].toLowerCase();
          }
          console.log(last[i].toLowerCase(), last[i]);
          lastFive.concat(last[i].toLowerCase() ? last[i].toLowerCase() : "");
        }

        return lastFive + firstTwo;
      }
      const images = [];
      for (let player of players) {
        const decodedName = encodeName(player.name);
        const firstLetter = decodedName[0].toLowerCase();
        console.log("DECODE", decodedName);
        const response = await fetch(
          `https://www.baseball-reference.com/players/${firstLetter}/${decodedName}01.shtml`
        );

        console.log(
          `https://www.baseball-reference.com/players/${firstLetter}/${decodedName}01.shtml`
        );
        const body = await response.text();

        const $ = cheerio.load(body);

        images.push($("img")[1].attribs.src);
      }
      return images;
    };
    this.homeBox = [
      this.home.abbr,
      this.home.runsCount,
      this.home.hitsCount,
      this.home.errorsCount,
    ];
    this.currentInningNumber = this.data.innings.length - 1;
    this.currentInningInfo = this.data.innings[this.currentInningNumber];
    this.currentInningHalf = Number;
    this.bottomOrTop = () => {
      return JSON.stringify(this.currentInningInfo.halfs[1].events) ===
        JSON.stringify([])
        ? "Top"
        : "Bot";
    };
    this.currentPitchNumber = !this.getCurrentAtBat().events[
      this.getCurrentAtBat().events.length - 1
    ]
      ? 0
      : this.getCurrentAtBat().events[this.getCurrentAtBat().events.length - 1]
          .sequence_number;
    this.currentPitchZone = !this.getCurrentAtBat().events[
      this.getCurrentAtBat().events.length - 1
    ]
      ? null
      : this.getCurrentAtBat().events[this.getCurrentAtBat().events.length - 1]
          .mlb_pitch_data.zone;
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
      ? { balls: 0, strikes: 0, outs: () => this.getCurrentOuts() || 0 }
      : this.getCurrentAtBat().events[atBatLength].count;
    return `${balls} - ${strikes}, ${outs} ${outs === 1 ? "out" : "outs"}`;
  }
  getPitcherStats() {
    const atBatLength = this.getCurrentAtBat().events.length - 1;
    const { speed, zone, code, description } = !this.getCurrentAtBat().events[
      atBatLength
    ]
      ? { speed: 0, zone: "N/A", code: "N/A", description: "No Pitch Data" }
      : this.getCurrentAtBat().events[atBatLength].mlb_pitch_data;
    // return `speed: ${speed}, zone: ${zone}, code: ${code}, description: ${description}`;
    return `${description} ${Math.round(speed)} mph`;
  }

  getCurrentOuts() {
    const previousBatter = this.getPreviousAtBat();
    const previousAtBatLength = previousBatter.length - 2;
    const { outs } = previousBatter
      ? previousBatter.events[previousAtBatLength].count
      : 0;
    return outs;
  }
  getPreviousAtBat() {
    const currentInfo = this.currentInningInfo.halfs[this.currentInningHalf];
    const previousAtBat = currentInfo.events.length - 2;
    const previousAtBatLength =
      currentInfo.events[previousAtBat].at_bat.events.length - 1;
    return !currentInfo.events[previousAtBat]
      ? `Top of the Inning`
      : currentInfo.events[previousAtBat].at_bat;
  }
  getPreviousAtBatResult() {
    const previousBatter = this.getPreviousAtBat() || "Top of the inning";
    const previousBatterLastInning = this.getCurrentInning();
    const previousAtBatLength = previousBatter.length - 2;
    return !previousBatter ? "Top of the inning" : previousBatter.description;
  }
  getCurrentPitchDetails() {
    const atBatLength = this.getCurrentAtBat().events.length - 1;
    const { zone } = !this.getCurrentAtBat().events[atBatLength]
      ? "no pitch"
      : this.getCurrentAtBat().events[atBatLength].mlb_pitch_data;
    return zone;
  }
}

module.exports = BoxScore;
