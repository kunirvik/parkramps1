import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import "./Brandsite.css";

const DEFAULT_CONFIG = {
  logoText: "YOUR BRAND",
  logoImage: null,
  nav: [
    { label: "Web Shop", href: "#" },
    { label: "Shops", href: "#" },
    { label: "Advice", href: "#" },
    { label: "Cart", href: "#" },
  ],
  // Видео, которое одновременно (а) крутится фоном хиро-секции и (б) отражается в 3D-модели.
  heroVideoUrl: "https://res.cloudinary.com/dbx6muxub/video/upload/v1785325905/volt_park_visual2kwide_sjelea.mp4",
  heroModelUrl: "https://res.cloudinary.com/dbx6muxub/image/upload/v1786869663/logo_alatkf.glb",
  heroMirrorRestRotationY: 0,
  headerModelUrl: null,
  headerModelUrlAlt: null,
  heroLines: [
    { text: "Manor Place", tone: "dim2" },
    { text: "Your Brand South2 West8", tone: "dim" },
    { text: "Autumn 2026 Range", tone: "accent" },
    { text: "Autumn 2026 Lookbook", tone: "normal" },
  ],
  viewLabel: "View Range",
  viewHref: "#",
  marqueeText: "YOUR BRAND — НОВЫЙ ДРОП — ",
  gridImages: [
    { src: "", alt: "editorial-1.jpg", cap: "01 — ЛУК" },
    { src: "", alt: "editorial-2.jpg", cap: "02 — ДЕТАЛЬ" },
    { src: "", alt: "editorial-3.jpg", cap: "03 — ДЕТАЛЬ" },
    { src: "", alt: "editorial-4.jpg", cap: "04 — ЛУК" },
  ],
  social: [
    { label: "Instagram", href: "#" },
    { label: "TikTok", href: "#" },
    { label: "YouTube", href: "#" },
  ],
  infoLinks: [
    { label: "Доставка", href: "#" },
    { label: "Возврат", href: "#" },
    { label: "Условия использования", href: "#" },
    { label: "Политика конфиденциальности", href: "#" },
  ],
  shops: ["Магазин RU", "Магазин EU", "Магазин US"],
};

/* ---------- зеркальный (хромированный) материал для маленького orb в хедере ---------- */
function makeMirrorMaterial(extra = {}) {
  return new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1,
    roughness: 0.12,
    envMapIntensity: 1.5,
    transparent: false,
    opacity: 1,
    ...extra,
  });
}

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

/* ---------- общий загрузчик: своя модель или процедурная заглушка ---------- */
function loadMeshWithMaterial({ url, fallbackGeo, material, onReady, label = "model" }) {
  if (!url) {
    onReady(new THREE.Mesh(fallbackGeo, material));
    return () => {};
  }

  let cancelled = false;
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    url,
    (gltf) => {
      if (cancelled) return;
      const group = gltf.scene;
      group.traverse((child) => {
        if (child.isMesh) {
          if (Array.isArray(child.material)) {
            // растягиваем один и тот же материал на все группы,
            // чтобы не было рассинхрона material.length vs geometry.groups.length
            child.material = child.material.map(() => material);
          } else {
            child.material = material;
          }
          child.material.needsUpdate = true;
        }
      });
      onReady(group);
    },
    undefined,
    (err) => {
      console.error(`[BrandSite] Не удалось загрузить ${label} (${url}):`, err);
      if (cancelled) return;
      onReady(new THREE.Mesh(fallbackGeo, material));
    }
  );
  return () => { cancelled = true; };
}

/* ---------- центрирование и нормализация масштаба под размер сцены ---------- */
function fitAndCenter(object, targetSize) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  object.scale.setScalar(targetSize / maxDim);

  const box2 = new THREE.Box3().setFromObject(object);
  const center = new THREE.Vector3();
  box2.getCenter(center);
  object.position.sub(center);
}

