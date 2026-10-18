"use client";
import { useEffect, useRef, useState } from "react";
import type * as Three from "three";
export function ParticleWorld({
  mode,
  photos,
  name,
  travel = 0,
}: {
  mode: "sphere" | "heart" | "planet";
  photos: string[];
  name?: string;
  travel?: number;
}) {
  const mount = useRef<HTMLDivElement>(null),
    trip = useRef(travel);
  trip.current = travel;
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let disposed = false,
      frame = 0,
      cleanup = () => {};
    async function init() {
      const [T, { OrbitControls }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/controls/OrbitControls.js"),
      ]);
      if (disposed) return;
      const host = mount.current!;
      const mobile = host.clientWidth < 700;
      const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
      host.appendChild(renderer.domElement);
      renderer.domElement.setAttribute(
        "aria-label",
        mode === "planet"
          ? "Tinh cầu và vành đai hạt"
          : mode === "heart"
            ? "Trái tim hạt vàng 3D"
            : "Quả cầu ảnh 3D",
      );
      const scene = new T.Scene(),
        camera = new T.PerspectiveCamera(
          mode === "planet" ? 75 : 60,
          1,
          0.1,
          2500,
        );
      camera.position.set(
        0,
        mode === "planet" ? 60 : 0,
        mode === "planet" ? 200 : mode === "heart" ? 38 : 26,
      );
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = mode === "planet" ? 0.16 : 0.4;
      controls.minDistance = mode === "planet" ? 40 : 12;
      controls.maxDistance = mode === "planet" ? 1000 : 70;
      const root = new T.Group();
      scene.add(root);
      const geos: Three.BufferGeometry[] = [],
        mats: Three.Material[] = [],
        textures: Three.Texture[] = [];
      let seed = 20260915;
      const random = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed / 4294967296;
      };
      function points(
        count: number,
        fn: (i: number) => [number, number, number],
        color: string,
        size: number,
      ) {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) arr.set(fn(i), i * 3);
        const g = new T.BufferGeometry();
        g.setAttribute("position", new T.BufferAttribute(arr, 3));
        const m = new T.PointsMaterial({
          color,
          size,
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
          blending: T.AdditiveBlending,
          sizeAttenuation: true,
        });
        geos.push(g);
        mats.push(m);
        const p = new T.Points(g, m);
        root.add(p);
        return p;
      }
      points(
        mobile ? 900 : 1800,
        () => [
          (random() - 0.5) * 1500,
          (random() - 0.5) * 1200,
          (random() - 0.5) * 1500,
        ],
        "#ffffff",
        mode === "planet" ? 0.7 : 0.06,
      );
      if (mode === "heart") {
        const count = mobile ? 10000 : 22000;
        const colors = new Float32Array(count * 3),
          g = new T.BufferGeometry(),
          pos = new Float32Array(count * 3);
        const palette = [
          "#FFD58A",
          "#FFB454",
          "#FF756D",
          "#D94B58",
          "#FFE7B0",
        ].map((c) => new T.Color(c));
        for (let i = 0; i < count; i++) {
          const t = random() * Math.PI * 2,
            r = Math.sqrt(random());
          const x = 16 * Math.sin(t) ** 3,
            y =
              13 * Math.cos(t) -
              5 * Math.cos(2 * t) -
              2 * Math.cos(3 * t) -
              Math.cos(4 * t);
          pos.set(
            [
              x * r * 0.65,
              y * r * 0.65,
              (random() - 0.5) * 5 * Math.sqrt(1 - r * r),
            ],
            i * 3,
          );
          palette[Math.floor(random() * palette.length)].toArray(colors, i * 3);
        }
        g.setAttribute("position", new T.BufferAttribute(pos, 3));
        g.setAttribute("color", new T.BufferAttribute(colors, 3));
        const m = new T.PointsMaterial({
          size: 0.055,
          vertexColors: true,
          blending: T.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        });
        geos.push(g);
        mats.push(m);
        root.add(new T.Points(g, m));
        points(
          mobile ? 1600 : 3200,
          () => {
            const t = random() * Math.PI * 2,
              r = 12 + random() * 6;
            return [
              Math.cos(t) * r,
              Math.sin(t) * 3 - 3,
              Math.sin(t) * r * 0.4,
            ];
          },
          "#FFD58A",
          0.045,
        );
      } else if (mode === "planet") {
        points(
          mobile ? 40000 : 100000,
          () => {
            const t = random() * Math.PI * 2,
              r = 110 + random() * 240;
            return [Math.cos(t) * r, (random() - 0.5) * 4, Math.sin(t) * r];
          },
          "#ff9fcb",
          0.55,
        );
        points(
          mobile ? 35000 : 100000,
          () => {
            const t = random() * Math.PI * 2,
              r = 350 + random() * 170;
            return [Math.cos(t) * r, (random() - 0.5) * 6, Math.sin(t) * r];
          },
          "#e9e5ff",
          0.48,
        );
        points(
          15000,
          () => {
            const y = random() * 2 - 1,
              t = random() * Math.PI * 2,
              r = 55 + random() * 5;
            return [
              Math.sqrt(1 - y * y) * Math.cos(t) * r,
              y * r,
              Math.sqrt(1 - y * y) * Math.sin(t) * r,
            ];
          },
          "#ff83bf",
          0.65,
        );
        root.rotation.z = 0.12;
      } else {
        points(
          1800,
          () => {
            const y = random() * 2 - 1,
              t = random() * Math.PI * 2,
              r = 7.2;
            return [
              Math.sqrt(1 - y * y) * Math.cos(t) * r,
              y * r,
              Math.sqrt(1 - y * y) * Math.sin(t) * r,
            ];
          },
          "#ff88c3",
          0.035,
        );
      }
      const loader = new T.TextureLoader(),
        sprites: Three.Sprite[] = [];
      await Promise.all(
        photos.map(async (src) => {
          try {
            const t = await loader.loadAsync(src);
            if (disposed) {
              t.dispose();
              return;
            }
            t.colorSpace = T.SRGBColorSpace;
            textures.push(t);
          } catch {}
        }),
      );
      if (disposed) {
        renderer.dispose();
        renderer.domElement.remove();
        controls.dispose();
        geos.forEach((g) => g.dispose());
        mats.forEach((m) => m.dispose());
        textures.forEach((t) => t.dispose());
        return;
      }
      if (mode !== "heart")
        for (let i = 0; i < (mode === "planet" ? 120 : 72); i++) {
          const texture = textures[i % textures.length];
          if (!texture) break;
          const mat = new T.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.95,
          });
          mats.push(mat);
          const image = texture.image as HTMLImageElement;
          const sprite = new T.Sprite(mat),
            ratio = image.width / image.height;
          if (mode === "sphere") {
            const y = 1 - (2 * (i + 0.5)) / 72,
              t = i * Math.PI * (3 - Math.sqrt(5)),
              r = 10;
            sprite.position.set(
              Math.sqrt(1 - y * y) * Math.cos(t) * r,
              y * r,
              Math.sqrt(1 - y * y) * Math.sin(t) * r,
            );
            sprite.scale.set(2.5 * ratio, 2.5, 1);
          } else {
            const t = random() * Math.PI * 2,
              r = 130 + random() * 400;
            sprite.position.set(
              Math.cos(t) * r,
              (random() - 0.5) * 25,
              Math.sin(t) * r,
            );
            sprite.scale.set(9 * ratio, 9, 1);
          }
          root.add(sprite);
          sprites.push(sprite);
        }
      const resize = () => {
        const w = host.clientWidth,
          h = host.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(host);
      resize();
      let elapsed = 0,
        previous = performance.now(),
        currentTrip = trip.current,
        tripAge = -1;
      const initial = new T.Vector3();
      const paths = [
        new T.Vector3(0, 10, 80),
        new T.Vector3(0, 30, 600),
        new T.Vector3(-200, 400, -700),
      ];
      const draw = (now: number) => {
        if (disposed) return;
        elapsed += Math.min(0.05, (now - previous) / 1000);
        previous = now;
        if (trip.current !== currentTrip) {
          currentTrip = trip.current;
          tripAge = elapsed;
          initial.copy(camera.position);
        }
        if (mode === "planet" && tripAge >= 0) {
          const age = elapsed - tripAge;
          let a = initial,
            b = paths[0],
            f = age / 5;
          if (age > 5) {
            a = paths[0];
            b = paths[1];
            f = (age - 5) / 12;
          }
          if (age > 17) {
            a = paths[1];
            b = paths[2];
            f = (age - 17) / 5;
          }
          f = Math.min(1, f);
          camera.position.lerpVectors(a, b, f * f * (3 - 2 * f));
          camera.lookAt(0, 0, 0);
          controls.enabled = false;
          if (age > 22) {
            tripAge = -1;
            controls.enabled = true;
          }
        }
        if (mode === "heart") {
          root.scale.setScalar(1 + Math.sin(elapsed * 1.25) * 0.015);
          root.rotation.y = Math.sin(elapsed * 0.18) * 0.14;
          root.rotation.z = Math.sin(elapsed * 0.4) * 0.03;
        } else root.rotation.y += 0.0008;
        controls.update();
        renderer.render(scene, camera);
        frame = requestAnimationFrame(draw);
      };
      frame = requestAnimationFrame(draw);
      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        controls.dispose();
        geos.forEach((g) => g.dispose());
        mats.forEach((m) => m.dispose());
        textures.forEach((t) => t.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
      if (disposed) cleanup();
    }
    init().catch(() => {
      if (!disposed) setFailed(true);
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      cleanup();
    };
  }, [mode, photos]);
  return (
    <div className={`sd-particle-world sd-world-${mode}`} ref={mount}>
      {failed && (
        <p className="sd-world-error">
          Chưa khởi tạo được 3D. Hãy mở bằng trình duyệt có hỗ trợ WebGL.
        </p>
      )}
      {name && <h2 className="sd-world-name">{name}</h2>}
    </div>
  );
}
