// import React, { useState, useEffect, useRef } from "react";
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
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
//   heroVideoUrl: "https://res.cloudinary.com/dbx6muxub/video/upload/v1785325905/volt_park_visual2kwide_sjelea.mp4",
//   heroModelUrl: "https://res.cloudinary.com/dbx6muxub/image/upload/v1786811336/model_eteyx8.glb",
//   heroMirrorRestRotationY: 0,
//   headerModelUrl: "https://res.cloudinary.com/dbx6muxub/video/upload/v1785325905/volt_park_visual2kwide_sjelea.mp4",
//   headerModelUrlAlt: "https://res.cloudinary.com/dbx6muxub/image/upload/v1786869663/logo_alatkf.glb",
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

// /* =========================================================================
//    ОБЩИЕ ЗАГРУЗЧИКИ
//    ========================================================================= */

// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

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

// /* =========================================================================
//    ШЕЙДЕР "СЛИЯНИЯ С ФОНОМ" (screen-space background sampling)
//    Модель буквально показывает тот же пиксель видео, что находится позади
//    неё на экране. uDistortion и uFresnelStrength занулены — это убирает
//    стеклянное преломление и дополнительный блик по краям, за счёт чего
//    модель максимально точно и без лишней яркости сливается с фоновым видео
//    (эффект "невидимого" объекта, как на palaceskateboards.com).
//    ========================================================================= */

// function makeBgSampleMaterial(videoTexture) {
//   return new THREE.ShaderMaterial({
//     uniforms: {
//       uVideoTex: { value: videoTexture },
//       // размер контейнера (.hero), в который видео вписано через object-fit:cover
//       uContainerSize: { value: new THREE.Vector2(1, 1) },
//       // позиция левого-верхнего угла контейнера в экранных координатах (CSS px)
//       uContainerOffset: { value: new THREE.Vector2(0, 0) },
//       // позиция и размер САМОГО canvas модели на странице (CSS px) — без этого
//       // gl_FragCoord (локальный для canvas) неверно принимается за глобальный,
//       // отсюда и заметный сдвиг отражения относительно реального фона
//       uCanvasOffset: { value: new THREE.Vector2(0, 0) },
//       uCanvasSize: { value: new THREE.Vector2(1, 1) },
//       // нативный размер видео (videoWidth/videoHeight), для расчёта cover-кропа
//       uVideoNative: { value: new THREE.Vector2(16, 9) },
//       // devicePixelRatio, т.к. gl_FragCoord в физических пикселях канваса
//       uDPR: { value: window.devicePixelRatio || 1 },
//       // сила смещения сэмпла по нормали каждой грани — это и даёт "осколочный"
//       // эффект: соседние плоские грани модели смещают картинку по-разному.
//       // Крути 0.02–0.08 под свою модель.
//       uDistortion: { value: 0.05 },
//       // яркость блика по краю грани — читается как "стеклянная" кромка,
//       // как на референсе Palace
//       uFresnelStrength: { value: 0.25 },
//       // хроматическая аберрация: R и B каналы сэмплируются со сдвигом
//       // относительно G — даёт лёгкий радужный край на гранях
//       uChromaShift: { value: 0.01 },
//     },
//     vertexShader: `
//       varying vec3 vViewPos;
//       varying vec3 vViewDir;
//       void main() {
//         vec4 mv = modelViewMatrix * vec4(position, 1.0);
//         vViewPos = mv.xyz;
//         vViewDir = normalize(-mv.xyz);
//         gl_Position = projectionMatrix * mv;
//       }
//     `,
//     fragmentShader: `
//       uniform sampler2D uVideoTex;
//       uniform vec2 uContainerSize;
//       uniform vec2 uContainerOffset;
//       uniform vec2 uCanvasOffset;
//       uniform vec2 uCanvasSize;
//       uniform vec2 uVideoNative;
//       uniform float uDPR;
//       uniform float uDistortion;
//       uniform float uFresnelStrength;
//       uniform float uChromaShift;
//       varying vec3 vViewPos;
//       varying vec3 vViewDir;

//       // повторяет CSS object-fit: cover для видео внутри контейнера
//       vec2 coverUV(vec2 screenUV) {
//         float containerAspect = uContainerSize.x / uContainerSize.y;
//         float videoAspect = uVideoNative.x / uVideoNative.y;
//         vec2 uv = screenUV;
//         if (containerAspect > videoAspect) {
//           // контейнер шире видео -> обрезаются верх/низ
//           float scale = videoAspect / containerAspect;
//           uv.y = (uv.y - 0.5) * scale + 0.5;
//         } else {
//           // контейнер уже видео -> обрезаются края
//           float scale = containerAspect / videoAspect;
//           uv.x = (uv.x - 0.5) * scale + 0.5;
//         }
//         return uv;
//       }

//       // сэмплирует один канал фона со сдвигом local по нормали грани —
//       // используется трижды (R/G/B) с разным сдвигом для хроматической аберрации
//       vec3 sampleBg(vec2 local, vec3 flatNormal) {
//         vec2 distorted = local + flatNormal.xy * uDistortion;
//         vec2 videoUV = coverUV(clamp(distorted, 0.0, 1.0));
//         // THREE.VideoTexture по умолчанию flipY=true: v=0 у него соответствует
//         // НИЗУ видео, а наш videoUV.y посчитан в CSS-логике (0=верх) — инвертируем
//         vec2 sampleUV = vec2(videoUV.x, 1.0 - videoUV.y);
//         return texture2D(uVideoTex, sampleUV).rgb;
//       }

//       void main() {
//         // ГРАНЁНАЯ нормаль: считаем через производные позиции во view-space —
//         // она константна для каждого треугольника (в отличие от интерполированной
//         // вершинной нормали), поэтому соседние грани дают РАЗНЫЙ сдвиг картинки —
//         // именно это создаёт "осколочный" эффект вместо гладкого зеркала.
//         vec3 fdx = dFdx(vViewPos);
//         vec3 fdy = dFdy(vViewPos);
//         vec3 flatNormal = normalize(cross(fdx, fdy));

//         // gl_FragCoord — пиксель ВНУТРИ canvas модели (физические px, y снизу вверх)
//         vec2 localCanvasPx = gl_FragCoord.xy / uDPR; // -> CSS px, всё ещё локально для canvas
//         localCanvasPx.y = uCanvasSize.y - localCanvasPx.y; // разворачиваем в top-down, как в CSS

//         // переводим в глобальные координаты окна: позиция canvas + локальный пиксель
//         vec2 windowPx = uCanvasOffset + localCanvasPx;

//         // переводим в координаты относительно контейнера (.hero), 0..1
//         vec2 local = (windowPx - uContainerOffset) / uContainerSize;

//         float r = sampleBg(local, flatNormal + vec3(uChromaShift, 0.0, 0.0)).r;
//         float g = sampleBg(local, flatNormal).g;
//         float b = sampleBg(local, flatNormal - vec3(uChromaShift, 0.0, 0.0)).b;
//         vec3 bg = vec3(r, g, b);

//         // яркая грань по краю фасета — читается как "стеклянный" блик на референсе
//         float fresnel = pow(1.0 - max(dot(normalize(vViewDir), flatNormal), 0.0), 1.6);
//         vec3 color = bg + fresnel * uFresnelStrength;

