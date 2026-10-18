"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Gift } from "@/lib/templates";
export function GardenLetter({
  gift,
  onClose,
}: {
  gift: Gift;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [phase, setPhase] = useState("sealed");
  useEffect(() => {
    dialog.current?.showModal();
    const a = setTimeout(() => setPhase("opening"), 380),
      b = setTimeout(() => setPhase("reading"), 2300);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className={`gd-letter-dialog phase-${phase}`}
      aria-label="Lá thư trong vườn hoa"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button className="sd-close" aria-label="Đóng thư" onClick={onClose}>
        <X />
      </button>
      <div className="gd-letter-envelope">
        <div className="gd-letter-flap" />
        <img
          className="gd-letter-paper"
          src="/dlove/garden/letter/letter-blank-v3.webp"
          alt=""
        />
        <img
          className="gd-letter-front"
          src="/dlove/garden/letter/envelope-front.webp"
          alt=""
        />
        <img
          className="gd-letter-seal"
          src="/dlove/garden/letter/dlove-wax-seal.lossless.webp"
          alt=""
        />
        <img
          className="gd-letter-butterfly"
          src="/dlove/garden/letter/butterfly-letter-v3.webp"
          alt=""
        />
      </div>
      <article className="gd-letter-reading">
        <img src="/dlove/garden/letter/letter-blank-v3.webp" alt="" />
        <div>
          <small>Một lá thư dành riêng cho {gift.recipient}</small>
          <h2>{gift.title}</h2>
          <p>{gift.message}</p>
          <em>{gift.sender}</em>
        </div>
      </article>
    </dialog>
  );
}
