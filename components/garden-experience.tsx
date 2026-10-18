"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type * as Three from "three";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Flower2,
  Images,
  Mail,
  X,
} from "lucide-react";
import type { Gift } from "@/lib/templates";
import gardenData from "@/lib/garden-data.json";
import { SceneControls, useGiftAudio } from "./source-shared";
import { GardenLetter } from "./garden-letter";
import { BouquetArt } from "./bouquet-art";
type Person = { name: string; image: string; original: string; wish: string };
export function GardenExperience({
  gift,
  embedded = false,
}: {
  gift: Gift;
  embedded?: boolean;
}) {
  const [entered, setEntered] = useState(false),
    [selected, setSelected] = useState<number | null>(null),
    [nav, setNav] = useState(0),
    [letter, setLetter] = useState(false),
    [memories, setMemories] = useState(false),
    [bouquet, setBouquet] = useState(false);
  const sound = useGiftAudio(gift, 0.5);
  const people = useMemo(() => {
    const uploaded = gift.photos.filter(
      (s) => s.startsWith("data:") || gift.recipient !== "người thương",
    );
    return uploaded.length
      ? uploaded.map((image, i) => ({
          image,
          original: image,
          name: i === 0 ? gift.recipient : `Kỷ niệm ${i + 1}`,
          wish: gift.message,
        }))
      : gardenData.data.people;
  }, [gift.photos, gift.recipient, gift.message]);
  return (
    <section
      className={`sd-experience gd-experience ${embedded ? "sd-embedded" : ""}`}
    >
      {!entered ? (
        <div className="gd-welcome">
          <picture>
            <source
              media="(min-width:761px)"
              srcSet="/dlove/garden/welcome/garden-gate-desktop.jpg"
            />
            <img
              className="gd-welcome-bg"
              src="/dlove/garden/welcome/garden-gate.jpg"
              alt="Cổng vườn hoa"
            />
          </picture>
          <div className="gd-welcome-copy">
            <span>✿ Vườn hoa của chúng mình ✿</span>
            <h1>Cậu đến rồi!</h1>
            <p>
              Có một khu vườn nhỏ,
              <br />
              đang đợi bạn ghé thăm.
            </p>
            <button
              onClick={() => {
                sound.play();
                setEntered(true);
              }}
            >
              Cùng nhau khám phá nhé <span>↗</span>
            </button>
          </div>
          <img
            className="gd-guide"
            src="/dlove/garden/welcome/dlovy-guide.lossless.webp"
            alt="Thỏ chào đón"
          />
          <img
            className="gd-foreground"
            src="/dlove/garden/welcome/garden-foreground-desktop.lossless.webp"
            alt=""
          />
        </div>
      ) : (
        <>
          <GardenScene
            people={people}
            selected={selected}
            onSelect={setSelected}
            nav={nav}
          />
          <div className="gd-top">
            <span>✿ {gift.title}</span>
            <div>
              <button onClick={() => setMemories(true)}>
                <Images size={17} />
                Miền ký ức
              </button>
              <button onClick={() => setLetter(true)}>
                <Mail size={17} />
                Lá thư
              </button>
            </div>
          </div>
          {selected === null ? (
            <div className="gd-navigation">
              <p>Kéo để dạo quanh khu vườn · Chạm vào một người để ngắm gần</p>
              <div>
                <button
                  aria-label="Lùi lại"
                  onClick={() => setNav((v) => v - 1)}
                >
                  <ChevronLeft />
                </button>
                <span>Những điều lấp lánh</span>
                <button
                  aria-label="Đi tiếp"
                  onClick={() => setNav((v) => v + 1)}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          ) : (
            <>
              <button className="gd-back" onClick={() => setSelected(null)}>
                <ArrowLeft size={18} />
                Về khu vườn
              </button>
              <article className="gd-person-card">
                <span>✧ Một bông hoa thật đặc biệt</span>
                <h2>{people[selected].name}</h2>
                <p>{people[selected].wish}</p>
                <button onClick={() => setBouquet(true)}>
                  <Flower2 size={18} />
                  Một bó hoa dành cho cậu
                </button>
                <div className="gd-person-next">
                  <button
                    aria-label="Người trước"
                    onClick={() =>
                      setSelected(
                        (selected + people.length - 1) % people.length,
                      )
                    }
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    aria-label="Người tiếp theo"
                    onClick={() => setSelected((selected + 1) % people.length)}
                  >
                    <ChevronRight />
                  </button>
                </div>
              </article>
            </>
          )}
        </>
      )}
      <SceneControls
        sound={sound}
        onReplay={() => {
          setEntered(false);
          setSelected(null);
        }}
      />
      {letter && <GardenLetter gift={gift} onClose={() => setLetter(false)} />}
      {memories && <GardenMemories onClose={() => setMemories(false)} />}
      {bouquet && selected !== null && (
        <GardenBouquet
          person={people[selected]}
          onClose={() => setBouquet(false)}
        />
      )}
    </section>
  );
}
function GardenScene({
  people,
  selected,
  onSelect,
  nav,
}: {
  people: Person[];
  selected: number | null;
  onSelect: (i: number) => void;
  nav: number;
}) {
  const host = useRef<HTMLDivElement>(null),
    selection = useRef(selected),
    navigation = useRef(nav),
    select = useRef(onSelect);
  selection.current = selected;
  navigation.current = nav;
  select.current = onSelect;
  const [error, setError] = useState(false);
  useEffect(() => {
    let disposed = false,
      frame = 0,
      cleanup = () => {};
    async function init() {
      const T = await import("three");
      if (disposed) return;
      const rootEl = host.current!,
        mobile = rootEl.clientWidth <= 760;
      const renderer = new T.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
      rootEl.appendChild(renderer.domElement);
      renderer.domElement.setAttribute(
        "aria-label",
        "Khu vườn hoa 3D, kéo để dạo và chạm để chọn",
      );
      const scene = new T.Scene();
      scene.background = new T.Color("#ecd5e5");
      if (mobile) scene.fog = new T.Fog("#efd9e8", 23, 52);
      const camera = new T.PerspectiveCamera(43, 1, 0.1, 120);
      camera.position.set(0, mobile ? 2.65 : 2.35, 0);
      const textures: Three.Texture[] = [],
        materials: Three.SpriteMaterial[] = [],
        objects: Three.Group[] = [],
        portraits: Three.Sprite[] = [];
      const loader = new T.TextureLoader();
      async function texture(src: string) {
        const t = await loader.loadAsync(src);
        t.colorSpace = T.SRGBColorSpace;
        textures.push(t);
        return t;
      }
      const panorama = await texture("/dlove/garden/decor/dream-panorama.webp");
      panorama.mapping = T.EquirectangularReflectionMapping;
      scene.background = panorama;
      scene.backgroundRotation.y = Math.PI * 0.4;
      const [front, back, ribbon, loop, bunny, ...persons] = await Promise.all(
        [
          "/dlove/garden/decor/flowers-front.webp",
          "/dlove/garden/decor/flowers-back.webp",
          "/dlove/garden/decor/silk-ribbon.webp",
          "/dlove/garden/decor/silk-loop.webp",
          "/dlove/garden/decor/dlove-bunny.webp",
          ...people.map((p) => p.image),
        ].map(texture),
      );
      if (disposed) {
        textures.forEach((t) => t.dispose());
        renderer.dispose();
        renderer.domElement.remove();
        return;
      }
      function sprite(map: Three.Texture, height: number) {
        const m = new T.SpriteMaterial({
          map,
          transparent: true,
          alphaTest: 0.04,
          depthWrite: false,
        });
        materials.push(m);
        const s = new T.Sprite(m);
        const image = map.image as HTMLImageElement;
        s.scale.set((height * image.width) / image.height, height, 1);
        return s;
      }
      const slots = mobile
          ? people.length * 3
          : Math.ceil(16 / people.length) * people.length,
        radius = Math.max(10.2, slots * 0.56);
      for (let i = 0; i < slots; i++) {
        const group = new T.Group(),
          angle = (i / slots) * Math.PI * 2,
          idx = i % people.length;
        group.position.set(
          mobile
            ? (i % 2 ? -0.8 : 0.8) + Math.sin((i * 12) / 22) * 1.1
            : Math.sin(angle) * (radius + [0, 0.65, -0.25, 0.9, 0.2][i % 5]),
          0,
          mobile
            ? -13 - i * 12
            : -Math.cos(angle) * (radius + [0, 0.65, -0.25, 0.9, 0.2][i % 5]),
        );
        const p = sprite(persons[idx], [4.5, 4.25, 4.45, 4.15, 4.5][i % 5]);
        p.position.y = 2.7;
        p.userData.person = idx;
        p.userData.group = i;
        portraits.push(p);
        group.add(p);
        const b = sprite(back, 3.5);
        b.position.set(0, 1.1, -0.8);
        group.add(b);
        const f = sprite(front, 2.1);
        f.position.set(0, 0.47, 0.6);
        group.add(f);
        const r = sprite(ribbon, 1.5);
        r.position.set(0, 0.8, 0.9);
        group.add(r);
        if (i % 4 === 0) {
          const l = sprite(loop, 3.5);
          l.position.set(0, 3, -0.9);
          group.add(l);
        }
        if (i % 5 === 0) {
          const b = sprite(bunny, 1.7);
          b.position.set(2, 1, 1);
          group.add(b);
        }
        scene.add(group);
        objects.push(group);
      }
      let yaw = 0,
        pitch = 0,
        depth = 0,
        lastNav = navigation.current,
        lastSelect: number | null = null,
        pointer: {
          x: number;
          y: number;
          startX: number;
          startY: number;
        } | null = null,
        lastInteraction = 0,
        focusedGroup: Three.Group | null = null;
      const focusPosition = new T.Vector3(),
        focusLook = new T.Vector3(),
        look = new T.Vector3();
      const down = (e: PointerEvent) => {
        pointer = {
          x: e.clientX,
          y: e.clientY,
          startX: e.clientX,
          startY: e.clientY,
        };
        lastInteraction = performance.now();
        renderer.domElement.setPointerCapture(e.pointerId);
      };
      const move = (e: PointerEvent) => {
        if (!pointer || selection.current !== null) return;
        if (mobile) depth = Math.max(0, depth + (pointer.y - e.clientY) * 0.05);
        else {
          yaw -= (e.clientX - pointer.x) * 0.0025;
          pitch = Math.max(
            -0.19,
            Math.min(0.15, pitch + (e.clientY - pointer.y) * 0.0005),
          );
        }
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        lastInteraction = performance.now();
      };
      const up = (e: PointerEvent) => {
        if (!pointer) return;
        if (
          Math.hypot(e.clientX - pointer.startX, e.clientY - pointer.startY) <
          10
        ) {
          const rect = renderer.domElement.getBoundingClientRect(),
            ray = new T.Raycaster();
          ray.setFromCamera(
            new T.Vector2(
              ((e.clientX - rect.left) / rect.width) * 2 - 1,
              (-(e.clientY - rect.top) / rect.height) * 2 + 1,
            ),
            camera,
          );
          const hit = ray.intersectObjects(
            portraits.filter((p) => p.parent?.visible),
          )[0];
          if (hit) select.current(hit.object.userData.person);
        }
        pointer = null;
      };
      const wheel = (e: WheelEvent) => {
        e.preventDefault();
        lastInteraction = performance.now();
        if (selection.current !== null) return;
        if (mobile) depth = Math.max(0, depth + e.deltaY * 0.018);
        else yaw += e.deltaY * 0.0014;
      };
      const key = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          yaw += (Math.PI * 2) / slots;
          depth += 12;
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          yaw -= (Math.PI * 2) / slots;
          depth = Math.max(0, depth - 12);
        }
      };
      renderer.domElement.addEventListener("pointerdown", down);
      renderer.domElement.addEventListener("pointermove", move);
      renderer.domElement.addEventListener("pointerup", up);
      renderer.domElement.addEventListener("pointercancel", up);
      renderer.domElement.addEventListener("wheel", wheel, { passive: false });
      renderer.domElement.tabIndex = 0;
      renderer.domElement.addEventListener("keydown", key);
      const resize = () => {
        const w = rootEl.clientWidth,
          h = rootEl.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      const ob = new ResizeObserver(resize);
      ob.observe(rootEl);
      resize();
      let prev = performance.now(),
        elapsed = 0;
      function draw(now: number) {
        if (disposed) return;
        const dt = Math.min(0.05, (now - prev) / 1000);
        prev = now;
        elapsed += dt;
        if (navigation.current !== lastNav) {
          const delta = navigation.current - lastNav;
          yaw += (delta * Math.PI * 2) / slots;
          depth = Math.max(0, depth + delta * 12);
          lastNav = navigation.current;
          lastInteraction = now;
        }
        if (selection.current !== lastSelect) {
          lastSelect = selection.current;
          focusedGroup =
            lastSelect === null
              ? null
              : objects.find((_, i) => i % people.length === lastSelect) ||
                null;
          objects.forEach(
            (g) => (g.visible = !focusedGroup || g === focusedGroup),
          );
        }
        if (focusedGroup) {
          const p = focusedGroup.position;
          if (mobile) focusPosition.set(p.x, 2.8, p.z + 8);
          else focusPosition.set(p.x * 0.52, 2.8, p.z * 0.52);
          focusLook.set(p.x, 2.65, p.z);
          camera.position.lerp(focusPosition, Math.min(1, dt * 4));
          look.lerp(focusLook, Math.min(1, dt * 4));
          camera.lookAt(look);
        } else {
          if (now - lastInteraction > 2600 && !pointer) {
            if (mobile) depth += dt * 2;
            else yaw += dt * 0.018;
          }
          if (mobile) {
            if (depth > people.length * 12) depth -= people.length * 12;
            camera.position.lerp(
              new T.Vector3(0, 2.65, -depth),
              Math.min(1, dt * 4),
            );
            look.set(0, 2.8, -depth - 20);
          } else {
            camera.position.lerp(
              new T.Vector3(0, 2.35, 0),
              Math.min(1, dt * 4),
            );
            look.set(
              Math.sin(yaw) * 20,
              2.35 + pitch * 20,
              -Math.cos(yaw) * 20,
            );
          }
          camera.lookAt(look);
        }
        objects.forEach((g, i) => {
          const p = g.children[0];
          p.rotation.z = Math.sin(elapsed * 0.5 + i) * 0.005;
        });
        renderer.render(scene, camera);
        frame = requestAnimationFrame(draw);
      }
      frame = requestAnimationFrame(draw);
      cleanup = () => {
        cancelAnimationFrame(frame);
        ob.disconnect();
        renderer.domElement.removeEventListener("pointerdown", down);
        renderer.domElement.removeEventListener("pointermove", move);
        renderer.domElement.removeEventListener("pointerup", up);
        renderer.domElement.removeEventListener("pointercancel", up);
        renderer.domElement.removeEventListener("wheel", wheel);
        renderer.domElement.removeEventListener("keydown", key);
        materials.forEach((m) => m.dispose());
        textures.forEach((t) => t.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
      if (disposed) cleanup();
    }
    init().catch(() => {
      if (!disposed) setError(true);
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      cleanup();
    };
  }, [people]);
  return (
    <div className="gd-scene" ref={host}>
      {error && (
        <p className="sd-world-error">
          Chưa mở được khu vườn 3D. Vui lòng tải lại.
        </p>
      )}
    </div>
  );
}
function GardenMemories({ onClose }: { onClose: () => void }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div
      className="gd-memories"
      role="dialog"
      aria-modal="true"
      aria-label="Miền ký ức"
    >
      <button className="gd-back" onClick={onClose}>
        <ArrowLeft />
        Về khu vườn
      </button>
      <h2>Những ngày mình bên nhau</h2>
      <button className="gd-memory-toggle" onClick={() => setPaused((v) => !v)}>
        {paused ? "Tiếp tục" : "Tạm dừng"}
      </button>
      <div
        className="gd-film"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {Array.from({ length: 15 }, (_, i) => (
          <figure key={i}>
            <img
              src={`/dlove/garden/memory-${String((i % 5) + 1).padStart(2, "0")}.webp`}
              alt={`Kỷ niệm ${(i % 5) + 1}`}
            />
            <figcaption>Những ngày thật đẹp ♡</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
function GardenBouquet({
  person,
  onClose,
}: {
  person: Person;
  onClose: () => void;
}) {
  return (
    <div
      className="gd-bouquet"
      role="dialog"
      aria-modal="true"
      aria-label={`Bó hoa dành cho ${person.name}`}
    >
      <button className="sd-close" aria-label="Đóng bó hoa" onClick={onClose}>
        <X />
      </button>
      <h2>{person.name}</h2>
      <p>{person.wish}</p>
      <BouquetArt photos={Array(6).fill(person.image)} state="ready" />
    </div>
  );
}