//         gl_FragColor = vec4(color, 1.0);
//       }
//     `,
//   });
// }

// /* =========================================================================
//    HeaderOrb — маленький хром-объект в хедере (тут отражение честное,
//    т.к. это UI-элемент, а не "слияние с фоном")
//    ========================================================================= */

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

//     const light = new THREE.PointLight(0xffffff, 2);
//     light.position.set(2, 2, 2);
//     scene.add(light);
//     scene.add(new THREE.AmbientLight(0xffffff, 0.6));

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
//     };
//   }, [modelUrl, modelUrlAlt]);

//   return <div className="header-orb" ref={mountRef}></div>;
// }

// /* =========================================================================
//    HeroModel — "сливается" с фоновым видео через screen-space шейдер
//    ========================================================================= */

// function HeroModel({ modelUrl, heroVideoUrl, restRotationY = 0 }) {
//   const mountRef = useRef(null);
//   const heroSectionRef = useRef(null);

//   useEffect(() => {
//     const mount = mountRef.current;
//     if (!mount) return;

//     // .hero-model-wrap лежит внутри .hero (inset:0), поэтому контейнер
//     // для расчёта cover-кропа видео — это ближайшая секция .hero
//     const heroEl = mount.closest(".hero");
//     heroSectionRef.current = heroEl;

//     const CONFIG = {
//       modelSize: 2.8,
//       cameraZ: 6,
//       dragSensitivity: 0.008,
//       inertiaDamping: 0.94,
//       minVelocity: 0.00015,
//       settleDelay: 500,
//       settleSpeed: 0.045,
//       // на сколько мс приостанавливать автовращение после прокрутки страницы
//       scrollPauseMs: 700,
//     };

//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
//     camera.position.set(0, 0, CONFIG.cameraZ);

//     const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
//     // раньше здесь был жёсткий потолок 560px — теперь ориентируемся на
//     // реальный CSS-размер .hero-model-canvas-mount (задаётся в Brandsite.css,
//     // с отдельными значениями для моб/десктоп), с разумным верхним лимитом
//     // по производительности
//     const MAX_CANVAS_PX = 900;
//     const getSize = () => Math.min(mount.clientWidth || 560, mount.clientHeight || 560, MAX_CANVAS_PX);
//     let size = getSize();
//     renderer.setSize(size, size);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3));
//     // ВАЖНО: наш шейдер сэмплирует видео-текстуру напрямую и выдаёт уже
//     // готовый к показу sRGB-цвет (те же байты, что видит <video> в DOM).
//     // Дефолтный renderer.outputColorSpace = SRGBColorSpace заново кодирует
//     // этот уже закодированный цвет — двойная гамма визуально светлее
//     // фонового видео. Отключаем этот шаг для данного canvas.
//     renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
//     mount.appendChild(renderer.domElement);

//     /* ---------- видео-текстура (та же, что играет фоном в Hero) ---------- */
//     let videoEl = null;
//     let videoTexture = null;
//     // GLB обычно грузится быстрее, чем декодируется первый кадр видео —
//     // без этого флага модель кратко показывается чёрной (текстура ещё пустая)
//     const videoReady = { value: !heroVideoUrl }; // если видео нет — считаем сразу "готово"

//     if (heroVideoUrl) {
//       videoEl = document.createElement("video");
//       videoEl.src = heroVideoUrl;
//       videoEl.crossOrigin = "anonymous";
//       videoEl.loop = true;
//       videoEl.muted = true;
//       videoEl.playsInline = true;
//       videoEl.autoplay = true;
//       videoEl.setAttribute("playsinline", "");
//       videoEl.preload = "auto";

//       videoTexture = new THREE.VideoTexture(videoEl);
//       // Тег colorSpace здесь ни на что не влияет: в кастомном ShaderMaterial
//       // мы сэмплируем текстуру через texture2D() напрямую, без автогенерируемых
//       // three.js цепочек декодирования (они работают только для встроенных
//       // материалов вроде MeshStandardMaterial). Оставлено для ясности.
//       videoTexture.colorSpace = THREE.SRGBColorSpace;
//       videoTexture.generateMipmaps = false;
//       videoTexture.minFilter = THREE.LinearFilter;
//       videoTexture.magFilter = THREE.LinearFilter;

//       videoEl.play().catch((err) => {
//         console.warn("[BrandSite] Автовоспроизведение видео заблокировано браузером:", err);
//       });

//       // readyState >= 2 (HAVE_CURRENT_DATA) означает, что в буфере уже есть
//       // хотя бы один декодированный кадр — раньше этого текстура пустая/чёрная
//       if (videoEl.readyState >= 2) {
//         videoReady.value = true;
//       } else {
//         videoEl.addEventListener("loadeddata", () => { videoReady.value = true; }, { once: true });
//       }
//     } else {
//       console.warn("[BrandSite] heroVideoUrl отсутствует.");
//     }

//     const bgMaterial = makeBgSampleMaterial(videoTexture || new THREE.Texture());

//     /* ---------- обновление uniforms под реальную геометрию страницы ---------- */
//     const updateScreenUniforms = () => {
//       const dpr = Math.min(window.devicePixelRatio || 1, 3);
//       bgMaterial.uniforms.uDPR.value = dpr;

//       const refEl = heroSectionRef.current || mount;
//       const rect = refEl.getBoundingClientRect();
//       bgMaterial.uniforms.uContainerSize.value.set(rect.width, rect.height);
//       bgMaterial.uniforms.uContainerOffset.value.set(rect.left, rect.top);

//       // позиция и CSS-размер самого <canvas>, где рисуется модель — обязательно
//       // после renderer.setSize(), т.к. до этого канвас может иметь размер 0
//       const canvasRect = renderer.domElement.getBoundingClientRect();
//       bgMaterial.uniforms.uCanvasOffset.value.set(canvasRect.left, canvasRect.top);
//       bgMaterial.uniforms.uCanvasSize.value.set(canvasRect.width, canvasRect.height);

//       if (videoEl && videoEl.videoWidth && videoEl.videoHeight) {
//         bgMaterial.uniforms.uVideoNative.value.set(videoEl.videoWidth, videoEl.videoHeight);
//       }
//     };

//     updateScreenUniforms();
//     if (videoEl) {
//       videoEl.addEventListener("loadedmetadata", updateScreenUniforms);
//     }
//     window.addEventListener("resize", updateScreenUniforms);
//     window.addEventListener("scroll", updateScreenUniforms, { passive: true });

//     // отдельно отмечаем момент последнего скролла, чтобы приостановить
//     // автовращение модели на CONFIG.scrollPauseMs — читает animate() ниже
//     const scrollState = { lastScrollAt: -Infinity };
//     const onPageScroll = () => { scrollState.lastScrollAt = performance.now(); };
//     window.addEventListener("scroll", onPageScroll, { passive: true });

