"use client";
import { useState } from "react";
import type { Gift } from "@/lib/templates";
import { ParticleWorld } from "./particle-world";
import { SceneControls, useGiftAudio } from "./source-shared";
export function PlanetExperience({
  gift,
  embedded = false,
}: {
  gift: Gift;
  embedded?: boolean;
}) {
  const [started, setStarted] = useState(false),
    [travel, setTravel] = useState(0);
  const sound = useGiftAudio(gift);
  return (
    <section
      className={`sd-experience pl-experience ${embedded ? "sd-embedded" : ""}`}
      onDoubleClick={() => {
        if (started) setTravel((t) => t + 1);
      }}
    >
      <ParticleWorld mode="planet" photos={gift.photos} travel={travel} />
      {!started ? (
        <div className="pl-intro">
          <h1>{gift.title}</h1>
          <p>Có cả một vũ trụ dành cho bạn</p>
          <button
            onClick={() => {
              sound.play();
              setStarted(true);
            }}
          >
            Bắt đầu khám phá
          </button>
        </div>
      ) : (
        <button className="sd-next" onClick={() => setTravel((t) => t + 1)}>
          Du hành tinh cầu ✧
        </button>
      )}
      <SceneControls sound={sound} onReplay={() => setStarted(false)} />
    </section>
  );
}
