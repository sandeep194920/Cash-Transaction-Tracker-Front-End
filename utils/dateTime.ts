// Function to format the time in Minutes:Seconds
export const formatTime = (secondsRemaining: number) => {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  // Return formatted time as MM:SS, adding leading zero for seconds if needed
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

type DayT = "short" | "long";

type FormattedDate = {
  date: string;
  day: string;
};

export const formatDate = (
  dateInput: Date | string,
  dayType: DayT = "long"
): FormattedDate => {
  // If dateInput is not a Date object, create a Date object from it
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);

  const dayOptions: Intl.DateTimeFormatOptions = { weekday: dayType };
  const day = date.toLocaleDateString("en-US", dayOptions);

  return {
    date: formattedDate,
    day: day,
  };
};

export const formattedDateStr = (date: Date | string) => {
  const long = formatDate(date, "long");
  const short = formatDate(date, "short");
  return {
    dateLong: `${long.day}, ${long.date}`,
    dateShort: `${short.day}, ${short.date}`,
  };
};

// Example usage:
// const formatted = formatDate(new Date());
// console.log(formatted);
// Output example:
// { date: 'July 6, 2024', day: 'Saturday' }
