"use client";

import { useEffect, useState } from "react";

export function FacultyWishes({ wishes }: { wishes: string[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (
      wishes.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % wishes.length),
      6800,
    );
    return () => window.clearInterval(timer);
  }, [wishes]);
  return (
    <div className="faculty-wishes">
      <p className="faculty-wishes-eyebrow">
        20 · 10 <span>✦</span> GỬI TRỌN LÒNG TRI ÂN
      </p>
      <p className="faculty-wishes-line" key={index}>
        {wishes[index]}
      </p>
      <span className="faculty-wishes-dedication">
        Kính tặng các Cô · Khoa Tin học và Ngoại ngữ
      </span>
    </div>
  );
}
