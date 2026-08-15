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
   2) Hero: фото-фон + большая 3D-модель (настоящий хром —
      metalness:1, roughness>0, никакой прозрачности) по центру.
      Отражение строится из копии hero-фото, размещённой в отдельной
      "reflection-сцене" спереди и сзади модели и снятой CubeCamera —
      то есть модель буквально отражает фото, а не имитацию.
      Сцена стартует с тихого автовращения. Зажимаешь мышь и тащишь —
      вращение по Y полностью под курсором. Отпускаешь — модель летит
      по инерции, а затем сама доворачивается до heroMirrorRestRotationY
      и останавливается в этой позе ("слияние" с фоном).

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
  heroImage: "", // ссылка на своё фото для фона hero
  heroModelUrl: null, // ссылка на свой .glb для центра hero
  heroMirrorRestRotationY: 0, // угол (в радианах), в который модель довернётся и "сольётся" с фоном после отпускания мыши — подбери на глаз под свою модель
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

/* ---------- зеркальный (хромированный) материал ---------- */
function makeMirrorMaterial(extra = {}){
  return new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1,
    roughness: 0.12, // не 0 — на чистом нуле без ярких бликов форма "теряется" и кажется просто белой заливкой
    envMapIntensity: 1.5,
    transparent: false,
    opacity: 1,
    ...extra,
  });
}

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

/* ---------- общий загрузчик: своя модель или процедурная заглушка ----------
   Принимает готовый material снаружи — так на всю модель (все меши внутри .glb)
   ставится ОДИН и тот же материал с ОДНОЙ и той же envMap-текстурой, и когда
   эта текстура обновляется (см. CubeCamera ниже), отражение обновляется сразу
   у всех мешей без повторного обхода дерева на каждый кадр. */
function loadMeshWithMaterial({ url, fallbackGeo, material, onReady, label = "model" }){
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
      onReady(new THREE.Mesh(fallbackGeo, material));
    }
  );
  return () => { cancelled = true; };
}

/* ---------- центрирование и нормализация масштаба под размер сцены ----------
   Модели из разных источников (Blender, Sketchfab, Cinema4D...) экспортируются
   в разных единицах — без этого шага модель может оказаться то огромной
   ("приближена"), то микроскопической в зависимости от исходных юнитов файла. */
