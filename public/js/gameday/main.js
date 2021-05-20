async function getCurrentPitch() {
  const currentPitch = await document.querySelector(".currentPitchZone");
  const rawZoneItems = document.querySelectorAll(".batZone");
  let zoneItems = Array.from(rawZoneItems);
  //   console.log(items);
  zoneItems = zoneItems.filter((a) => a.id === currentPitch.innerHTML);

  zoneItems.forEach((a) => a.classList.add("pitchIndicator"));
  console.log(currentPitch.innerHTML);
}
getCurrentPitch();