//     /* ---------- загрузка GLB ---------- */
//     let current = null;
//     const disposeModel = loadMeshWithMaterial({
//       url: modelUrl,
//       fallbackGeo: new THREE.IcosahedronGeometry(1, 2),
//       material: bgMaterial,
//       label: "heroModelUrl",
//       onReady: (object) => {
//         fitAndCenter(object, CONFIG.modelSize);
//         current = object;
//         // не показываем модель, пока не готов первый кадр видео — иначе виден
//         // чёрный силуэт до того, как текстура успевает наполниться данными
//         current.visible = videoReady.value;
//         scene.add(current);
//       },
//     });

//     /* ---------- drag / inertia / settle ---------- */
//     const canvas = renderer.domElement;
//     canvas.style.cursor = "grab";
//     // pan-y: браузер сам обрабатывает вертикальный скролл страницы (жест
//     // пальцем вверх/вниз проходит мимо canvas и скроллит страницу как обычно),
//     // а горизонтальные движения достаются нашему JS для вращения модели.
//     // touch-action: none блокировал бы скролл страницы всей площадью canvas,
//     // что на телефоне ощущается как "залипшая" секция.
//     canvas.style.touchAction = "pan-y";

//     const state = {
//       dragging: false,
//       lastX: 0,
//       velocity: 0,
//       releasedAt: 0,
//       settling: false,
//       hasInteracted: false,
//       activePointerId: null,
//     };

//     const shortestAngle = (from, to) => Math.atan2(Math.sin(to - from), Math.cos(to - from));

//     const onPointerDown = (event) => {
//       if (!current) return;
//       // игнорируем второй/третий палец (например, случайный pinch-жест) —
//       // управляет только тот палец/курсор, что коснулся первым
//       if (!event.isPrimary) return;

//       state.activePointerId = event.pointerId;
//       state.dragging = true;
//       state.settling = false;
//       state.velocity = 0;
//       state.hasInteracted = true;
//       state.lastX = event.clientX;
//       canvas.setPointerCapture(event.pointerId);
//       canvas.style.cursor = "grabbing";

//       // на время активного драга полностью забираем жест у браузера, чтобы
//       // страница не пыталась одновременно скроллиться, пока управляем моделью —
//       // именно это давало ощущение "анимация продолжает жить своей жизнью"
//       canvas.style.touchAction = "none";
//     };

//     const onPointerMove = (event) => {
//       if (!state.dragging || !current || event.pointerId !== state.activePointerId) return;
//       const dx = event.clientX - state.lastX;
//       state.lastX = event.clientX;
//       // на тач-экране палец покрывает больше пикселей за тот же жест, чем
//       // мышь — снижаем чувствительность, чтобы вращение не было дёрганым
//       const sensitivity = event.pointerType === "touch"
//         ? CONFIG.dragSensitivity * 0.6
//         : CONFIG.dragSensitivity;
//       const rotationDelta = dx * sensitivity;
//       current.rotation.y += rotationDelta;
//       state.velocity = rotationDelta;
//     };

//     const onPointerUp = (event) => {
//       if (!state.dragging || event.pointerId !== state.activePointerId) return;
//       state.dragging = false;
//       state.activePointerId = null;
//       state.releasedAt = performance.now();
//       canvas.style.cursor = "grab";
//       // возвращаем pan-y — вертикальный скролл страницы снова работает
//       // нативно, когда пользователь просто касается модели, не вращая её
//       canvas.style.touchAction = "pan-y";
//       try { canvas.releasePointerCapture(event.pointerId); } catch (_) {}
//     };

//     canvas.addEventListener("pointerdown", onPointerDown);
//     canvas.addEventListener("pointermove", onPointerMove);
//     canvas.addEventListener("pointerup", onPointerUp);
//     canvas.addEventListener("pointercancel", onPointerUp);

//     let raf;
//     const animate = () => {
//       if (current) {
//         if (!current.visible && videoReady.value) {
//           current.visible = true;
//         }
//         if (state.dragging) {
//           // управление в onPointerMove
//         } else if (!state.hasInteracted) {
//           // не крутим модель, пока пользователь недавно скроллил страницу —
//           // так вращение не мельтешит на фоне скролла, а стартует спустя паузу
//           const scrolledRecently = performance.now() - scrollState.lastScrollAt < CONFIG.scrollPauseMs;
//           if (!scrolledRecently) {
//             current.rotation.y += 0.003;
//           }
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

//       renderer.render(scene, camera);
//       raf = requestAnimationFrame(animate);
//     };
//     animate();

//     const onResize = () => {
//       size = getSize();
//       camera.aspect = 1;
//       camera.updateProjectionMatrix();
//       renderer.setSize(size, size);
//       updateScreenUniforms();
//     };
//     window.addEventListener("resize", onResize);

//     return () => {
//       cancelAnimationFrame(raf);
//       window.removeEventListener("resize", onResize);
//       window.removeEventListener("resize", updateScreenUniforms);
//       window.removeEventListener("scroll", updateScreenUniforms);
//       window.removeEventListener("scroll", onPageScroll);
//       if (videoEl) videoEl.removeEventListener("loadedmetadata", updateScreenUniforms);

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

//       bgMaterial.dispose();
//       if (videoTexture) videoTexture.dispose();
//       if (videoEl) {
//         videoEl.pause();
//         videoEl.removeAttribute("src");
//         videoEl.load();
//       }

//       renderer.dispose();
//       if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
//     };
//   }, [modelUrl, heroVideoUrl, restRotationY]);

//   return (
//     <div className="hero-model-wrap">
//       <div className="hero-model-canvas-mount" ref={mountRef} />
//     </div>
//   );
// }

// /* =========================================================================
//    Остальная разметка — без изменений
//    ========================================================================= */

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
//   const bgVideoRef = useRef(null);

//   useEffect(() => {
//     const v = bgVideoRef.current;
//     if (v) {
//       v.play().catch((err) => console.warn("[BrandSite] Автовоспроизведение фонового видео заблокировано:", err));
//     }
//   }, [cfg.heroVideoUrl]);

//   return (
//     <section className="hero">
//       <div className={"hero-bg" + (cfg.heroVideoUrl ? "" : " no-photo")}>
//         {cfg.heroVideoUrl ? (
//           <video
//             ref={bgVideoRef}
//             className="hero-bg-video"
//             src={cfg.heroVideoUrl}
//             autoPlay
//             muted
//             loop
//             playsInline
//           />
//         ) : (
//           <div className="hero-bg-label">
//             heroVideoUrl — замени на своё видео<br />(широкоформатное, ≥ 1920px по ширине)
//           </div>
//         )}
//       </div>

//       <HeroModel modelUrl={cfg.heroModelUrl} heroVideoUrl={cfg.heroVideoUrl} restRotationY={cfg.heroMirrorRestRotationY} />

