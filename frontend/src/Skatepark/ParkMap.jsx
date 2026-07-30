// import { useRef, useState } from "react";
// import gsap from "gsap";
// import "../Skatepark/Skatepark.css";


// const figures = [
//   {
//     id: "rail",
//     title: "Rail",
//     image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257520/volt_park_visual10_2_oo1az0.jpg",
//     area: {
//       left: "20%",
//       top: "45%",
//       width: "12%",
//       height: "8%",
//     },
//   },

//   {
//     id: "quarter",
//     title: "Quarter Pipe",
//     image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257520/volt_park_visual10_2_oo1az0.jpg",
//     area: {
//       left: "65%",
//       top: "20%",
//       width: "18%",
//       height: "35%",
//     },
//   },

//   {
//     id: "box",
//     title: "Fun Box",
//     image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual9_2_jrzknr.jpg",
//     area: {
//       left: "40%",
//       top: "60%",
//       width: "15%",
//       height: "10%",
//     },
//   },

//   // добавь еще 7 фигур сюда
// ];


// export default function Skatepark() {

//   const layers = useRef({});
//   const tooltip = useRef(null);

//   const [active, setActive] = useState(null);


//   const showFigure = (id, title) => {

//     setActive(title);


//     Object.keys(layers.current).forEach((key)=>{

//       gsap.to(layers.current[key],{
//         opacity:key === id ? 1 : 0,
//         duration:.45,
//         ease:"power3.out"
//       });

//     });


//     gsap.fromTo(
//       tooltip.current,
//       {
//         opacity:0,
//         y:10,
//         scale:.9
//       },
//       {
//         opacity:1,
//         y:0,
//         scale:1,
//         duration:.3
//       }
//     );

//   };


//   const hideFigure = ()=>{

//     setActive(null);


//     Object.values(layers.current).forEach(layer=>{

//       gsap.to(layer,{
//         opacity:0,
//         duration:.45,
//         ease:"power3.out"
//       });

//     });


//     gsap.to(
//       tooltip.current,
//       {
//         opacity:0,
//         y:10,
//         duration:.25
//       }
//     );

//   };


//   const moveTooltip = (e)=>{

//     if(!tooltip.current) return;


//     gsap.to(tooltip.current,{
//       x:e.clientX + 15,
//       y:e.clientY + 15,
//       duration:.15
//     });

//   };



// return (

// <div
// className="skatepark"
// onMouseMove={moveTooltip}
// >


// {/* основа */}

// <img
// className="park-image"
// src="https://res.cloudinary.com/dbx6muxub/image/upload/v1785257521/voltparkvisual2_k4c3fr.jpg"
// alt=""
// />



// {/* цветные слои */}

// {
// figures.map(item=>(

// <img

// key={item.id}

// ref={(el)=>
// layers.current[item.id]=el
// }

// className="park-layer"

// src={item.image}

// alt=""

// />

// ))
// }




// {/* зоны */}

// {
// figures.map(item=>(

// <div

// key={item.id}

// className="hotspot"

// style={item.area}

// onMouseEnter={()=>
// showFigure(item.id,item.title)
// }

// onMouseLeave={hideFigure}

// />

// ))
// }



// {/* подсказка */}

// <div
// ref={tooltip}
// className="skate-tooltip"
// >

// {active}

// </div>



// </div>

// );

// }
// import { useRef, useState, useEffect } from "react";
// import gsap from "gsap";
// import "../Skatepark/Skatepark.css";
// import ParkMap from "../Skatepark/park.svg?react";

// const figures = [
//   { id: "quater",   title: "quarter",       image: "..." },
//   { id: "quater2",  title: "Quarter Pipe",  image: "..." },
//   { id: "vertwall", title: "Vertical Wall", image: "..." },
//   // остальные фигуры — id должен совпадать с id path в park.svg
// ];

// const figureById = Object.fromEntries(figures.map(f => [f.id, f]));

// export default function Skatepark() {
//   const svgWrapRef = useRef(null);
//   const layers = useRef({});
//   const [active, setActive] = useState(null);

//   const isTouch =
//     typeof window !== "undefined" &&
//     window.matchMedia("(pointer: coarse)").matches;

//   const highlight = (id) => {
//     setActive(id);
//     Object.keys(layers.current).forEach((key) => {
//       gsap.to(layers.current[key], {
//         opacity: key === id ? 1 : 0,
//         duration: 0.4,
//         ease: "power3.out",
//       });
//     });
//   };

//   const clearHighlight = () => {
//     setActive(null);
//     Object.values(layers.current).forEach((layer) =>
//       gsap.to(layer, { opacity: 0, duration: 0.4 })
//     );
//   };

//   useEffect(() => {
//     const root = svgWrapRef.current;
//     if (!root) return;

//     const paths = root.querySelectorAll("path[id]");
// console.log(document.querySelectorAll('.park-svg path[id]'))
//     paths.forEach((path) => {
//       const figure = figureById[path.id];
//       if (!figure) return; // путь без соответствующей фигуры пропускаем

//       path.style.cursor = "pointer";
//       path.style.pointerEvents = "auto"; // на случай если у svg pointer-events:none

//       if (isTouch) {
//         // тап — тоггл: тапнул по фигуре -> подсветилась,
//         // тапнул ещё раз по ней же или мимо -> погасла
//         path.addEventListener("click", (e) => {
//           e.stopPropagation();
//           setActive((prev) => {
//             const next = prev === figure.id ? null : figure.id;
//             if (next) highlight(next);
//             else clearHighlight();
//             return next;
//           });
//         });
//       } else {
//         path.addEventListener("mouseenter", () => highlight(figure.id));
//         path.addEventListener("mouseleave", clearHighlight);
//       }
//     });

