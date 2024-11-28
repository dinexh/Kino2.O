'use client'
import { useState, useEffect } from 'react'
import FilmBackground from '../../components/Background/FilmBackground'
import './counter.css'

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const targetDate = new Date('2024-01-04T00:00:00').getTime();
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

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-container">
      <FilmBackground />
      <div className="countdown-content">
        <h2>EVENT <span>STARTS</span> IN</h2>
        <div className="timer-wrapper">
          <div className="time-section">
            <div className="time">{timeLeft.days}</div>
            <div className="label">DAYS</div>
          </div>
          <div className="time-section">
            <div className="time">{timeLeft.hours}</div>
            <div className="label">HOURS</div>
          </div>
          <div className="time-section">
            <div className="time">{timeLeft.minutes}</div>
            <div className="label">MINUTES</div>
          </div>
          <div className="time-section">
            <div className="time">{timeLeft.seconds}</div>
            <div className="label">SECONDS</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
