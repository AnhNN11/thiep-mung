import { Heart, Sparkles, Music2 } from "lucide-react";
import { templates, type Theme } from "@/lib/templates";
import { BouquetArt } from "./bouquet-art";
export function Artwork({
  theme,
  large = false,
}: {
  theme: Theme;
  large?: boolean;
}) {
  if (templates.some((t) => t.id === theme))
    return (
      <div
        className={`artwork source-art ${large ? "art-large" : ""}`}
        aria-hidden="true"
      >
        <img src={`/dlove/thumbnails/${theme}.webp`} alt="" loading="lazy" />
      </div>
    );
  if (theme === "bloom")
    return (
      <div className="artwork art-bloom pb-card-art" aria-hidden="true">
        <BouquetArt />
      </div>
    );
  return (
    <div
      className={`artwork art-${theme} ${large ? "art-large" : ""}`}
      aria-hidden="true"
    >
      {theme === "galaxy" && (
        <>
          <div className="starfield" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="planet-heart">
            <Heart fill="currentColor" strokeWidth={0} />
          </div>
          <span className="galaxy-script">you are my universe</span>
          <div className="photo-orbit p1">
            <img src="/images/memory-1.jpg" alt="" />
          </div>
          <div className="photo-orbit p2">
            <img src="/images/memory-2.jpg" alt="" />
          </div>
          <span className="tiny-star">✦</span>
        </>
      )}
      {theme === "letter" && (
        <>
          <div className="letter-paper">
            <span>To my favorite person,</span>
            <i />
            <i />
            <i />
            <i />
            <b>with love ♡</b>
          </div>
          <div className="envelope">
            <div className="envelope-flap" />
            <div className="wax-seal">
              <Heart fill="currentColor" size={16} />
            </div>
          </div>
          <span className="letter-flower">✿</span>
        </>
      )}
      {theme === "memories" && (
        <>
          <span className="memory-label">the little things, with you.</span>
          <div className="polaroid polaroid-back">
            <img src="/images/memory-2.jpg" alt="" />
            <span>our little escape</span>
          </div>
          <div className="polaroid polaroid-front">
            <img src="/images/memory-1.jpg" alt="" />
            <span>you + me ♡</span>
          </div>
          <span className="memory-tape" />
        </>
      )}
      {theme === "surprise" && (
        <>
          <Sparkles className="gift-spark" size={32} />
          <div className="present">
            <div className="present-bow">୨୧</div>
            <div className="present-lid" />
            <div className="present-body" />
            <div className="present-ribbon" />
          </div>
          <span className="surprise-script">a little happiness</span>
          <Heart className="present-heart" size={22} />
        </>
      )}
      {theme === "vinyl" && (
        <>
          <div className="record-sleeve">
            <span>LOVE NOTES</span>
            <Music2 size={30} />
            <small>vol. 01 — only for you</small>
          </div>
          <div className="record">
            <div className="record-label">
              <Heart size={22} fill="currentColor" />
              <span>thương</span>
            </div>
          </div>
          <span className="vinyl-spark">✧</span>
        </>
      )}
    </div>
  );
}
