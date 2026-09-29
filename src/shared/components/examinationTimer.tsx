import { useEffect, useState } from "react";
interface TimerProps {
  duration: number;
}
const ExaminationTimer = ({ duration }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);
  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  return (
    <>
      <div className="container-fluid g-0">
        <div className="fw-semibold stat-card-value">
            {String(hours).padStart(2, "0")}hr :{String(minutes).padStart(2, "0")}min:{String(seconds).padStart(2, "0")}s
        </div>
      </div>
    </>
  );
};

export default ExaminationTimer;