/* ---------- маленький вращающийся 3D-объект в хедере ---------- */
function HeaderOrb({ modelUrl, modelUrlAlt }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const size = 42;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const light = new THREE.PointLight(0xffffff, 2);
    light.position.set(2, 2, 2);
    scene.add(light);

    let current = null;
    let dispose1 = () => {};
    let dispose2 = null;

    const setMesh = (obj) => {
      if (current) scene.remove(current);
      current = obj;
      fitAndCenter(current, 1.5);
      scene.add(current);
    };

    dispose1 = loadMeshWithMaterial({
      url: modelUrl,
      fallbackGeo: new THREE.IcosahedronGeometry(1, 0),
      material: makeMirrorMaterial(),
      label: "headerModelUrl",
      onReady: setMesh,
    });

    let altObj = null;
    if (modelUrlAlt !== undefined) {
      dispose2 = loadMeshWithMaterial({
        url: modelUrlAlt,
        fallbackGeo: new THREE.OctahedronGeometry(1.1, 0),
        material: makeMirrorMaterial(),
        label: "headerModelUrlAlt",
        onReady: (obj) => { fitAndCenter(obj, 1.5); obj.visible = false; scene.add(obj); },
      });
    }

    let swapped = false;
    const onScroll = () => {
      const shouldSwap = window.scrollY > 60;
      if (shouldSwap !== swapped) {
        swapped = shouldSwap;
        if (altObj && current) {
          scene.remove(current);
          current.visible = true;
          const tmp = current;
          current = altObj;
          current.visible = true;
          altObj = tmp;
          altObj.visible = false;
          scene.add(current);
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf;
    const animate = () => {
      if (current) {
        current.rotation.y += 0.02;
        current.rotation.x += 0.008;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      dispose1();
      if (dispose2) dispose2();
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      pmrem.dispose();
    };
  }, [modelUrl, modelUrlAlt]);

  return <div className="header-orb" ref={mountRef}></div>;
}

function HeroModel({ modelUrl, heroVideoUrl, restRotationY = 0 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const CONFIG = {
      modelSize: 2.8,
      cameraZ: 6,
      reflectionSize: 1024,
      dragSensitivity: 0.008,
      inertiaDamping: 0.94,
      minVelocity: 0.00015,
      settleDelay: 500,
      settleSpeed: 0.045,
      envUpdateEveryFrame: 2,
      roomDistance: 12,
      roomHeight: 16,
    };

    /* ---------- основная сцена ---------- */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, CONFIG.cameraZ);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    const getSize = () => Math.min(mount.clientWidth || 560, mount.clientHeight || 560, 560);
    let size = getSize();
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3));

    if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
    else renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x333333, 1.4));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 6, 8);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
    fillLight.position.set(-5, 2, 4);
    scene.add(fillLight);

    /* ---------- reflection-scene: НИКОГДА не рендерится на экран напрямую ---------- */
    const reflectionScene = new THREE.Scene();
    reflectionScene.background = new THREE.Color(0x77736b);

    let videoEl = null;
    let videoTexture = null;
    const reflectionObjects = [];

    const buildReflectionRoom = (texture) => {
      reflectionObjects.forEach((obj) => {
        reflectionScene.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      reflectionObjects.length = 0;

      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false; // видео-текстуры не поддерживают mipmaps
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

      const wallGeoWide = new THREE.PlaneGeometry(30, 16.875);
      const wallGeoSide = new THREE.PlaneGeometry(24, 16);

      const front = new THREE.Mesh(wallGeoWide, new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
      front.position.set(0, 0, -CONFIG.roomDistance);
      front.rotation.y = Math.PI;
      reflectionScene.add(front);
      reflectionObjects.push(front);

      const back = new THREE.Mesh(wallGeoWide, new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
      back.position.set(0, 0, CONFIG.roomDistance);
      reflectionScene.add(back);
      reflectionObjects.push(back);

      const left = new THREE.Mesh(wallGeoSide, new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
      left.position.set(-CONFIG.roomDistance, 0, 0);
      left.rotation.y = Math.PI / 2;
      reflectionScene.add(left);
      reflectionObjects.push(left);

      const right = new THREE.Mesh(wallGeoSide, new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
      right.position.set(CONFIG.roomDistance, 0, 0);
      right.rotation.y = -Math.PI / 2;
      reflectionScene.add(right);
      reflectionObjects.push(right);

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 30),
        new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
      );
      floor.position.y = -CONFIG.roomHeight / 2;
      floor.rotation.x = Math.PI / 2;
      reflectionScene.add(floor);
      reflectionObjects.push(floor);

      const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 30),
        new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
      );
      ceiling.position.y = CONFIG.roomHeight / 2;
      ceiling.rotation.x = Math.PI / 2;
      reflectionScene.add(ceiling);
      reflectionObjects.push(ceiling);
    };

    if (heroVideoUrl) {
      videoEl = document.createElement("video");
      videoEl.src = heroVideoUrl;
      videoEl.crossOrigin = "anonymous"; // обязательно, иначе WebGL не сможет читать пиксели видео
      videoEl.loop = true;
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.autoplay = true;
      videoEl.setAttribute("playsinline", ""); // для старых iOS Safari
      videoEl.preload = "auto";

      videoTexture = new THREE.VideoTexture(videoEl);
      buildReflectionRoom(videoTexture);

      videoEl.play().catch((err) => {
        console.warn("[BrandSite] Автовоспроизведение видео заблокировано браузером:", err);
      });
    } else {
      console.warn("[BrandSite] heroVideoUrl отсутствует.");
    }

    /* ---------- CubeCamera ---------- */
    const cubeRT = new THREE.WebGLCubeRenderTarget(CONFIG.reflectionSize, {
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
    });
    const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRT);
    scene.add(cubeCamera);

    // const chromeMaterial = new THREE.MeshStandardMaterial({
    //   color: 0xffffff,
    //   metalness: 1,
    //   roughness: 0,
    //   envMap: cubeRT.texture,
    //   envMapIntensity: 2,
    //   transparent: false,
    //   side: THREE.DoubleSide,
    // });
    const chromeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  envMap: cubeRT.texture,
  reflectivity: 1,
  combine: THREE.MultiplyOperation, // или THREE.AddOperation для ярче/светлее
  side: THREE.DoubleSide,
});

    /* ---------- загрузка GLB ---------- */
    let current = null;
    const disposeModel = loadMeshWithMaterial({
      url: modelUrl,
      fallbackGeo: new THREE.IcosahedronGeometry(1, 2),
      material: chromeMaterial,
      label: "heroModelUrl",
      onReady: (object) => {
        fitAndCenter(object, CONFIG.modelSize);
        current = object;
        scene.add(current);

        const box = new THREE.Box3().setFromObject(current);
        const center = new THREE.Vector3();
        box.getCenter(center);
        cubeCamera.position.copy(center);
      },
    });

    /* ---------- drag / inertia / settle ---------- */
    const canvas = renderer.domElement;
    canvas.style.cursor = "grab";
    canvas.style.touchAction = "none";

    const state = {
      dragging: false,
      lastX: 0,
      velocity: 0,
      releasedAt: 0,
      settling: false,
      hasInteracted: false,
      envFrame: 0,
    };

    const shortestAngle = (from, to) => Math.atan2(Math.sin(to - from), Math.cos(to - from));

    const onPointerDown = (event) => {
      if (!current) return;
      state.dragging = true;
      state.settling = false;
      state.velocity = 0;
      state.hasInteracted = true;
      state.lastX = event.clientX;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    };

    const onPointerMove = (event) => {
      if (!state.dragging || !current) return;
      const dx = event.clientX - state.lastX;
      state.lastX = event.clientX;
      const rotationDelta = dx * CONFIG.dragSensitivity;
      current.rotation.y += rotationDelta;
      state.velocity = rotationDelta;
    };

    const onPointerUp = (event) => {
      if (!state.dragging) return;
      state.dragging = false;
      state.releasedAt = performance.now();
      canvas.style.cursor = "grab";
      try { canvas.releasePointerCapture(event.pointerId); } catch (_) {}
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    let raf;
    const animate = () => {
      if (current) {
        if (state.dragging) {
          // управление в onPointerMove
        } else if (!state.hasInteracted) {
          current.rotation.y += 0.003;
        } else if (!state.settling) {
          if (Math.abs(state.velocity) > CONFIG.minVelocity) {
            current.rotation.y += state.velocity;
            state.velocity *= CONFIG.inertiaDamping;
          } else if (performance.now() - state.releasedAt > CONFIG.settleDelay) {
            state.settling = true;
          }
        } else {
          const diff = shortestAngle(current.rotation.y, restRotationY);
          if (Math.abs(diff) > 0.002) {
            current.rotation.y += diff * CONFIG.settleSpeed;
          } else {
            current.rotation.y = restRotationY;
            state.settling = false;
            state.velocity = 0;
          }
        }
      }

      // VideoTexture сам помечает needsUpdate каждый кадр, пока видео играет —
      // руками ничего дергать не нужно, просто регулярно обновляем env-карту.
      state.envFrame++;
      if (state.envFrame >= CONFIG.envUpdateEveryFrame) {
        state.envFrame = 0;
        cubeCamera.update(renderer, reflectionScene);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      size = getSize();
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(size, size);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);

      disposeModel();

      if (current) {
        current.traverse((child) => {
          if (child.isMesh && child.geometry) child.geometry.dispose();
        });
      }

      reflectionObjects.forEach((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });

      if (videoTexture) videoTexture.dispose();
      if (videoEl) {
        videoEl.pause();
        videoEl.removeAttribute("src");
        videoEl.load();
      }

      cubeRT.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [modelUrl, heroVideoUrl, restRotationY]);

  return (
    <div className="hero-model-wrap">
      <div ref={mountRef} style={{ width: "70vmin", height: "70vmin", maxWidth: 560, maxHeight: 560 }} />
    </div>
  );
}

