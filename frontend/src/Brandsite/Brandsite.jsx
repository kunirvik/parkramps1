import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import "./Brandsite.css";

/* ============================================================
   BrandSite — hero-страница в стиле Palace Skateboards.

   ЧТО ЗДЕСЬ ЕСТЬ:
   1) Плавающая капсула-хедер с маленьким вращающимся 3D-объектом
      слева от лого. При скролле объект меняется на другой
      (headerModelUrl -> headerModelUrlAlt).
   2) Hero: фото-фон + большая 3D-модель (настоящее зеркало —
      metalness:1, roughness:0, envMap = само hero-фото) по центру.
      Сцена стартует с автовращения. Как только пользователь
      зажимает мышь на модели и тащит — вращение полностью
      переходит под его контроль (перетаскивание = поворот по X/Y,
      как в orbit-controls), при отпускании остаётся инерция,
      которая плавно гаснет и снова переходит в автовращение.
      Модель всегда непрозрачна; "слияние" с фоном — оптический
      эффект самого зеркала: когда модель разворачивается почти
      ребром к камере, её видимая площадь схлопывается и сквозь
      неё остаётся в основном отражение/фон, то есть в этот момент
      она визуально "выравнивается" с фотографией за ней.

   КАК ПОДКЛЮЧИТЬ СВОЮ 3D-МОДЕЛЬ:
     <BrandSite config={{
       heroModelUrl: "/models/logo.glb",       // твоя модель для hero
       headerModelUrl: "/models/icon-a.glb",   // модель в хедере (до скролла)
       headerModelUrlAlt: "/models/icon-b.glb",// модель в хедере (после скролла)
       heroImage: "/img/hero.jpg",
     }} />

   Если URL моделей не передать — используются процедурные
   стеклянные фигуры (работает "из коробки" для превью).

   Зависимости: react, three (npm i three).
   Модули three/examples/jsm/* идут в комплекте с пакетом three.
============================================================= */

const DEFAULT_CONFIG = {
  logoText: "YOUR BRAND",
  logoImage: null,
  nav: [
    { label: "Web Shop", href: "#" },
    { label: "Shops", href: "#" },
    { label: "Advice", href: "#" },
    { label: "Cart", href: "#" },
  ],
  heroImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785509360/volt_park_visual4_zzykei.jpg", // ссылка на своё фото для фона hero
  heroModelUrl: "https://res.cloudinary.com/dbx6muxub/image/upload/v1786811336/model_eteyx8.glb", // ссылка на свой .glb для центра hero
  headerModelUrl: null, // .glb для хедера (состояние 1)
  headerModelUrlAlt: null, // .glb для хедера (состояние 2, после скролла)
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

/* ---------- зеркальный (хромированный) материал ----------
   metalness:1, roughness:0 = настоящее зеркало: никакой прозрачности,
   вся картинка вокруг (в т.ч. envMap с hero-фото) отражается в поверхности.
   При повороте модели меняется её нормаль относительно камеры —
   поэтому отражение "плывёт" по поверхности, как в реальном зеркале. */
function makeMirrorMaterial(){
  return new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1,
    roughness: 0.04,
    envMapIntensity: 1.3,
    transparent: false,
    opacity: 1,
  });
}

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

/* ---------- общий загрузчик: своя модель или процедурная заглушка ---------- */
function loadMirrorMesh({ url, fallbackGeo, onReady, label = "model" }){
  const material = makeMirrorMaterial();

  if (!url) {
    const mesh = new THREE.Mesh(fallbackGeo, material);
    onReady(mesh);
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
        if (child.isMesh) child.material = material;
      });
      onReady(group);
    },
    undefined,
    (err) => {
      // ВАЖНО: если модель не грузится, ошибка попадёт сюда — смотри консоль браузера.
      // Частые причины: неверный путь (файл должен лежать в /public и путь начинаться с "/"),
      // CORS на другом домене, модель сжата Draco без прописанного decoder-пути (уже подключён выше),
      // либо .gltf ссылается на .bin/текстуры, которые не выложены рядом с ним.
      console.error(`[BrandSite] Не удалось загрузить ${label} (${url}):`, err);
      if (cancelled) return;
      const mesh = new THREE.Mesh(fallbackGeo, material);
      onReady(mesh);
    }
  );
  return () => { cancelled = true; };
}

