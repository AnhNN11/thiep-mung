"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  Heart,
  Phone,
  Video,
  Info,
  Camera,
  Mic,
} from "lucide-react";
import type { Gift } from "@/lib/templates";
import { ParticleWorld } from "./particle-world";
import {
  HoldButton,
  SceneControls,
  SourceLetter,
  useGiftAudio,
} from "./source-shared";
export function ValentineExperience({
  gift,
  embedded = false,
}: {
  gift: Gift;
  embedded?: boolean;
}) {
  const [phase, setPhase] = useState<"lock" | "chat" | "heart" | "sphere">(
      "lock",
    ),
    [message, setMessage] = useState(0),
    [letter, setLetter] = useState(false);
  const sound = useGiftAudio(gift);
  const messages = useMemo(
    () => [
      `hello ${gift.recipient} ❤️`,
      "hôm nay là một ngày thật đặc biệt",
      `dù ở đâu, ${gift.sender} vẫn luôn nghĩ về bạn`,
      "đừng buồn nhé",
      "có một chút bất ngờ dành cho bạn nè ❤️",
    ],
    [gift.recipient, gift.sender],
  );
  useEffect(() => {
    if (phase !== "chat") return;
    let elapsed = 0;
    const timers = [0, 1150, 2850, 1000, 2050].map((delay, i) => {
      elapsed += delay;
      return setTimeout(() => setMessage(i + 1), elapsed);
    });
    return () => timers.forEach(clearTimeout);
  }, [phase]);
  const days = Math.max(
    0,
    Math.floor(
      (Date.now() -
        new Date(
          /^\d{4}-\d{2}-\d{2}$/.test(gift.occasion)
            ? gift.occasion
            : "2023-05-27",
        ).getTime()) /
        86400000,
    ),
  );
  return (
    <section
      className={`sd-experience vt-experience ${embedded ? "sd-embedded" : ""}`}
    >
      {phase === "lock" ? (
        <div
          className="vt-phone vt-lock"
          style={{ backgroundImage: "url(/dlove/valentine/background.jpg)" }}
        >
          <small>Chủ nhật, ngày 18 tháng 10</small>
          <h1>09:41</h1>
          <button
            className="vt-notification"
            onClick={() => {
              sound.play();
              setPhase("chat");
            }}
          >
            <img src="/dlove/valentine/icon.jpg" alt="" />
            <span>
              <b>{gift.sender}</b>
              <small>Bạn có một tin nhắn mới ♡</small>
            </span>
          </button>
          <button
            className="vt-unlock"
            onClick={() => {
              sound.play();
              setPhase("chat");
            }}
          >
            Vuốt lên để mở tin nhắn <span>⌃</span>
          </button>
        </div>
      ) : phase === "chat" ? (
        <div className="vt-phone vt-chat">
          <header>
            <ChevronLeft />
            <img src="/dlove/valentine/avatar.jpg" alt="" />
            <div>
              <b>{gift.sender}</b>
              <small>Đang hoạt động</small>
            </div>
            <Phone size={19} />
            <Video size={22} />
            <Info size={20} />
          </header>
          <div className="vt-chat-body">
            <p className="vt-chat-date">HÔM NAY</p>
            {messages.slice(0, message).map((text, i) => (
              <div key={i} className="vt-chat-row">
                <img src="/dlove/valentine/avatar.jpg" alt="" />
                <p>{text}</p>
              </div>
            ))}
            {message === 5 && (
              <div className="vt-touch">
                <HoldButton
                  label="Ấn giữ để xem bất ngờ"
                  onComplete={() => setPhase("heart")}
                >
                  <img src="/dlove/galaxy/fingerprint.png" alt="" />
                </HoldButton>
                <p>Ấn giữ để xem bất ngờ</p>
              </div>
            )}
          </div>
          <footer>
            <Camera size={24} />
            <Mic size={22} />
            <span>Aa</span>
            <Heart fill="currentColor" />
          </footer>
        </div>
      ) : phase === "heart" ? (
        <>
          <ParticleWorld mode="heart" photos={gift.photos} />
          <div className="vt-days">
            <div>
              <img src="/dlove/valentine/left.jpg" alt={gift.sender} />
              <span>{gift.sender}</span>
            </div>
            <strong>
              {days.toLocaleString("vi")}
              <small>ngày bên nhau</small>
            </strong>
            <div>
              <img src="/dlove/valentine/right.jpg" alt={gift.recipient} />
              <span>{gift.recipient}</span>
            </div>
          </div>
          <button className="sd-next" onClick={() => setPhase("sphere")}>
            Chạm để mở kỷ niệm ♡
          </button>
        </>
      ) : (
        <>
          <ParticleWorld mode="sphere" photos={gift.photos} />
          <p className="sd-bottom-hint">Những ngày mình có nhau</p>
        </>
      )}
      <SceneControls
        sound={sound}
        onReplay={() => {
          setPhase("lock");
          setMessage(0);
        }}
        onLetter={
          phase === "sphere" || phase === "heart"
            ? () => setLetter(true)
            : undefined
        }
      />
      {letter && <SourceLetter gift={gift} onClose={() => setLetter(false)} />}
    </section>
  );
}
