import { addDays, nextDay, set, isPast } from 'date-fns';
import type { Day } from 'date-fns';

const dayMap: { [key: string]: number } = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6
};

export const parseTournamentStartTime = (startTimeStr: string): Date | null => {
  try {
    const now = new Date();
    const parts = startTimeStr.split(', ');
    if (parts.length !== 2) return null;

    const datePart = parts[0].toLowerCase();
    const timePart = parts[1].replace(/ (EST|EDT)$/, ''); // Remove timezone for parsing

    const timeMatch = timePart.match(/(\d{1,2}):(\d{2}) (AM|PM)/);
    if (!timeMatch) return null;

    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const ampm = timeMatch[3];

    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0; // Midnight case

    let targetDate = new Date();

    if (datePart === 'today') {
      // Base date is today
    } else if (datePart === 'tomorrow') {
      targetDate = addDays(now, 1);
    } else if (dayMap[datePart] !== undefined) {
      const dayIndex = dayMap[datePart];
      // If it's the same day of the week, check if time has passed
      if (now.getDay() === dayIndex) {
        const potentialTodayDate = set(now, { hours, minutes, seconds: 0, milliseconds: 0 });
        if (isPast(potentialTodayDate)) {
          targetDate = nextDay(now, dayIndex as Day); // It's next week
        }
      } else {
        targetDate = nextDay(now, dayIndex as Day);
      }
    } else {
      return null;
    }
    
    return set(targetDate, { hours, minutes, seconds: 0, milliseconds: 0 });

  } catch (e) {
    console.error(`Error parsing date string: "${startTimeStr}"`, e);
    return null;
  }
};
