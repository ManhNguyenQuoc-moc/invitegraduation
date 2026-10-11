import React, { useState, useEffect } from "react";

interface ITimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC<{ targetDateString?: string }> = ({
  targetDateString = "2026-10-23T11:00:00+07:00"
}) => {
  const [timeLeft, setTimeLeft] = useState<ITimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date(targetDateString).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDateString]);

  const units = [
    { label: "Ngày", val: timeLeft.days },
    { label: "Giờ", val: timeLeft.hours },
    { label: "Phút", val: timeLeft.minutes },
    { label: "Giây", val: timeLeft.seconds }
  ];

  return (
    <div className="space-y-2 pt-1 w-full text-center sm:text-left">
      <div className="flex items-center justify-center sm:justify-start">
        <p className="text-[11px] uppercase font-bold tracking-wider text-sky-200">
          Đếm Ngược Tới Khoảnh Khắc Trao Bằng (23.10.2026)
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
        {units.map((unit, i) => (
          <div
            key={i}
            className="bg-white/5 backdrop-blur-md rounded-2xl py-3 px-2 text-center border border-white/10 hover:border-sky-300/60 hover:bg-white/10 hover:scale-105 hover:-translate-y-1 hover:shadow-sky-500/20 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer group"
          >
            <span className="font-serif font-bold text-2xl sm:text-3xl bg-gradient-to-r from-white via-sky-100 to-slate-200 bg-clip-text text-transparent block group-hover:from-sky-100 group-hover:to-cyan-200 transition-all">
              {String(unit.val).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase font-bold text-sky-300/80 tracking-wider mt-0.5 block group-hover:text-sky-200 transition-colors">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