function Header({ cfg, onBurger }) {
  return (
    <header className="site-header">
      <HeaderOrb modelUrl={cfg.headerModelUrl} modelUrlAlt={cfg.headerModelUrlAlt} />
      {cfg.logoImage
        ? <img src={cfg.logoImage} alt={cfg.logoText} className="logo-img" />
        : <a href="#" className="logo">{cfg.logoText}</a>}
      <nav>
        {cfg.nav.map((item) => (
          <a href={item.href} key={item.label}>
            {item.label}
            {item.label.toLowerCase() === "cart" && <span className="cart-badge">0</span>}
          </a>
        ))}
      </nav>
      <button className="burger" onClick={onBurger}>Меню</button>
    </header>
  );
}

function MenuOverlay({ cfg, open, onClose }) {
  return (
    <div className={"menu-overlay" + (open ? " open" : "")}>
      <nav>
        {cfg.nav.map((item, i) => (
          <a href={item.href} key={item.label} onClick={onClose}>
            {item.label}
            <span className="idx">{String(i + 1).padStart(2, "0")}</span>
          </a>
        ))}
      </nav>
      <div className="menu-footer mono">
        {cfg.social.map((s) => <a key={s.label} href={s.href}>{s.label}</a>)}
      </div>
    </div>
  );
}

function Hero({ cfg }) {
  const bgVideoRef = useRef(null);

  useEffect(() => {
    const v = bgVideoRef.current;
    if (v) {
      v.play().catch((err) => console.warn("[BrandSite] Автовоспроизведение фонового видео заблокировано:", err));
    }
  }, [cfg.heroVideoUrl]);

  return (
    <section className="hero">
      <div className={"hero-bg" + (cfg.heroVideoUrl ? "" : " no-photo")}>
        {cfg.heroVideoUrl ? (
          <video
            ref={bgVideoRef}
            className="hero-bg-video"
            src={cfg.heroVideoUrl}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <div className="hero-bg-label">
            heroVideoUrl — замени на своё видео<br />(широкоформатное, ≥ 1920px по ширине)
          </div>
        )}
      </div>

      <HeroModel modelUrl={cfg.heroModelUrl} heroVideoUrl={cfg.heroVideoUrl} restRotationY={cfg.heroMirrorRestRotationY} />

      <div className="hero-lines">
        {cfg.heroLines.map((l, i) => (
          <div className={"line " + l.tone} key={i}>{l.text}</div>
        ))}
      </div>

      <a href={cfg.viewHref} className="hero-view-btn mono">{cfg.viewLabel}</a>

      <div className="hero-scroll-hint">
        <span>Scroll</span>
        <div className="bar"></div>
      </div>
    </section>
  );
}

