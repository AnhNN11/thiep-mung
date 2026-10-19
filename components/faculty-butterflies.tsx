import type { CSSProperties } from "react";

// Deterministic paths keep the server and client markup identical.
const flights = Array.from({ length: 18 }, (_, i) => {
  const startX = 5 + ((i * 23) % 89);
  const drift = (i % 2 ? -1 : 1) * (10 + (i % 4) * 5);
  const startY = 83 + ((i * 11) % 30);
  return {
    "--butterfly-x0": `${startX}vw`,
    "--butterfly-y0": `${startY}vh`,
    "--butterfly-x1": `${startX + drift}vw`,
    "--butterfly-y1": `${startY - 24}vh`,
    "--butterfly-x2": `${startX - drift * 0.45}vw`,
    "--butterfly-y2": `${startY - 48}vh`,
    "--butterfly-x3": `${startX + drift * 0.7}vw`,
    "--butterfly-y3": `${startY - 76}vh`,
    "--butterfly-x4": `${startX - drift * 0.2}vw`,
    "--butterfly-y4": "-12vh",
    "--butterfly-duration": `${15 + (i % 6) * 2.2}s`,
    "--butterfly-delay": `${-i * 1.71 - 3}s`,
    "--butterfly-size": `${27 + ((i * 7) % 27)}px`,
    "--wing-duration": `${0.65 + (i % 5) * 0.13}s`,
    "--butterfly-turn": `${i % 2 ? -18 : 18}deg`,
  } as CSSProperties;
});

export function FacultyButterflies() {
  return (
    <div className="faculty-butterflies" aria-hidden="true">
      {flights.map((style, i) => (
        <span
          className={`faculty-butterfly butterfly-tone-${i % 3}`}
          style={style}
          key={i}
        >
          <span className="faculty-butterfly-sway">
            <img
              className="faculty-butterfly-wings"
              src="/dlove/bouquet/butterfly.webp"
              alt=""
              draggable={false}
            />
          </span>
        </span>
      ))}
    </div>
  );
}
