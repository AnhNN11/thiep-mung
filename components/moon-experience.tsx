"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import portrait from "@/public/dlove/moon-vip/layout.json";
import desktop from "@/public/dlove/moon-vip/layout.desktop.json";
import type { Gift } from "@/lib/templates";
import { LoveRain } from "./love-rain";
import { ParticleWorld } from "./particle-world";
import {
  HoldButton,
  SceneControls,
  SourceLetter,
  useGiftAudio,
} from "./source-shared";
type Box = { x: number; y: number; width: number; height: number };
type Layer = {
  id: string;
  file: string;
  zIndex: number;
  clipPath?: string;
  placement: { mode: string; boxPx?: Box; targetContentBoxPx?: Box };
  asset: { width: number; height: number; alphaContentRectPx?: Box };
  animation: {
    preset: string;
    durationSeconds?: number;
    delaySeconds?: number;
  };
};
function placement(l: Layer) {
  if (l.placement.boxPx) return l.placement.boxPx;
  const b = l.placement.targetContentBoxPx!,
    a = l.asset.alphaContentRectPx || {
      x: 0,
      y: 0,
      width: l.asset.width,
      height: l.asset.height,
    },
    s = Math.min(b.width / a.width, b.height / a.height);
  return {
    x: b.x + (b.width - a.width * s) / 2 - a.x * s,
    y: b.y + (b.height - a.height * s) / 2 - a.y * s,
    width: l.asset.width * s,
    height: l.asset.height * s,
  };
}
function Poster({
  wide,
  exiting,
  onStart,
  onComplete,
}: {
  wide: boolean;
  exiting: boolean;
  onStart: () => void;
  onComplete: () => void;
}) {
  const layout = wide ? desktop : portrait;
  const layers = layout.layers as Layer[];
  const moon =
    layers.find((l) => l.id === "full-moon") ||
    layers.find((l) => l.file.includes("full-moon"))!;
  const target = moon.placement.targetContentBoxPx || placement(moon);
  const ref = layout.scene.referenceCanvas;
  return (
    <div
      className={`mv-poster ${wide ? "mv-wide" : "mv-portrait"} ${exiting ? "mv-exiting" : ""}`}
    >
      <svg viewBox={ref.viewBox} preserveAspectRatio="xMidYMin slice">
        <defs>
          {Object.entries(layout.clipPaths).map(([id, c]) => (
            <clipPath key={id} id={`mv-${wide ? "d" : "p"}-${id}`}>
              <path d={c.d} />
            </clipPath>
          ))}
        </defs>
        {[...layers]
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((l) => {
            const p = placement(l);
            return (
              <g
                key={l.id}
                clipPath={
                  l.clipPath
                    ? `url(#mv-${wide ? "d" : "p"}-${l.clipPath})`
                    : undefined
                }
                aria-hidden="true"
              >
                <image
                  href={`/dlove/moon-vip/intro/${l.file}`}
                  {...p}
                  className={`mv-layer mv-${l.animation.preset}`}
                  style={
                    {
                      animationDuration: `${l.animation.durationSeconds || 6}s`,
                      animationDelay: `${l.animation.delaySeconds || 0}s`,
                      transformOrigin: `${p.x + p.width / 2}px ${p.y + p.height / 2}px`,
                    } as CSSProperties
                  }
                />
              </g>
            );
          })}
        <foreignObject
          x={target.x}
          y={target.y}
          width={target.width}
          height={target.height}
        >
          <HoldButton
            label="Ấn giữ vào mặt trăng"
            onStart={onStart}
            onComplete={onComplete}
            className="mv-moon-target"
          >
            <span />
          </HoldButton>
        </foreignObject>
        {wide && (
          <text
            x={target.x + target.width / 2}
            y={466}
            textAnchor="middle"
            fill="#fff1d2"
            fontFamily="Mali"
            fontSize="21"
          >
            Ấn giữ vào mặt trăng
          </text>
        )}
      </svg>
      {!wide && <p className="mv-moon-hint">Ấn giữ vào mặt trăng</p>}
    </div>
  );
}
const moonMessages = [
  "trung thu vui vẻ",
  "iu em nhiều lắm",
  "cảm ơn em vì tất cả",
  "iu em",
  "i love you",
  "Minh Châu",
  "chúc em thật nhiều may mắn",
  "chúc em một đời bình an",
];
export function MoonExperience({
  gift,
  embedded = false,
}: {
  gift: Gift;
  embedded?: boolean;
}) {
  const [phase, setPhase] = useState<"intro" | "opening" | "rain" | "heart">(
      "intro",
    ),
    [wide, setWide] = useState(false),
    [letter, setLetter] = useState(false),
    [ready, setReady] = useState(false);
  const sound = useGiftAudio(gift);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const legacy = gift.theme === "moon";
  useEffect(() => {
    const m = matchMedia("(min-width:900px) and (min-aspect-ratio:4/3)");
    const update = () => setWide(m.matches);
    update();
    m.addEventListener("change", update);
    return () => {
      m.removeEventListener("change", update);
      timers.current.forEach(clearTimeout);
    };
  }, []);
  function open() {
    sound.play();
    setPhase("opening");
    timers.current.push(setTimeout(() => setPhase("rain"), 3100));
  }
  useEffect(() => {
    if (phase !== "rain") {
      setReady(false);
      return;
    }
    const t = setTimeout(() => setReady(true), 5000);
    return () => clearTimeout(t);
  }, [phase]);
  return (
    <section
      className={`sd-experience mv-experience ${embedded ? "sd-embedded" : ""}`}
    >
      {(phase === "opening" || phase === "rain") && (
        <LoveRain
          key="moon-rain"
          started
          paused={letter}
          photos={gift.photos}
          messages={moonMessages.map((s) =>
            s === "Minh Châu" ? gift.recipient : s,
          )}
          direction="up"
          hearts={false}
        />
      )}
      {(legacy || phase === "intro" || phase === "opening") &&
        (legacy ? (
          <div className={`ml-poster ${phase === "rain" ? "ml-active" : ""}`}>
            <img
              className="ml-moon"
              src="/dlove/moon/image/moon.png"
              alt="Mặt trăng"
            />
            <img
              className="ml-mountain"
              src="/dlove/moon/image/mountain.png"
              alt=""
            />
            <img
              className="ml-rabbits"
              src="/dlove/moon/image/rabbits.png"
              alt=""
            />
            <img
              className="ml-sister"
              src="/dlove/moon/image/sister.png"
              alt=""
            />
            {Array.from({ length: 6 }, (_, i) => (
              <img
                key={i}
                className="ml-lantern"
                src="/dlove/moon/image/lantern.png"
                alt=""
                style={{
                  left: `${10 + i * 15}%`,
                  animationDelay: `${-i * 1.3}s`,
                }}
              />
            ))}
            {phase === "intro" && (
              <div className="sd-center-intro">
                <h1>Trung thu vui vẻ</h1>
                <button
                  onClick={() => {
                    sound.play();
                    setPhase("rain");
                  }}
                >
                  Mở đêm trăng
                </button>
              </div>
            )}
          </div>
        ) : (
          <Poster
            wide={wide}
            exiting={phase === "opening"}
            onStart={sound.play}
            onComplete={open}
          />
        ))}
      {phase === "heart" && (
        <>
          <ParticleWorld mode="heart" photos={gift.photos} />
          <img
            className="mv-couple"
            src={
              gift.photos.some((s) => s.startsWith("data:"))
                ? gift.photos[0]
                : "/dlove/moon-vip/photos/couple.webp"
            }
            alt="Ảnh kỷ niệm"
          />
        </>
      )}
      <SceneControls
        sound={sound}
        onReplay={() => {
          timers.current.forEach(clearTimeout);
          setPhase("intro");
        }}
        onLetter={
          !legacy && (ready || phase === "heart")
            ? () => setLetter(true)
            : undefined
        }
        onHeart={!legacy && ready ? () => setPhase("heart") : undefined}
      />
      {letter && (
        <SourceLetter gift={gift} moon onClose={() => setLetter(false)} />
      )}
    </section>
  );
}