function Marquee({ cfg }) {
  return (
    <div className="marquee">
      <div className="marquee-track">
        <span>{cfg.marqueeText.repeat(4)}</span>
        <span>{cfg.marqueeText.repeat(4)}</span>
      </div>
    </div>
  );
}

function EditorialGrid({ cfg }) {
  return (
    <section className="section">
      <div className="section-head">
        <h2 className="display">Свежий дроп</h2>
        <p>Замени плейсхолдеры в gridImages на свои фото — квадраты подстроятся сами.</p>
      </div>
      <div className="grid">
        {cfg.gridImages.map((img, i) => (
          <div className="cell" key={i}>
            <div className="frame">
              {img.src
                ? <img src={img.src} alt={img.cap} />
                : <div className="ph-label">{img.alt}</div>}
            </div>
            <div className="cap mono">{img.cap}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (email.includes("@")) setSent(true);
  };

  return (
    <div className="newsletter">
      <div className="newsletter-inner">
        <h3 className="display">Будь в курсе дропов первым</h3>
        <form className="newsletter-form" onSubmit={submit}>
          <div className="row">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="submit mono" type="submit">Подписаться</button>
          </div>
          <label className="agree mono">
            <input type="checkbox" required /> Согласен с политикой конфиденциальности
          </label>
          {sent && <div className="newsletter-msg">Готово — вы в списке.</div>}
        </form>
      </div>
    </div>
  );
}

function Footer({ cfg }) {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-cols">
          <div className="footer-col">
            <h4>Соцсети</h4>
            {cfg.social.map((s) => <a key={s.label} href={s.href}>{s.label}</a>)}
          </div>
          <div className="footer-col">
            <h4>Информация</h4>
            {cfg.infoLinks.map((s) => <a key={s.label} href={s.href}>{s.label}</a>)}
          </div>
          <div className="footer-col">
            <h4>Магазины</h4>
            {cfg.shops.map((s) => <span key={s}>{s}</span>)}
          </div>
          <div className="footer-col">
            <h4>Рассылка</h4>
            <span>Форма подписки — выше на странице.</span>
          </div>
        </div>
        <div className="footer-wordmark display">{cfg.logoText}</div>
        <div className="footer-bottom">
          <span>© {cfg.logoText} {new Date().getFullYear()}</span>
          <span>React + Three.js</span>
        </div>
      </div>
    </footer>
  );
}

function CookieBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="cookie-bar">
      <span>Сайт использует куки. Продолжая просмотр, вы соглашаетесь с их использованием.</span>
      <button className="accept" onClick={() => setVisible(false)}>Принять</button>
    </div>
  );
}

export default function BrandSite({ config }) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="brand-site">
      <Header cfg={cfg} onBurger={() => setMenuOpen((m) => !m)} />
      <MenuOverlay cfg={cfg} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Hero cfg={cfg} />
      <Marquee cfg={cfg} />
      <EditorialGrid cfg={cfg} />
      <Newsletter />
      <Footer cfg={cfg} />
      <CookieBar />
    </div>
  );
} 
// import React, { useState, useEffect, useRef } from "react";
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
// import "./Brandsite.css";

// const DEFAULT_CONFIG = {
//   logoText: "YOUR BRAND",
//   logoImage: null,
//   nav: [
//     { label: "Web Shop", href: "#" },
//     { label: "Shops", href: "#" },
//     { label: "Advice", href: "#" },
//     { label: "Cart", href: "#" },
//   ],
//   heroImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785509327/volt_park_visual9_lsorlm.jpg",
//   heroModelUrl: "https://res.cloudinary.com/dbx6muxub/image/upload/v1786869663/logo_alatkf.glb",
//   heroMirrorRestRotationY: 0,
//   headerModelUrl: null,
//   headerModelUrlAlt: null,
//   heroLines: [
//     { text: "Manor Place", tone: "dim2" },
//     { text: "Your Brand South2 West8", tone: "dim" },
//     { text: "Autumn 2026 Range", tone: "accent" },
//     { text: "Autumn 2026 Lookbook", tone: "normal" },
//   ],
//   viewLabel: "View Range",
//   viewHref: "#",
//   marqueeText: "YOUR BRAND — НОВЫЙ ДРОП — ",
//   gridImages: [
//     { src: "", alt: "editorial-1.jpg", cap: "01 — ЛУК" },
//     { src: "", alt: "editorial-2.jpg", cap: "02 — ДЕТАЛЬ" },
//     { src: "", alt: "editorial-3.jpg", cap: "03 — ДЕТАЛЬ" },
//     { src: "", alt: "editorial-4.jpg", cap: "04 — ЛУК" },
//   ],
//   social: [
//     { label: "Instagram", href: "#" },
//     { label: "TikTok", href: "#" },
//     { label: "YouTube", href: "#" },
//   ],
//   infoLinks: [
//     { label: "Доставка", href: "#" },
//     { label: "Возврат", href: "#" },
//     { label: "Условия использования", href: "#" },
//     { label: "Политика конфиденциальности", href: "#" },
//   ],
//   shops: ["Магазин RU", "Магазин EU", "Магазин US"],
// };

