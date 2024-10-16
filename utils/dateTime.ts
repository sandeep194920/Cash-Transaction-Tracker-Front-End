// Function to format the time in Minutes:Seconds
export const formatTime = (secondsRemaining: number) => {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  // Return formatted time as MM:SS, adding leading zero for seconds if needed
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

type FormattedDate = {
  date: string;
  day: string;
};

const formatDate = (
  dateInput: Date | string,
  dayType: "short" | "long" = "long"
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

// const { day, date } = formatDate(item.transactionDate);
// const dayShort = formatDate(item.transactionDate, "short").day;
// const formattedDate = `${day}, ${date}`;
// const formattedShortDate = `${dayShort}, ${date}`;

type FormattedDateT = {
  date: Date | string;
  type?: "short" | "long";
};

export const formattedDate = ({ date, type = "long" }: FormattedDateT) => {
  return type === "long" ? formatDate(date, "long") : formatDate(date, "short");
};

// Example usage:
// const formatted = formatDate(new Date());
// console.log(formatted);
// Output example:
// { date: 'July 6, 2024', day: 'Saturday' }
