import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update every sec

    return () => clearInterval(interval);
  }, []);

  const formattedTime = format(time, 'hh:mm a');

  return {formattedTime}
};

export default Clock;
