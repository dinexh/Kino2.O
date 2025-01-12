'use client'
import { useState, useEffect } from 'react'
import './counter.css'
import '../../moblie.css';
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const calculateTimeLeft = () => {
    const currentYear = new Date().getFullYear();
    const targetDate = new Date(`${currentYear}-02-10T00:00:00`).getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    };
  };

  useEffect(() => {
    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft());
    };

    updateTimer(); // Initial call to set the time left immediately
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-container">
      <div className="countdown-container-in">
        <h2>EVENT <span>STARTS</span> IN</h2>
        <div className="timer">
          <div className="time-in">
            <div className="time">{timeLeft.days}</div>
            <div className="label">DAYS</div>
          </div>
          <div className="time-in">
            <div className="time">{timeLeft.hours}</div>
            <div className="label">HOURS</div>
          </div>
          <div className="time-in">
            <div className="time">{timeLeft.minutes}</div>
            <div className="label">MINUTES</div>
          </div>
          <div className="time-in">
            <div className="time">{timeLeft.seconds}</div>
            <div className="label">SECONDS</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
