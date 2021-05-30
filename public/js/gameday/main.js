// const { default: fetch } = require("node-fetch");

const batZoneItems = document.querySelectorAll(".batZone");

batZoneItems.forEach((item) =>
  item.addEventListener("click", submitZoneChoice)
);
// const { sequencenumber } = document.querySelector(".pitchNumber").dataset;
// const { gameid } = document.querySelector(".boxCon").dataset;
// console.log(sequencenumber, gameid);
function submitZoneChoice(e) {
  const { sequencenumber } = document.querySelector(".pitchNumber").dataset;
  const { gameid } = document.querySelector(".boxCon").dataset;
  // console.log(sequencenumber, gameid);
  const testing = "TESTING";
  const pitchGuess = e.target.id;
  fetch(`${window.location.href}`, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ pitchGuess, sequencenumber, gameid }),
  }).then(window.location.reload());
}

async function getCurrentPitch() {
  const currentPitch = await document.querySelector(".currentPitchZone");
  const rawZoneItems = document.querySelectorAll(".batZone");
  let zoneItems = [...rawZoneItems];
  zoneItems = zoneItems.filter(
    (a) => Number(a.id) === Number(currentPitch.innerHTML)
  );
  zoneItems.forEach((a) => a.classList.add("pitchIndicator"));
}
getCurrentPitch();