//     if (isTouch) {
//       // тап в пустое место карты - сброс подсветки
//       const handleOutsideTap = (e) => {
//         if (!root.contains(e.target)) clearHighlight();
//       };
//       document.addEventListener("click", handleOutsideTap);
//       return () => document.removeEventListener("click", handleOutsideTap);
//     }
//   }, [isTouch]);

//   return (
//     <div className="skatepark">
//       <img
//         className="park-image"
//         src="..."
//         alt="skatepark"
//       />

//       {figures.map((item) => (
//         <img
//           key={item.id}
//           ref={(el) => (layers.current[item.id] = el)}
//           className="park-layer"
//           src={item.image}
//           alt=""
//         />
//       ))}

//       <div ref={svgWrapRef} className="park-svg-wrap">
//         <ParkMap className="park-svg" />
//       </div>

//       {active && (
//         <div className="skate-tooltip skate-tooltip--visible">
//           {figureById[active]?.title}
//         </div>
//       )}
//     </div>
//   );
// }
// import { useRef, useState, useEffect, useCallback } from "react";
// import gsap from "gsap";
// import "./Skatepark.css";

// /**
//  * ПРО ІМПОРТ SVG (`?react` vs fetch у рантаймі)
//  * ─────────────────────────────────────────────
//  * Якщо у тебе вже налаштований vite-plugin-svgr — статичний імпорт
//  * теж може працювати:
//  *   import ParkMap from "./park.svg?react";
//  * АЛЕ є 2 типові причини, чому навіть з налаштованим плагіном компонент
//  * не з'являється:
//  *   1) У svgr не ввімкнено exportAsDefault: true — тоді `import X from
//  *      "...svg?react"` повертає undefined, і React мовчки не рендерить
//  *      дерево (в консолі буде "Element type is invalid"). Або постав
//  *      exportAsDefault: true в конфіг, або імпортуй саме так:
//  *      import { ReactComponent as ParkMap } from "./park.svg?react";
//  *   2) id всередині <path> у самому park.svg не збігаються 1-в-1 (з
//  *      урахуванням регістру й дефісів) з id в масиві `figures` нижче —
//  *      тоді svg покажеться, але жодна фігура не буде клікабельною.
//  * Перевіряй консоль браузера — там завжди є конкретна помилка.
//  *
//  * Нижче лишив варіант через fetch() у рантаймі — він працює однаково
//  * незалежно від того, чи налаштований svgr, тому лишаю його як
//  * надійний дефолт. Хочеш повернутись на статичний імпорт — заміни
//  * useEffect, що вантажить svgMarkup, на прямий `<ParkMap className="park-svg" />`.
//  */
// const SVG_DESKTOP = "/park.svg";
// const SVG_MOBILE = "/park-mobile.svg";

// const BASE_IMAGE =
//   "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257521/voltparkvisual2_k4c3fr.jpg";
// const BASE_IMAGE_MOBILE = BASE_IMAGE;

// // Каждая фигура: id должен ТОЧНО совпадать с id path в svg.
// // note — короткий "статовий" факт, покажем его как буллет в карточке.
// const figures = [
//   { id: "ramp", title: "Рампа", note: "Набір швидкості й повітряні трюки.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual12_unvhp8.jpg" },
//   { id: "quater3", title: "Квотер 3", note: "Третій квотер, свій розмір і характер.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual11_cewrz7.jpg" },
//   { id: "roll-in", title: "Ролл-ін", note: "Заїзд у секцію з фігурами.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257520/volt_park_visual10_2_oo1az0.jpg" },
//   { id: "bank", title: "Бенк", note: "Похила поверхня для зв'язок.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual9_2_jrzknr.jpg" },
//   { id: "box", title: "Бокс", note: "Для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual13_z6hp1g.jpg" },
//   { id: "jumpbox", title: "Джампбокс", note: "Стрибки й ейр-трюки.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/voltparkvisual4_rrbeeo.jpg" },
//   { id: "flybox", title: "Флайбокс", note: "Фірмова фігура з ухилом в ейр.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/voltparkvisual3_kpnpkk.jpg" },
//   { id: "volcano", title: "Волкано", note: "Складніші заходи і виходи.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual5_2_w899yo.jpg" },
//   { id: "quater2", title: "Квотер 2", note: "Частина великої ейр-зони.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual6_2_gl0q0k.jpg" },
//   { id: "vertwall", title: "Vert wall", note: "Вертикальна стіна, найвищий рівень.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual8_2_zwmivn.jpg" },
//   { id: "quater", title: "Квотер", note: "Базовий квотер, старт для новачків.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual7_2_rrpf7v.jpg" },
// ];

// const figureById = Object.fromEntries(figures.map((f) => [f.id, f]));

// function useIsMobile(breakpoint = 720) {
//   const [isMobile, setIsMobile] = useState(false);
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
//     const update = () => setIsMobile(mq.matches);
//     update();
//     mq.addEventListener("change", update);
//     return () => mq.removeEventListener("change", update);
//   }, [breakpoint]);
//   return isMobile;
// }

// export default function Skatepark() {
//   const svgWrapRef = useRef(null);
//   const rosterRef = useRef(null);
//   const layers = useRef({});
//   const thumbRefs = useRef({});
//   const [active, setActive] = useState(null);
//   const [locked, setLocked] = useState(false); // клик по тумбу "прикалывает" карточку
//   const [cardPos, setCardPos] = useState({ side: "right" });
//   const [svgMarkup, setSvgMarkup] = useState(null);
//   const [svgFailed, setSvgFailed] = useState(false);

//   const isMobile = useIsMobile();
//   const isTouch =
//     typeof window !== "undefined" &&
//     window.matchMedia("(pointer: coarse)").matches;

//   useEffect(() => {
//     let cancelled = false;
//     setSvgMarkup(null);
//     setSvgFailed(false);
//     const src = isMobile ? SVG_MOBILE : SVG_DESKTOP;