//       {/* Строки текста над героем (Manor Place / Autumn 2026 Range и т.п.)
//           на мобилке скрыты через .hero-lines{display:none} в Brandsite.css —
//           на десктопе отображаются как прежде. */}
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

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
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
  heroVideoUrl: "https://res.cloudinary.com/dbx6muxub/video/upload/v1785325905/volt_park_visual2kwide_sjelea.mp4",
  heroModelUrl: "https://res.cloudinary.com/dbx6muxub/image/upload/v1786811336/model_eteyx8.glb",
  heroMirrorRestRotationY: 0,
  headerModelUrl: "https://res.cloudinary.com/dbx6muxub/video/upload/v1785325905/volt_park_visual2kwide_sjelea.mp4",
  headerModelUrlAlt: "https://res.cloudinary.com/dbx6muxub/image/upload/v1786869663/logo_alatkf.glb",
  viewLabel: "View Range",
  viewHref: "#",

  // ---------- строки рулетки hero + опциональное per-slide содержимое ----------
  // Поля videoUrl / modelUrl / restRotationY / viewLabel / viewHref
  // НЕОБЯЗАТЕЛЬНЫ: если не заданы — берутся дефолты сверху.
  heroLines: [
    { text: "Manor Place", tone: "dim2" },
    { text: "Your Brand South2 West8", tone: "dim" },
    {
      text: "Autumn 2026 Range",
      tone: "accent",
      // videoUrl: "https://.../another-clip.mp4",
      // modelUrl: "https://.../another-model.glb",
      // viewLabel: "View Autumn",
      // viewHref: "#autumn",
    },
    { text: "Autumn 2026 Lookbook", tone: "normal" },
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

/* =========================================================================
   ОБЩИЕ ЗАГРУЗЧИКИ
   ========================================================================= */

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

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

/* =========================================================================
   ШЕЙДЕР "СЛИЯНИЯ С ФОНОМ" (screen-space background sampling)
   ========================================================================= */

function makeBgSampleMaterial(videoTexture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uVideoTex: { value: videoTexture },
      uContainerSize: { value: new THREE.Vector2(1, 1) },
      uContainerOffset: { value: new THREE.Vector2(0, 0) },
      uCanvasOffset: { value: new THREE.Vector2(0, 0) },
      uCanvasSize: { value: new THREE.Vector2(1, 1) },
      uVideoNative: { value: new THREE.Vector2(16, 9) },
      uDPR: { value: window.devicePixelRatio || 1 },
      uDistortion: { value: 0.05 },
      uFresnelStrength: { value: 0.25 },
      uChromaShift: { value: 0.01 },
    },
    vertexShader: `
      varying vec3 vViewPos;
      varying vec3 vViewDir;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vViewPos = mv.xyz;
        vViewDir = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform sampler2D uVideoTex;
      uniform vec2 uContainerSize;
      uniform vec2 uContainerOffset;
      uniform vec2 uCanvasOffset;
      uniform vec2 uCanvasSize;
      uniform vec2 uVideoNative;
      uniform float uDPR;
      uniform float uDistortion;
      uniform float uFresnelStrength;
      uniform float uChromaShift;
      varying vec3 vViewPos;
      varying vec3 vViewDir;

      vec2 coverUV(vec2 screenUV) {
        float containerAspect = uContainerSize.x / uContainerSize.y;
        float videoAspect = uVideoNative.x / uVideoNative.y;
        vec2 uv = screenUV;
        if (containerAspect > videoAspect) {
          float scale = videoAspect / containerAspect;
          uv.y = (uv.y - 0.5) * scale + 0.5;
        } else {
          float scale = containerAspect / videoAspect;
          uv.x = (uv.x - 0.5) * scale + 0.5;
        }
        return uv;
      }

      vec3 sampleBg(vec2 local, vec3 flatNormal) {
        vec2 distorted = local + flatNormal.xy * uDistortion;
        vec2 videoUV = coverUV(clamp(distorted, 0.0, 1.0));
        vec2 sampleUV = vec2(videoUV.x, 1.0 - videoUV.y);
        return texture2D(uVideoTex, sampleUV).rgb;
      }

      void main() {
        vec3 fdx = dFdx(vViewPos);
        vec3 fdy = dFdy(vViewPos);
        vec3 flatNormal = normalize(cross(fdx, fdy));

        vec2 localCanvasPx = gl_FragCoord.xy / uDPR;
        localCanvasPx.y = uCanvasSize.y - localCanvasPx.y;

        vec2 windowPx = uCanvasOffset + localCanvasPx;
        vec2 local = (windowPx - uContainerOffset) / uContainerSize;

        float r = sampleBg(local, flatNormal + vec3(uChromaShift, 0.0, 0.0)).r;
        float g = sampleBg(local, flatNormal).g;
        float b = sampleBg(local, flatNormal - vec3(uChromaShift, 0.0, 0.0)).b;
        vec3 bg = vec3(r, g, b);

        float fresnel = pow(1.0 - max(dot(normalize(vViewDir), flatNormal), 0.0), 1.6);
        vec3 color = bg + fresnel * uFresnelStrength;

        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
}

/* =========================================================================
   HeaderOrb
   ========================================================================= */

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

    const light = new THREE.PointLight(0xffffff, 2);
    light.position.set(2, 2, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

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
    };
  }, [modelUrl, modelUrlAlt]);

  return <div className="header-orb" ref={mountRef}></div>;
}

/* =========================================================================
   HeroModel — "сливается" с фоновым видео через screen-space шейдер.

   videoRef указывает на ТОТ ЖЕ <video>, что рендерит Hero (общий источник
   кадров — отражение физически не может разойтись с фоном).

   ВАЖНО (fix черной модели): элемент <video> ОБЯЗАН иметь атрибут
   crossOrigin="anonymous", выставленный ДО начала загрузки src. Видео
   грузится с другого домена (Cloudinary) — без CORS-режима браузер метит
   canvas/текстуру как "tainted", и WebGL получает право читать из неё
   пиксели, только рендеря чёрный кадр (без ошибки в консоли). Атрибут
   теперь стоит прямо в JSX <video> внутри Hero — см. ниже.
   ========================================================================= */

function HeroModel({ modelUrl, videoRef, heroVideoUrl, restRotationY = 0 }) {
  const mountRef = useRef(null);
  const heroSectionRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const heroEl = mount.closest(".hero");
    heroSectionRef.current = heroEl;

    const CONFIG = {
      modelSize: 2.8,
      cameraZ: 6,
      dragSensitivity: 0.008,
      inertiaDamping: 0.94,
      minVelocity: 0.00015,
      settleDelay: 500,
      settleSpeed: 0.045,
      scrollPauseMs: 700,
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, CONFIG.cameraZ);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    const MAX_CANVAS_PX = 900;
    const getSize = () => Math.min(mount.clientWidth || 560, mount.clientHeight || 560, MAX_CANVAS_PX);
    let size = getSize();
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3));
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    mount.appendChild(renderer.domElement);

    /* ---------- видео-текстура: тот же <video>, что и фон, БЕЗ клона ---------- */
    const videoEl = heroVideoUrl ? (videoRef && videoRef.current) : null;
    let videoTexture = null;
    const videoReady = { value: !videoEl };
    let onLoadedData = null;

    if (videoEl) {
      videoTexture = new THREE.VideoTexture(videoEl);
      videoTexture.colorSpace = THREE.SRGBColorSpace;
      videoTexture.generateMipmaps = false;
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;

      if (videoEl.readyState >= 2) {
        videoReady.value = true;
      } else {
        onLoadedData = () => { videoReady.value = true; };
        videoEl.addEventListener("loadeddata", onLoadedData, { once: true });
      }
    } else {
      console.warn("[BrandSite] heroVideoUrl/videoRef отсутствует — модель без фонового отражения.");
    }

    const bgMaterial = makeBgSampleMaterial(videoTexture || new THREE.Texture());

    const updateScreenUniforms = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      bgMaterial.uniforms.uDPR.value = dpr;

      const refEl = heroSectionRef.current || mount;
      const rect = refEl.getBoundingClientRect();
      bgMaterial.uniforms.uContainerSize.value.set(rect.width, rect.height);
      bgMaterial.uniforms.uContainerOffset.value.set(rect.left, rect.top);

      const canvasRect = renderer.domElement.getBoundingClientRect();
      bgMaterial.uniforms.uCanvasOffset.value.set(canvasRect.left, canvasRect.top);
      bgMaterial.uniforms.uCanvasSize.value.set(canvasRect.width, canvasRect.height);

      if (videoEl && videoEl.videoWidth && videoEl.videoHeight) {
        bgMaterial.uniforms.uVideoNative.value.set(videoEl.videoWidth, videoEl.videoHeight);
      }
    };

    updateScreenUniforms();
    if (videoEl) {
      videoEl.addEventListener("loadedmetadata", updateScreenUniforms);
    }
    window.addEventListener("resize", updateScreenUniforms);
    window.addEventListener("scroll", updateScreenUniforms, { passive: true });

    const scrollState = { lastScrollAt: -Infinity };
    const onPageScroll = () => { scrollState.lastScrollAt = performance.now(); };
    window.addEventListener("scroll", onPageScroll, { passive: true });

    let current = null;
    const disposeModel = loadMeshWithMaterial({
      url: modelUrl,
      fallbackGeo: new THREE.IcosahedronGeometry(1, 2),
      material: bgMaterial,
      label: "heroModelUrl",
      onReady: (object) => {
        fitAndCenter(object, CONFIG.modelSize);
        current = object;
        current.visible = videoReady.value;
        scene.add(current);
      },
    });

    const canvas = renderer.domElement;
    canvas.style.cursor = "grab";
    canvas.style.touchAction = "pan-y";

    const state = {
      dragging: false,
      lastX: 0,
      velocity: 0,
      releasedAt: 0,
      settling: false,
      hasInteracted: false,
      activePointerId: null,
    };

    const shortestAngle = (from, to) => Math.atan2(Math.sin(to - from), Math.cos(to - from));

    const onPointerDown = (event) => {
      if (!current) return;
      if (!event.isPrimary) return;

      state.activePointerId = event.pointerId;
      state.dragging = true;
      state.settling = false;
      state.velocity = 0;
      state.hasInteracted = true;
      state.lastX = event.clientX;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
      canvas.style.touchAction = "none";
    };

    const onPointerMove = (event) => {
      if (!state.dragging || !current || event.pointerId !== state.activePointerId) return;
      const dx = event.clientX - state.lastX;
      state.lastX = event.clientX;
      const sensitivity = event.pointerType === "touch"
        ? CONFIG.dragSensitivity * 0.6
        : CONFIG.dragSensitivity;
      const rotationDelta = dx * sensitivity;
      current.rotation.y += rotationDelta;
      state.velocity = rotationDelta;
    };

    const onPointerUp = (event) => {
      if (!state.dragging || event.pointerId !== state.activePointerId) return;
      state.dragging = false;
      state.activePointerId = null;
      state.releasedAt = performance.now();
      canvas.style.cursor = "grab";
      canvas.style.touchAction = "pan-y";
      try { canvas.releasePointerCapture(event.pointerId); } catch (_) {}
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    let raf;
    const animate = () => {
      if (current) {
        if (!current.visible && videoReady.value) {
          current.visible = true;
        }
        if (state.dragging) {
          // управление в onPointerMove
        } else if (!state.hasInteracted) {
          const scrolledRecently = performance.now() - scrollState.lastScrollAt < CONFIG.scrollPauseMs;
          if (!scrolledRecently) {
            current.rotation.y += 0.003;
          }
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

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      size = getSize();
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(size, size);
      updateScreenUniforms();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("resize", updateScreenUniforms);
      window.removeEventListener("scroll", updateScreenUniforms);
      window.removeEventListener("scroll", onPageScroll);
      if (videoEl) {
        videoEl.removeEventListener("loadedmetadata", updateScreenUniforms);
        if (onLoadedData) videoEl.removeEventListener("loadeddata", onLoadedData);
      }

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

      bgMaterial.dispose();
      if (videoTexture) videoTexture.dispose();
      // videoEl НЕ трогаем (pause/removeAttribute/load) — им владеет и
      // управляет компонент Hero, а не HeroModel.

      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [modelUrl, heroVideoUrl, videoRef, restRotationY]);

  return (
    <div className="hero-model-wrap">
      <div className="hero-model-canvas-mount" ref={mountRef} />
    </div>
  );
}

/* =========================================================================
   Header / MenuOverlay — без изменений
   ========================================================================= */

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

/* =========================================================================
   Hero — рулетка heroLines + полноценная смена контента по слайду.
   ========================================================================= */

function Hero({ cfg, activeLine, onActiveLineChange, slide }) {
  const bgVideoRef = useRef(null);
  const heroRef = useRef(null);

  const activeLineRef = useRef(activeLine);
  useEffect(() => { activeLineRef.current = activeLine; }, [activeLine]);

  const lastManualAtRef = useRef(-Infinity);
  const wheelAccumRef = useRef(0);
  const touchStartYRef = useRef(null);

  const WHEEL_THRESHOLD = 70;
  const TOUCH_THRESHOLD = 60;
  const GUARD_MS = 900; // подавляет авто-переход по "ended" сразу после ручного жеста

  const linesCount = cfg.heroLines.length;
  const lastIndex = linesCount - 1;
  const hasVideo = !!slide.videoUrl;

  const goToLine = useCallback((index) => {
    const clamped = Math.max(0, Math.min(lastIndex, index));
    onActiveLineChange(clamped);
  }, [lastIndex, onActiveLineChange]);

  const onManualStep = useCallback((dir) => {
    lastManualAtRef.current = performance.now();
    goToLine(activeLineRef.current + dir);
  }, [goToLine]);

  /* ---------- короткий фейд при смене слайда, чтобы пересборка
     Three.js сцены в HeroModel не била по глазам ---------- */
  const [contentVisible, setContentVisible] = useState(true);
  useEffect(() => {
    setContentVisible(false);
    const t = setTimeout(() => setContentVisible(true), 60);
    return () => clearTimeout(t);
  }, [slide.videoUrl, slide.modelUrl]);

  /* ---------- источник фонового видео: переключаем вручную при смене
     слайда. crossOrigin выставлен и в JSX (для первой загрузки), и тут —
     на случай динамической смены src на уже смонтированном элементе. ---------- */
  useEffect(() => {
    const v = bgVideoRef.current;
    if (!v || !hasVideo) return;

    if (v.crossOrigin !== "anonymous") {
      v.crossOrigin = "anonymous";
    }

    if (v.getAttribute("src") !== slide.videoUrl) {
      v.pause();
      v.setAttribute("src", slide.videoUrl);
      v.load();
    }
    v.play().catch((err) => console.warn("[BrandSite] Автовоспроизведение видео заблокировано:", err));

    const onVisible = () => {
      if (document.visibilityState === "visible" && v.paused) {
        v.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [slide.videoUrl, hasVideo]);

  /* ---------- автозапуск рулетки после каждого прогона видео ---------- */
  useEffect(() => {
    const v = bgVideoRef.current;
    if (!v || linesCount < 2) return;

    const onEnded = () => {
      const recentManual = performance.now() - lastManualAtRef.current < GUARD_MS;
      if (!recentManual) {
        const next = (activeLineRef.current + 1) % linesCount;
        onActiveLineChange(next);
      }
      v.currentTime = 0;
      v.play().catch(() => {});
    };

    v.addEventListener("ended", onEnded);
    return () => v.removeEventListener("ended", onEnded);
  }, [linesCount, onActiveLineChange]);

  /* ---------- ручная рулетка: колесо / свайп внутри .hero ---------- */
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl || linesCount < 2) return;

    const onWheel = (e) => {
      const dir = e.deltaY > 0 ? 1 : -1;
      const atEnd = activeLineRef.current === lastIndex && dir > 0;
      const atStart = activeLineRef.current === 0 && dir < 0;

      if (atEnd || atStart) return;

      e.preventDefault();
      wheelAccumRef.current += e.deltaY;
      if (Math.abs(wheelAccumRef.current) > WHEEL_THRESHOLD) {
        onManualStep(wheelAccumRef.current > 0 ? 1 : -1);
        wheelAccumRef.current = 0;
      }
    };

    const onTouchStart = (e) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      if (touchStartYRef.current === null) return;
      const dy = touchStartYRef.current - e.touches[0].clientY;
      const dir = dy > 0 ? 1 : -1;
      const atEnd = activeLineRef.current === lastIndex && dir > 0;
      const atStart = activeLineRef.current === 0 && dir < 0;

      if (atEnd || atStart) return;

      if (Math.abs(dy) > TOUCH_THRESHOLD) {
        onManualStep(dir);
        touchStartYRef.current = e.touches[0].clientY;
      }
      e.preventDefault();
    };

    const onTouchEnd = () => { touchStartYRef.current = null; };

    heroEl.addEventListener("wheel", onWheel, { passive: false });
    heroEl.addEventListener("touchstart", onTouchStart, { passive: true });
    heroEl.addEventListener("touchmove", onTouchMove, { passive: false });
    heroEl.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      heroEl.removeEventListener("wheel", onWheel);
      heroEl.removeEventListener("touchstart", onTouchStart);
      heroEl.removeEventListener("touchmove", onTouchMove);
      heroEl.removeEventListener("touchend", onTouchEnd);
    };
  }, [linesCount, lastIndex, onManualStep]);

  const onLineClick = (index) => {
    lastManualAtRef.current = performance.now();
    goToLine(index);
  };

  return (
    <section className="hero" ref={heroRef}>
      <div className={"hero-visual" + (contentVisible ? " visible" : "")}>
        <div className={"hero-bg" + (hasVideo ? "" : " no-photo")}>
          {hasVideo ? (
            <video
              ref={bgVideoRef}
              className="hero-bg-video"
              crossOrigin="anonymous"
              autoPlay
              muted
              playsInline
              /* crossOrigin обязателен: без него видео с другого домена
                 (Cloudinary) помечается как tainted, и WebGL-текстура в
                 HeroModel рендерит чёрный кадр вместо реального отражения.
                 src управляется вручную в useEffect выше; loop сознательно
                 не задан — "ended" используется как триггер рулетки. */
            />
          ) : (
            <div className="hero-bg-label">
              videoUrl — замени на своё видео<br />(широкоформатное, ≥ 1920px по ширине)
            </div>
          )}
        </div>

        <HeroModel
          modelUrl={slide.modelUrl}
          videoRef={bgVideoRef}
          heroVideoUrl={slide.videoUrl}
          restRotationY={slide.restRotationY}
        />
      </div>

      <div className="hero-lines">
        {cfg.heroLines.map((l, i) => (
          <div
            className={"line " + l.tone + (i === activeLine ? " active" : "")}
            key={i}
            onClick={() => onLineClick(i)}
          >
            {l.text}
          </div>
        ))}
      </div>

      <a href={slide.viewHref} className="hero-view-btn mono">{slide.viewLabel}</a>

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

  const [activeLine, setActiveLine] = useState(0);

  const activeHeroSlide = useMemo(() => {
    const line = cfg.heroLines[activeLine] || {};
    return {
      videoUrl: line.videoUrl ?? cfg.heroVideoUrl,
      modelUrl: line.modelUrl ?? cfg.heroModelUrl,
      restRotationY: line.restRotationY ?? cfg.heroMirrorRestRotationY,
      viewLabel: line.viewLabel ?? cfg.viewLabel,
      viewHref: line.viewHref ?? cfg.viewHref,
    };
  }, [cfg, activeLine]);

  return (
    <div className="brand-site">
      <Header cfg={cfg} onBurger={() => setMenuOpen((m) => !m)} />
      <MenuOverlay cfg={cfg} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Hero
        cfg={cfg}
        activeLine={activeLine}
        onActiveLineChange={setActiveLine}
        slide={activeHeroSlide}
      />
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
//   heroVideoUrl: "https://res.cloudinary.com/dbx6muxub/video/upload/v1785325905/volt_park_visual2kwide_sjelea.mp4",
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

// /* =========================================================================
//    ОБЩИЕ ЗАГРУЗЧИКИ
//    ========================================================================= */

// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

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

// /* =========================================================================
//    ШЕЙДЕР "СЛИЯНИЯ С ФОНОМ" (screen-space background sampling)
//    Модель буквально показывает тот же пиксель видео, что находится позади
//    неё на экране — с лёгким искажением по нормалям (эффект стекла/призмы),
//    как на palaceskateboards.com. Это НЕ физическое отражение (не cubemap),
//    поэтому оно точно совпадает с фоном при любом освещении и в любой позе,
//    если верно посчитаны uResolution/uOffset/uVideoNative.
//    ========================================================================= */

// function makeBgSampleMaterial(videoTexture) {
//   return new THREE.ShaderMaterial({
//     uniforms: {
//       uVideoTex: { value: videoTexture },
//       // размер контейнера (.hero), в который видео вписано через object-fit:cover
//       uContainerSize: { value: new THREE.Vector2(1, 1) },
//       // позиция левого-верхнего угла контейнера в экранных координатах (CSS px)
//       uContainerOffset: { value: new THREE.Vector2(0, 0) },
//       // позиция и размер САМОГО canvas модели на странице (CSS px) — без этого
//       // gl_FragCoord (локальный для canvas) неверно принимается за глобальный,
//       // отсюда и заметный сдвиг отражения относительно реального фона
//       uCanvasOffset: { value: new THREE.Vector2(0, 0) },
//       uCanvasSize: { value: new THREE.Vector2(1, 1) },
//       // нативный размер видео (videoWidth/videoHeight), для расчёта cover-кропа
//       uVideoNative: { value: new THREE.Vector2(16, 9) },
//       // devicePixelRatio, т.к. gl_FragCoord в физических пикселях канваса
//       uDPR: { value: window.devicePixelRatio || 1 },
//       uDistortion: { value: 0.05 },
//       uFresnelStrength: { value: 0.18 },
//     },
//     vertexShader: `
//       varying vec3 vNormal;
//       varying vec3 vViewDir;
//       void main() {
//         vNormal = normalize(normalMatrix * normal);
//         vec4 mv = modelViewMatrix * vec4(position, 1.0);
//         vViewDir = normalize(-mv.xyz);
//         gl_Position = projectionMatrix * mv;
//       }
//     `,
//     fragmentShader: `
//       uniform sampler2D uVideoTex;
//       uniform vec2 uContainerSize;
//       uniform vec2 uContainerOffset;
//       uniform vec2 uCanvasOffset;
//       uniform vec2 uCanvasSize;
//       uniform vec2 uVideoNative;
//       uniform float uDPR;
//       uniform float uDistortion;
//       uniform float uFresnelStrength;
//       varying vec3 vNormal;
//       varying vec3 vViewDir;

//       // повторяет CSS object-fit: cover для видео внутри контейнера
//       vec2 coverUV(vec2 screenUV) {
//         float containerAspect = uContainerSize.x / uContainerSize.y;
//         float videoAspect = uVideoNative.x / uVideoNative.y;
//         vec2 uv = screenUV;
//         if (containerAspect > videoAspect) {
//           // контейнер шире видео -> обрезаются верх/низ
//           float scale = videoAspect / containerAspect;
//           uv.y = (uv.y - 0.5) * scale + 0.5;
//         } else {
//           // контейнер уже видео -> обрезаются края
//           float scale = containerAspect / videoAspect;
//           uv.x = (uv.x - 0.5) * scale + 0.5;
//         }
//         return uv;
//       }

//       void main() {
//         // gl_FragCoord — пиксель ВНУТРИ canvas модели (физические px, y снизу вверх)
//         vec2 localCanvasPx = gl_FragCoord.xy / uDPR; // -> CSS px, всё ещё локально для canvas
//         localCanvasPx.y = uCanvasSize.y - localCanvasPx.y; // разворачиваем в top-down, как в CSS

//         // переводим в глобальные координаты окна: позиция canvas + локальный пиксель
//         vec2 windowPx = uCanvasOffset + localCanvasPx;

//         // переводим в координаты относительно контейнера (.hero), 0..1
//         vec2 local = (windowPx - uContainerOffset) / uContainerSize;

//         // лёгкое "стеклянное" искажение по нормали поверхности
//         vec2 distorted = local + vNormal.xy * uDistortion;

//         vec2 videoUV = coverUV(clamp(distorted, 0.0, 1.0));
//         vec4 bg = texture2D(uVideoTex, videoUV);

//         // тонкий fresnel-блик по краям, чтобы читался объём модели
//         float fresnel = pow(1.0 - max(dot(normalize(vViewDir), normalize(vNormal)), 0.0), 2.5);
//         vec3 color = bg.rgb + fresnel * uFresnelStrength;

//         gl_FragColor = vec4(color, 1.0);
//       }
//     `,
//   });
// }

// /* =========================================================================
//    HeaderOrb — маленький хром-объект в хедере (тут отражение честное,
//    т.к. это UI-элемент, а не "слияние с фоном")
//    ========================================================================= */

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

//     const light = new THREE.PointLight(0xffffff, 2);
//     light.position.set(2, 2, 2);
//     scene.add(light);
//     scene.add(new THREE.AmbientLight(0xffffff, 0.6));

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
//     };
//   }, [modelUrl, modelUrlAlt]);

//   return <div className="header-orb" ref={mountRef}></div>;
// }

// /* =========================================================================
//    HeroModel — теперь "сливается" с фоновым видео через screen-space шейдер
//    ========================================================================= */

// function HeroModel({ modelUrl, heroVideoUrl, restRotationY = 0 }) {
//   const mountRef = useRef(null);
//   const heroSectionRef = useRef(null);

//   useEffect(() => {
//     const mount = mountRef.current;
//     if (!mount) return;

//     // .hero-model-wrap лежит внутри .hero (inset:0), поэтому контейнер
//     // для расчёта cover-кропа видео — это ближайшая секция .hero
//     const heroEl = mount.closest(".hero");
//     heroSectionRef.current = heroEl;

//     const CONFIG = {
//       modelSize: 2.8,
//       cameraZ: 6,
//       dragSensitivity: 0.008,
//       inertiaDamping: 0.94,
//       minVelocity: 0.00015,
//       settleDelay: 500,
//       settleSpeed: 0.045,
//     };

//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
//     camera.position.set(0, 0, CONFIG.cameraZ);

//     const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
//     const getSize = () => Math.min(mount.clientWidth || 560, mount.clientHeight || 560, 560);
//     let size = getSize();
//     renderer.setSize(size, size);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3));
//     mount.appendChild(renderer.domElement);

//     /* ---------- видео-текстура (та же, что играет фоном в Hero) ---------- */
//     let videoEl = null;
//     let videoTexture = null;

//     if (heroVideoUrl) {
//       videoEl = document.createElement("video");
//       videoEl.src = heroVideoUrl;
//       videoEl.crossOrigin = "anonymous";
//       videoEl.loop = true;
//       videoEl.muted = true;
//       videoEl.playsInline = true;
//       videoEl.autoplay = true;
//       videoEl.setAttribute("playsinline", "");
//       videoEl.preload = "auto";

//       videoTexture = new THREE.VideoTexture(videoEl);
//       videoTexture.colorSpace = THREE.SRGBColorSpace;
//       videoTexture.generateMipmaps = false;
//       videoTexture.minFilter = THREE.LinearFilter;
//       videoTexture.magFilter = THREE.LinearFilter;

//       videoEl.play().catch((err) => {
//         console.warn("[BrandSite] Автовоспроизведение видео заблокировано браузером:", err);
//       });
//     } else {
//       console.warn("[BrandSite] heroVideoUrl отсутствует.");
//     }

//     const bgMaterial = makeBgSampleMaterial(videoTexture || new THREE.Texture());

//     /* ---------- обновление uniforms под реальную геометрию страницы ---------- */
//     const updateScreenUniforms = () => {
//       const dpr = Math.min(window.devicePixelRatio || 1, 3);
//       bgMaterial.uniforms.uDPR.value = dpr;

//       const refEl = heroSectionRef.current || mount;
//       const rect = refEl.getBoundingClientRect();
//       bgMaterial.uniforms.uContainerSize.value.set(rect.width, rect.height);
//       bgMaterial.uniforms.uContainerOffset.value.set(rect.left, rect.top);

//       // позиция и CSS-размер самого <canvas>, где рисуется модель — обязательно
//       // после renderer.setSize(), т.к. до этого канвас может иметь размер 0
//       const canvasRect = renderer.domElement.getBoundingClientRect();
//       bgMaterial.uniforms.uCanvasOffset.value.set(canvasRect.left, canvasRect.top);
//       bgMaterial.uniforms.uCanvasSize.value.set(canvasRect.width, canvasRect.height);

//       if (videoEl && videoEl.videoWidth && videoEl.videoHeight) {
//         bgMaterial.uniforms.uVideoNative.value.set(videoEl.videoWidth, videoEl.videoHeight);
//       }
//     };

//     updateScreenUniforms();
//     if (videoEl) {
//       videoEl.addEventListener("loadedmetadata", updateScreenUniforms);
//     }
//     window.addEventListener("resize", updateScreenUniforms);
//     window.addEventListener("scroll", updateScreenUniforms, { passive: true });

//     /* ---------- загрузка GLB ---------- */
//     let current = null;
//     const disposeModel = loadMeshWithMaterial({
//       url: modelUrl,
//       fallbackGeo: new THREE.IcosahedronGeometry(1, 2),
//       material: bgMaterial,
//       label: "heroModelUrl",
//       onReady: (object) => {
//         fitAndCenter(object, CONFIG.modelSize);
//         current = object;
//         scene.add(current);
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

//       renderer.render(scene, camera);
//       raf = requestAnimationFrame(animate);
//     };
//     animate();

//     const onResize = () => {
//       size = getSize();
//       camera.aspect = 1;
//       camera.updateProjectionMatrix();
//       renderer.setSize(size, size);
//       updateScreenUniforms();
//     };
//     window.addEventListener("resize", onResize);

//     return () => {
//       cancelAnimationFrame(raf);
//       window.removeEventListener("resize", onResize);
//       window.removeEventListener("resize", updateScreenUniforms);
//       window.removeEventListener("scroll", updateScreenUniforms);
//       if (videoEl) videoEl.removeEventListener("loadedmetadata", updateScreenUniforms);

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

//       bgMaterial.dispose();
//       if (videoTexture) videoTexture.dispose();
//       if (videoEl) {
//         videoEl.pause();
//         videoEl.removeAttribute("src");
//         videoEl.load();
//       }

//       renderer.dispose();
//       if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
//     };
//   }, [modelUrl, heroVideoUrl, restRotationY]);

//   return (
//     <div className="hero-model-wrap">
//       <div ref={mountRef} style={{ width: "70vmin", height: "70vmin", maxWidth: 560, maxHeight: 560 }} />
//     </div>
//   );
// }

// /* =========================================================================
//    Остальная разметка — без изменений
//    ========================================================================= */

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
//   const bgVideoRef = useRef(null);

//   useEffect(() => {
//     const v = bgVideoRef.current;
//     if (v) {
//       v.play().catch((err) => console.warn("[BrandSite] Автовоспроизведение фонового видео заблокировано:", err));
//     }
//   }, [cfg.heroVideoUrl]);

//   return (
//     <section className="hero">
//       <div className={"hero-bg" + (cfg.heroVideoUrl ? "" : " no-photo")}>
//         {cfg.heroVideoUrl ? (
//           <video
//             ref={bgVideoRef}
//             className="hero-bg-video"
//             src={cfg.heroVideoUrl}
//             autoPlay
//             muted
//             loop
//             playsInline
//           />
//         ) : (
//           <div className="hero-bg-label">
//             heroVideoUrl — замени на своё видео<br />(широкоформатное, ≥ 1920px по ширине)
//           </div>
//         )}
//       </div>

//       <HeroModel modelUrl={cfg.heroModelUrl} heroVideoUrl={cfg.heroVideoUrl} restRotationY={cfg.heroMirrorRestRotationY} />

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
//   // Видео, которое одновременно (а) крутится фоном хиро-секции и (б) отражается в 3D-модели.
//   heroVideoUrl: "https://res.cloudinary.com/dbx6muxub/video/upload/v1785325905/volt_park_visual2kwide_sjelea.mp4",
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

// function HeroModel({ modelUrl, heroVideoUrl, restRotationY = 0 }) {
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

//     let videoEl = null;
//     let videoTexture = null;
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
//       texture.generateMipmaps = false; // видео-текстуры не поддерживают mipmaps
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

//     if (heroVideoUrl) {
//       videoEl = document.createElement("video");
//       videoEl.src = heroVideoUrl;
//       videoEl.crossOrigin = "anonymous"; // обязательно, иначе WebGL не сможет читать пиксели видео
//       videoEl.loop = true;
//       videoEl.muted = true;
//       videoEl.playsInline = true;
//       videoEl.autoplay = true;
//       videoEl.setAttribute("playsinline", ""); // для старых iOS Safari
//       videoEl.preload = "auto";

//       videoTexture = new THREE.VideoTexture(videoEl);
//       buildReflectionRoom(videoTexture);

//       videoEl.play().catch((err) => {
//         console.warn("[BrandSite] Автовоспроизведение видео заблокировано браузером:", err);
//       });
//     } else {
//       console.warn("[BrandSite] heroVideoUrl отсутствует.");
//     }

//     /* ---------- CubeCamera ---------- */
//     const cubeRT = new THREE.WebGLCubeRenderTarget(CONFIG.reflectionSize, {
//       generateMipmaps: true,
//       minFilter: THREE.LinearMipmapLinearFilter,
//       magFilter: THREE.LinearFilter,
//     });
//     const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRT);
//     scene.add(cubeCamera);

//     // const chromeMaterial = new THREE.MeshStandardMaterial({
//     //   color: 0xffffff,
//     //   metalness: 1,
//     //   roughness: 0,
//     //   envMap: cubeRT.texture,
//     //   envMapIntensity: 2,
//     //   transparent: false,
//     //   side: THREE.DoubleSide,
//     // });
//     const chromeMaterial = new THREE.MeshBasicMaterial({
//   color: 0xffffff,
//   envMap: cubeRT.texture,
//   reflectivity: 1,
//   combine: THREE.MultiplyOperation, // или THREE.AddOperation для ярче/светлее
//   side: THREE.DoubleSide,
// });

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

//       // VideoTexture сам помечает needsUpdate каждый кадр, пока видео играет —
//       // руками ничего дергать не нужно, просто регулярно обновляем env-карту.
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

//       if (videoTexture) videoTexture.dispose();
//       if (videoEl) {
//         videoEl.pause();
//         videoEl.removeAttribute("src");
//         videoEl.load();
//       }

//       cubeRT.dispose();
//       renderer.dispose();
//       if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
//     };
//   }, [modelUrl, heroVideoUrl, restRotationY]);

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
//   const bgVideoRef = useRef(null);

//   useEffect(() => {
//     const v = bgVideoRef.current;
//     if (v) {
//       v.play().catch((err) => console.warn("[BrandSite] Автовоспроизведение фонового видео заблокировано:", err));
//     }
//   }, [cfg.heroVideoUrl]);

//   return (
//     <section className="hero">
//       <div className={"hero-bg" + (cfg.heroVideoUrl ? "" : " no-photo")}>
//         {cfg.heroVideoUrl ? (
//           <video
//             ref={bgVideoRef}
//             className="hero-bg-video"
//             src={cfg.heroVideoUrl}
//             autoPlay
//             muted
//             loop
//             playsInline
//           />
//         ) : (
//           <div className="hero-bg-label">
//             heroVideoUrl — замени на своё видео<br />(широкоформатное, ≥ 1920px по ширине)
//           </div>
//         )}
//       </div>

//       <HeroModel modelUrl={cfg.heroModelUrl} heroVideoUrl={cfg.heroVideoUrl} restRotationY={cfg.heroMirrorRestRotationY} />

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