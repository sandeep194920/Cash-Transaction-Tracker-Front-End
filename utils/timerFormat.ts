// Function to format the time in Minutes:Seconds
export const formatTime = (secondsRemaining: number) => {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  // Return formatted time as MM:SS, adding leading zero for seconds if needed
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