//     fetch(src)
//       .then((res) => {
//         if (!res.ok) throw new Error(`SVG not found: ${src}`);
//         return res.text();
//       })
//       .then((text) => {
//         if (cancelled) return;
//         const cleaned = text
//           .replace(/<svg([^>]*)\swidth="[^"]*"/i, "<svg$1")
//           .replace(/<svg([^>]*)\sheight="[^"]*"/i, "<svg$1");
//         setSvgMarkup(cleaned);
//       })
//       .catch(() => {
//         if (cancelled) return;
//         if (isMobile) {
//           fetch(SVG_DESKTOP)
//             .then((r) => (r.ok ? r.text() : Promise.reject()))
//             .then((text) => !cancelled && setSvgMarkup(text))
//             .catch(() => !cancelled && setSvgFailed(true));
//         } else {
//           setSvgFailed(true);
//         }
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, [isMobile]);

//   const showLayer = useCallback((id, clientX) => {
//     setActive(id);
//     if (typeof window !== "undefined" && typeof clientX === "number") {
//       setCardPos({ side: clientX > window.innerWidth / 2 ? "left" : "right" });
//     }
//     Object.entries(layers.current).forEach(([key, el]) => {
//       if (!el) return;
//       gsap.to(el, {
//         opacity: key === id ? 1 : 0,
//         duration: 0.35,
//         ease: "power2.out",
//         overwrite: true,
//       });
//     });
//     Object.entries(thumbRefs.current).forEach(([key, el]) => {
//       if (!el) return;
//       el.classList.toggle("roster-tile--active", key === id);
//     });
//   }, []);

//   const hideAllLayers = useCallback(() => {
//     if (locked) return; // не гасимо, если карточка "приколота" кликом
//     setActive(null);
//     Object.values(layers.current).forEach((el) => {
//       if (!el) return;
//       gsap.to(el, { opacity: 0, duration: 0.35, ease: "power2.out", overwrite: true });
//     });
//     Object.values(thumbRefs.current).forEach((el) => {
//       if (el) el.classList.remove("roster-tile--active");
//     });
//   }, [locked]);

//   // Универсальный набор обработчиков — навешивается и на path'ы svg,
//   // и на тумбы ростера, чтобы логика подсветки была одна и та же.
//   const bindFigureEvents = useCallback(
//     (el, figure) => {
//       const cleanup = [];
//       if (isTouch) {
//         const onTap = (e) => {
//           e.stopPropagation();
//           setLocked((prevLocked) => {
//             const willLock = !(prevLocked && active === figure.id);
//             if (willLock) showLayer(figure.id, e.clientX);
//             else hideAllLayersForce();
//             return willLock;
//           });
//         };
//         el.addEventListener("click", onTap);
//         cleanup.push(() => el.removeEventListener("click", onTap));
//       } else {
//         const onEnter = (e) => showLayer(figure.id, e.clientX);
//         const onLeave = () => hideAllLayers();
//         const onClick = (e) => {
//           // клик на десктопе "приколачивает" карточку, повторный — открепляет
//           setLocked((prev) => {
//             const next = !(prev && active === figure.id);
//             if (next) showLayer(figure.id, e.clientX);
//             return next;
//           });
//         };
//         const onFocus = (e) => showLayer(figure.id, e.target.getBoundingClientRect().x);
//         const onBlur = () => hideAllLayers();

//         el.addEventListener("mouseenter", onEnter);
//         el.addEventListener("mouseleave", onLeave);
//         el.addEventListener("click", onClick);
//         el.addEventListener("focus", onFocus);
//         el.addEventListener("blur", onBlur);

//         cleanup.push(() => {
//           el.removeEventListener("mouseenter", onEnter);
//           el.removeEventListener("mouseleave", onLeave);
//           el.removeEventListener("click", onClick);
//           el.removeEventListener("focus", onFocus);
//           el.removeEventListener("blur", onBlur);
//         });
//       }
//       return () => cleanup.forEach((fn) => fn());
//     },
//     [isTouch, active, showLayer, hideAllLayers]
//   );

//   function hideAllLayersForce() {
//     setActive(null);
//     setLocked(false);
//     Object.values(layers.current).forEach((el) => {
//       if (!el) return;
//       gsap.to(el, { opacity: 0, duration: 0.35, ease: "power2.out", overwrite: true });
//     });
//     Object.values(thumbRefs.current).forEach((el) => {
//       if (el) el.classList.remove("roster-tile--active");
//     });
//   }

//   // Навешиваем на path'ы svg — только после того, как markup реально в DOM
//   useEffect(() => {
//     const root = svgWrapRef.current;
//     if (!root || !svgMarkup) return;

//     const paths = root.querySelectorAll("path[id]");
//     const cleanupFns = [];

//     paths.forEach((path) => {
//       const figure = figureById[path.id];
//       if (!figure) return;
//       path.style.cursor = "pointer";
//       path.style.pointerEvents = "auto";
//       path.setAttribute("tabindex", "0");
//       path.setAttribute("role", "button");
//       path.setAttribute("aria-label", figure.title);
//       cleanupFns.push(bindFigureEvents(path, figure));
//     });

//     let outsideTapHandler;
//     if (isTouch) {
//       outsideTapHandler = (e) => {
//         if (!root.contains(e.target) && !rosterRef.current?.contains(e.target)) {
//           hideAllLayersForce();
//         }
//       };
//       document.addEventListener("click", outsideTapHandler);
//     }

//     return () => {
//       cleanupFns.forEach((fn) => fn());
//       if (outsideTapHandler) document.removeEventListener("click", outsideTapHandler);
//     };
//   }, [isTouch, svgMarkup, bindFigureEvents]);

//   // Навешиваем на тумбы ростера
//   useEffect(() => {
//     const cleanupFns = [];
//     figures.forEach((figure) => {
//       const el = thumbRefs.current[figure.id];
//       if (!el) return;
//       cleanupFns.push(bindFigureEvents(el, figure));
//     });
//     return () => cleanupFns.forEach((fn) => fn());
//   }, [bindFigureEvents]);

