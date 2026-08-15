import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import "./Brandsite.css";

/* ============================================================
   BrandSite — hero-страница в стиле Palace Skateboards.

   ЧТО ЗДЕСЬ ЕСТЬ:
   1) Плавающая капсула-хедер с маленьким вращающимся 3D-объектом
      слева от лого. При скролле объект меняется на другой
      (headerModelUrl -> headerModelUrlAlt).
   2) Hero: фото-фон + большая 3D-модель (зеркальное/стеклянное
      физическое стекло — transmission + envMap) по центру,
      которая крутится, а при скролле "растворяется" и как бы
      сливается с фото (canvas тает и немного увеличивается,
      фон-фото одновременно расфокусируется -> становится резким).

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
  heroImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785509354/volt_park_visual5_y7b5ab.jpg", // ссылка на своё фото для фона hero
  heroModelUrl: "https://res.cloudinary.com/dbx6muxub/image/upload/v1786811336/model_eteyx8.glb", // ссылка на свой .glb для центра hero
  headerModelUrl: "https://res.cloudinary.com/dbx6muxub/image/upload/v1786811336/model_eteyx8.glb", // .glb для хедера (состояние 1)
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

/* ---------- общий загрузчик: своя модель или процедурная заглушка ---------- */
function loadGlassMesh({ url, fallbackGeo, color = 0xffffff, onReady }){
  const material = new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.1,
    roughness: 0.06,
    transmission: 1,
    thickness: 1.2,
    ior: 1.4,
    iridescence: 0.6,
    iridescenceIOR: 1.3,
    reflectivity: 0.6,
    envMapIntensity: 1.4,
  });

  if (!url) {
    const mesh = new THREE.Mesh(fallbackGeo, material);
    onReady(mesh);
    return () => {};
  }

  let cancelled = false;
  const loader = new GLTFLoader();
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
    () => {
      // если своя модель не загрузилась — показываем заглушку, чтобы сцена не была пустой
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

    dispose1 = loadGlassMesh({
      url: modelUrl,
      fallbackGeo: new THREE.IcosahedronGeometry(1, 0),
      color: 0x1f3bff,
      onReady: setMesh,
    });

    // второе состояние (после скролла) грузим сразу, чтобы переключение было мгновенным
    let altObj = null;
    if (modelUrlAlt !== undefined) {
      dispose2 = loadGlassMesh({
        url: modelUrlAlt,
        fallbackGeo: new THREE.OctahedronGeometry(1.1, 0),
        color: 0xd4ff3f,
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

/* ---------- большая hero-модель: крутится, при скролле "тает" в фото ---------- */
function HeroModel({ modelUrl }){
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
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.05).texture;

    const key = new THREE.PointLight(0xffffff, 3);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0x1f3bff, 2);
    rim.position.set(-4, -2, -3);
    scene.add(rim);

    let current = null;
    const dispose = loadGlassMesh({
      url: modelUrl,
      fallbackGeo: new THREE.IcosahedronGeometry(1.8, 1),
      color: 0xffffff,
      onReady: (obj) => { current = obj; scene.add(obj); },
    });

    let mouseX = 0, mouseY = 0;
    const onMove = (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMove);

    let raf;
    const animate = () => {
      if (current) {
        current.rotation.y += 0.006;
        current.rotation.x += 0.0025;
        current.rotation.x += (mouseY * 0.6 - current.rotation.x) * 0.01;
        current.rotation.y += (mouseX * 0.6 - current.rotation.y) * 0.01;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    // ---- скролл: модель растворяется и "сливается" с фото ----
    const heroEl = mount.closest(".hero");
    const wrap = canvasWrapRef.current;
    const bg = heroEl ? heroEl.querySelector(".hero-bg") : null;

    const onScroll = () => {
      if (!heroEl) return;
      const heroHeight = heroEl.offsetHeight;
      const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);
      // модель тает и немного растёт, будто расходится в частицы фото
      wrap.style.opacity = String(1 - progress);
      wrap.style.transform = `scale(${1 + progress * 0.5})`;
      // фото одновременно проявляется из размытия — эффект слияния
      if (bg) {
        const blur = 6 * (1 - progress);
        const brightness = 0.72 + progress * 0.28;
        bg.style.filter = `blur(${blur}px) brightness(${brightness}) saturate(0.9)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const onResize = () => {
      size = getSize();
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(size, size);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      dispose();
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      pmrem.dispose();
    };
  }, [modelUrl]);

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

      <HeroModel modelUrl={cfg.heroModelUrl} />

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