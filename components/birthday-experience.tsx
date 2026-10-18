"use client";
import { useEffect, useRef, useState } from "react";
import type { Gift } from "@/lib/templates";
import { SceneControls, useGiftAudio } from "./source-shared";
export function BirthdayExperience({
  gift,
  embedded = false,
}: {
  gift: Gift;
  embedded?: boolean;
}) {
  const [running, setRunning] = useState(false),
    [finished, setFinished] = useState(false),
    [iteration, setIteration] = useState(0);
  const canvas = useRef<HTMLCanvasElement>(null);
  const sound = useGiftAudio(gift, 0.6);
  useEffect(() => {
    if (!running) return;
    const c = canvas.current!,
      ctx = c.getContext("2d")!;
    let w = 0,
      h = 0,
      frame = 0,
      started = performance.now(),
      lastMatrix = 0;
    let drops: number[] = [],
      targets: { x: number; y: number }[] = [],
      particles: { x: number; y: number; tx: number; ty: number }[] = [];
    let lastWord = "";
    const mobile = c.clientWidth < 700,
      step = mobile ? 4 : 8;
    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * devicePixelRatio;
      c.height = h * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      drops = Array.from(
        { length: Math.ceil(w / (mobile ? 13 : 25)) },
        () => -Math.random() * 50,
      );
    };
    const observer = new ResizeObserver(resize);
    observer.observe(c);
    resize();
    const words = ["3", "2", "1", "HAPPY", "BIRTHDAY", "TO", "YOU", "❤"];
    function makeWord(word: string) {
      const scratch = document.createElement("canvas");
      scratch.width = Math.ceil(w);
      scratch.height = Math.ceil(h);
      const x = scratch.getContext("2d")!;
      x.fillStyle = "white";
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.font = `bold ${Math.min(h * 0.34, w / (word.length * 0.7))}px Arial`;
      x.fillText(word, w / 2, h / 2);
      const pixels = x.getImageData(0, 0, w, h).data;
      targets = [];
      for (let y = 0; y < h; y += step)
        for (let xx = 0; xx < w; xx += step)
          if (pixels[(y * w + xx) * 4 + 3] > 128) targets.push({ x: xx, y });
      particles = targets.map((p, i) => ({
        x: particles[i]?.x ?? Math.random() * w,
        y: particles[i]?.y ?? Math.random() * h,
        tx: p.x,
        ty: p.y,
      }));
    }
    function draw(now: number) {
      const age = now - started,
        index =
          age < 4200
            ? Math.floor(age / 1400)
            : 3 + Math.floor((age - 4200) / 1900);
      if (index >= words.length) {
        setFinished(true);
        return;
      }
      const word = words[index];
      if (word !== lastWord) {
        makeWord(word);
        lastWord = word;
      }
      ctx.fillStyle = "rgba(0,0,0,.14)";
      ctx.fillRect(0, 0, w, h);
      if (now - lastMatrix > 50) {
        ctx.font = `${mobile ? 13 : 25}px monospace`;
        ctx.fillStyle = "#ff1493";
        for (let i = 0; i < drops.length; i++) {
          ctx.globalAlpha = 0.28;
          ctx.fillText(
            "HAPPYBIRTHDAY"[Math.floor(Math.random() * 13)],
            i * (mobile ? 13 : 25),
            drops[i],
          );
          drops[i] += mobile ? 13 : 25;
          if (drops[i] > h && Math.random() > 0.975)
            drops[i] = -Math.random() * 200;
        }
        lastMatrix = now;
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#ff69b4";
      ctx.shadowColor = "#ff69b4";
      ctx.shadowBlur = 8;
      for (const p of particles) {
        p.x += (p.tx - p.x) * 0.11;
        p.y += (p.ty - p.y) * 0.11;
        ctx.beginPath();
        ctx.arc(p.x, p.y, mobile ? 1.5 : 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [running, iteration]);
  return (
    <section
      className={`sd-experience bd-experience ${embedded ? "sd-embedded" : ""}`}
    >
      {!running ? (
        <div className="sd-center-intro">
          <span className="bd-intro-heart">♡</span>
          <h1>Happy Birthday</h1>
          <p>Có một điều đặc biệt dành cho {gift.recipient}</p>
          <button
            onClick={() => {
              sound.play();
              setRunning(true);
            }}
          >
            Chạm để bắt đầu
          </button>
        </div>
      ) : finished ? (
        <div className="bd-finale">
          <div className="bd-hearts">
            {Array.from({ length: 25 }, (_, i) => (
              <span
                key={i}
                style={{
                  left: `${i * 4}%`,
                  animationDelay: `${-i * 0.8}s`,
                  animationDuration: `${5 + (i % 5)}s`,
                }}
              >
                💖
              </span>
            ))}
          </div>
          <img src="/dlove/birthday/cat-love.gif" alt="Chú mèo gửi trái tim" />
          <h2>{gift.recipient}</h2>
          <p>{gift.title}</p>
        </div>
      ) : (
        <canvas ref={canvas} className="bd-canvas" />
      )}
      <SceneControls
        sound={sound}
        onReplay={() => {
          setRunning(false);
          setFinished(false);
          setIteration((i) => i + 1);
        }}
      />
    </section>
  );
}