//   const activeFigure = active ? figureById[active] : null;
//   const baseImage = isMobile ? BASE_IMAGE_MOBILE : BASE_IMAGE;

//   return (
//     <div className="skatepark-wrap">
//       {/* data-cursor-trail="off" выключает CursorImageTrail в этой зоне */}
//       <div className={`skatepark ${isMobile ? "skatepark--mobile" : ""}`} data-cursor-trail="off">
//         <img className="park-image" src={baseImage} alt="Скейтпарк, загальний вигляд" />

//         {figures.map((item) => (
//           <img
//             key={item.id}
//             ref={(el) => (layers.current[item.id] = el)}
//             className="park-layer"
//             src={isMobile && item.imageMobile ? item.imageMobile : item.image}
//             alt={item.title}
//           />
//         ))}

//         <div
//           ref={svgWrapRef}
//           className="park-svg-wrap"
//           // eslint-disable-next-line react/no-danger
//           dangerouslySetInnerHTML={svgMarkup ? { __html: svgMarkup } : undefined}
//         />

//         {svgFailed && (
//           <div className="skate-fallback">
//             Не вдалося завантажити карту парку. Перевір, що файл{" "}
//             <code>{isMobile ? "park-mobile.svg" : "park.svg"}</code> лежить у папці{" "}
//             <code>/public</code>.
//           </div>
//         )}

//         {/* ── Карточка фигуры, в стиле статовой карточки персонажа ── */}
//         <div
//           className={`skate-card skate-card--${cardPos.side} ${
//             activeFigure ? "skate-card--visible" : ""
//           }`}
//         >
//           {activeFigure && (
//             <>
//               <div className="skate-card__head">
//                 <span className="skate-card__chip" />
//                 <span className="skate-card__title">{activeFigure.title}</span>
//               </div>
//               <div className="skate-card__body">
//                 <span className="skate-card__bullet">—</span>
//                 <span className="skate-card__text">{activeFigure.note}</span>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* ── Ростер фигур — горизонтальная прокрутка, как выбор персонажа ── */}
//       <div className="roster" ref={rosterRef}>
//         {figures.map((figure) => (
//           <button
//             key={figure.id}
//             type="button"
//             className="roster-tile"
//             ref={(el) => (thumbRefs.current[figure.id] = el)}
//             aria-label={figure.title}
//           >
//             <img src={figure.image} alt="" />
//             <span className="roster-tile__lock">✕</span>
//             <span className="roster-tile__label">{figure.title}</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// import { useRef, useState, useEffect } from "react";
// import gsap from "gsap";
// import "../Skatepark/Skatepark.css";
// import ParkMap from "../Skatepark/park.svg?react";

// // Базовое фото парка (общий план, без подсветки)
// const BASE_IMAGE = "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257521/voltparkvisual2_k4c3fr.jpg";

// // Каждая фигура: id должен ТОЧНО совпадать с id path в park.svg,
// // image — картинка именно этой фигуры (крупный план / рендер / фото),
// // которая появится поверх базового фото при наведении.
// const figures = [
//   { id: "ramp",     title: "Рампа",              image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual12_unvhp8.jpg" },
//   { id: "quater3",  title: "Квотер 3",           image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual11_cewrz7.jpg" },
//   { id: "roll-in",  title: "Ролл-ін",            image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257520/volt_park_visual10_2_oo1az0.jpg" },
//   { id: "bank",     title: "Бенк",               image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual9_2_jrzknr.jpg" },
//   { id: "box",      title: "Бокс",               image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual13_z6hp1g.jpg" },
//   { id: "jumpbox",  title: "Джампбокс",          image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/voltparkvisual4_rrbeeo.jpg" },
//   { id: "flybox",   title: "Флайбокс",           image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/voltparkvisual3_kpnpkk.jpg" },
//   { id: "volcano",  title: "Волкано",            image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual5_2_w899yo.jpg" },
//   { id: "quater2",  title: "Квотер 2",           image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual6_2_gl0q0k.jpg" },
//   { id: "vertwall", title: "Vert wall",          image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual8_2_zwmivn.jpg" },
//   { id: "quater",   title: "Квотер",             image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual7_2_rrpf7v.jpg" },
// ];

// const figureById = Object.fromEntries(figures.map((f) => [f.id, f]));

// export default function Skatepark() {
//   const svgWrapRef = useRef(null);
//   const layers = useRef({});
//   const [active, setActive] = useState(null);

//   const isTouch =
//     typeof window !== "undefined" &&
//     window.matchMedia("(pointer: coarse)").matches;

//   const showLayer = (id) => {
//     setActive(id);
//     Object.entries(layers.current).forEach(([key, el]) => {
//       if (!el) return;
//       gsap.to(el, {
//         opacity: key === id ? 1 : 0,
//         duration: 0.35,
//         ease: "power2.out",
//         overwrite: true,
//       });
//     });
//   };

//   const hideAllLayers = () => {
//     setActive(null);
//     Object.values(layers.current).forEach((el) => {
//       if (!el) return;
//       gsap.to(el, { opacity: 0, duration: 0.35, ease: "power2.out", overwrite: true });
//     });
//   };

//   useEffect(() => {
//     const root = svgWrapRef.current;
//     if (!root) return;

//     const paths = root.querySelectorAll("path[id]");
//     const cleanupFns = [];

//     paths.forEach((path) => {
//       const figure = figureById[path.id];
//       if (!figure) return;

//       path.style.cursor = "pointer";
//       path.style.pointerEvents = "auto";
//       path.setAttribute("tabindex", "0");
//       path.setAttribute("role", "button");
//       path.setAttribute("aria-label", figure.title);

