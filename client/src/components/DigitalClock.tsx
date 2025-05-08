import { useState, useEffect } from "react";

const DigitalClock = () => {
  const [time, setTime] = useState<string>("00:00");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    };

    // Update the clock immediately
    updateClock();

    // Update the clock every minute
    const interval = setInterval(updateClock, 60000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-1 bg-primary rounded-lg shadow-md">
      <div id="digital-clock" className="text-white font-mono font-bold text-2xl px-3 py-1">
        {time}
      </div>
    </div>
  );
};

export default DigitalClock;
