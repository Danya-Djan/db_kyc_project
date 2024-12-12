export function secondsToHMS(seconds) {
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const remainingSecondsAfterMinutes = remainingSeconds % 60;
  const remainingSecondsRounded = Math.round(remainingSecondsAfterMinutes); 

  return [hours, minutes, remainingSecondsRounded];
}
