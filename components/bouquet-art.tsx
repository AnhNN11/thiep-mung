import type { CSSProperties } from "react";
import {
  bouquetParts,
  flowerCovers,
  portraitSlots,
  revealDelays,
  sampleBouquetPhotos,
  type BouquetPart,
} from "@/lib/bouquet";
export function partStyle(part: Omit<BouquetPart, "asset">): CSSProperties {
  return {
    left: `${part.x / 10}%`,
    top: `${part.y / 12.8}%`,
    width: `${part.w / 10}%`,
    height: `${part.h / 12.8}%`,
    zIndex: part.z,
    "--turn": `${part.r || 0}deg`,
    "--flip": part.flip ? -1 : 1,
    "--delay": `${part.delay || 0}ms`,
  } as CSSProperties;
}
export function BouquetArt({
  photos = sampleBouquetPhotos,
  state = "ready",
  onReady,
  portraitKinds,
}: {
  photos?: string[];
  state?: string;
  onReady?: () => void;
  portraitKinds?: ("photo" | "cutout" | "flag")[];
}) {
  const images = photos.length ? photos : sampleBouquetPhotos;
  return (
    <div
      className={`pb-bouquet-art state-${state}`}
      onLoad={onReady}
      aria-hidden="true"
    >
      <div className="pb-glow" />
      {bouquetParts.map((part, i) => (
        <img
          key={`art-${i}`}
          className={`pb-part pb-art ${part.delay ? "pb-infill" : ""}`}
          style={partStyle(part)}
          src={`/dlove/bouquet/${part.asset}.webp`}
          alt=""
          draggable={false}
        />
      ))}
      {portraitSlots.map((slot, i) => {
        const bloom = flowerCovers[i],
          angle = ((bloom.r || 0) * Math.PI) / 180;
        const localX =
          bloom.w *
            (bloom.asset === "rose-pink" ? (bloom.flip ? 0.37 : 0.63) : 0.5) -
          bloom.w * 0.5;
        const localY = bloom.h * (0.58 - 0.78);
        const centerX =
          bloom.x +
          bloom.w * 0.5 +
          localX * Math.cos(angle) -
          localY * Math.sin(angle);
        const centerY =
          bloom.y +
          bloom.h * 0.78 +
          localX * Math.sin(angle) +
          localY * Math.cos(angle);
        const dx = ((centerX - slot.x - slot.w * 0.5) / slot.w) * 100,
          dy =
            ((centerY - slot.y - slot.h * (0.78 + 0.66 * (0.22 - 0.78))) /
              slot.h) *
            100;
        return (
          <div
            className={`pb-part pb-portrait is-${portraitKinds?.[i] || (/\/dlove\/(?:photos\/bouquet-|garden\/person-)/.test(images[i % images.length]) ? "cutout" : "photo")}`}
            key={`portrait-${i}`}
            data-portrait-index={i}
            style={
              {
                ...partStyle(slot),
                "--delay": `${revealDelays[i] + 160}ms`,
                "--shift-x": `${dx}%`,
                "--shift-y": `${dy}%`,
                "--near-x": `${dx * 0.24}%`,
                "--near-y": `${dy * 0.24}%`,
              } as CSSProperties
            }
          >
            {portraitKinds?.[i] === "photo" ? (
              <div className="pb-photo-frame">
                <img src={images[i % images.length]} alt="" draggable={false} />
              </div>
            ) : (
              <img src={images[i % images.length]} alt="" draggable={false} />
            )}
          </div>
        );
      })}
      {flowerCovers.map((part, i) => (
        <img
          className="pb-part pb-cover-flower"
          key={`cover-${i}`}
          style={
            {
              ...partStyle(part),
              "--delay": `${revealDelays[i]}ms`,
            } as CSSProperties
          }
          src={`/dlove/bouquet/${part.asset}.webp`}
          alt=""
          draggable={false}
        />
      ))}
      <img
        className="pb-part pb-bow"
        src="/dlove/bouquet/bow.webp"
        alt=""
        draggable={false}
      />
    </div>
  );
}