/* ---------- маленький вращающийся 3D-объект в хедере ---------- */
function HeaderOrb({ modelUrl, modelUrlAlt }){
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
      current.scale.setScalar(1.15);
      scene.add(current);
    };

    dispose1 = loadMirrorMesh({
      url: modelUrl,
      fallbackGeo: new THREE.IcosahedronGeometry(1, 0),
      label: "headerModelUrl",
      onReady: setMesh,
    });

    // второе состояние (после скролла) грузим сразу, чтобы переключение было мгновенным
    let altObj = null;
    if (modelUrlAlt !== undefined) {
      dispose2 = loadMirrorMesh({
        url: modelUrlAlt,
        fallbackGeo: new THREE.OctahedronGeometry(1.1, 0),
        label: "headerModelUrlAlt",
        onReady: (obj) => { altObj = obj; obj.visible = false; scene.add(obj); },
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

/* ---------- большая hero-модель: настоящее зеркало, отражающее hero-фото ---------- */
function HeroModel({ modelUrl, heroImage }){
  const mountRef = useRef(null);
  const canvasWrapRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const getSize = () => Math.min(mount.clientWidth, mount.clientHeight, 560);
    let size = getSize();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    // запасной студийный env — используется, пока (или если) фото не загрузилось
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.05).texture;

    // ---- главное: envMap = само hero-фото ----
    // Так модель буквально отражает фон. Поворот модели меняет нормали
    // относительно камеры — значит меняется и то, какой участок фото
    // "смотрит" в объектив, то есть отражение реально едет по поверхности.
    let envTexture = null;
    if (heroImage) {
      const texLoader = new THREE.TextureLoader();
      texLoader.load(
        heroImage,
        (tex) => {
          tex.mapping = THREE.EquirectangularReflectionMapping;
          if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
          else tex.encoding = THREE.sRGBEncoding;
          envTexture = tex;
          scene.environment = tex;
        },
        undefined,
        (err) => console.error("[BrandSite] Не удалось загрузить heroImage как envMap:", err)
      );
    }

    const key = new THREE.PointLight(0xffffff, 1.5);
    key.position.set(3, 4, 5);
    scene.add(key);

    let current = null;
    const dispose = loadMirrorMesh({
      url: modelUrl,
      fallbackGeo: new THREE.CylinderGeometry(1.7, 1.7, 0.18, 72),
      label: "heroModelUrl",
      onReady: (obj) => { current = obj; scene.add(obj); },
    });

    /* ---------- drag-to-rotate с захватом мыши + инерция ---------- */
    const canvas = renderer.domElement;
    canvas.style.cursor = "grab";

    const state = {
      dragging: false,
      lastX: 0, lastY: 0,
      velX: 0, velY: 0,
      idleSpeed: 0.006, // скорость автовращения в состоянии покоя
    };

    const onPointerDown = (e) => {
      state.dragging = true;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      state.velX = 0; state.velY = 0;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onPointerMove = (e) => {
      if (!state.dragging || !current) return;
      const dx = e.clientX - state.lastX;
      const dy = e.clientY - state.lastY;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      const sensitivity = 0.008;
      current.rotation.y += dx * sensitivity;
      current.rotation.x += dy * sensitivity;
      // запоминаем скорость жеста — пригодится для инерции после отпускания
      state.velX = dx * sensitivity;
      state.velY = dy * sensitivity;
    };
    const endDrag = (e) => {
      if (!state.dragging) return;
      state.dragging = false;
      canvas.style.cursor = "grab";
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);

    let raf;
    const animate = () => {
      if (current) {
        if (state.dragging) {
          // во время перетаскивания вращение полностью управляется курсором (см. onPointerMove)
        } else if (Math.abs(state.velX) > 0.0002 || Math.abs(state.velY) > 0.0002) {
          // инерция после отпускания — плавно гасим скорость жеста
          current.rotation.y += state.velX;
          current.rotation.x += state.velY;
          state.velX *= 0.94;
          state.velY *= 0.94;
        } else {
          // авто-вращение в состоянии покоя
          current.rotation.y += state.idleSpeed;
          current.rotation.x += state.idleSpeed * 0.35;
        }
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
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("resize", onResize);
      dispose();
      if (envTexture) envTexture.dispose();
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      pmrem.dispose();
    };
  }, [modelUrl, heroImage]);

  // Модель всегда полностью непрозрачна и видна — никакого fade при скролле.
  // Фото при этом всегда остаётся позади, как самостоятельный слой фона.
  return (
    <div className="hero-model-wrap" ref={canvasWrapRef}>
      <div ref={mountRef} style={{ width: "70vmin", height: "70vmin", maxWidth: 560, maxHeight: 560 }}></div>
    </div>
  );
}

function Header({ cfg, onBurger }){
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

function MenuOverlay({ cfg, open, onClose }){
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

function Hero({ cfg }){
  return (
    <section className="hero">
      <div
        className={"hero-bg" + (cfg.heroImage ? "" : " no-photo")}
        style={cfg.heroImage ? { backgroundImage: `url(${cfg.heroImage})` } : undefined}
      >
        {!cfg.heroImage && (
          <div className="hero-bg-label">
            heroImage — замени на своё фото<br />(широкоформатное, ≥ 2000px по ширине)
          </div>
        )}
      </div>

      <HeroModel modelUrl={cfg.heroModelUrl} heroImage={cfg.heroImage} />

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

function Marquee({ cfg }){
  return (
    <div className="marquee">
      <div className="marquee-track">
        <span>{cfg.marqueeText.repeat(4)}</span>
        <span>{cfg.marqueeText.repeat(4)}</span>
      </div>
    </div>
  );
}

function EditorialGrid({ cfg }){
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

function Newsletter(){
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

function Footer({ cfg }){
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

function CookieBar(){
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="cookie-bar">
      <span>Сайт использует куки. Продолжая просмотр, вы соглашаетесь с их использованием.</span>
      <button className="accept" onClick={() => setVisible(false)}>Принять</button>
    </div>
  );
}

export default function BrandSite({ config }){
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