"use client";
import { useEffect, useRef, useState } from "react";
import { X, RotateCcw } from "lucide-react";
import type { Gift } from "@/lib/templates";
const base = "/dlove/letter";
function EnvelopeText({
  occasion,
  salutation,
}: {
  occasion?: string;
  salutation?: string;
}) {
  return (
    <svg className="pb-envelope-text" viewBox="0 0 1349 859" aria-hidden="true">
      <text x="674.5" y="122" textAnchor="middle" className="pb-envelope-top">
        {salutation || "Dành tặng em"}
      </text>
      <text
        x="674.5"
        y="290"
        textAnchor="middle"
        className="pb-envelope-headline"
      >
        {occasion?.includes("20/10")
          ? "20/10"
          : occasion?.includes("sinh nhật")
            ? "Happy Birthday"
            : "Gửi em"}
      </text>
      <text
        x="674.5"
        y="410"
        textAnchor="middle"
        className="pb-envelope-bottom"
      >
        Một chút yêu thương
      </text>
    </svg>
  );
}
export function EnvelopeFace({
  occasion,
  salutation,
}: {
  occasion?: string;
  salutation?: string;
}) {
  return (
    <span className="pb-envelope-face">
      <img src={`${base}/sides.webp`} alt="" />
      <img src={`${base}/front.webp`} alt="" />
      <img src={`${base}/flap-blank.webp`} alt="" />
      <EnvelopeText occasion={occasion} salutation={salutation} />
      <img className="pb-face-seal" src={`${base}/seal-dlove.webp`} alt="" />
    </span>
  );
}
export function BouquetLetter({
  gift,
  photo,
  onClose,
  salutation,
}: {
  gift: Gift;
  photo: string;
  onClose: () => void;
  salutation?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    area = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<"closed" | "opening" | "open" | "closing">(
    "closed",
  );
  const [flapBack, setFlapBack] = useState(false),
    [focusPhoto, setFocusPhoto] = useState(false),
    [leaving, setLeaving] = useState(false);
  const [scale, setScale] = useState(1),
    [typed, setTyped] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]),
    finishTyping = useRef(false);
  const text = gift.message;
  useEffect(() => {
    const el = dialog.current,
      oldFocus = document.activeElement as HTMLElement | null;
    el?.showModal();
    return () => {
      timers.current.forEach(clearTimeout);
      el?.close();
      oldFocus?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    const element = area.current;
    if (!element) return;
    const resize = () => {
      const height = stage === "closed" ? 630 : 980;
      setScale(
        Math.min(
          (element.clientWidth - 2) / 740,
          (element.clientHeight - 2) / height,
          1,
        ),
      );
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    return () => observer.disconnect();
  }, [stage]);
  useEffect(() => {
    if (stage !== "open") return;
    finishTyping.current = false;
    setTyped(0);
    let count = 0;
    const speed = Math.max(28, Math.min(42, 22000 / Math.max(1, text.length)));
    const timer = setInterval(() => {
      if (finishTyping.current) {
        clearInterval(timer);
        return;
      }
      count = Math.min(text.length, count + 1);
      setTyped(count);
      if (count === text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [stage, text]);
  function later(callback: () => void, delay: number) {
    timers.current.push(setTimeout(callback, delay));
  }
  function open() {
    if (stage !== "closed") return;
    setStage("opening");
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    later(() => setFlapBack(true), reduced ? 0 : 450);
    later(() => setStage("open"), reduced ? 10 : 1450);
  }
  function close() {
    setLeaving(true);
    setStage("closing");
    later(
      onClose,
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 10 : 300,
    );
  }
  const blocks = text.slice(0, typed).split("\n");
  return (
    <dialog
      className={`pb-letter-modal ${leaving ? "pb-letter-leaving" : ""}`}
      ref={dialog}
      aria-label="Lá thư dành riêng cho bạn"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <div className="pb-letter-toolbar">
        <button onClick={close} aria-label="Đóng lá thư">
          <X size={23} />
        </button>
      </div>
      <div className="pb-letter-area" ref={area}>
        <div
          className={`pb-letter-scene stage-${stage} ${flapBack ? "flap-back" : ""} ${focusPhoto ? "focus-photo" : ""}`}
          style={{ transform: `translate(-50%,-50%) scale(${scale})` }}
        >
          <div className="pb-envelope">
            <div className="pb-envelope-back" />
            <div className="pb-flap-hinge">
              <div className="pb-flap-rotate">
                <div className="pb-flap-outside">
                  <img src={`${base}/flap-blank.webp`} alt="" />
                  <EnvelopeText
                    occasion={gift.occasion}
                    salutation={salutation}
                  />
                </div>
                <div className="pb-flap-inside" />
              </div>
            </div>
            <img
              className="pb-envelope-sides"
              src={`${base}/sides.webp`}
              alt=""
            />
            <article
              className="pb-paper"
              aria-hidden={stage !== "open"}
              inert={stage !== "open"}
            >
              <div className="pb-paper-border" />
              <img
                className="pb-paper-flower-top"
                src={`${base}/flower-top.webp`}
                alt=""
              />
              <div
                className="pb-letter-copy"
                tabIndex={stage === "open" ? 0 : -1}
                aria-label="Lời nhắn, cuộn để đọc tiếp"
              >
                <div className="pb-letter-copy-inner">
                  <h1>
                    {blocks[0] || " "}
                    <span>♡</span>
                  </h1>
                  <div className="pb-letter-paragraphs">
                    {blocks
                      .slice(1)
                      .filter(Boolean)
                      .map((block, index) => (
                        <p key={index}>{block}</p>
                      ))}
                  </div>
                </div>
              </div>
              <button
                className="pb-letter-photo"
                aria-label={focusPhoto ? "Trở lại đọc thư" : "Chạm để ngắm ảnh"}
                aria-pressed={focusPhoto}
                onClick={() => setFocusPhoto(!focusPhoto)}
              >
                <img
                  className="pb-photo-watercolor"
                  src={`${base}/watercolor.webp`}
                  alt=""
                />
                <span className="pb-photo-viewport">
                  <img
                    src={photo}
                    alt={`Ảnh kỷ niệm dành tặng ${gift.recipient}`}
                  />
                </span>
              </button>
              <img
                className="pb-paper-flower-front"
                src={`${base}/flower-front.webp`}
                alt=""
              />
            </article>
            <img
              className="pb-envelope-front"
              src={`${base}/front.webp`}
              alt=""
            />
            <img
              className="pb-wax-seal"
              src={`${base}/seal-dlove.webp`}
              alt=""
            />
            {stage === "closed" && (
              <button
                className="pb-envelope-hit"
                aria-label="Chạm để mở phong bì"
                onClick={open}
              />
            )}
          </div>
        </div>
      </div>
      <div className="pb-letter-controls">
        {stage === "closed" ? (
          <button onClick={open}>Chạm vào phong bì để mở thư</button>
        ) : (
          <>
            <button onClick={() => setFocusPhoto(!focusPhoto)}>
              {focusPhoto ? "Trở lại đọc thư" : "Chạm vào ảnh để ngắm thật gần"}
            </button>
            {stage === "open" && typed < text.length && (
              <button
                onClick={() => {
                  finishTyping.current = true;
                  setTyped(text.length);
                }}
              >
                Đọc trọn lá thư
              </button>
            )}
            <button
              aria-label="Đọc lại lá thư"
              onClick={() => {
                setFlapBack(false);
                setFocusPhoto(false);
                setStage("closed");
                setTyped(0);
              }}
            >
              <RotateCcw size={14} />
            </button>
          </>
        )}
      </div>
    </dialog>
  );
}
