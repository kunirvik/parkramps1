import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import "./BrandSite.css";

/* ============================================================
   BrandSite — компонент-страница в стиле Palace Skateboards
   (шапка, hero-слайдер с Three.js акцентом, бегущая строка,
   редакторская сетка, подписка, футер).

   ИСПОЛЬЗОВАНИЕ:
     import BrandSite from "./BrandSite";

     <BrandSite config={{
       logoText: "MY BRAND",
       heroSlides: [{ src: "/img/hero-1.jpg", caption: "SS26" }],
       ...
     }} />

   Если проп config не передан — используется DEFAULT_CONFIG ниже.
   Требует установленных зависимостей: react, three.
============================================================= */

const DEFAULT_CONFIG = {
  logoText: "YOUR BRAND",
  logoImage: null, // например "/img/logo.svg" — если задан, используется вместо logoText в шапке
  nav: [
    { label: "Магазин", href: "#" },
    { label: "Точки продаж", href: "#" },
    { label: "Журнал", href: "#" },
  ],
  heroSlides: [
    { src: "", alt: "hero-1.jpg — вертикальное фото 1600×2000", caption: "НОВАЯ КОЛЛЕКЦИЯ" },
    { src: "", alt: "hero-2.jpg — вертикальное фото 1600×2000", caption: "ЛУКБУК" },
  ],
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

/* ---------- Three.js hero-акцент ---------- */
function ThreeAccent(){
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth, height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const geo = new THREE.TorusKnotGeometry(1.5, 0.35, 140, 12);
    const mat = new THREE.MeshBasicMaterial({ color: 0x1f3bff, wireframe: true, transparent: true, opacity: 0.85 });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    let mouseX = 0, mouseY = 0;
    const onMove = (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMove);

    let raf;
    const animate = () => {
      mesh.rotation.x += 0.003;
      mesh.rotation.y += 0.004;
      mesh.rotation.z += 0.001;
      mesh.rotation.x += (mouseY - mesh.rotation.x * 0.02) * 0.01;
      mesh.rotation.y += (mouseX - mesh.rotation.y * 0.02) * 0.01;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div className="three-canvas" ref={mountRef}></div>;
}

function Header({ cfg, onBurger }){
  return (
    <header className="site-header">
      <div className="side left">
        <button className="burger mono" onClick={onBurger}>Меню</button>
      </div>
      {cfg.logoImage
        ? <img src={cfg.logoImage} alt={cfg.logoText} className="logo-img" />
        : <a href="#" className="logo display">{cfg.logoText}</a>}
      <div className="side right">
        <a href="#" className="hlink mono">Поиск</a>
        <a href="#" className="hlink mono">Корзина<span className="cart-badge">0</span></a>
      </div>
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
  const [active, setActive] = useState(0);
  const slides = cfg.heroSlides;

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  const next = () => setActive((a) => (a + 1) % slides.length);
  const prev = () => setActive((a) => (a - 1 + slides.length) % slides.length);

  return (
    <section className="hero">
      {slides.map((s, i) => (
        <div className={"hero-slide" + (i === active ? " active" : "")} key={i}>
          <div className="ph">
            {s.src
              ? <img src={s.src} alt={s.caption} />
              : <div className="ph-label">{s.alt}<br />замени на своё фото</div>}
          </div>
        </div>
      ))}
      <ThreeAccent />
      <div className="hero-copy">
        <div className="eyebrow mono">{slides[active].caption}</div>
        <h1 className="display">{cfg.logoText}</h1>
        <a href="#" className="view-link">Смотреть →</a>
      </div>
      <div className="hero-controls">
        <button className="arrow" onClick={prev}>‹</button>
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button key={i} className={i === active ? "active" : ""} onClick={() => setActive(i)} />
          ))}
        </div>
        <button className="arrow" onClick={next}>›</button>
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