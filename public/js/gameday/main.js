async function getCurrentPitch() {
  const currentPitch = await document.querySelector(".currentPitchZone");
  const rawZoneItems = document.querySelectorAll(".batZone");
  console.log(rawZoneItems);
  let zoneItems = [...rawZoneItems];
  zoneItems = zoneItems.filter(
    (a) => Number(a.id) === Number(currentPitch.innerHTML)
  );
  console.log(zoneItems);
  zoneItems.forEach((a) => a.classList.add("pitchIndicator"));
  console.log(currentPitch.innerHTML);
  // rawZoneItems.forEach((a) => (a.innerHTML = ""));
}
getCurrentPitch();
