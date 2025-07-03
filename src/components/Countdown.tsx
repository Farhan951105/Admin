import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface CountdownProps {
  targetDate: Date;
  status: string;
  lateRegEndDate?: Date | null;
}

const Countdown = ({ targetDate, status, lateRegEndDate }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      let target = targetDate;

      // If tournament is active and we have a late registration end date, show that instead
      if (status === 'upcoming' && lateRegEndDate && now < lateRegEndDate) {
        target = lateRegEndDate;
      }

      if (now >= target) {
        setTimeLeft('Started');
      } else {
        setTimeLeft(formatDistanceToNow(target, { addSuffix: true }));
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate, status, lateRegEndDate]);

  return <span>{timeLeft}</span>;
};

export default Countdown;