// /* ---------- зеркальный (хромированный) материал для маленького orb в хедере ---------- */
// function makeMirrorMaterial(extra = {}) {
//   return new THREE.MeshStandardMaterial({
//     color: 0xffffff,
//     metalness: 1,
//     roughness: 0.12,
//     envMapIntensity: 1.5,
//     transparent: false,
//     opacity: 1,
//     ...extra,
//   });
// }

// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

// /* ---------- общий загрузчик: своя модель или процедурная заглушка ---------- */
// function loadMeshWithMaterial({ url, fallbackGeo, material, onReady, label = "model" }) {
//   if (!url) {
//     onReady(new THREE.Mesh(fallbackGeo, material));
//     return () => {};
//   }

//   let cancelled = false;
//   const loader = new GLTFLoader();
//   loader.setDRACOLoader(dracoLoader);
//   loader.load(
//     url,
//     (gltf) => {
//       if (cancelled) return;
//       const group = gltf.scene;
//       group.traverse((child) => {
//         if (child.isMesh) {
//           if (Array.isArray(child.material)) {
//             // растягиваем один и тот же материал на все группы,
//             // чтобы не было рассинхрона material.length vs geometry.groups.length
//             child.material = child.material.map(() => material);
//           } else {
//             child.material = material;
//           }
//           child.material.needsUpdate = true;
//         }
//       });
//       onReady(group);
//     },
//     undefined,
//     (err) => {
//       console.error(`[BrandSite] Не удалось загрузить ${label} (${url}):`, err);
//       if (cancelled) return;
//       onReady(new THREE.Mesh(fallbackGeo, material));
//     }
//   );
//   return () => { cancelled = true; };
// }

// /* ---------- центрирование и нормализация масштаба под размер сцены ---------- */
// function fitAndCenter(object, targetSize) {
//   const box = new THREE.Box3().setFromObject(object);
//   const size = new THREE.Vector3();
//   box.getSize(size);
//   const maxDim = Math.max(size.x, size.y, size.z) || 1;
//   object.scale.setScalar(targetSize / maxDim);

//   const box2 = new THREE.Box3().setFromObject(object);
//   const center = new THREE.Vector3();
//   box2.getCenter(center);
//   object.position.sub(center);
// }

// /* ---------- маленький вращающийся 3D-объект в хедере ---------- */
// function HeaderOrb({ modelUrl, modelUrlAlt }) {
//   const mountRef = useRef(null);

//   useEffect(() => {
//     const mount = mountRef.current;
//     const size = 42;

//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
//     camera.position.set(0, 0, 3.2);

//     const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
//     renderer.setSize(size, size);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     mount.appendChild(renderer.domElement);

//     const pmrem = new THREE.PMREMGenerator(renderer);
//     scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

//     const light = new THREE.PointLight(0xffffff, 2);
//     light.position.set(2, 2, 2);
//     scene.add(light);

//     let current = null;
//     let dispose1 = () => {};
//     let dispose2 = null;

//     const setMesh = (obj) => {
//       if (current) scene.remove(current);
//       current = obj;
//       fitAndCenter(current, 1.5);
//       scene.add(current);
//     };

//     dispose1 = loadMeshWithMaterial({
//       url: modelUrl,
//       fallbackGeo: new THREE.IcosahedronGeometry(1, 0),
//       material: makeMirrorMaterial(),
//       label: "headerModelUrl",
//       onReady: setMesh,
//     });

//     let altObj = null;
//     if (modelUrlAlt !== undefined) {
//       dispose2 = loadMeshWithMaterial({
//         url: modelUrlAlt,
//         fallbackGeo: new THREE.OctahedronGeometry(1.1, 0),
//         material: makeMirrorMaterial(),
//         label: "headerModelUrlAlt",
//         onReady: (obj) => { fitAndCenter(obj, 1.5); obj.visible = false; scene.add(obj); },
//       });
//     }

//     let swapped = false;
//     const onScroll = () => {
//       const shouldSwap = window.scrollY > 60;
//       if (shouldSwap !== swapped) {
//         swapped = shouldSwap;
//         if (altObj && current) {
//           scene.remove(current);
//           current.visible = true;
//           const tmp = current;
//           current = altObj;
//           current.visible = true;
//           altObj = tmp;
//           altObj.visible = false;
//           scene.add(current);
//         }
//       }
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });

//     let raf;
//     const animate = () => {
//       if (current) {
//         current.rotation.y += 0.02;
//         current.rotation.x += 0.008;
//       }
//       renderer.render(scene, camera);
//       raf = requestAnimationFrame(animate);
//     };
//     animate();

//     return () => {
//       cancelAnimationFrame(raf);
//       window.removeEventListener("scroll", onScroll);
//       dispose1();
//       if (dispose2) dispose2();
//       mount.removeChild(renderer.domElement);
//       renderer.dispose();
//       pmrem.dispose();
//     };
//   }, [modelUrl, modelUrlAlt]);

//   return <div className="header-orb" ref={mountRef}></div>;
// }

// function HeroModel({ modelUrl, heroImage, restRotationY = 0 }) {
//   const mountRef = useRef(null);

//   useEffect(() => {
//     const mount = mountRef.current;
//     if (!mount) return;