//       if (isTouch) {
//         const onTap = (e) => {
//           e.stopPropagation();
//           setActive((prev) => {
//             const next = prev === figure.id ? null : figure.id;
//             if (next) showLayer(next);
//             else hideAllLayers();
//             return next;
//           });
//         };
//         path.addEventListener("click", onTap);
//         cleanupFns.push(() => path.removeEventListener("click", onTap));
//       } else {
//         const onEnter = () => showLayer(figure.id);
//         const onLeave = () => hideAllLayers();
//         const onFocus = () => showLayer(figure.id);
//         const onBlur = () => hideAllLayers();

//         path.addEventListener("mouseenter", onEnter);
//         path.addEventListener("mouseleave", onLeave);
//         path.addEventListener("focus", onFocus);
//         path.addEventListener("blur", onBlur);

//         cleanupFns.push(() => {
//           path.removeEventListener("mouseenter", onEnter);
//           path.removeEventListener("mouseleave", onLeave);
//           path.removeEventListener("focus", onFocus);
//           path.removeEventListener("blur", onBlur);
//         });
//       }
//     });

//     let outsideTapHandler;
//     if (isTouch) {
//       outsideTapHandler = (e) => {
//         if (!root.contains(e.target)) hideAllLayers();
//       };
//       document.addEventListener("click", outsideTapHandler);
//     }

//     return () => {
//       cleanupFns.forEach((fn) => fn());
//       if (outsideTapHandler) document.removeEventListener("click", outsideTapHandler);
//     };
//   }, [isTouch]);

//   return (
//     <div className="skatepark">
//       {/* Базовое фото — видно всегда */}
//       <img className="park-image" src={BASE_IMAGE} alt="Скейтпарк, загальний вигляд" />

//       {/* Слой картинки для каждой фигуры — проявляется поверх базового при наведении */}
//       {figures.map((item) => (
//         <img
//           key={item.id}
//           ref={(el) => (layers.current[item.id] = el)}
//           className="park-layer"
//           src={item.image}
//           alt={item.title}
//         />
//       ))}

//       {/* SVG поверх всего — прозрачные path работают как hit-зоны для наведения */}
//       <div ref={svgWrapRef} className="park-svg-wrap">
//         <ParkMap className="park-svg" />
//       </div>

//       {active && (
//         <div className="skate-tooltip skate-tooltip--visible">
//           {figureById[active]?.title}
//         </div>
//       )}
//     </div>
//   );
// }
// 

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";


/**
 * ParkMap
 * -------
 * Загальна фотка парку + SVG-мапа з клікабельними/ховабельними зонами.
 * При наведенні на зону — плавно (GSAP) підсвічується відповідне фото
 * (те саме фото, але з візуально виділеним елементом), яке лежить
 * поверх базового зображення.
 *
 * Підказку (тултул з описом) компонент НЕ рендерить сам — він лише
 * повідомляє про активний елемент через onFigureHover(figure, event),
 * щоб можна було намалювати свій тултул будь-де на лендингу.
 *
 * ВАЖЛИВО: viewBox SVG (2304x776) у прикладі не збігається за
 * пропорціями з фото (2476x1473). SVG розтягується на весь контейнер
 * (preserveAspectRatio="none"), тож зони підсвітяться коректно тільки
 * якщо координати path'ів справді малювалися відносно повного кадру
 * базового фото. Якщо після інтеграції побачиш зсув — онови
 * viewBox на реальні пропорції фото (2476 776 -> краще 2476 1473,
 * підправивши координати path).
 */

