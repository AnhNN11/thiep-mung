"use client";
import { useEffect, useRef, useState } from "react";
import type * as Three from "three";
type Falling = {
  object: Three.Object3D;
  material: Three.Material & { opacity: number };
  x: number;
  speed: number;
  phase: number;
  kind: "text" | "photo" | "heart";
};
export function LoveRain({
  started,
  paused,
  photos,
  messages,
  direction = "down",
  hearts = true,
  appearance,
  photoInsets,
}: {
  started: boolean;
  paused: boolean;
  photos: string[];
  messages: string[];
  direction?: "up" | "down";
  hearts?: boolean;
  appearance?: "tribute";
  photoInsets?: Record<string, { top: number; bottom: number }>;
}) {
  const mount = useRef<HTMLDivElement>(null),
    start = useRef(started),
    pause = useRef(paused);
  const [failed, setFailed] = useState(false);
  start.current = started;
  pause.current = paused;
  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    let disposed = false,
      frame = 0,
      cleanup = () => {};
    async function setup() {
      const [
        T,
        { OrbitControls },
        { EffectComposer },
        { RenderPass },
        { UnrealBloomPass },
        { Text },
        { OBJLoader },
      ] = await Promise.all([
        import("three"),
        import("three/examples/jsm/controls/OrbitControls.js"),
        import("three/examples/jsm/postprocessing/EffectComposer.js"),
        import("three/examples/jsm/postprocessing/RenderPass.js"),
        import("three/examples/jsm/postprocessing/UnrealBloomPass.js"),
        import("troika-three-text"),
        import("three/examples/jsm/loaders/OBJLoader.js"),
      ]);
      if (disposed) return;
      const mobile = host!.clientWidth < 700,
        reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tribute = appearance === "tribute";
      const renderer = new T.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, mobile ? 1.75 : 2),
      );
      renderer.outputColorSpace = T.SRGBColorSpace;
      host!.appendChild(renderer.domElement);
      renderer.domElement.setAttribute(
        "aria-label",
        "Không gian mưa lời chúc, ảnh kỷ niệm và trái tim",
      );
      const scene = new T.Scene();
      scene.background = new T.Color(tribute ? "#130d16" : "#000");
      const camera = new T.PerspectiveCamera(100, 1, 0.1, 500);
      camera.position.set(-10, 0, 30);
      camera.lookAt(0, 0, 0);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enablePan = false;
      controls.minDistance = 10;
      controls.maxDistance = 50;
      controls.zoomSpeed = 0.35;
      controls.rotateSpeed = 0.7;
      scene.add(new T.AmbientLight("#ffffff", 1));
      const pinkLight = new T.PointLight("#ff00ff", 0.5, 20);
      pinkLight.position.set(10, 10, 0);
      scene.add(pinkLight);
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new UnrealBloomPass(
        new T.Vector2(512, 512),
        tribute ? 0.28 : mobile ? 0.42 : 0.7,
        0.4,
        mobile ? 0.22 : 0.1,
      );
      composer.addPass(bloom);
      const textures: Three.Texture[] = [],
        materials: Three.Material[] = [],
        geometries: Three.BufferGeometry[] = [],
        texts: InstanceType<typeof Text>[] = [];
      const falling: Falling[] = [];
      const root = new T.Group();
      scene.add(root);
      let seed = 18203;
      const random = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed / 4294967296;
      };
      const starGeometry = new T.BufferGeometry();
      const stars = new Float32Array((mobile ? 900 : 1500) * 3);
      for (let i = 0; i < stars.length; i += 3) {
        stars[i] = (random() - 0.5) * 260;
        stars[i + 1] = (random() - 0.5) * 200;
        stars[i + 2] = (random() - 0.5) * 180 - 50;
      }
      starGeometry.setAttribute("position", new T.BufferAttribute(stars, 3));
      geometries.push(starGeometry);
      const starMaterial = new T.PointsMaterial({
        color: "#ddd4e5",
        size: 0.11,
        transparent: true,
        opacity: 0.65,
        sizeAttenuation: true,
      });
      materials.push(starMaterial);
      scene.add(new T.Points(starGeometry, starMaterial));
      const add = (
        object: Three.Object3D,
        material: Falling["material"],
        x: number,
        z: number,
        speed: number,
        kind: Falling["kind"],
      ) => {
        object.position.set(x, -55 + random() * 150, z);
        root.add(object);
        falling.push({
          object,
          material,
          x,
          speed,
          phase: random() * Math.PI * 2,
          kind,
        });
      };
      const columns = tribute ? (mobile ? 8 : 10) : mobile ? 14 : 18,
        rows = tribute ? 6 : mobile ? 7 : 9;
      for (let row = 0; row < rows; row++)
        for (let col = 0; col < columns; col++) {
          const value = messages[(row * columns + col) % messages.length];
          const words = value.split(/\s+/);
          let wrapped = "";
          words.forEach((word, index) => {
            wrapped +=
              (index && index % (tribute ? 5 : 8) === 0
                ? "\n"
                : index
                  ? " "
                  : "") + word;
          });
          const text = new Text();
          text.text = wrapped;
          text.font = "/dlove/fonts/Mali.ttf";
          text.fontSize = tribute ? 1.16 : 1.5;
          text.letterSpacing = tribute ? 0.01 : -0.1;
          if (tribute) {
            text.maxWidth = 19;
            text.lineHeight = 1.45;
          }
          text.anchorX = "center";
          text.anchorY = "middle";
          text.textAlign = "center";
          const textColor = tribute
            ? ["#f5c8d9", "#e9cda2", "#e0c6e8"][(row + col) % 3]
            : "#EE66A6";
          const material = new T.MeshStandardMaterial({
            color: textColor,
            emissive: textColor,
            emissiveIntensity: tribute ? 0.65 : 1.5,
            toneMapped: false,
            transparent: true,
            opacity: 0,
            side: T.DoubleSide,
            depthWrite: false,
          });
          materials.push(material);
          text.material = material;
          const gap = tribute ? 22 : value.length > 20 ? 6 : 3;
          add(
            text,
            material,
            (col - (columns - 1) / 2) * gap,
            tribute ? -24 + row * 12 : -10 + row * gap * 1.5,
            tribute ? 3.2 + random() * 1.6 : 7 + random() * 2,
            "text",
          );
          text.sync();
          texts.push(text);
        }
      const loader = new T.TextureLoader();
      const heartAsset = new OBJLoader()
        .loadAsync("/dlove/heart.obj")
        .catch(() => null);
      const photoTextures = await Promise.all(
        photos.map(async (src) => {
          try {
            const texture = await loader.loadAsync(src);
            if (disposed) {
              texture.dispose();
              return null;
            }
            texture.colorSpace = T.SRGBColorSpace;
            const inset = photoInsets?.[src];
            if (inset) {
              const top = Math.max(0, Math.min(0.45, inset.top));
              const bottom = Math.max(0, Math.min(0.45, inset.bottom));
              texture.repeat.y = 1 - top - bottom;
              texture.offset.y = bottom;
            }
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            textures.push(texture);
            return texture;
          } catch {
            return null;
          }
        }),
      );
      const heartModel = await heartAsset;
      if (disposed) {
        texts.forEach((text) => text.dispose());
        textures.forEach((texture) => texture.dispose());
        materials.forEach((material) => material.dispose());
        geometries.forEach((geometry) => geometry.dispose());
        controls.dispose();
        bloom.dispose();
        composer.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        return;
      }
      for (let row = 0; row < 4; row++)
        for (let col = 0; col < 4; col++) {
          const texture = photoTextures[(row * 4 + col) % photoTextures.length];
          if (!texture) continue;
          const image = texture.image as HTMLImageElement;
          const ratio = image.width / (image.height * texture.repeat.y);
          const geometry = new T.PlaneGeometry(
            ratio > 1 ? 10 : 10 * ratio,
            ratio > 1 ? 10 / ratio : 10,
          );
          geometries.push(geometry);
          const material = new T.MeshStandardMaterial({
            map: texture,
            emissiveMap: texture,
            emissive: tribute ? "#ffffff" : "#EE66A6",
            emissiveIntensity: tribute ? 0.25 : 0.4,
            toneMapped: false,
            transparent: true,
            opacity: 0,
            side: T.DoubleSide,
            depthWrite: false,
          });
          materials.push(material);
          add(
            new T.Mesh(geometry, material),
            material as Falling["material"],
            (col - 1.5) * 18,
            -10 + row * 10,
            tribute ? 2.8 + random() * 2 : 4 + random() * 5,
            "photo",
          );
        }
      const heartShape = new T.Shape();
      heartShape.moveTo(0, 0.25);
      heartShape.bezierCurveTo(-1.3, 1.6, -2, 0, 0, -1.3);
      heartShape.bezierCurveTo(2, 0, 1.3, 1.6, 0, 0.25);
      let heartGeometry: Three.BufferGeometry = new T.ExtrudeGeometry(
        heartShape,
        {
          depth: 0.2,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.08,
          bevelThickness: 0.08,
        },
      );
      let originalHeart = false;
      if (heartModel)
        heartModel.traverse((object) => {
          const mesh = object as Three.Mesh;
          if (!originalHeart && mesh.isMesh) {
            heartGeometry.dispose();
            heartGeometry = mesh.geometry;
            originalHeart = true;
          }
          const material = mesh.material;
          if (material)
            (Array.isArray(material) ? material : [material]).forEach((value) =>
              value.dispose(),
            );
        });
      geometries.push(heartGeometry);
      if (hearts)
        for (let row = 0; row < 4; row++)
          for (let col = 0; col < 7; col++) {
            const material = new T.MeshStandardMaterial({
              color: tribute ? "#cf7f99" : "#e62e00",
              emissive: tribute ? "#cf7f99" : "#e62e00",
              emissiveIntensity: tribute ? 0.65 : 1.3,
              toneMapped: false,
              metalness: 0.1,
              roughness: 0.5,
              transparent: true,
              opacity: 0,
            });
            materials.push(material);
            const object = new T.Mesh(heartGeometry, material);
            object.scale.setScalar(originalHeart ? 0.15 : 0.65);
            if (originalHeart) object.rotation.x = -Math.PI / 2;
            add(
              object,
              material,
              (col - 3) * 7 + (random() - 0.5) * 3,
              -12 + row * 9,
              tribute ? 3 + random() * 3 : 5 + random() * 9,
              "heart",
            );
          }
      const resize = () => {
        const w = host!.clientWidth,
          h = host!.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        composer.setSize(w, h);
        bloom.setSize(
          Math.round((w / h) * (mobile ? 260 : 180)),
          mobile ? 260 : 180,
        );
      };
      const observer = new ResizeObserver(resize);
      observer.observe(host!);
      resize();
      let previous = performance.now(),
        elapsed = 0,
        startedAt = -1,
        letterSpeed = 1;
      const render = (now: number) => {
        if (disposed) return;
        const delta = Math.min((now - previous) / 1000, 0.05);
        previous = now;
        elapsed += delta;
        if (start.current && startedAt < 0) startedAt = elapsed;
        const age = startedAt < 0 ? 0 : elapsed - startedAt;
        const entry =
          startedAt < 0 ? 0 : Math.max(0, Math.min(1, (age - 0.08) / 1.2));
        letterSpeed +=
          ((pause.current ? 0.32 : 1) - letterSpeed) * Math.min(1, delta / 0.5);
        const entranceSpeed = 0.32 + 0.68 * Math.min(1, age / 2.4);
        root.visible = start.current;
        controls.enabled = start.current && (reduced || age >= 2.4);
        if (start.current)
          for (const item of falling) {
            const speedScale = letterSpeed * entranceSpeed;
            if (!reduced) {
              item.object.position.y +=
                (direction === "up" ? 1 : -1) * item.speed * delta * speedScale;
              if (item.object.position.y < -55) item.object.position.y = 95;
              if (item.object.position.y > 95) item.object.position.y = -55;
              if (direction === "up" && item.kind === "text") {
                const m = item.material as Three.MeshStandardMaterial;
                m.color
                  .set("#EE66A6")
                  .lerp(
                    new T.Color("#99DDFF"),
                    (Math.sin(elapsed / 2.5) + 1) / 2,
                  );
                m.emissive.copy(m.color);
              }
              item.object.position.x =
                item.x +
                Math.sin(elapsed * 0.45 + item.phase) *
                  (item.kind === "photo" ? 1.1 : 0.45);
              if (item.kind === "photo")
                item.object.rotation.z =
                  Math.cos(elapsed * 0.55 + item.phase) * 0.04;
              if (item.kind === "heart")
                item.object.rotation.z +=
                  delta * (0.4 + (item.phase / (Math.PI * 2)) * 0.5);
            }
            item.material.opacity =
              Math.min(
                1,
                (item.object.position.y + 55) / 12,
                (95 - item.object.position.y) / 12,
              ) * entry;
          }
        controls.update();
        composer.render();
        frame = requestAnimationFrame(render);
      };
      frame = requestAnimationFrame(render);
      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        controls.dispose();
        texts.forEach((text) => text.dispose());
        textures.forEach((texture) => texture.dispose());
        materials.forEach((material) => material.dispose());
        geometries.forEach((geometry) => geometry.dispose());
        bloom.dispose();
        composer.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
      if (disposed) cleanup();
    }
    setup().catch((error) => {
      if (!disposed) {
        console.error("Could not initialize gift scene", error);
        setFailed(true);
      }
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      cleanup();
    };
    // Scene assets are fixed for one gift. Playback flags are read through refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="pb-rain-host" ref={mount}>
      {failed && (
        <div className="pb-webgl-fallback">
          <p>Trình duyệt chưa mở được hiệu ứng 3D.</p>
          <span>Bạn vẫn có thể nghe nhạc và mở lá thư ở góc màn hình.</span>
        </div>
      )}
    </div>
  );
}