//     const CONFIG = {
//       modelSize: 2.8,
//       cameraZ: 6,
//       reflectionSize: 1024,
//       dragSensitivity: 0.008,
//       inertiaDamping: 0.94,
//       minVelocity: 0.00015,
//       settleDelay: 500,
//       settleSpeed: 0.045,
//       envUpdateEveryFrame: 2,
//       roomDistance: 12,
//       roomHeight: 16,
//     };

//     /* ---------- основная сцена ---------- */
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
//     camera.position.set(0, 0, CONFIG.cameraZ);

//     const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
//     const getSize = () => Math.min(mount.clientWidth || 560, mount.clientHeight || 560, 560);
//     let size = getSize();
//     renderer.setSize(size, size);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3));

//     if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
//     else renderer.outputEncoding = THREE.sRGBEncoding;
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 1.15;
//     mount.appendChild(renderer.domElement);

//     scene.add(new THREE.HemisphereLight(0xffffff, 0x333333, 1.4));
//     const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
//     keyLight.position.set(4, 6, 8);
//     scene.add(keyLight);
//     const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
//     fillLight.position.set(-5, 2, 4);
//     scene.add(fillLight);

//     /* ---------- reflection-scene: НИКОГДА не рендерится на экран напрямую ---------- */
//     const reflectionScene = new THREE.Scene();
//     reflectionScene.background = new THREE.Color(0x77736b);

//     let photoTexture = null;
//     const reflectionObjects = [];

   
//     const buildReflectionRoom = (texture) => {
//       reflectionObjects.forEach((obj) => {
//         reflectionScene.remove(obj);
//         if (obj.geometry) obj.geometry.dispose();
//         if (obj.material) obj.material.dispose();
//       });
//       reflectionObjects.length = 0;

//       texture.colorSpace = THREE.SRGBColorSpace;
//       texture.wrapS = THREE.ClampToEdgeWrapping;
//       texture.wrapT = THREE.ClampToEdgeWrapping;
//       texture.minFilter = THREE.LinearFilter;
//       texture.magFilter = THREE.LinearFilter;
//       texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

//       const wallGeoWide = new THREE.PlaneGeometry(30, 16.875);
//       const wallGeoSide = new THREE.PlaneGeometry(24, 16);

//       const front = new THREE.Mesh(wallGeoWide, new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
//       front.position.set(0, 0, -CONFIG.roomDistance);
//       front.rotation.y = Math.PI;
//       reflectionScene.add(front);
//       reflectionObjects.push(front);

//       const back = new THREE.Mesh(wallGeoWide, new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
//       back.position.set(0, 0, CONFIG.roomDistance);
//       reflectionScene.add(back);
//       reflectionObjects.push(back);

//       const left = new THREE.Mesh(wallGeoSide, new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
//       left.position.set(-CONFIG.roomDistance, 0, 0);
//       left.rotation.y = Math.PI / 2;
//       reflectionScene.add(left);
//       reflectionObjects.push(left);

//       const right = new THREE.Mesh(wallGeoSide, new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }));
//       right.position.set(CONFIG.roomDistance, 0, 0);
//       right.rotation.y = -Math.PI / 2;
//       reflectionScene.add(right);
//       reflectionObjects.push(right);

      
//       const floor = new THREE.Mesh(
//         new THREE.PlaneGeometry(30, 30),
//         new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
//       );
//       floor.position.y = -CONFIG.roomHeight / 2;
//       floor.rotation.x = Math.PI / 2;
//       reflectionScene.add(floor);
//       reflectionObjects.push(floor);

//       const ceiling = new THREE.Mesh(
//         new THREE.PlaneGeometry(30, 30),
//         new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
//       );
//       ceiling.position.y = CONFIG.roomHeight / 2;
//       ceiling.rotation.x = Math.PI / 2;
//       reflectionScene.add(ceiling);
//       reflectionObjects.push(ceiling);
//     };

//     if (heroImage) {
//       const textureLoader = new THREE.TextureLoader();
//       textureLoader.setCrossOrigin("anonymous");
//       textureLoader.load(
//         heroImage,
//         (texture) => {
//           photoTexture = texture;
//           buildReflectionRoom(texture);
//         },
//         undefined,
//         (error) => console.error("[BrandSite] Reflection image FAILED (проверь CORS на Cloudinary):", error)
//       );
//     } else {
//       console.warn("[BrandSite] heroImage отсутствует.");
//     }

//     /* ---------- CubeCamera ---------- */
//     const cubeRT = new THREE.WebGLCubeRenderTarget(CONFIG.reflectionSize, {
//       generateMipmaps: true,
//       minFilter: THREE.LinearMipmapLinearFilter,
//       magFilter: THREE.LinearFilter,
//     });
//     const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRT);
//     scene.add(cubeCamera);

   
//     const chromeMaterial = new THREE.MeshStandardMaterial({
//       color: 0xffffff,
//       metalness: 1,
//       roughness: 0,
//       envMap: cubeRT.texture,
//       envMapIntensity: 2,
//       transparent: false,
//       // opacity: 1,
//       side: THREE.DoubleSide,
//     });

//     /* ---------- загрузка GLB ---------- */
//     let current = null;
//     const disposeModel = loadMeshWithMaterial({
//       url: modelUrl,
//       fallbackGeo: new THREE.IcosahedronGeometry(1, 2),
//       material: chromeMaterial,
//       label: "heroModelUrl",
//       onReady: (object) => {
//         fitAndCenter(object, CONFIG.modelSize);
//         current = object;
//         scene.add(current);