function fitAndCenter(object, targetSize){
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

    // второе состояние (после скролла) грузим сразу, чтобы переключение было мгновенным
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

/* ============================================================
   Большая hero-модель.

   КАК ЭТО УСТРОЕНО (по шагам):

   1. Фото hero кладётся ДВАЖДЫ как плоскость — спереди и сзади
      модели — но не в основную сцену, а в отдельную reflectionScene,
      которую основная камера вообще не рендерит. Поэтому фото
      никогда не перекрывает кадр и не превращается в "белый квадрат".

   2. CubeCamera стоит в центре (там же, где модель) и "фотографирует"
      reflectionScene по всем 6 направлениям в текстуру cubeRT.texture.

   3. Материал модели — обычный хром (metalness:1, roughness>0,
      никакой прозрачности) с envMap = cubeRT.texture. Поскольку это
      один и тот же объект текстуры, обновлять material на каждый
      кадр не нужно: как только cubeCamera.update() перерисовывает
      cubeRT, отражение на модели обновляется само.

   4. Вращаешь модель мышью (drag) — после отпускания она сначала
      летит по инерции, а затем плавно доворачивается до целевого
      угла TARGET_ROTATION_Y ("слитая" с фоном поза) и на нём
      останавливается — не тает, не становится прозрачной, просто
      фиксируется в этом развороте.
============================================================= */
function HeroModel({ modelUrl, heroImage, restRotationY = 0 }){
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const CONFIG = {
      modelSize: 2.8,        // целевой диаметр модели в мировых единицах — меняй, если модель кажется мелкой/крупной
      cameraZ: 6,
      dragSensitivity: 0.008,
      inertiaDamping: 0.94,
      minVelocity: 0.00015,
      settleDelay: 500,      // мс паузы после отпускания мыши, прежде чем начать доворот
      settleSpeed: 0.045,
      envUpdateEveryFrame: 2, // обновлять отражение раз в N кадров (дешевле для GPU)
    };

    const getSize = () => Math.min(mount.clientWidth, mount.clientHeight, 560);
    let size = getSize();

    /* ---------- основная сцена: модель + свет ---------- */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, CONFIG.cameraZ);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
    else renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x333333, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(4, 6, 8);
    scene.add(key);

    /* ---------- reflection-scene: фото спереди и сзади модели ----------
       Именно это отражает зеркало — сюда НЕ добавляется сама модель,
       поэтому не нужно её прятать/показывать на каждый кадр захвата. */
    const reflectionScene = new THREE.Scene();
    reflectionScene.background = new THREE.Color(0x9a9488); // нейтральный фон "пустоты" на случай, если фото ещё не загрузилось — тон подобран близко к paper-фону, чтобы модель не выглядела сломанной/чёрной

    let photoTexture = null;
    const buildReflectionPlanes = (tex) => {
      const mat = new THREE.MeshBasicMaterial({ map: tex });
      const front = new THREE.Mesh(new THREE.PlaneGeometry(26, 15), mat);
      front.position.set(0, 0, 16);
      front.rotation.y = Math.PI; // развёрнута лицом к центру (к модели)
      reflectionScene.add(front);

      const back = new THREE.Mesh(new THREE.PlaneGeometry(26, 15), mat);
      back.position.set(0, 0, -16);
      reflectionScene.add(back);

      console.log("[BrandSite] Отражение: heroImage успешно подключён к зеркалу.");
    };

    if (heroImage) {
      console.log("[BrandSite] Загружаю heroImage для отражения:", heroImage);
      const texLoader = new THREE.TextureLoader();
      texLoader.setCrossOrigin("anonymous"); // без этого текстура с другого домена (CDN/Cloudinary) не встанет в WebGL-текстуру
      texLoader.load(
        heroImage,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          photoTexture = tex;
          buildReflectionPlanes(tex);
        },
        undefined,
        (err) => console.error("[BrandSite] heroImage НЕ загрузился для отражения (см. Network-таб на CORS/404):", err)
      );
    } else {
      console.warn("[BrandSite] heroImage не передан — зеркало отражает только нейтральный серый фон.");
    }

    /* ---------- CubeCamera: строит envMap из reflectionScene ---------- */
    const cubeRT = new THREE.WebGLCubeRenderTarget(256, {
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    });
    // ВАЖНО: НЕ ставим тут colorSpace = SRGBColorSpace — это промежуточный
    // рендер-таргет (уже в линейном пространстве после захвата), а не готовый
    // sRGB-файл с диска. Если пометить его как sRGB, движок применит
    // цветокоррекцию ВТОРОЙ раз при сэмплировании — картинка "выцветает"
    // в плоский блёклый тон именно так, как было на скриншоте.
    const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRT);
    scene.add(cubeCamera);

    /* ---------- материал: настоящий хром, никогда не прозрачный ---------- */
    const material = makeMirrorMaterial({ envMap: cubeRT.texture });

    let current = null;
    const dispose = loadMeshWithMaterial({
      url: modelUrl,
      fallbackGeo: new THREE.CylinderGeometry(1, 1, 0.12, 72), // тонкий диск — на ребре он почти исчезает и "сливается" с фоном
      material,
      label: "heroModelUrl",
      onReady: (obj) => {
        fitAndCenter(obj, CONFIG.modelSize);
        current = obj;
        scene.add(current);
      },
    });

    /* ---------- drag-to-rotate + инерция + доворот до "слитой" позы ---------- */
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

    const onPointerDown = (e) => {
      if (!current) return;
      state.dragging = true;
      state.settling = false;
      state.velocity = 0;
      state.hasInteracted = true;
      state.lastX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onPointerMove = (e) => {
      if (!state.dragging || !current) return;
      const dx = e.clientX - state.lastX;
      state.lastX = e.clientX;
      const delta = dx * CONFIG.dragSensitivity;
      current.rotation.y += delta;
      state.velocity = delta;
    };
    const onPointerUp = (e) => {
      if (!state.dragging) return;
      state.dragging = false;
      state.releasedAt = performance.now();
      canvas.style.cursor = "grab";
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    let raf;
    const animate = () => {
      if (current) {
        if (state.dragging) {
          // вращение полностью управляется курсором — см. onPointerMove
        } else if (!state.hasInteracted) {
          // до первого клика — тихое авто-вращение, чтобы сцена не была статичной
          current.rotation.y += 0.006;
        } else if (!state.settling) {
          if (Math.abs(state.velocity) > CONFIG.minVelocity) {
            // инерция после отпускания
            current.rotation.y += state.velocity;
            state.velocity *= CONFIG.inertiaDamping;
          } else if (performance.now() - state.releasedAt > CONFIG.settleDelay) {
            state.settling = true;
          }
        } else {
          // доворот до целевого угла — "слияние" с фоном
          const diff = shortestAngle(current.rotation.y, restRotationY);
          if (Math.abs(diff) > 0.002) {
            current.rotation.y += diff * CONFIG.settleSpeed;
          } else {
            current.rotation.y = restRotationY;
            state.settling = false; // доворот завершён — модель фиксируется в этой позе
          }
        }
      }

      // обновляем отражение не каждый кадр — дешевле для GPU
      state.envFrame++;
      if (state.envFrame >= CONFIG.envUpdateEveryFrame) {
        state.envFrame = 0;
        // На время захвата отключаем тонмаппинг: иначе он "запекается" в саму
        // текстуру отражения, а затем ПОВТОРНО применяется при финальном
        // рендере модели — двойная цветокоррекция и даёт тот блёклый плоский вид.
        const prevToneMapping = renderer.toneMapping;
        renderer.toneMapping = THREE.NoToneMapping;
        cubeCamera.update(renderer, reflectionScene);
        renderer.toneMapping = prevToneMapping;
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
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", onResize);
      dispose();
      if (photoTexture) photoTexture.dispose();
      cubeRT.dispose();
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [modelUrl, heroImage, restRotationY]);

  return (
    <div className="hero-model-wrap">
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

      <HeroModel modelUrl={cfg.heroModelUrl} heroImage={cfg.heroImage} restRotationY={cfg.heroMirrorRestRotationY} />

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