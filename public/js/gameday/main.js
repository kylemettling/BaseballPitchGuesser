const batZoneItems = document.querySelectorAll(".batZone");

batZoneItems.forEach((item) =>
  item.addEventListener("click", submitZoneChoice)
);
function submitZoneChoice(e) {
  const { sequencenumber } = document.querySelector(".pitchNumber").dataset;
  const { gameid } = document.querySelector(".boxCon").dataset;
  // console.log(sequencenumber, gameid);
  const testing = "TESTING";
  const pitchGuess = e.target.id;
  try {
    fetch(`${window.location.href}`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        pitchGuess: parseInt(pitchGuess),
        sequencenumber: parseInt(sequencenumber),
        gameid,
      }),
    }).then(window.location.reload());
  } catch (err) {
    console.log(err);
  }
}

async function getCurrentPitch() {
  let currentPitch = document.querySelector(".currentPitchZone");
  currentPitch = currentPitch.innerHTML.split(" ");
  currentPitch = currentPitch[currentPitch.length - 1];
  console.log(currentPitch);
  const rawZoneItems = document.querySelectorAll(".batZone");
  let zoneItems = [...rawZoneItems];
  zoneItems = zoneItems.filter((a) => Number(a.id) === Number(currentPitch));
  zoneItems.forEach((a) => a.classList.add("pitchIndicator"));
}
getCurrentPitch();
