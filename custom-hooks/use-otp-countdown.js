import { useState, useEffect } from 'react';

const useOtpCountdown = (initialDurationSeconds) => {
  const [seconds, setSeconds] = useState(initialDurationSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRunning, seconds]);

  const stopCountdown = () => {
    setIsRunning(false);
  };

  const resetCountdown = () => {
    setSeconds(initialDurationSeconds);
    setIsRunning(true);
  };

  return { seconds, isRunning, stopCountdown, resetCountdown };
};

export default useOtpCountdown;