const figures = [
  { id: "ramp", title: "Рампа", note: "Класична рампа для набору швидкості й повітряних трюків.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual12_unvhp8.jpg" },
  { id: "quater3", title: "Квотер 3", note: "Один із трьох квотерів парку, свій розмір і свій характер.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual11_cewrz7.jpg" },
  { id: "roll-in", title: "Ролл-ін", note: "Заїзд, з якого стартують у секцію з фігурами.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257520/volt_park_visual10_2_oo1az0.jpg" },
  { id: "bank", title: "Бенк", note: "Похила поверхня для зв'язок і плавних переходів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual9_2_jrzknr.jpg" },
  { id: "box", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual13_z6hp1g.jpg" },
  { id: "jumpbox", title: "Джампбокс", note: "Фігура для стрибків і відпрацювання ейр-трюків.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/voltparkvisual4_rrbeeo.jpg" },
  { id: "flybox", title: "Флайбокс", note: "Одна з фірмових фігур парку з ухилом в ейр.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/voltparkvisual3_kpnpkk.jpg" },
  { id: "volcano", title: "Волкано", note: "Фігура для складніших заходів і виходів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual5_2_w899yo.jpg" },
  { id: "quater2", title: "Квотер 2", note: "Другий квотер — частина великої ейр-зони.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual6_2_gl0q0k.jpg" },
  { id: "vertwall", title: "Vert wall", note: "Вертикальна стіна для найвищого рівня катання.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual8_2_zwmivn.jpg" },
  { id: "quater", title: "Квотер", note: "Базовий квотер парку, з нього зручно починати.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual7_2_rrpf7v.jpg" },
  { id: "box2", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual14_dnjash.jpg" },
  { id: "wallride", title: "Волрайд", note: "Секція для заїзду по стіні.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual15_ktwiqp.jpg" },
];

const BASE_IMAGE = "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257521/voltparkvisual2_k4c3fr.jpg";

export default function ParkMap({ onFigureHover, className = "" }) {
  const [activeId, setActiveId] = useState(null);
  const highlightRefs = useRef({});

  // мапа id -> дані фігури, для швидкого лукапу
  const figuresById = useMemo(
    () => Object.fromEntries(figures.map((f) => [f.id, f])),
    []
  );

  useEffect(() => {
    figures.forEach((f) => {
      const el = highlightRefs.current[f.id];
      if (!el) return;
      gsap.to(el, {
        opacity: f.id === activeId ? 1 : 0,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  }, [activeId]);

  const handleEnter = (id) => (e) => {
    setActiveId(id);
    onFigureHover?.(figuresById[id], e);
  };

  const handleLeave = () => {
    setActiveId(null);
    onFigureHover?.(null);
  };

  const pathClass =
    "fill-transparent hover:fill-white/5 focus:fill-white/10 outline-none cursor-pointer transition-colors duration-200";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl select-none ${className}`}
      style={{ aspectRatio: "2476 / 1473" }}
    >
      {/* Базове фото */}
      <img
        src={BASE_IMAGE}
        alt="Схема парку"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Підсвічені фото — по одному на кожну фігуру, ховаються/показуються через GSAP */}
      {figures.map((f) => (
        <img
          key={f.id}
          ref={(el) => (highlightRefs.current[f.id] = el)}
          src={f.image}
          alt={f.title}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
          draggable={false}
        />
      ))}

      {/* SVG-мапа з ховабельними зонами */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 2304 776"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path id="quater3" className={pathClass} tabIndex={0} onMouseEnter={handleEnter("quater3")} onMouseLeave={handleLeave} onFocus={handleEnter("quater3")} onBlur={handleLeave} d="M1554.5 718.5V484.5H1590.5L1677 488L1745.5 494L1884.5 498.5V748.5H1745.5L1554.5 718.5Z" />
        <path id="roll-in" className={pathClass} tabIndex={0} onMouseEnter={handleEnter("roll-in")} onMouseLeave={handleLeave} onFocus={handleEnter("roll-in")} onBlur={handleLeave} d="M1533.5 482.5V276.5L1708 274L1770.5 270H1841H1900H1923.5H1930.5V504H1923.5L1900 496.5H1783L1709 488.5L1533.5 482.5Z" />
        <path id="bank" className={pathClass} tabIndex={0} onMouseEnter={handleEnter("bank")} onMouseLeave={handleLeave} onFocus={handleEnter("bank")} onBlur={handleLeave} d="M1786.5 25L1545.5 41V274H1721.5L1786.5 270.5H1869V25H1786.5Z" />
        <path id="box" className={pathClass} tabIndex={0} onMouseEnter={handleEnter("box")} onMouseLeave={handleLeave} onFocus={handleEnter("box")} onBlur={handleLeave} d="M801 40.5V0H1102.5V43L809 45.5L801 40.5Z" />
        <path id="jumpbox" className={pathClass} tabIndex={0} onMouseEnter={handleEnter("jumpbox")} onMouseLeave={handleLeave} onFocus={handleEnter("jumpbox")} onBlur={handleLeave} d="M752.5 276.5V114L909.5 105.5H1022.5L1141.5 113V276.5L1022.5 273L752.5 276.5Z" />
        <path id="flybox" className={pathClass} tabIndex={0} onMouseEnter={handleEnter("flybox")} onMouseLeave={handleLeave} onFocus={handleEnter("flybox")} onBlur={handleLeave} d="M867.5 275L719 277L719.5 483H745.5L867 488L957 492.5L1002.5 490H1033.5L1179.5 482V276L1032 273L867.5 275Z" />
        <path id="volcano" className={pathClass} tabIndex={0} onMouseEnter={handleEnter("volcano")} onMouseLeave={handleLeave} onFocus={handleEnter("volcano")} onBlur={handleLeave} d="M840.5 645.5V487L957.5 492.5H976.5L1105 485V645.5L976.5 662.5H957.5L840.5 645.5Z" />
        <path id="quater2" className={pathClass} tabIndex={0} onMouseEnter={handleEnter("quater2")} onMouseLeave={handleLeave} onFocus={handleEnter("quater2")} onBlur={handleLeave} d="M91.5 585H65L65.5 755.5H73L104.5 740.5H189.5H194.5L376 718V513L162.5 523.5V571L91.5 585Z" />
        <path id="vertwall" className={pathClass} tabIndex={0} onMouseEnter={handleEnter("vertwall")} onMouseLeave={handleLeave} onFocus={handleEnter("vertwall")} onBlur={handleLeave} d="M44 187.5L0 182V593H7.5L45 584.5H93.5L163 570.5V522.5L364 511V246.5L184 243.5V196.5L44 187.5Z" />
        <path id="quater" className={pathClass} tabIndex={0} onMouseEnter={handleEnter("quater")} onMouseLeave={handleLeave} onFocus={handleEnter("quater")} onBlur={handleLeave} d="M116.5 26.5C106 23 83.2 16 76 16L77.5 187L184 196.5V242.5L376 247V39L214 26.5H116.5Z" />
        <path id="ramp" className={pathClass} tabIndex={0} onMouseEnter={handleEnter("ramp")} onMouseLeave={handleLeave} onFocus={handleEnter("ramp")} onBlur={handleLeave} d="M1910 3L1866.5 24H1871V112.5V272H1930.5V505H1924.5L1899.5 498H1886V679V684V749H1958.5V711H2197.5L2247 749H2265V684V679L2237 640.5L2215 579.5L2208 493V267L2217 172L2236 119.5L2266 88V18.5H2277.5L2303.5 11V3H1910Z" />
        <path id="box2" className={pathClass} tabIndex={0} onMouseEnter={handleEnter("box2")} onMouseLeave={handleLeave} onFocus={handleEnter("box2")} onBlur={handleLeave} d="M2236 268H2207V492H2236V268Z" />
        <path id="wallride" className={pathClass} tabIndex={0} onMouseEnter={handleEnter("wallride")} onMouseLeave={handleLeave} onFocus={handleEnter("wallride")} onBlur={handleLeave} d="M1960.5 748V713.5H2200L2264 763V776H2011.5L1960.5 748Z" />
      </svg>
    </div>
  );
}

// import { useRef, useState, useEffect } from "react";
// import gsap from "gsap";
// import "./Skatepark.css";
// import ParkMap from "./park.svg?react";

// // Базовое фото парка (общий план, без подсветки)
// const BASE_IMAGE =
//   "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257521/voltparkvisual2_k4c3fr.jpg";

// // Каждая фигура: id должен ТОЧНО совпадать с id path в park.svg,
// // image — картинка именно этой фигуры, note — короткая "журнальная" подпись сбоку.
// const figures = [
//   { id: "ramp", title: "Рампа", note: "Класична рампа для набору швидкості й повітряних трюків.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual12_unvhp8.jpg" },
//   { id: "quater3", title: "Квотер 3", note: "Один із трьох квотерів парку, свій розмір і свій характер.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual11_cewrz7.jpg" },
//   { id: "roll-in", title: "Ролл-ін", note: "Заїзд, з якого стартують у секцію з фігурами.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257520/volt_park_visual10_2_oo1az0.jpg" },
//   { id: "bank", title: "Бенк", note: "Похила поверхня для зв'язок і плавних переходів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual9_2_jrzknr.jpg" },
//   { id: "box", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual13_z6hp1g.jpg" },
//   { id: "jumpbox", title: "Джампбокс", note: "Фігура для стрибків і відпрацювання ейр-трюків.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/voltparkvisual4_rrbeeo.jpg" },
//   { id: "flybox", title: "Флайбокс", note: "Одна з фірмових фігур парку з ухилом в ейр.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/voltparkvisual3_kpnpkk.jpg" },
//   { id: "volcano", title: "Волкано", note: "Фігура для складніших заходів і виходів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual5_2_w899yo.jpg" },
//   { id: "quater2", title: "Квотер 2", note: "Другий квотер — частина великої ейр-зони.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual6_2_gl0q0k.jpg" },
//   { id: "vertwall", title: "Vert wall", note: "Вертикальна стіна для найвищого рівня катання.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual8_2_zwmivn.jpg" },
//   { id: "quater", title: "Квотер", note: "Базовий квотер парку, з нього зручно починати.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual7_2_rrpf7v.jpg" },
//   { id: "box2", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual14_dnjash.jpg" },
//   { id: "wallride", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual15_ktwiqp.jpg" },

// ];

// const figureById = Object.fromEntries(figures.map((f) => [f.id, f]));

// export default function Skatepark() {
//   const svgWrapRef = useRef(null);
//   const layers = useRef({});
//   const [active, setActive] = useState(null);
//   const [notePos, setNotePos] = useState({ side: "right" });

//   const isTouch =
//     typeof window !== "undefined" &&
//     window.matchMedia("(pointer: coarse)").matches;

//   const showLayer = (id, clientX) => {
//     setActive(id);
//     // если фигура в правой половине экрана — карточка выезжает слева, и наоборот
//     if (typeof window !== "undefined" && typeof clientX === "number") {
//       setNotePos({ side: clientX > window.innerWidth / 2 ? "left" : "right" });
//     }
//     Object.entries(layers.current).forEach(([key, el]) => {
//       if (!el) return;
//       gsap.to(el, {
//         opacity: key === id ? 1 : 0,
//         duration: 0.35,
//         ease: "power2.out",
//         overwrite: true,
//       });
//     });
//   };

//   const hideAllLayers = () => {
//     setActive(null);
//     Object.values(layers.current).forEach((el) => {
//       if (!el) return;
//       gsap.to(el, { opacity: 0, duration: 0.35, ease: "power2.out", overwrite: true });
//     });
//   };

//   useEffect(() => {
//     const root = svgWrapRef.current;
//     if (!root) return;

//     const paths = root.querySelectorAll("path[id]");
//     const cleanupFns = [];

//     paths.forEach((path) => {
//       const figure = figureById[path.id];
//       if (!figure) return;

//       path.style.cursor = "pointer";
//       path.style.pointerEvents = "auto";
//       path.setAttribute("tabindex", "0");
//       path.setAttribute("role", "button");
//       path.setAttribute("aria-label", figure.title);

//       if (isTouch) {
//         const onTap = (e) => {
//           e.stopPropagation();
//           setActive((prev) => {
//             const next = prev === figure.id ? null : figure.id;
//             if (next) showLayer(next, e.clientX);
//             else hideAllLayers();
//             return next;
//           });
//         };
//         path.addEventListener("click", onTap);
//         cleanupFns.push(() => path.removeEventListener("click", onTap));
//       } else {
//         const onEnter = (e) => showLayer(figure.id, e.clientX);
//         const onMove = (e) => {
//           if (typeof window !== "undefined") {
//             setNotePos({ side: e.clientX > window.innerWidth / 2 ? "left" : "right" });
//           }
//         };
//         const onLeave = () => hideAllLayers();
//         const onFocus = (e) => showLayer(figure.id, e.target.getBoundingClientRect().x);
//         const onBlur = () => hideAllLayers();

//         path.addEventListener("mouseenter", onEnter);
//         path.addEventListener("mousemove", onMove);
//         path.addEventListener("mouseleave", onLeave);
//         path.addEventListener("focus", onFocus);
//         path.addEventListener("blur", onBlur);

//         cleanupFns.push(() => {
//           path.removeEventListener("mouseenter", onEnter);
//           path.removeEventListener("mousemove", onMove);
//           path.removeEventListener("mouseleave", onLeave);
//           path.removeEventListener("focus", onFocus);
//           path.removeEventListener("blur", onBlur);
//         });
//       }
//     });

//     let outsideTapHandler;
//     if (isTouch) {
//       outsideTapHandler = (e) => {
//         if (!root.contains(e.target)) hideAllLayers();
//       };
//       document.addEventListener("click", outsideTapHandler);
//     }

//     return () => {
//       cleanupFns.forEach((fn) => fn());
//       if (outsideTapHandler) document.removeEventListener("click", outsideTapHandler);
//     };
//   }, [isTouch]);

//   const activeFigure = active ? figureById[active] : null;

//   return (
//     // data-cursor-trail="off" выключает CursorImageTrail именно в этой зоне
//     <div className="skatepark" data-cursor-trail="off">
//       {/* Базовое фото — видно всегда */}
//       <img className="park-image" src={BASE_IMAGE} alt="Скейтпарк, загальний вигляд" />

//       {/* Слой картинки для каждой фигуры — проявляется поверх базового при наведении */}
//       {figures.map((item) => (
//         <img
//           key={item.id}
//           ref={(el) => (layers.current[item.id] = el)}
//           className="park-layer"
//           src={item.image}
//           alt={item.title}
//         />
//       ))}

//       {/* SVG поверх всего — прозрачные path работают как hit-зоны для наведения */}
//       <div ref={svgWrapRef} className="park-svg-wrap">
//         <ParkMap className="park-svg" preserveAspectRatio="xMidYMid slice" />
//       </div>

//       {/* Журнальная заметка сбоку от активной фигуры */}
//       <div
//         className={`skate-note skate-note--${notePos.side} ${
//           activeFigure ? "skate-note--visible" : ""
//         }`}
//       >
//         {activeFigure && (
//           <>
//             <span className="skate-note__tag">Зона парку</span>
//             <h4 className="skate-note__title">{activeFigure.title}</h4>
//             <p className="skate-note__text">{activeFigure.note}</p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
// import { useRef, useState, useEffect } from "react";
// import gsap from "gsap";
// import "../Skatepark/Skatepark.css";
// import { ReactComponent as ParkMap } from "../Skatepark/park.svg";

// const figures = [

//   {
//     id:"quater",
//     title:"quarter",

//     image:"https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual7_2_rrpf7v.jpg",


//   },


//   {
//     id:"quater2",
//     title:"Quarter Pipe",

//     image:"https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual6_2_gl0q0k.jpg",


//   },


//   {
//     id:"vertwall",
//     title:"Vertical Wall",

//     image:"https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual8_2_zwmivn.jpg",


//   },
// //     {
// //     id:"vertwall1",
// //     title:"Vertical Wall",

// //     image:"https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual8_2_zwmivn.jpg",

// //     area:{
// //       left:"4%",
// //       top:"38.50%",
// //       width:"13.50%",
// //       height:"28%"
// //     }
// //   },


//   // добавляешь остальные фигуры сюда

// ];



// export default function Skatepark(){

//     const [coords,setCoords] = useState({
//   x:0,
//   y:0
// }); 


// const layers = useRef({});
// const tooltip = useRef(null);

// const [active,setActive]=useState(null);





// const showFigure=(id,title)=>{


// setActive(title);


// Object.keys(layers.current).forEach(key=>{

// gsap.to(
// layers.current[key],
// {
// opacity:key===id?1:0,
// duration:.4,
// ease:"power3.out"
// }
// )

// });


// gsap.fromTo(
// tooltip.current,

// {
// opacity:0,
// scale:.8,
// y:10
// },

// {
// opacity:1,
// scale:1,
// y:0,
// duration:.3
// }

// );


// }





// const hideFigure=()=>{


// setActive(null);


// Object.values(layers.current).forEach(layer=>{

// gsap.to(
// layer,
// {
// opacity:0,
// duration:.4
// }
// )

// });


// gsap.to(
// tooltip.current,
// {
// opacity:0,
// y:10,
// duration:.2
// }
// )


// }




// // const moveTooltip=(e)=>{


// // if(!tooltip.current)return;


// // gsap.to(
// // tooltip.current,
// // {
// // x:e.clientX+15,
// // y:e.clientY+15,
// // duration:.1
// // }
// // )


// // }
// useEffect(() => {
//   figures.forEach((figure) => {
//     const el = document.getElementById(figure.id);

//     if (!el) return;

//     el.style.cursor = "pointer";

//     el.addEventListener("mouseenter", () =>
//       showFigure(figure.id, figure.title)
//     );

//     el.addEventListener("mouseleave", hideFigure);
//   });
// }, []); 
// const showCoords = (e)=>{

// const rect = e.currentTarget.getBoundingClientRect();


// const x = ((e.clientX - rect.left) / rect.width) * 100;

// const y = ((e.clientY - rect.top) / rect.height) * 100;


// setCoords({
//  x:x.toFixed(2),
//  y:y.toFixed(2)
// });


// // moveTooltip(e);

// };



// return (

// <div
// className="skatepark"
// //onMouseMove={moveTooltip}
// onMouseMove={showCoords}

// >


// {/* базовая карта */}

// <img

// className="park-image"

// src="https://res.cloudinary.com/dbx6muxub/image/upload/v1785257521/voltparkvisual2_k4c3fr.jpg"

// alt="skatepark"

// />



// {/* слои подсветки */}

// {/* {

// figures.map(item=>(

// <img

// key={item.id}

// ref={el=>layers.current[item.id]=el}

// className="park-layer"

// src={item.image}

// alt=""

// />

// ))

// } */}

// {figures.map(item => (
//   <img
//     key={item.id}
//     ref={el => (layers.current[item.id] = el)}
//     className="park-layer"
//     src={item.image}
//     alt=""
//   />
// ))}

// <ParkMap className="park-svg" /> 


// {/* интерактивные зоны */}

// {

// figures.map(item=>(

// <div

// key={item.id}

// className="park-svg"

// style={item.area}

// onMouseEnter={()=>showFigure(item.id,item.title)}

// onMouseLeave={hideFigure}

// />

// ))

// }




// {/* <div

// ref={tooltip}

// className="skate-tooltip"

// >

// {active}

// </div> */}


// <div className="coordinates z-1111111111111">

// left: {coords.x}% <br/>
// top: {coords.y}%

// </div>



// </div>

// )


// }