//         const box = new THREE.Box3().setFromObject(current);
//         const center = new THREE.Vector3();
//         box.getCenter(center);
//         cubeCamera.position.copy(center);
//       },
//     });

//     /* ---------- drag / inertia / settle ---------- */
//     const canvas = renderer.domElement;
//     canvas.style.cursor = "grab";
//     canvas.style.touchAction = "none";

//     const state = {
//       dragging: false,
//       lastX: 0,
//       velocity: 0,
//       releasedAt: 0,
//       settling: false,
//       hasInteracted: false,
//       envFrame: 0,
//     };

//     const shortestAngle = (from, to) => Math.atan2(Math.sin(to - from), Math.cos(to - from));

//     const onPointerDown = (event) => {
//       if (!current) return;
//       state.dragging = true;
//       state.settling = false;
//       state.velocity = 0;
//       state.hasInteracted = true;
//       state.lastX = event.clientX;
//       canvas.setPointerCapture(event.pointerId);
//       canvas.style.cursor = "grabbing";
//     };

//     const onPointerMove = (event) => {
//       if (!state.dragging || !current) return;
//       const dx = event.clientX - state.lastX;
//       state.lastX = event.clientX;
//       const rotationDelta = dx * CONFIG.dragSensitivity;
//       current.rotation.y += rotationDelta;
//       state.velocity = rotationDelta;
//     };

//     const onPointerUp = (event) => {
//       if (!state.dragging) return;
//       state.dragging = false;
//       state.releasedAt = performance.now();
//       canvas.style.cursor = "grab";
//       try { canvas.releasePointerCapture(event.pointerId); } catch (_) {}
//     };

//     canvas.addEventListener("pointerdown", onPointerDown);
//     canvas.addEventListener("pointermove", onPointerMove);
//     canvas.addEventListener("pointerup", onPointerUp);
//     canvas.addEventListener("pointercancel", onPointerUp);

//     let raf;
//     const animate = () => {
//       if (current) {
//         if (state.dragging) {
//           // управление в onPointerMove
//         } else if (!state.hasInteracted) {
//           current.rotation.y += 0.003;
//         } else if (!state.settling) {
//           if (Math.abs(state.velocity) > CONFIG.minVelocity) {
//             current.rotation.y += state.velocity;
//             state.velocity *= CONFIG.inertiaDamping;
//           } else if (performance.now() - state.releasedAt > CONFIG.settleDelay) {
//             state.settling = true;
//           }
//         } else {
//           const diff = shortestAngle(current.rotation.y, restRotationY);
//           if (Math.abs(diff) > 0.002) {
//             current.rotation.y += diff * CONFIG.settleSpeed;
//           } else {
//             current.rotation.y = restRotationY;
//             state.settling = false;
//             state.velocity = 0;
//           }
//         }
//       }

//       state.envFrame++;
//       if (state.envFrame >= CONFIG.envUpdateEveryFrame) {
//         state.envFrame = 0;
//         cubeCamera.update(renderer, reflectionScene);
//       }

//       renderer.render(scene, camera);
//       raf = requestAnimationFrame(animate);
//     };
//     animate();

//     const onResize = () => {
//       size = getSize();
//       camera.aspect = 1;
//       camera.updateProjectionMatrix();
//       renderer.setSize(size, size);
//     };
//     window.addEventListener("resize", onResize);

//     return () => {
//       cancelAnimationFrame(raf);
//       window.removeEventListener("resize", onResize);
//       canvas.removeEventListener("pointerdown", onPointerDown);
//       canvas.removeEventListener("pointermove", onPointerMove);
//       canvas.removeEventListener("pointerup", onPointerUp);
//       canvas.removeEventListener("pointercancel", onPointerUp);

//       disposeModel();

//       if (current) {
//         current.traverse((child) => {
//           if (child.isMesh && child.geometry) child.geometry.dispose();
//         });
//       }

//       reflectionObjects.forEach((obj) => {
//         if (obj.geometry) obj.geometry.dispose();
//         if (obj.material) obj.material.dispose();
//       });

//       if (photoTexture) photoTexture.dispose();
//       cubeRT.dispose();
//       renderer.dispose();
//       if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
//     };
//   }, [modelUrl, heroImage, restRotationY]);

//   return (
//     <div className="hero-model-wrap">
//       <div ref={mountRef} style={{ width: "70vmin", height: "70vmin", maxWidth: 560, maxHeight: 560 }} />
//     </div>
//   );
// }

// function Header({ cfg, onBurger }) {
//   return (
//     <header className="site-header">
//       <HeaderOrb modelUrl={cfg.headerModelUrl} modelUrlAlt={cfg.headerModelUrlAlt} />
//       {cfg.logoImage
//         ? <img src={cfg.logoImage} alt={cfg.logoText} className="logo-img" />
//         : <a href="#" className="logo">{cfg.logoText}</a>}
//       <nav>
//         {cfg.nav.map((item) => (
//           <a href={item.href} key={item.label}>
//             {item.label}
//             {item.label.toLowerCase() === "cart" && <span className="cart-badge">0</span>}
//           </a>
//         ))}
//       </nav>
//       <button className="burger" onClick={onBurger}>Меню</button>
//     </header>
//   );
// }

