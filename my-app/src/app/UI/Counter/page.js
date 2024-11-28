'use client'
import { useState, useEffect } from 'react'
import './counter.css'

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 56,
    hours: 3,
    minutes: 12,
    seconds: 57
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = { ...prevTime };
        
        if (newTime.seconds > 0) {
          newTime.seconds--;
        } else {
          newTime.seconds = 59;
          if (newTime.minutes > 0) {
            newTime.minutes--;
          } else {
            newTime.minutes = 59;
            if (newTime.hours > 0) {
              newTime.hours--;
            } else {
              newTime.hours = 23;
              if (newTime.days > 0) {
                newTime.days--;
              }
            }
          }
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-container">
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
  );
};

export default CountdownTimer;