// function MenuOverlay({ cfg, open, onClose }) {
//   return (
//     <div className={"menu-overlay" + (open ? " open" : "")}>
//       <nav>
//         {cfg.nav.map((item, i) => (
//           <a href={item.href} key={item.label} onClick={onClose}>
//             {item.label}
//             <span className="idx">{String(i + 1).padStart(2, "0")}</span>
//           </a>
//         ))}
//       </nav>
//       <div className="menu-footer mono">
//         {cfg.social.map((s) => <a key={s.label} href={s.href}>{s.label}</a>)}
//       </div>
//     </div>
//   );
// }

// function Hero({ cfg }) {
//   return (
//     <section className="hero">
//       <div
//         className={"hero-bg" + (cfg.heroImage ? "" : " no-photo")}
//         style={cfg.heroImage ? { backgroundImage: `url(${cfg.heroImage})` } : undefined}
//       >
//         {!cfg.heroImage && (
//           <div className="hero-bg-label">
//             heroImage — замени на своё фото<br />(широкоформатное, ≥ 2000px по ширине)
//           </div>
//         )}
//       </div>

//       <HeroModel modelUrl={cfg.heroModelUrl} heroImage={cfg.heroImage} restRotationY={cfg.heroMirrorRestRotationY} />

//       <div className="hero-lines">
//         {cfg.heroLines.map((l, i) => (
//           <div className={"line " + l.tone} key={i}>{l.text}</div>
//         ))}
//       </div>

//       <a href={cfg.viewHref} className="hero-view-btn mono">{cfg.viewLabel}</a>

//       <div className="hero-scroll-hint">
//         <span>Scroll</span>
//         <div className="bar"></div>
//       </div>
//     </section>
//   );
// }

// function Marquee({ cfg }) {
//   return (
//     <div className="marquee">
//       <div className="marquee-track">
//         <span>{cfg.marqueeText.repeat(4)}</span>
//         <span>{cfg.marqueeText.repeat(4)}</span>
//       </div>
//     </div>
//   );
// }

// function EditorialGrid({ cfg }) {
//   return (
//     <section className="section">
//       <div className="section-head">
//         <h2 className="display">Свежий дроп</h2>
//         <p>Замени плейсхолдеры в gridImages на свои фото — квадраты подстроятся сами.</p>
//       </div>
//       <div className="grid">
//         {cfg.gridImages.map((img, i) => (
//           <div className="cell" key={i}>
//             <div className="frame">
//               {img.src
//                 ? <img src={img.src} alt={img.cap} />
//                 : <div className="ph-label">{img.alt}</div>}
//             </div>
//             <div className="cap mono">{img.cap}</div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// function Newsletter() {
//   const [email, setEmail] = useState("");
//   const [sent, setSent] = useState(false);

//   const submit = (e) => {
//     e.preventDefault();
//     if (email.includes("@")) setSent(true);
//   };

//   return (
//     <div className="newsletter">
//       <div className="newsletter-inner">
//         <h3 className="display">Будь в курсе дропов первым</h3>
//         <form className="newsletter-form" onSubmit={submit}>
//           <div className="row">
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <button className="submit mono" type="submit">Подписаться</button>
//           </div>
//           <label className="agree mono">
//             <input type="checkbox" required /> Согласен с политикой конфиденциальности
//           </label>
//           {sent && <div className="newsletter-msg">Готово — вы в списке.</div>}
//         </form>
//       </div>
//     </div>
//   );
// }

// function Footer({ cfg }) {
//   return (
//     <footer>
//       <div className="footer-inner">
//         <div className="footer-cols">
//           <div className="footer-col">
//             <h4>Соцсети</h4>
//             {cfg.social.map((s) => <a key={s.label} href={s.href}>{s.label}</a>)}
//           </div>
//           <div className="footer-col">
//             <h4>Информация</h4>
//             {cfg.infoLinks.map((s) => <a key={s.label} href={s.href}>{s.label}</a>)}
//           </div>
//           <div className="footer-col">
//             <h4>Магазины</h4>
//             {cfg.shops.map((s) => <span key={s}>{s}</span>)}
//           </div>
//           <div className="footer-col">
//             <h4>Рассылка</h4>
//             <span>Форма подписки — выше на странице.</span>
//           </div>
//         </div>
//         <div className="footer-wordmark display">{cfg.logoText}</div>
//         <div className="footer-bottom">
//           <span>© {cfg.logoText} {new Date().getFullYear()}</span>
//           <span>React + Three.js</span>
//         </div>
//       </div>
//     </footer>
//   );
// }

// function CookieBar() {
//   const [visible, setVisible] = useState(true);
//   if (!visible) return null;
//   return (
//     <div className="cookie-bar">
//       <span>Сайт использует куки. Продолжая просмотр, вы соглашаетесь с их использованием.</span>
//       <button className="accept" onClick={() => setVisible(false)}>Принять</button>
//     </div>
//   );
// }

// export default function BrandSite({ config }) {
//   const cfg = { ...DEFAULT_CONFIG, ...config };
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <div className="brand-site">
//       <Header cfg={cfg} onBurger={() => setMenuOpen((m) => !m)} />
//       <MenuOverlay cfg={cfg} open={menuOpen} onClose={() => setMenuOpen(false)} />
//       <Hero cfg={cfg} />
//       <Marquee cfg={cfg} />
//       <EditorialGrid cfg={cfg} />
//       <Newsletter />
//       <Footer cfg={cfg} />
//       <CookieBar />
//     </div>
//   );
// }