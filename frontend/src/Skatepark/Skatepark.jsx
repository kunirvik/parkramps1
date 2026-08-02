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
// import { useRef, useState, useEffect } from "react";
// import gsap from "gsap";
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

//     // Все path'ы SVG — невидимые hit-зоны (fill/stroke transparent),
//     // раньше это задавалось через .park-svg path в CSS.
//     const allPaths = root.querySelectorAll("path");
//     allPaths.forEach((path) => {
//       path.style.fill = "transparent";
//       path.style.stroke = "transparent";
//       path.style.pointerEvents = "auto";
//       path.style.cursor = "pointer";
//       path.style.outline = "none";
//     });

//     const paths = root.querySelectorAll("path[id]");
//     const cleanupFns = [];

//     paths.forEach((path) => {
//       const figure = figureById[path.id];
//       if (!figure) return;

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

//   const noteSideClasses =
//     notePos.side === "left"
//       ? "left-6 rotate-2"
//       : "right-6 -rotate-2";

//   return (
//     // data-cursor-trail="off" выключает CursorImageTrail именно в этой зоне
//     <div
//       data-cursor-trail="off"
//       className="relative w-full h-auto  overflow-hidden select-none bg-[#0a0a0a]"
//     >
//       {/* Базовое фото — видно всегда */}
//       <img
//         className="absolute inset-0 z-[1] w-full h-full object-cover object-top opacity-100 pointer-events-none"
//         src={BASE_IMAGE}
//         alt="Скейтпарк, загальний вигляд"
//       />

//       {/* Слой картинки для каждой фигуры — проявляется поверх базового при наведении */}
//       {figures.map((item) => (
//         <img
//           key={item.id}
//           ref={(el) => (layers.current[item.id] = el)}
//           className="absolute inset-0 z-[2] w-full h-full object-cover object-top opacity-0 pointer-events-none will-change-[opacity]"
//           src={item.image}
//           alt={item.title}
//         />
//       ))}

//       {/* SVG поверх всего — прозрачные path работают как hit-зоны для наведения */}
//       <div
//         ref={svgWrapRef}
//         className="absolute inset-0 z-10 pointer-events-none"
//       >
//         <ParkMap
//           className="w-full h-full block"
//           preserveAspectRatio="xMidYMid slice"
//         />
//       </div>

//       {/* Журнальная заметка сбоку от активной фигуры */}
//       <div
//         className={`
//           absolute top-1/2 z-20 -translate-y-1/2 scale-[0.96]
//           w-[min(240px,42%)] max-[720px]:w-[min(200px,60%)]
//           p-[14px_16px_16px] max-[720px]:p-[10px_12px_12px]
//           bg-[#f2f0e6] text-[#111]
//           shadow-[0_10px_24px_rgba(0,0,0,0.35)]
//           opacity-0 pointer-events-none
//           transition-[opacity,transform] duration-250 ease-out
//           [clip-path:polygon(0%_2%,3%_0%,97%_1%,100%_3%,99%_97%,96%_100%,2%_99%,0%_96%)]
//           ${noteSideClasses}
//           ${activeFigure ? "opacity-100 scale-100" : ""}
//         `}
//       >
//         {activeFigure && (
//           <>
//             <span className="inline-block font-['Space_Mono',monospace] text-[10px] tracking-[0.12em] uppercase bg-[#111] text-[#d4ff3f] px-1.5 py-0.5 mb-2">
//               Зона парку
//             </span>
//             <h4 className="m-0 mb-1.5 font-['Anton','Arial_Narrow',sans-serif] text-[22px] max-[720px]:text-[18px] leading-none uppercase">
//               {activeFigure.title}
//             </h4>
//             <p className="m-0 text-[13px] max-[720px]:text-[12px] leading-[1.4]">
//               {activeFigure.note}
//             </p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
// import { useRef, useState, useEffect } from "react";
// import gsap from "gsap";
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

//     // Прозрачность/курсор/pointer-events у path теперь задаются CSS-классами
//     // на обёртке (см. className ниже) — они применяются сразу при первом рендере,
//     // ДО этого эффекта, поэтому больше нет вспышки цветных path при загрузке.
//     // Здесь остаётся только a11y-разметка и обработчики событий.

//     const paths = root.querySelectorAll("path[id]");
//     const cleanupFns = [];

//     paths.forEach((path) => {
//       const figure = figureById[path.id];
//       if (!figure) return;

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

//   const noteSideClasses =
//     notePos.side === "left"
//       ? "left-6 rotate-2"
//       : "right-6 -rotate-2";

//   return (
//     // data-cursor-trail="off" выключает CursorImageTrail именно в этой зоне
//     //
//     // Важно: высоту секции теперь задаёт САМО базовое фото (оно в потоке,
//     // position: static, w-full h-auto) — а не aspect-ratio-класс.
//     // Раз высота берётся из реального фото, SVG (viewBox 2477x1274) и все
//     // остальные слои с absolute inset-0 растягиваются на 100%/100% этого же
//     // блока и совпадают с фото автоматически, какие бы пропорции у фото ни были.
//     // Если захотите вернуть фиксированную рамку — добавьте сюда
//     // aspect-[2477/1274] (по пропорциям viewBox) и уберите object-cover ниже,
//     // либо оставьте как есть, если исходники уже кадрированы под нужный кадр.
//     <div
//       data-cursor-trail="off"
//       className="relative w-full overflow-hidden select-none bg-[#0a0a0a]"
//     >
//       {/* Базовое фото — в потоке документа, задаёт высоту всей секции */}
//       <img
//         className="relative z-[1] block w-full h-auto object-cover object-top pointer-events-none"
//         src={BASE_IMAGE}
//         alt="Скейтпарк, загальний вигляд"
//       />

//       {/* Слой картинки для каждой фигуры — проявляется поверх базового при наведении */}
//       {figures.map((item) => (
//         <img
//           key={item.id}
//           ref={(el) => (layers.current[item.id] = el)}
//           className="absolute inset-0 z-[2] w-full h-full object-cover object-top opacity-0 pointer-events-none will-change-[opacity]"
//           src={item.image}
//           alt={item.title}
//         />
//       ))}

//       {/* SVG поверх всего — прозрачные path работают как hit-зоны для наведения.
//           fill-transparent/stroke-transparent/pointer-events-auto/cursor-pointer
//           заданы CSS-классами (а не inline-стилями в JS), поэтому они применяются
//           мгновенно при первом рендере — никакой вспышки цветных path при загрузке. */}
//       <div
//         ref={svgWrapRef}
//         className="absolute inset-0 z-10 pointer-events-none [&_path]:fill-transparent [&_path]:stroke-transparent [&_path]:pointer-events-auto [&_path]:cursor-pointer [&_path]:outline-none"
//       >
//         <ParkMap
//           className="w-full h-full block"
//           preserveAspectRatio="xMidYMid slice"
//         />
//       </div>

//       {/* Журнальная заметка сбоку от активной фигуры */}
//       <div
//         className={`
//           absolute top-1/2 z-20 -translate-y-1/2 scale-[0.96]
//           w-[min(240px,42%)] max-[720px]:w-[min(200px,60%)]
//           p-[14px_16px_16px] max-[720px]:p-[10px_12px_12px]
//           bg-[#f2f0e6] text-[#111]
//           shadow-[0_10px_24px_rgba(0,0,0,0.35)]
//           opacity-0 pointer-events-none
//           transition-[opacity,transform] duration-250 ease-out
//           [clip-path:polygon(0%_2%,3%_0%,97%_1%,100%_3%,99%_97%,96%_100%,2%_99%,0%_96%)]
//           ${noteSideClasses}
//           ${activeFigure ? "opacity-100 scale-100" : ""}
//         `}
//       >
//         {activeFigure && (
//           <>
//             <span className="inline-block font-['Space_Mono',monospace] text-[10px] tracking-[0.12em] uppercase bg-[#111] text-[#d4ff3f] px-1.5 py-0.5 mb-2">
//               Зона парку
//             </span>
//             <h4 className="m-0 mb-1.5 font-['Anton','Arial_Narrow',sans-serif] text-[22px] max-[720px]:text-[18px] leading-none uppercase">
//               {activeFigure.title}
//             </h4>
//             <p className="m-0 text-[13px] max-[720px]:text-[12px] leading-[1.4]">
//               {activeFigure.note}
//             </p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
// import { useRef, useState, useEffect } from "react";
// import gsap from "gsap";
// import ParkMapDesktop from "./park.svg?react";
// import ParkMapMobile from "./park-mobile.svg?react"; // отдельный SVG с той же структурой id, но под вертикальный кадр

// // Базовое фото парка (общий план, без подсветки)
// const BASE_IMAGE_DESKTOP =
//   "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257521/voltparkvisual2_k4c3fr.jpg";
// const BASE_IMAGE_MOBILE =
//   "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/voltparkvisual2_h7bxoy.jpg"; // ваше вертикальное фото

// // Каждая фигура: id должен ТОЧНО совпадать с id path в park.svg,
// // image — картинка именно этой фигуры, note — короткая "журнальная" подпись сбоку.
// // image — фото для десктопного (горизонтального) SVG
// // mobileImage — то же фото, но скадрированное/подготовленное под вертикальний park-mobile.svg
// // (если mobileImage не указан — на мобилке используется тот же image, что и на десктопе)
// const figures = [
//   { id: "ramp", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual12_kuncse.jpg", title: "Рампа", note: "Класична рампа для набору швидкості й повітряних трюків.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual12_unvhp8.jpg" },
//   { id: "quater3", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual11_vjekyg.jpg", title: "Квотер 3", note: "Один із трьох квотерів парку, свій розмір і свій характер.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual11_cewrz7.jpg" },
//   { id: "roll-in", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual10_2_accbsl.jpg", title: "Ролл-ін", note: "Заїзд, з якого стартують у секцію з фігурами.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257520/volt_park_visual10_2_oo1az0.jpg" },
//   { id: "bank", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual9_2_nnmnay.jpg", title: "Бенк", note: "Похила поверхня для зв'язок і плавних переходів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual9_2_jrzknr.jpg" },
//   { id: "box", mobileImage:  "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual13_l168i9.jpg", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual13_z6hp1g.jpg" },
//   { id: "jumpbox", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/voltparkvisual3_x9m10k.jpg", title: "Джампбокс", note: "Фігура для стрибків і відпрацювання ейр-трюків.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/voltparkvisual4_rrbeeo.jpg" },
//   { id: "flybox", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/voltparkvisual4_f9b6hb.jpg", title: "Флайбокс", note: "Одна з фірмових фігур парку з ухилом в ейр.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/voltparkvisual3_kpnpkk.jpg" },
//   { id: "volcano", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual5_2_qdoyk5.jpg", title: "Волкано", note: "Фігура для складніших заходів і виходів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual5_2_w899yo.jpg" },
//   { id: "quater2", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual6_2_jxskkx.jpg", title: "Квотер 2", note: "Другий квотер — частина великої ейр-зони.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual6_2_gl0q0k.jpg" },
//   { id: "vertwall", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual8_2_zk97cn.jpg", title: "Vert wall", note: "Вертикальна стіна для найвищого рівня катання.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual8_2_zwmivn.jpg" },
//   { id: "quater", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual7_2_qm6fku.jpg", title: "Квотер", note: "Базовий квотер парку, з нього зручно починати.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual7_2_rrpf7v.jpg" },
//   { id: "box2", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual14_rwvnmc.jpg", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual14_dnjash.jpg" },
//   { id: "wallride", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual15_xgkol6.jpg", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual15_ktwiqp.jpg" },
// ];



 
// const figureById = Object.fromEntries(figures.map((f) => [f.id, f]));
 
// // id фигуры, на которой на мобилке показываем пульсирующую точку-подсказку "тисни сюди"
// // (выберите любую заметную/крупную фигуру из списка выше)
// const HINT_FIGURE_ID = "box";
 
// export default function Skatepark() {
//   const svgWrapRef = useRef(null);
//   const layers = useRef({});
//   const [active, setActive] = useState(null);
//   // const [notePos, setNotePos] = useState({ side: "right" });
// //  const [notePos, setNotePos] = useState({
// //   left: 0,
// //   top: 0,
// //   side: "right",
// // });

// const [notePos, setNotePos] = useState({
//   left: 0,
//   top: 0,
//   side: "right",
//   vertical: "bottom",
// });

 
//   const isTouch =
//     typeof window !== "undefined" &&
//     window.matchMedia("(pointer: coarse)").matches;
 
//   // Отдельный брейкпоинт под "мобильную" версию SVG/фото (совпадает с max-[720px] в остальной верстке).
//   // Слушаем через matchMedia + resize, чтобы переключение SVG/фото происходило и при повороте
//   // экрана / ресайзе окна, а не только при первом рендере.
//   const [isMobile, setIsMobile] = useState(
//     () => typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches
//   );
 
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const mq = window.matchMedia("(max-width: 720px)");
//     const onChange = (e) => setIsMobile(e.matches);
//     mq.addEventListener("change", onChange);
//     return () => mq.removeEventListener("change", onChange);
//   }, []);
 
//   const ParkMap = isMobile ? ParkMapMobile : ParkMapDesktop;
//   const baseImage = isMobile ? BASE_IMAGE_MOBILE : BASE_IMAGE_DESKTOP;
 
//   // Подсказка "тут всё кликабельно" — шиммер по всей карте + пульсирующая точка на одной фигуре.
//   // Показывается только на мобилке и только пока пользователь ни разу не тапнул ни по одной фигуре.
//   const [hasInteracted, setHasInteracted] = useState(false);
//   const [hintDotPos, setHintDotPos] = useState(null); // { xPercent, yPercent } в координатах viewBox
//   const shimmerRef = useRef(null);
 
 

// const showLayer = (id, clientX) => {
//   setActive(id);
//   setHasInteracted(true);

//   const root = svgWrapRef.current;
//   const path = root?.querySelector(`path#${CSS.escape(id)}`);

//   if (!root || !path) return;

//   const rootBox = root.getBoundingClientRect();
//   const pathBox = path.getBoundingClientRect();

//   const figureX =
//     pathBox.left + pathBox.width / 2 - rootBox.left;

//   const figureY =
//     pathBox.top + pathBox.height / 2 - rootBox.top;

//   const gap = 14;

//   // ==========================================
//   // МОБИЛЬНЫЙ — карточка сверху или снизу
//   // ==========================================

//   if (isMobile) {
//     const cardWidth = Math.min(rootBox.width - 24, 300);
//     const cardHeight = 145;

//     // Центрируем карточку относительно фигуры
//     let left = figureX - cardWidth / 2;

//     // Не даём карточке выйти за края
//     left = Math.max(
//       12,
//       Math.min(left, rootBox.width - cardWidth - 12)
//     );

//     // Сколько места сверху и снизу от фигуры
//     const spaceTop = pathBox.top - rootBox.top;
//     const spaceBottom =
//       rootBox.height -
//       (pathBox.bottom - rootBox.top);

//     let top;
//     let vertical;

//     // Если сверху достаточно места — показываем сверху
//     if (spaceTop >= cardHeight + gap) {
//       top =
//         figureY -
//         pathBox.height / 2 -
//         cardHeight -
//         gap;

//       vertical = "top";
//     } else {
//       // Иначе показываем снизу
//       top =
//         figureY +
//         pathBox.height / 2 +
//         gap;

//       vertical = "bottom";
//     }

//     // Дополнительная защита от выхода за границы
//     top = Math.max(
//       12,
//       Math.min(top, rootBox.height - cardHeight - 12)
//     );

//     setNotePos({
//       left,
//       top,
//       side: "center",
//       vertical,
//     });
//   }

//   // ==========================================
//   // ДЕСКТОП — карточка слева или справа
//   // ==========================================

//   else {
//     const cardWidth = Math.min(
//       260,
//       rootBox.width * 0.38
//     );

//     const cardHeight = 150;

//     let side = "right";

//     let left =
//       figureX +
//       pathBox.width / 2 +
//       gap;

//     // Справа нет места → ставим слева
//     if (
//       left + cardWidth >
//       rootBox.width - 12
//     ) {
//       side = "left";

//       left =
//         figureX -
//         pathBox.width / 2 -
//         cardWidth -
//         gap;
//     }

//     left = Math.max(
//       12,
//       Math.min(
//         left,
//         rootBox.width - cardWidth - 12
//       )
//     );

//     let top =
//       figureY -
//       cardHeight / 2;

//     top = Math.max(
//       12,
//       Math.min(
//         top,
//         rootBox.height - cardHeight - 12
//       )
//     );

//     setNotePos({
//       left,
//       top,
//       side,
//       vertical: "center",
//     });
//   }

//   // Плавно показываем активную фотографию
//   Object.entries(layers.current).forEach(
//     ([key, el]) => {
//       if (!el) return;

//       gsap.to(el, {
//         opacity: key === id ? 1 : 0,
//         duration: 0.35,
//         ease: "power2.out",
//         overwrite: true,
//       });
//     }
//   );
// };



 
//   const hideAllLayers = () => {
//     setActive(null);
//     Object.values(layers.current).forEach((el) => {
//       if (!el) return;
//       gsap.to(el, { opacity: 0, duration: 0.35, ease: "power2.out", overwrite: true });
//     });
//   };
 
//   useEffect(() => {
//     if (!isMobile || hasInteracted) return;
//     const timer = setTimeout(() => setHasInteracted(true), 6000); // подсказка гаснет сама через 6с
//     return () => clearTimeout(timer);
//   }, [isMobile, hasInteracted]);
 
//   // Шиммер-эффект "тут всё кликабельно": светлая диагональная полоса дважды
//   // проходит по всей карте при заходе на мобилку, затем сама останавливается.
//   // Если пользователь тапнул раньше — showLayer уже поставил hasInteracted=true,
//   // и таймлайн ниже прерывается досрочно.
//   useEffect(() => {
//     if (!isMobile || hasInteracted) return;
//     const el = shimmerRef.current;
//     if (!el) return;
 
//     const tl = gsap.timeline({ repeat: 1, repeatDelay: 0.6, delay: 0.5 });
//     tl.fromTo(
//       el,
//       { xPercent: -130, opacity: 0.9 },
//       { xPercent: 130, opacity: 0.9, duration: 1.1, ease: "power1.inOut" }
//     );
 
//     return () => tl.kill();
//   }, [isMobile, hasInteracted]);
 
//   useEffect(() => {
//     const root = svgWrapRef.current;
//     if (!root) return;
 
//     // Прозрачность/курсор/pointer-events у path теперь задаются CSS-классами
//     // на обёртке (см. className ниже) — они применяются сразу при первом рендере,
//     // ДО этого эффекта, поэтому больше нет вспышки цветных path при загрузке.
//     // Здесь остаётся только a11y-разметка и обработчики событий.
 
//     const paths = root.querySelectorAll("path[id]");
//     const cleanupFns = [];
 
//     // Позиция точки-подсказки: берём реальный bbox path'а HINT_FIGURE_ID
//     // и переводим его в проценты относительно viewBox, чтобы точка легла
//     // ровно на фигуру при любом размере блока.
//     if (isMobile) {
//       const svgEl = root.querySelector("svg");
//       const hintPath = root.querySelector(`path#${CSS.escape(HINT_FIGURE_ID)}`);
//       if (svgEl && hintPath && svgEl.viewBox?.baseVal) {
//         const { x: vbX, y: vbY, width: vbW, height: vbH } = svgEl.viewBox.baseVal;
//         const bbox = hintPath.getBBox();
//         const cx = bbox.x + bbox.width / 2;
//         const cy = bbox.y + bbox.height / 2;
//         setHintDotPos({
//           xPercent: ((cx - vbX) / vbW) * 100,
//           yPercent: ((cy - vbY) / vbH) * 100,
//         });
//       }
//     }
 
//     paths.forEach((path) => {
//       const figure = figureById[path.id];
//       if (!figure) return;
 
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
//         // const onMove = (e) => {
//         //   if (!isMobile && typeof window !== "undefined") {
//         //     setNotePos({ side: e.clientX > window.innerWidth / 2 ? "left" : "right" });
//         //   }
//         // };
//         const onLeave = () => hideAllLayers();
//         const onFocus = (e) => showLayer(figure.id, e.target.getBoundingClientRect().x);
//         const onBlur = () => hideAllLayers();
 
//         path.addEventListener("mouseenter", onEnter);
//         // path.addEventListener("mousemove", onMove);
//         path.addEventListener("mouseleave", onLeave);
//         path.addEventListener("focus", onFocus);
//         path.addEventListener("blur", onBlur);
 
//         cleanupFns.push(() => {
//           path.removeEventListener("mouseenter", onEnter);
//           // path.removeEventListener("mousemove", onMove);
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
//   }, [isTouch, isMobile]);
 
//   const activeFigure = active ? figureById[active] : null;
 
//   // Десктоп: карточка стоит слева/справа от курсора, по центру высоты блока.
//   // Мобилка: клика без курсора недостаточно для лево/право — карточка вместо этого
//   // прижата к низу блока на всю ширину, как нижний "sheet".
//   const noteClasses = `
//   absolute z-20
//   w-[min(260px,38%)]
//   p-[14px_16px_16px]
//   text-[#111]
//   shadow-[0_12px_40px_rgba(0,0,0,0.25)]
//   backdrop-blur-xl
//   bg-[rgba(242,240,230,0.78)]
//   border border-[rgba(255,255,255,0.45)]
//   opacity-0 pointer-events-none
//   transition-[opacity,transform] duration-250 ease-out
//   [clip-path:polygon(0%_2%,3%_0%,97%_1%,100%_3%,99%_97%,96%_100%,2%_99%,0%_96%)]
//   ${activeFigure ? "opacity-100" : ""}
// `;

//   return (
//     // data-cursor-trail="off" выключает CursorImageTrail именно в этой зоне
//     //
//     // Важно: высоту секции теперь задаёт САМО базовое фото (оно в потоке,
//     // position: static, w-full h-auto) — а не aspect-ratio-класс.
//     // Раз высота берётся из реального фото, SVG (viewBox 2477x1274) и все
//     // остальные слои с absolute inset-0 растягиваются на 100%/100% этого же
//     // блока и совпадают с фото автоматически, какие бы пропорции у фото ни были.
//     // Если захотите вернуть фиксированную рамку — добавьте сюда
//     // aspect-[2477/1274] (по пропорциям viewBox) и уберите object-cover ниже,
//     // либо оставьте как есть, если исходники уже кадрированы под нужный кадр.
//     <div
//       data-cursor-trail="off"
//       className="relative w-full overflow-hidden select-none bg-[#0a0a0a]"
//     >
//       {/* Базовое фото — в потоке документа, задаёт высоту всей секции */}
//       <img
//         className="relative z-[1] block w-full h-auto object-cover object-top pointer-events-none"
//         src={baseImage}
//         alt="Скейтпарк, загальний вигляд"
//       />
 
//       {/* Слой картинки для каждой фигуры — проявляется поверх базового при наведении */}
//       {figures.map((item) => (
//         <img
//           key={item.id}
//           ref={(el) => (layers.current[item.id] = el)}
//           className="absolute inset-0 z-[2] w-full h-full object-cover object-top opacity-0 pointer-events-none will-change-[opacity]"
//           src={isMobile && item.mobileImage ? item.mobileImage : item.image}
//           alt={item.title}
//         />
//       ))}
 
//       {/* SVG поверх всего — прозрачные path работают как hit-зоны для наведения.
//           fill-transparent/stroke-transparent/pointer-events-auto/cursor-pointer
//           заданы CSS-классами (а не inline-стилями в JS), поэтому они применяются
//           мгновенно при первом рендере — никакой вспышки цветных path при загрузке. */}
//       <div
//         ref={svgWrapRef}
//         className="absolute inset-0 z-10 pointer-events-none [&_path]:fill-transparent [&_path]:stroke-transparent [&_path]:pointer-events-auto [&_path]:cursor-pointer [&_path]:outline-none"
//       >
//         <ParkMap
//           className="w-full h-full block"
//           preserveAspectRatio="xMidYMid slice"
//         />
//       </div>
 
//       {/* Подсказка "тут всё кликабельно" — только на мобилке, до первого тапа пользователя */}
//       {isMobile && !hasInteracted && (
//         <>
//           {/* Диагональная светлая полоса, дважды пробегает по карте (см. useEffect выше) */}
//           <div
//             ref={shimmerRef}
//             className="absolute inset-0 z-[15] pointer-events-none opacity-0"
//             style={{
//               background:
//                 "linear-gradient(75deg, transparent 42%, rgba(242,240,230,0.55) 50%, transparent 58%)",
//             }}
//           />
 
//           {/* Пульсирующая точка-подсказка на выбранной фигуре (HINT_FIGURE_ID) */}
//           {hintDotPos && (
//             <div
//               className="absolute z-[16] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
//               style={{ left: `${hintDotPos.xPercent}%`, top: `${hintDotPos.yPercent}%` }}
//             >
//               <span className="absolute inset-0 rounded-full bg-[#d4ff3f]/70 animate-ping" />
//               <span className="relative block w-3.5 h-3.5 rounded-full bg-[#d4ff3f] shadow-[0_0_10px_rgba(212,255,63,0.8)]" />
//             </div>
//           )}
//         </>
//       )}
 
//       {/* Журнальная заметка — на десктопе сбоку от 
//       активной фигуры, на мобилке снизу на всю ширину */}
//       {/* <div className={noteClasses}> */}
      
// <div
//   className={`
//     absolute z-20
//     w-[min(260px,calc(100%-24px))]
//     p-[14px_16px_16px]
//     bg-[rgba(242,240,230,0.78)]
//     backdrop-blur-xl
//     border border-white/40
//     text-[#111]
//     shadow-[0_10px_30px_rgba(0,0,0,0.3)]
//     pointer-events-none
//     opacity-0
//     transition-[opacity,transform] duration-250 ease-out
//     ${
//       activeFigure
//         ? "opacity-100"
//         : ""
//     }
//   `}
//   style={
//     activeFigure
//       ? {
//           left: `${notePos.left}px`,
//           top: `${notePos.top}px`,
//           transform:
//             isMobile
//               ? "rotate(-1deg)"
//               : notePos.side === "left"
//               ? "rotate(2deg)"
//               : "rotate(-2deg)",
//         }
//       : undefined
//   }
// >
//   {activeFigure && (
//     <>
//       <span className="inline-block font-['Space_Mono',monospace] text-[10px] tracking-[0.12em] uppercase bg-[#111] text-[#d4ff3f] px-1.5 py-0.5 mb-2">
//         Зона парку
//       </span>

//       <h4 className="m-0 mb-1.5 font-['Anton','Arial_Narrow',sans-serif] text-[22px] max-[720px]:text-[18px] leading-none uppercase">
//         {activeFigure.title}
//       </h4>

//       <p className="m-0 text-[13px] max-[720px]:text-[12px] leading-[1.4]">
//         {activeFigure.note}
//       </p>
//     </>
//   )}
// </div>


//     </div>
//   );
// }
// import { useRef, useState, useEffect } from "react";
// import gsap from "gsap";
// import ParkMapDesktop from "./park.svg?react";
// import ParkMapMobile from "./park-mobile.svg?react"; // отдельный SVG с той же структурой id, но под вертикальный кадр

// // Базовое фото парка (общий план, без подсветки)
// const BASE_IMAGE_DESKTOP =
//   "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257521/voltparkvisual2_k4c3fr.jpg";
// const BASE_IMAGE_MOBILE =
//   "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/voltparkvisual2_h7bxoy.jpg"; // ваше вертикальное фото

// // Каждая фигура: id должен ТОЧНО совпадать с id path в park.svg,
// // image — картинка именно этой фигуры, note — короткая "журнальная" подпись сбоку.
// // image — фото для десктопного (горизонтального) SVG
// // mobileImage — то же фото, но скадрированное/подготовленное под вертикальний park-mobile.svg
// // (если mobileImage не указан — на мобилке используется тот же image, что и на десктопе)
// const figures = [
//   { id: "ramp", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual12_kuncse.jpg", title: "Рампа", note: "Класична рампа для набору швидкості й повітряних трюків.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual12_unvhp8.jpg" },
//   { id: "quater3", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual11_vjekyg.jpg", title: "Квотер 3", note: "Один із трьох квотерів парку, свій розмір і свій характер.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual11_cewrz7.jpg" },
//   { id: "roll-in", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual10_2_accbsl.jpg", title: "Ролл-ін", note: "Заїзд, з якого стартують у секцію з фігурами.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257520/volt_park_visual10_2_oo1az0.jpg" },
//   { id: "bank", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual9_2_nnmnay.jpg", title: "Бенк", note: "Похила поверхня для зв'язок і плавних переходів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual9_2_jrzknr.jpg" },
//   { id: "box", mobileImage:  "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual13_l168i9.jpg", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual13_z6hp1g.jpg" },
//   { id: "jumpbox", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/voltparkvisual3_x9m10k.jpg", title: "Джампбокс", note: "Фігура для стрибків і відпрацювання ейр-трюків.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/voltparkvisual4_rrbeeo.jpg" },
//   { id: "flybox", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/voltparkvisual4_f9b6hb.jpg", title: "Флайбокс", note: "Одна з фірмових фігур парку з ухилом в ейр.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/voltparkvisual3_kpnpkk.jpg" },
//   { id: "volcano", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual5_2_qdoyk5.jpg", title: "Волкано", note: "Фігура для складніших заходів і виходів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual5_2_w899yo.jpg" },
//   { id: "quater2", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual6_2_jxskkx.jpg", title: "Квотер 2", note: "Другий квотер — частина великої ейр-зони.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual6_2_gl0q0k.jpg" },
//   { id: "vertwall", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual8_2_zk97cn.jpg", title: "Vert wall", note: "Вертикальна стіна для найвищого рівня катання.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual8_2_zwmivn.jpg" },
//   { id: "quater", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual7_2_qm6fku.jpg", title: "Квотер", note: "Базовий квотер парку, з нього зручно починати.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual7_2_rrpf7v.jpg" },
//   { id: "box2", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual14_rwvnmc.jpg", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual14_dnjash.jpg" },
//   { id: "wallride", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual15_xgkol6.jpg", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual15_ktwiqp.jpg" },
// ];



 
// const figureById = Object.fromEntries(figures.map((f) => [f.id, f]));
 
// // id фигуры, на которой показываем пульсирующую точку-подсказку "тисни/наведи сюди"
// // (выберите любую заметную/крупную фигуру из списка выше) — работает и на мобилке, и на десктопе
// const HINT_FIGURE_ID = "box";
 
// export default function Skatepark() {
//   const svgWrapRef = useRef(null);
//   const layers = useRef({});
//   const [active, setActive] = useState(null);
//   const [notePos, setNotePos] = useState({
//     left: 0,
//     top: 0,
//     side: "right",
//     vertical: "bottom",
//   });

//   const isTouch =
//     typeof window !== "undefined" &&
//     window.matchMedia("(pointer: coarse)").matches;
 
//   // Отдельный брейкпоинт под "мобильную" версию SVG/фото (совпадает с max-[720px] в остальной верстке).
//   // Слушаем через matchMedia + resize, чтобы переключение SVG/фото происходило и при повороте
//   // экрана / ресайзе окна, а не только при первом рендере.
//   const [isMobile, setIsMobile] = useState(
//     () => typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches
//   );
 
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const mq = window.matchMedia("(max-width: 720px)");
//     const onChange = (e) => setIsMobile(e.matches);
//     mq.addEventListener("change", onChange);
//     return () => mq.removeEventListener("change", onChange);
//   }, []);
 
//   const ParkMap = isMobile ? ParkMapMobile : ParkMapDesktop;
//   const baseImage = isMobile ? BASE_IMAGE_MOBILE : BASE_IMAGE_DESKTOP;
 
//   // Подсказка "тут всё кликабельно": на мобилке — шиммер по всій карті + текстовий
//   // чіп біля пульсуючої точки, на десктопі — текстова підказка над картою + та сама
//   // пульсуюча точка (щоб було зрозуміло, що по фігурах можна наводити курсором).
//   // Ховається одразу, тільки-но користувач вибрав першу фігуру (клік/тап/hover/фокус),
//   // і більше не з'являється — див. showLayer нижче.
//   const [hasInteracted, setHasInteracted] = useState(false);
//   const [hintDotPos, setHintDotPos] = useState(null); // { xPercent, yPercent } в координатах viewBox
//   const shimmerRef = useRef(null);
 
 

// const showLayer = (id, clientX) => {
//   setActive(id);
//   setHasInteracted(true);

//   const root = svgWrapRef.current;
//   const path = root?.querySelector(`path#${CSS.escape(id)}`);

//   if (!root || !path) return;

//   const rootBox = root.getBoundingClientRect();
//   const pathBox = path.getBoundingClientRect();

//   const figureX =
//     pathBox.left + pathBox.width / 2 - rootBox.left;

//   const figureY =
//     pathBox.top + pathBox.height / 2 - rootBox.top;

//   const gap = 14;

//   // ==========================================
//   // МОБИЛЬНЫЙ — карточка сверху или снизу
//   // ==========================================

//   if (isMobile) {
//     const cardWidth = Math.min(rootBox.width - 24, 300);
//     const cardHeight = 145;

//     // Центрируем карточку относительно фигуры
//     let left = figureX - cardWidth / 2;

//     // Не даём карточке выйти за края
//     left = Math.max(
//       12,
//       Math.min(left, rootBox.width - cardWidth - 12)
//     );

//     // Сколько места сверху и снизу от фигуры
//     const spaceTop = pathBox.top - rootBox.top;
//     const spaceBottom =
//       rootBox.height -
//       (pathBox.bottom - rootBox.top);

//     let top;
//     let vertical;

//     // Если сверху достаточно места — показываем сверху
//     if (spaceTop >= cardHeight + gap) {
//       top =
//         figureY -
//         pathBox.height / 2 -
//         cardHeight -
//         gap;

//       vertical = "top";
//     } else {
//       // Иначе показываем снизу
//       top =
//         figureY +
//         pathBox.height / 2 +
//         gap;

//       vertical = "bottom";
//     }

//     // Дополнительная защита от выхода за границы
//     top = Math.max(
//       12,
//       Math.min(top, rootBox.height - cardHeight - 12)
//     );

//     setNotePos({
//       left,
//       top,
//       side: "center",
//       vertical,
//     });
//   }

//   // ==========================================
//   // ДЕСКТОП — карточка слева или справа
//   // ==========================================

//   else {
//     const cardWidth = Math.min(
//       260,
//       rootBox.width * 0.38
//     );

//     const cardHeight = 150;

//     let side = "right";

//     let left =
//       figureX +
//       pathBox.width / 2 +
//       gap;

//     // Справа нет места → ставим слева
//     if (
//       left + cardWidth >
//       rootBox.width - 12
//     ) {
//       side = "left";

//       left =
//         figureX -
//         pathBox.width / 2 -
//         cardWidth -
//         gap;
//     }

//     left = Math.max(
//       12,
//       Math.min(
//         left,
//         rootBox.width - cardWidth - 12
//       )
//     );

//     let top =
//       figureY -
//       cardHeight / 2;

//     top = Math.max(
//       12,
//       Math.min(
//         top,
//         rootBox.height - cardHeight - 12
//       )
//     );

//     setNotePos({
//       left,
//       top,
//       side,
//       vertical: "center",
//     });
//   }

//   // Плавно показываем активную фотографию
//   Object.entries(layers.current).forEach(
//     ([key, el]) => {
//       if (!el) return;

//       gsap.to(el, {
//         opacity: key === id ? 1 : 0,
//         duration: 0.35,
//         ease: "power2.out",
//         overwrite: true,
//       });
//     }
//   );
// };



 
//   const hideAllLayers = () => {
//     setActive(null);
//     Object.values(layers.current).forEach((el) => {
//       if (!el) return;
//       gsap.to(el, { opacity: 0, duration: 0.35, ease: "power2.out", overwrite: true });
//     });
//   };
 
//   useEffect(() => {
//     if (hasInteracted) return;
//     // Подсказка гаснет сама через 6с, даже если ніхто нічого не натиснув —
//     // працює однаково і на мобілці, і на десктопі.
//     const timer = setTimeout(() => setHasInteracted(true), 6000);
//     return () => clearTimeout(timer);
//   }, [hasInteracted]);
 
//   // Шиммер-эффект "тут всё кликабельно": светлая диагональная полоса дважды
//   // проходит по всей карте при заходе на мобилку, затем сама останавливается.
//   // Если пользователь тапнул раньше — showLayer уже поставил hasInteracted=true,
//   // и таймлайн ниже прерывается досрочно.
//   useEffect(() => {
//     if (!isMobile || hasInteracted) return;
//     const el = shimmerRef.current;
//     if (!el) return;
 
//     const tl = gsap.timeline({ repeat: 1, repeatDelay: 0.6, delay: 0.5 });
//     tl.fromTo(
//       el,
//       { xPercent: -130, opacity: 0.9 },
//       { xPercent: 130, opacity: 0.9, duration: 1.1, ease: "power1.inOut" }
//     );
 
//     return () => tl.kill();
//   }, [isMobile, hasInteracted]);
 
//   useEffect(() => {
//     const root = svgWrapRef.current;
//     if (!root) return;
 
//     // Прозрачность/курсор/pointer-events у path теперь задаются CSS-классами
//     // на обёртке (см. className ниже) — они применяются сразу при первом рендере,
//     // ДО этого эффекта, поэтому больше нет вспышки цветных path при загрузке.
//     // Здесь остаётся только a11y-разметка и обработчики событий.
 
//     const paths = root.querySelectorAll("path[id]");
//     const cleanupFns = [];
 
//     // Позиция точки-подсказки: берём реальный bbox path'а HINT_FIGURE_ID
//     // и переводим его в проценты относительно viewBox, чтобы точка легла
//     // ровно на фигуру при любом размере блока. Считаем и на мобилке, и на
//     // десктопе — точка-подсказка теперь показывается в обоих случаях.
//     const svgEl = root.querySelector("svg");
//     const hintPath = root.querySelector(`path#${CSS.escape(HINT_FIGURE_ID)}`);
//     if (svgEl && hintPath && svgEl.viewBox?.baseVal) {
//       const { x: vbX, y: vbY, width: vbW, height: vbH } = svgEl.viewBox.baseVal;
//       const bbox = hintPath.getBBox();
//       const cx = bbox.x + bbox.width / 2;
//       const cy = bbox.y + bbox.height / 2;
//       setHintDotPos({
//         xPercent: ((cx - vbX) / vbW) * 100,
//         yPercent: ((cy - vbY) / vbH) * 100,
//       });
//     }
 
//     paths.forEach((path) => {
//       const figure = figureById[path.id];
//       if (!figure) return;
 
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
//         // const onMove = (e) => {
//         //   if (!isMobile && typeof window !== "undefined") {
//         //     setNotePos({ side: e.clientX > window.innerWidth / 2 ? "left" : "right" });
//         //   }
//         // };
//         const onLeave = () => hideAllLayers();
//         const onFocus = (e) => showLayer(figure.id, e.target.getBoundingClientRect().x);
//         const onBlur = () => hideAllLayers();
 
//         path.addEventListener("mouseenter", onEnter);
//         // path.addEventListener("mousemove", onMove);
//         path.addEventListener("mouseleave", onLeave);
//         path.addEventListener("focus", onFocus);
//         path.addEventListener("blur", onBlur);
 
//         cleanupFns.push(() => {
//           path.removeEventListener("mouseenter", onEnter);
//           // path.removeEventListener("mousemove", onMove);
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
//   }, [isTouch, isMobile]);
 
//   const activeFigure = active ? figureById[active] : null;
 
//   return (
//     <section className="relative bg-[#0a0a0a]">
//       {/* Заголовок-підказка над картою — той самий патерн, що й у Gallery/Categories,
//           щоб зона одразу читалась як окрема інтерактивна секція, а не просто фото. */}
//       <div className="max-w-[640px] mx-auto pt-25 pb-8 max-[720px]:pt-16 max-[720px]:pb-6 px-6 text-center relative z-[2]">
//         <span className="inline-block font-mono text-[11px] tracking-[0.14em] uppercase text-[#d4ff3f] mb-2.5">
//           Карта парку
//         </span>
//         <h2 className="font-['Anton','Arial_Narrow',sans-serif] text-[clamp(28px,5vw,48px)] leading-none m-0 mb-3 text-[#f2f0e6] uppercase">
//           Інтерактивна карта
//         </h2>
//         <p className="text-[15px] leading-[1.5] text-[#8a8a83] m-0">
//           {isTouch
//             ? "Торкнись будь-якої фігури на карті — з'явиться фото і опис саме цього елемента."
//             : "Наведи курсор на будь-яку фігуру на карті — з'явиться фото і опис саме цього елемента."}
//         </p>
//       </div>

//       {/* data-cursor-trail="off" выключает CursorImageTrail именно в этой зоне
//           Важно: высоту секции задаёт САМО базовое фото (оно в потоке,
//           position: static, w-full h-auto) — а не aspect-ratio-класс.
//           Раз высота берётся из реального фото, SVG (viewBox 2477x1274) и все
//           остальные слои с absolute inset-0 растягиваются на 100%/100% этого же
//           блока и совпадают с фото автоматически, какие бы пропорции у фото ни были. */}
//       <div
//         data-cursor-trail="off"
//         className="relative w-full overflow-hidden select-none bg-[#0a0a0a]"
//       >
//         {/* Базовое фото — в потоке документа, задаёт высоту всей секции */}
//         <img
//           className="relative z-[1] block w-full h-auto object-cover object-top pointer-events-none"
//           src={baseImage}
//           alt="Скейтпарк, загальний вигляд"
//         />

//         {/* Слой картинки для каждой фигуры — проявляется поверх базового при наведении */}
//         {figures.map((item) => (
//           <img
//             key={item.id}
//             ref={(el) => (layers.current[item.id] = el)}
//             className="absolute inset-0 z-[2] w-full h-full object-cover object-top opacity-0 pointer-events-none will-change-[opacity]"
//             src={isMobile && item.mobileImage ? item.mobileImage : item.image}
//             alt={item.title}
//           />
//         ))}

//         {/* SVG поверх всего — прозрачные path работают как hit-зоны для наведения.
//             fill-transparent/stroke-transparent/pointer-events-auto/cursor-pointer
//             заданы CSS-классами (а не inline-стилями в JS), поэтому они применяются
//             мгновенно при первом рендере — никакой вспышки цветных path при загрузке. */}
//         <div
//           ref={svgWrapRef}
//           className="absolute inset-0 z-10 pointer-events-none [&_path]:fill-transparent [&_path]:stroke-transparent [&_path]:pointer-events-auto [&_path]:cursor-pointer [&_path]:outline-none"
//         >
//           <ParkMap
//             className="w-full h-full block"
//             preserveAspectRatio="xMidYMid slice"
//           />
//         </div>

//         {/* Подсказка "тут всё кликабельно" — показывается до первого выбора фигуры,
//             на мобилке и на десктопе. Мобилка: шиммер + текстовий чіп біля точки.
//             Десктоп: текстовий чіп біля точки з підказкою навести курсор. */}
//         {!hasInteracted && (
//           <>
//             {/* Диагональная светлая полоса — только на мобилке, дважды пробегает по карте */}
//             {isMobile && (
//               <div
//                 ref={shimmerRef}
//                 className="absolute inset-0 z-[15] pointer-events-none opacity-0"
//                 style={{
//                   background:
//                     "linear-gradient(75deg, transparent 42%, rgba(242,240,230,0.55) 50%, transparent 58%)",
//                 }}
//               />
//             )}

//             {/* Пульсирующая точка-подсказка на выбранной фигуре (HINT_FIGURE_ID) +
//                 текстовый чип рядом с ней, чтобы было однозначно понятно, что делать. */}
//             {hintDotPos && (
//               <div
//                 className="absolute z-[16] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
//                 style={{ left: `${hintDotPos.xPercent}%`, top: `${hintDotPos.yPercent}%` }}
//               >
//                 <span className="absolute inset-0 rounded-full bg-[#d4ff3f]/70 animate-ping" />
//                 <span className="relative block w-3.5 h-3.5 rounded-full bg-[#d4ff3f] shadow-[0_0_10px_rgba(212,255,63,0.8)]" />

//                 <span
//                   className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] tracking-[0.04em] uppercase text-[#0d0d0d] bg-[#d4ff3f] px-2.5 py-1 shadow-[0_6px_16px_rgba(0,0,0,0.4)] ${
//                     isMobile ? "-top-9" : "-top-10"
//                   }`}
//                 >
//                   {isMobile ? "👆 Тисни на фігуру" : "🖱 Наведи курсором"}
//                 </span>
//               </div>
//             )}
//           </>
//         )}

//         {/* Журнальная заметка — на десктопе сбоку от активной фигуры,
//             на мобилке снизу/сверху рядом с ней */}
//         <div
//           className={`
//             absolute z-20
//             w-[min(260px,calc(100%-24px))]
//             p-[14px_16px_16px]
//             bg-[rgba(242,240,230,0.78)]
//             backdrop-blur-xl
//             border border-white/40
//             text-[#111]
//             shadow-[0_10px_30px_rgba(0,0,0,0.3)]
//             pointer-events-none
//             opacity-0
//             transition-[opacity,transform] duration-250 ease-out
//             ${activeFigure ? "opacity-100" : ""}
//           `}
//           style={
//             activeFigure
//               ? {
//                   left: `${notePos.left}px`,
//                   top: `${notePos.top}px`,
//                   transform: isMobile
//                     ? "rotate(-1deg)"
//                     : notePos.side === "left"
//                     ? "rotate(2deg)"
//                     : "rotate(-2deg)",
//                 }
//               : undefined
//           }
//         >
//           {activeFigure && (
//             <>
//               <span className="inline-block font-['Space_Mono',monospace] text-[10px] tracking-[0.12em] uppercase bg-[#111] text-[#d4ff3f] px-1.5 py-0.5 mb-2">
//                 Зона парку
//               </span>

//               <h4 className="m-0 mb-1.5 font-['Anton','Arial_Narrow',sans-serif] text-[22px] max-[720px]:text-[18px] leading-none uppercase">
//                 {activeFigure.title}
//               </h4>

//               <p className="m-0 text-[13px] max-[720px]:text-[12px] leading-[1.4]">
//                 {activeFigure.note}
//               </p>
//             </>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

// import { useRef, useState, useEffect } from "react";
// import gsap from "gsap";
// import ParkMapDesktop from "./park.svg?react";
// import ParkMapMobile from "./park-mobile.svg?react"; // отдельный SVG с той же структурой id, но под вертикальный кадр

// // Базовое фото парка (общий план, без подсветки)
// const BASE_IMAGE_DESKTOP =
//   "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257521/voltparkvisual2_k4c3fr.jpg";
// const BASE_IMAGE_MOBILE =
//   "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/voltparkvisual2_h7bxoy.jpg"; // ваше вертикальное фото

// // Каждая фигура: id должен ТОЧНО совпадать с id path в park.svg,
// // image — картинка именно этой фигуры, note — короткая "журнальная" подпись сбоку.
// // image — фото для десктопного (горизонтального) SVG
// // mobileImage — то же фото, но скадрированное/подготовленное под вертикальний park-mobile.svg
// // (если mobileImage не указан — на мобилке используется тот же image, что и на десктопе)
// const figures = [
//   { id: "ramp", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual12_kuncse.jpg", title: "Рампа", note: "Класична рампа для набору швидкості й повітряних трюків.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual12_unvhp8.jpg" },
//   { id: "quater3", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual11_vjekyg.jpg", title: "Квотер 3", note: "Один із трьох квотерів парку, свій розмір і свій характер.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual11_cewrz7.jpg" },
//   { id: "roll-in", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual10_2_accbsl.jpg", title: "Ролл-ін", note: "Заїзд, з якого стартують у секцію з фігурами.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257520/volt_park_visual10_2_oo1az0.jpg" },
//   { id: "bank", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual9_2_nnmnay.jpg", title: "Бенк", note: "Похила поверхня для зв'язок і плавних переходів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual9_2_jrzknr.jpg" },
//   { id: "box", mobileImage:  "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual13_l168i9.jpg", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual13_z6hp1g.jpg" },
//   { id: "jumpbox", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/voltparkvisual3_x9m10k.jpg", title: "Джампбокс", note: "Фігура для стрибків і відпрацювання ейр-трюків.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/voltparkvisual4_rrbeeo.jpg" },
//   { id: "flybox", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/voltparkvisual4_f9b6hb.jpg", title: "Флайбокс", note: "Одна з фірмових фігур парку з ухилом в ейр.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/voltparkvisual3_kpnpkk.jpg" },
//   { id: "volcano", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual5_2_qdoyk5.jpg", title: "Волкано", note: "Фігура для складніших заходів і виходів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual5_2_w899yo.jpg" },
//   { id: "quater2", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual6_2_jxskkx.jpg", title: "Квотер 2", note: "Другий квотер — частина великої ейр-зони.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual6_2_gl0q0k.jpg" },
//   { id: "vertwall", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual8_2_zk97cn.jpg", title: "Vert wall", note: "Вертикальна стіна для найвищого рівня катання.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual8_2_zwmivn.jpg" },
//   { id: "quater", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual7_2_qm6fku.jpg", title: "Квотер", note: "Базовий квотер парку, з нього зручно починати.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual7_2_rrpf7v.jpg" },
//   { id: "box2", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual14_rwvnmc.jpg", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual14_dnjash.jpg" },
//   { id: "wallride", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual15_xgkol6.jpg", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual15_ktwiqp.jpg" },
// ];



 
// const figureById = Object.fromEntries(figures.map((f) => [f.id, f]));
 
// // id фигуры, на которой показываем пульсирующую точку-подсказку "тисни/наведи сюди"
// // (выберите любую заметную/крупную фигуру из списка выше) — работает и на мобилке, и на десктопе
// const HINT_FIGURE_ID = "box";
 
// export default function Skatepark() {
//   const svgWrapRef = useRef(null);
//   const layers = useRef({});
//   const [active, setActive] = useState(null);
//   const [notePos, setNotePos] = useState({
//     left: 0,
//     top: 0,
//     side: "right",
//     vertical: "bottom",
//   });

//   const isTouch =
//     typeof window !== "undefined" &&
//     window.matchMedia("(pointer: coarse)").matches;
 
//   // Отдельный брейкпоинт под "мобильную" версию SVG/фото (совпадает с max-[720px] в остальной верстке).
//   // Слушаем через matchMedia + resize, чтобы переключение SVG/фото происходило и при повороте
//   // экрана / ресайзе окна, а не только при первом рендере.
//   const [isMobile, setIsMobile] = useState(
//     () => typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches
//   );
 
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const mq = window.matchMedia("(max-width: 720px)");
//     const onChange = (e) => setIsMobile(e.matches);
//     mq.addEventListener("change", onChange);
//     return () => mq.removeEventListener("change", onChange);
//   }, []);
 
//   const ParkMap = isMobile ? ParkMapMobile : ParkMapDesktop;
//   const baseImage = isMobile ? BASE_IMAGE_MOBILE : BASE_IMAGE_DESKTOP;
 
//   // Подсказка "тут всё кликабельно": на мобилке — шиммер по всій карті + текстовий
//   // чіп біля пульсуючої точки, на десктопі — текстова підказка над картою + та сама
//   // пульсуюча точка (щоб було зрозуміло, що по фігурах можна наводити курсором).
//   // Ховається одразу, тільки-но користувач вибрав першу фігуру (клік/тап/hover/фокус),
//   // і більше не з'являється — див. showLayer нижче.
//   const [hasInteracted, setHasInteracted] = useState(false);
//   const [hintDotPos, setHintDotPos] = useState(null); // { xPercent, yPercent } в координатах viewBox
//   const shimmerRef = useRef(null);

//   // Секция может быть далеко от старта страницы — если запускать 6-секундный
//   // таймер подсказки сразу при монтировании, пользователь может дойти до
//   // карты уже после того, как подсказка "сама" погасла. Поэтому таймер и
//   // шиммер стартуют только когда секция реально появилась во вьюпорте.
//   const sectionRef = useRef(null);
//   const [hasEnteredView, setHasEnteredView] = useState(false);

//   useEffect(() => {
//     if (typeof IntersectionObserver === "undefined") {
//       setHasEnteredView(true);
//       return;
//     }
//     const el = sectionRef.current;
//     if (!el) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setHasEnteredView(true);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.25 }
//     );
//     observer.observe(el);
//     return () => observer.disconnect();
//   }, []);
 
 

// const showLayer = (id, clientX) => {
//   setActive(id);
//   setHasInteracted(true);

//   const root = svgWrapRef.current;
//   const path = root?.querySelector(`path#${CSS.escape(id)}`);

//   if (!root || !path) return;

//   const rootBox = root.getBoundingClientRect();
//   const pathBox = path.getBoundingClientRect();

//   const figureX =
//     pathBox.left + pathBox.width / 2 - rootBox.left;

//   const figureY =
//     pathBox.top + pathBox.height / 2 - rootBox.top;

//   const gap = 14;

//   // ==========================================
//   // МОБИЛЬНЫЙ — карточка сверху или снизу
//   // ==========================================

//   if (isMobile) {
//     const cardWidth = Math.min(rootBox.width - 24, 300);
//     const cardHeight = 145;

//     // Центрируем карточку относительно фигуры
//     let left = figureX - cardWidth / 2;

//     // Не даём карточке выйти за края
//     left = Math.max(
//       12,
//       Math.min(left, rootBox.width - cardWidth - 12)
//     );

//     // Сколько места сверху и снизу от фигуры
//     const spaceTop = pathBox.top - rootBox.top;
//     const spaceBottom =
//       rootBox.height -
//       (pathBox.bottom - rootBox.top);

//     let top;
//     let vertical;

//     // Если сверху достаточно места — показываем сверху
//     if (spaceTop >= cardHeight + gap) {
//       top =
//         figureY -
//         pathBox.height / 2 - 
//         cardHeight -
//         gap;

//       vertical = "top";
//     } else {
//       // Иначе показываем снизу
//       top =
//         figureY +
//         pathBox.height / 2 +
//         gap;

//       vertical = "bottom";
//     }

//     // Дополнительная защита от выхода за границы
//     top = Math.max(
//       12,
//       Math.min(top, rootBox.height - cardHeight - 12)
//     );

//     setNotePos({
//       left,
//       top,
//       side: "center",
//       vertical,
//     });
//   }

//   // ==========================================
//   // ДЕСКТОП — карточка слева или справа
//   // ==========================================

//   else {
//     const cardWidth = Math.min(
//       260,
//       rootBox.width * 0.38
//     );

//     const cardHeight = 150;

//     let side = "right";

//     let left =
//       figureX +
//       pathBox.width / 2 +
//       gap;

//     // Справа нет места → ставим слева
//     if (
//       left + cardWidth >
//       rootBox.width - 12
//     ) {
//       side = "left";

//       left =
//         figureX -
//         pathBox.width / 2 -
//         cardWidth -
//         gap;
//     }

//     left = Math.max(
//       12,
//       Math.min(
//         left,
//         rootBox.width - cardWidth - 12
//       )
//     );

//     let top =
//       figureY -
//       cardHeight / 2;

//     top = Math.max(
//       12,
//       Math.min(
//         top,
//         rootBox.height - cardHeight - 12
//       )
//     );

//     setNotePos({
//       left,
//       top,
//       side,
//       vertical: "center",
//     });
//   }

//   // Плавно показываем активную фотографию
//   Object.entries(layers.current).forEach(
//     ([key, el]) => {
//       if (!el) return;

//       gsap.to(el, {
//         opacity: key === id ? 1 : 0,
//         duration: 0.35,
//         ease: "power2.out",
//         overwrite: true,
//       });
//     }
//   );
// };



 
//   const hideAllLayers = () => {
//     setActive(null);
//     Object.values(layers.current).forEach((el) => {
//       if (!el) return;
//       gsap.to(el, { opacity: 0, duration: 0.35, ease: "power2.out", overwrite: true });
//     });
//   };
 
//   useEffect(() => {
//     if (!hasEnteredView || hasInteracted) return;
//     // Подсказка гаснет сама через 6с ПОСЛЕ того, как секция появилась во
//     // вьюпорте — а не через 6с после монтирования страницы. Так подсказка
//     // всегда застаёт пользователя, если он доскроллил до карты позже.
//     const timer = setTimeout(() => setHasInteracted(true), 6000);
//     return () => clearTimeout(timer);
//   }, [hasEnteredView, hasInteracted]);
 
//   // Шиммер-эффект "тут всё кликабельно": светлая диагональная полоса дважды
//   // проходит по всей карте, когда секция появляется во вьюпорте на мобилке,
//   // затем сама останавливается. Если пользователь тапнул раньше — showLayer
//   // уже поставил hasInteracted=true, и таймлайн ниже прерывается досрочно.
//   useEffect(() => {
//     if (!isMobile || !hasEnteredView || hasInteracted) return;
//     const el = shimmerRef.current;
//     if (!el) return;
 
//     const tl = gsap.timeline({ repeat: 1, repeatDelay: 0.6, delay: 0.5 });
//     tl.fromTo(
//       el,
//       { xPercent: -130, opacity: 0.9 },
//       { xPercent: 130, opacity: 0.9, duration: 1.1, ease: "power1.inOut" }
//     );
 
//     return () => tl.kill();
//   }, [isMobile, hasEnteredView, hasInteracted]);
 
//   useEffect(() => {
//     const root = svgWrapRef.current;
//     if (!root) return;
 
//     // Прозрачность/курсор/pointer-events у path теперь задаются CSS-классами
//     // на обёртке (см. className ниже) — они применяются сразу при первом рендере,
//     // ДО этого эффекта, поэтому больше нет вспышки цветных path при загрузке.
//     // Здесь остаётся только a11y-разметка и обработчики событий.
 
//     const paths = root.querySelectorAll("path[id]");
//     const cleanupFns = [];
 
//     // Позиция точки-подсказки: берём реальный bbox path'а HINT_FIGURE_ID
//     // и переводим его в проценты относительно viewBox, чтобы точка легла
//     // ровно на фигуру при любом размере блока. Считаем и на мобилке, и на
//     // десктопе — точка-подсказка теперь показывается в обоих случаях.
//     const svgEl = root.querySelector("svg");
//     const hintPath = root.querySelector(`path#${CSS.escape(HINT_FIGURE_ID)}`);
//     if (svgEl && hintPath && svgEl.viewBox?.baseVal) {
//       const { x: vbX, y: vbY, width: vbW, height: vbH } = svgEl.viewBox.baseVal;
//       const bbox = hintPath.getBBox();
//       const cx = bbox.x + bbox.width / 2;
//       const cy = bbox.y + bbox.height / 2;
//       setHintDotPos({
//         xPercent: ((cx - vbX) / vbW) * 100,
//         yPercent: ((cy - vbY) / vbH) * 100,
//       });
//     }
 
//     paths.forEach((path) => {
//       const figure = figureById[path.id];
//       if (!figure) return;
 
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
//         // const onMove = (e) => {
//         //   if (!isMobile && typeof window !== "undefined") {
//         //     setNotePos({ side: e.clientX > window.innerWidth / 2 ? "left" : "right" });
//         //   }
//         // };
//         const onLeave = () => hideAllLayers();
//         const onFocus = (e) => showLayer(figure.id, e.target.getBoundingClientRect().x);
//         const onBlur = () => hideAllLayers();
 
//         path.addEventListener("mouseenter", onEnter);
//         // path.addEventListener("mousemove", onMove);
//         path.addEventListener("mouseleave", onLeave);
//         path.addEventListener("focus", onFocus);
//         path.addEventListener("blur", onBlur);
 
//         cleanupFns.push(() => {
//           path.removeEventListener("mouseenter", onEnter);
//           // path.removeEventListener("mousemove", onMove);
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
//   }, [isTouch, isMobile]);
 
//   const activeFigure = active ? figureById[active] : null;
 
//   return (
//     <section ref={sectionRef} className="relative bg-[#0a0a0a]">
//       {/* Заголовок-підказка над картою — той самий патерн, що й у Gallery/Categories,
//           щоб зона одразу читалась як окрема інтерактивна секція, а не просто фото. */}
//       <div className="max-w-[640px] mx-auto pt-25 pb-8 max-[720px]:pt-16 max-[720px]:pb-6 px-6 text-center relative z-[2]">
//         <span className="inline-block font-mono text-[11px] tracking-[0.14em] uppercase text-[#d4ff3f] mb-2.5">
//           Карта парку
//         </span>
//         <h2 className="font-['Anton','Arial_Narrow',sans-serif] text-[clamp(28px,5vw,48px)] leading-none m-0 mb-3 text-[#f2f0e6] uppercase">
//           Інтерактивна карта
//         </h2>
//         <p className="text-[15px] leading-[1.5] text-[#8a8a83] m-0">
//           {isTouch
//             ? "Торкнись будь-якої фігури на карті — з'явиться фото і опис саме цього елемента."
//             : "Наведи курсор на будь-яку фігуру на карті — з'явиться фото і опис саме цього елемента."}
//         </p>
//       </div>

//       {/* data-cursor-trail="off" выключает CursorImageTrail именно в этой зоне
//           Важно: высоту секции задаёт САМО базовое фото (оно в потоке,
//           position: static, w-full h-auto) — а не aspect-ratio-класс.
//           Раз высота берётся из реального фото, SVG (viewBox 2477x1274) и все
//           остальные слои с absolute inset-0 растягиваются на 100%/100% этого же
//           блока и совпадают с фото автоматически, какие бы пропорции у фото ни были. */}
//       <div
//         data-cursor-trail="off"
//         className="relative w-full overflow-hidden select-none bg-[#0a0a0a]"
//       >
//         {/* Базовое фото — в потоке документа, задаёт высоту всей секции */}
//         <img
//           className="relative z-[1] block w-full h-auto object-cover object-top pointer-events-none"
//           src={baseImage}
//           alt="Скейтпарк, загальний вигляд"
//         />

//         {/* Слой картинки для каждой фигуры — проявляется поверх базового при наведении */}
//         {figures.map((item) => (
//           <img
//             key={item.id}
//             ref={(el) => (layers.current[item.id] = el)}
//             className="absolute inset-0 z-[2] w-full h-full object-cover object-top opacity-0 pointer-events-none will-change-[opacity]"
//             src={isMobile && item.mobileImage ? item.mobileImage : item.image}
//             alt={item.title}
//           />
//         ))}

//         {/* SVG поверх всего — прозрачные path работают как hit-зоны для наведения.
//             fill-transparent/stroke-transparent/pointer-events-auto/cursor-pointer
//             заданы CSS-классами (а не inline-стилями в JS), поэтому они применяются
//             мгновенно при первом рендере — никакой вспышки цветных path при загрузке. */}
//         <div
//           ref={svgWrapRef}
//           className="absolute inset-0 z-10 pointer-events-none [&_path]:fill-transparent [&_path]:stroke-transparent [&_path]:pointer-events-auto [&_path]:cursor-pointer [&_path]:outline-none"
//         >
//           <ParkMap
//             className="w-full h-full block"
//             preserveAspectRatio="xMidYMid slice"
//           />
//         </div>

//         {/* Подсказка "тут всё кликабельно" — показывается до первого выбора фигуры,
//             на мобилке и на десктопе. Мобилка: шиммер + текстовий чіп біля точки.
//             Десктоп: текстовий чіп біля точки з підказкою навести курсор. */}
//         {hasEnteredView && !hasInteracted && (
//           <>
//             {/* Диагональная светлая полоса — только на мобилке, дважды пробегает по карте */}
//             {isMobile && (
//               <div
//                 ref={shimmerRef}
//                 className="absolute inset-0 z-[15] pointer-events-none opacity-0"
//                 style={{
//                   background:
//                     "linear-gradient(75deg, transparent 42%, rgba(242,240,230,0.55) 50%, transparent 58%)",
//                 }}
//               />
//             )}

//             {/* Пульсирующая точка-подсказка на выбранной фигуре (HINT_FIGURE_ID) +
//                 текстовый чип рядом с ней, чтобы было однозначно понятно, что делать. */}
//             {hintDotPos && (
//               <div
//                 className="absolute z-[16] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
//                 style={{ left: `${hintDotPos.xPercent}%`, top: `${hintDotPos.yPercent}%` }}
//               >
//                 <span className="absolute inset-0 rounded-full bg-[#d4ff3f]/70 animate-ping" />
//                 <span className="relative block w-3.5 h-3.5 rounded-full bg-[#d4ff3f] shadow-[0_0_10px_rgba(212,255,63,0.8)]" />

//                 <span
//                   className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] tracking-[0.04em] uppercase text-[#0d0d0d] bg-[#d4ff3f] px-2.5 py-1 shadow-[0_6px_16px_rgba(0,0,0,0.4)] ${
//                     isMobile ? "-top-9" : "-top-10"
//                   }`}
//                 >
//                   {isMobile ? "👆 Тисни на фігуру" : "🖱 Наведи курсором"}
//                 </span>
//               </div>
//             )}
//           </>
//         )}

//         {/* Журнальная заметка — на десктопе сбоку от активной фигуры,
//             на мобилке снизу/сверху рядом с ней */}
//         <div
//           className={`
//             absolute z-20
//             w-[min(260px,calc(100%-24px))]
//             p-[14px_16px_16px]
//             bg-[rgba(242,240,230,0.78)]
//             backdrop-blur-xl
//             border border-white/40
//             text-[#111]
//             shadow-[0_10px_30px_rgba(0,0,0,0.3)]
//             pointer-events-none
//             opacity-0
//             transition-[opacity,transform] duration-250 ease-out
//             ${activeFigure ? "opacity-100" : ""}
//           `}
//           style={
//             activeFigure
//               ? {
//                   left: `${notePos.left}px`,
//                   top: `${notePos.top}px`,
//                   transform: isMobile
//                     ? "rotate(-1deg)"
//                     : notePos.side === "left"
//                     ? "rotate(2deg)"
//                     : "rotate(-2deg)",
//                 }
//               : undefined
//           }
//         >
//           {activeFigure && (
//             <>
//               <span className="inline-block font-['Space_Mono',monospace] text-[10px] tracking-[0.12em] uppercase bg-[#111] text-[#d4ff3f] px-1.5 py-0.5 mb-2">
//                 Зона парку
//               </span>

//               <h4 className="m-0 mb-1.5 font-['Anton','Arial_Narrow',sans-serif] text-[22px] max-[720px]:text-[18px] leading-none uppercase">
//                 {activeFigure.title}
//               </h4>

//               <p className="m-0 text-[13px] max-[720px]:text-[12px] leading-[1.4]">
//                 {activeFigure.note}
//               </p>
//             </>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }
//топчик!!!!!!!!!!!
// import { useRef, useState, useEffect } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import ParkMapDesktop from "./park.svg?react";
// import ParkMapMobile from "./park-mobile.svg?react"; // отдельный SVG с той же структурой id, но под вертикальный кадр

// gsap.registerPlugin(ScrollTrigger);

// // Базовое фото парка (общий план, без подсветки)
// const BASE_IMAGE_DESKTOP =
//   "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257521/voltparkvisual2_k4c3fr.jpg";
// const BASE_IMAGE_MOBILE =
//   "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/voltparkvisual2_h7bxoy.jpg"; // ваше вертикальное фото

// // Каждая фигура: id должен ТОЧНО совпадать с id path в park.svg,
// // image — картинка именно этой фигуры, note — короткая "журнальная" подпись сбоку.
// // image — фото для десктопного (горизонтального) SVG
// // mobileImage — то же фото, но скадрированное/подготовленное под вертикальний park-mobile.svg
// // (если mobileImage не указан — на мобилке используется тот же image, что и на десктопе)
// const figures = [
//   { id: "ramp", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual12_kuncse.jpg", title: "Рампа", note: "Класична рампа для набору швидкості й повітряних трюків.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual12_unvhp8.jpg" },
//   { id: "quater3", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual11_vjekyg.jpg", title: "Квотер 3", note: "Один із трьох квотерів парку, свій розмір і свій характер.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual11_cewrz7.jpg" },
//   { id: "roll-in", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual10_2_accbsl.jpg", title: "Ролл-ін", note: "Заїзд, з якого стартують у секцію з фігурами.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257520/volt_park_visual10_2_oo1az0.jpg" },
//   { id: "bank", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual9_2_nnmnay.jpg", title: "Бенк", note: "Похила поверхня для зв'язок і плавних переходів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual9_2_jrzknr.jpg" },
//   { id: "box", mobileImage:  "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual13_l168i9.jpg", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual13_z6hp1g.jpg" },
//   { id: "jumpbox", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/voltparkvisual3_x9m10k.jpg", title: "Джампбокс", note: "Фігура для стрибків і відпрацювання ейр-трюків.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/voltparkvisual4_rrbeeo.jpg" },
//   { id: "flybox", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/voltparkvisual4_f9b6hb.jpg", title: "Флайбокс", note: "Одна з фірмових фігур парку з ухилом в ейр.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/voltparkvisual3_kpnpkk.jpg" },
//   { id: "volcano", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual5_2_qdoyk5.jpg", title: "Волкано", note: "Фігура для складніших заходів і виходів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual5_2_w899yo.jpg" },
//   { id: "quater2", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual6_2_jxskkx.jpg", title: "Квотер 2", note: "Другий квотер — частина великої ейр-зони.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual6_2_gl0q0k.jpg" },
//   { id: "vertwall", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual8_2_zk97cn.jpg", title: "Vert wall", note: "Вертикальна стіна для найвищого рівня катання.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual8_2_zwmivn.jpg" },
//   { id: "quater", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual7_2_qm6fku.jpg", title: "Квотер", note: "Базовий квотер парку, з нього зручно починати.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual7_2_rrpf7v.jpg" },
//   { id: "box2", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual14_rwvnmc.jpg", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual14_dnjash.jpg" },
//   { id: "wallride", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual15_xgkol6.jpg", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual15_ktwiqp.jpg" },
// ];



 
// const figureById = Object.fromEntries(figures.map((f) => [f.id, f]));
 
// // id фигуры, на которой показываем пульсирующую точку-подсказку "тисни/наведи сюди"
// // (выберите любую заметную/крупную фигуру из списка выше) — работает и на мобилке, и на десктопе
// const HINT_FIGURE_ID = "box";
 
// export default function Skatepark() {
//   const svgWrapRef = useRef(null);
//   const layers = useRef({});
//   const [active, setActive] = useState(null);
//   const [notePos, setNotePos] = useState({
//     left: 0,
//     top: 0,
//     side: "right",
//     vertical: "bottom",
//   });

//   const isTouch =
//     typeof window !== "undefined" &&
//     window.matchMedia("(pointer: coarse)").matches;
 
//   // Отдельный брейкпоинт под "мобильную" версию SVG/фото (совпадает с max-[720px] в остальной верстке).
//   // Слушаем через matchMedia + resize, чтобы переключение SVG/фото происходило и при повороте
//   // экрана / ресайзе окна, а не только при первом рендере.
//   const [isMobile, setIsMobile] = useState(
//     () => typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches
//   );
 
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const mq = window.matchMedia("(max-width: 720px)");
//     const onChange = (e) => setIsMobile(e.matches);
//     mq.addEventListener("change", onChange);
//     return () => mq.removeEventListener("change", onChange);
//   }, []);
 
//   const ParkMap = isMobile ? ParkMapMobile : ParkMapDesktop;
//   const baseImage = isMobile ? BASE_IMAGE_MOBILE : BASE_IMAGE_DESKTOP;
 
//   // Подсказка "тут всё кликабельно": на мобилке — шиммер по всій карті + текстовий
//   // чіп біля пульсуючої точки, на десктопі — текстова підказка над картою + та сама
//   // пульсуюча точка (щоб було зрозуміло, що по фігурах можна наводити курсором).
//   // Ховається одразу, тільки-но користувач вибрав першу фігуру (клік/тап/hover/фокус),
//   // і більше не з'являється — див. showLayer нижче.
//   const [hasInteracted, setHasInteracted] = useState(false);
//   const [hintDotPos, setHintDotPos] = useState(null); // { xPercent, yPercent } в координатах viewBox
//   const shimmerRef = useRef(null);

//   // Секция может быть далеко от старта страницы — если запускать 6-секундный
//   // таймер подсказки сразу при монтировании, пользователь может дойти до
//   // карты уже после того, как подсказка "сама" погасла. Поэтому таймер и
//   // шиммер стартуют только когда секция реально появилась во вьюпорте.
//   const sectionRef = useRef(null);
//   const [hasEnteredView, setHasEnteredView] = useState(false);

//   useEffect(() => {
//     if (typeof IntersectionObserver === "undefined") {
//       setHasEnteredView(true);
//       return;
//     }
//     const el = sectionRef.current;
//     if (!el) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setHasEnteredView(true);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.25 }
//     );
//     observer.observe(el);
//     return () => observer.disconnect();
//   }, []);

//   // Появление всей секции скейтпарка при скролле — мягкий fade+slide-up,
//   // как и у остальных блоков (reveal-паттерн).
//   useEffect(() => {
//     const el = sectionRef.current;
//     if (!el) return;
//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         el,
//         { opacity: 0, y: 60 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 1,
//           ease: "power3.out",
//           scrollTrigger: { trigger: el, start: "top 80%" },
//         }
//       );
//     });
//     return () => ctx.revert();
//   }, []);
 
 

// const showLayer = (id, clientX) => {
//   setActive(id);
//   setHasInteracted(true);

//   const root = svgWrapRef.current;
//   const path = root?.querySelector(`path#${CSS.escape(id)}`);

//   if (!root || !path) return;

//   const rootBox = root.getBoundingClientRect();
//   const pathBox = path.getBoundingClientRect();

//   const figureX =
//     pathBox.left + pathBox.width / 2 - rootBox.left;

//   const figureY =
//     pathBox.top + pathBox.height / 2 - rootBox.top;

//   const gap = 14;

//   // ==========================================
//   // МОБИЛЬНЫЙ — карточка сверху или снизу
//   // ==========================================

//   if (isMobile) {
//     const cardWidth = Math.min(rootBox.width - 24, 300);
//     const cardHeight = 145;

//     // Центрируем карточку относительно фигуры
//     let left = figureX - cardWidth / 2;

//     // Не даём карточке выйти за края
//     left = Math.max(
//       12,
//       Math.min(left, rootBox.width - cardWidth - 12)
//     );

//     // Сколько места сверху и снизу от фигуры
//     const spaceTop = pathBox.top - rootBox.top;
//     const spaceBottom =
//       rootBox.height -
//       (pathBox.bottom - rootBox.top);

//     let top;
//     let vertical;

//     // Если сверху достаточно места — показываем сверху
//     if (spaceTop >= cardHeight + gap) {
//       top =
//         figureY -
//         pathBox.height / 2 -
//         cardHeight -
//         gap;

//       vertical = "top";
//     } else {
//       // Иначе показываем снизу
//       top =
//         figureY +
//         pathBox.height / 2 +
//         gap;

//       vertical = "bottom";
//     }

//     // Дополнительная защита от выхода за границы
//     top = Math.max(
//       12,
//       Math.min(top, rootBox.height - cardHeight - 12)
//     );

//     setNotePos({
//       left,
//       top,
//       side: "center",
//       vertical,
//     });
//   }

//   // ==========================================
//   // ДЕСКТОП — карточка слева или справа
//   // ==========================================

//   else {
//     const cardWidth = Math.min(
//       260,
//       rootBox.width * 0.38
//     );

//     const cardHeight = 150;

//     let side = "right";

//     let left =
//       figureX +
//       pathBox.width / 2 +
//       gap;

//     // Справа нет места → ставим слева
//     if (
//       left + cardWidth >
//       rootBox.width - 12
//     ) {
//       side = "left";

//       left =
//         figureX -
//         pathBox.width / 2 -
//         cardWidth -
//         gap;
//     }

//     left = Math.max(
//       12,
//       Math.min(
//         left,
//         rootBox.width - cardWidth - 12
//       )
//     );

//     let top =
//       figureY -
//       cardHeight / 2;

//     top = Math.max(
//       12,
//       Math.min(
//         top,
//         rootBox.height - cardHeight - 12
//       )
//     );

//     setNotePos({
//       left,
//       top,
//       side,
//       vertical: "center",
//     });
//   }

//   // Плавно показываем активную фотографию
//   Object.entries(layers.current).forEach(
//     ([key, el]) => {
//       if (!el) return;

//       gsap.to(el, {
//         opacity: key === id ? 1 : 0,
//         duration: 0.35,
//         ease: "power2.out",
//         overwrite: true,
//       });
//     }
//   );
// };



 
//   const hideAllLayers = () => {
//     setActive(null);
//     Object.values(layers.current).forEach((el) => {
//       if (!el) return;
//       gsap.to(el, { opacity: 0, duration: 0.35, ease: "power2.out", overwrite: true });
//     });
//   };
 
//   useEffect(() => {
//     if (!hasEnteredView || hasInteracted) return;
//     // Подсказка гаснет сама через 6с ПОСЛЕ того, как секция появилась во
//     // вьюпорте — а не через 6с после монтирования страницы. Так подсказка
//     // всегда застаёт пользователя, если он доскроллил до карты позже.
//     const timer = setTimeout(() => setHasInteracted(true), 6000);
//     return () => clearTimeout(timer);
//   }, [hasEnteredView, hasInteracted]);
 
//   // Шиммер-эффект "тут всё кликабельно": светлая диагональная полоса дважды
//   // проходит по всей карте, когда секция появляется во вьюпорте на мобилке,
//   // затем сама останавливается. Если пользователь тапнул раньше — showLayer
//   // уже поставил hasInteracted=true, и таймлайн ниже прерывается досрочно.
//   useEffect(() => {
//     if (!isMobile || !hasEnteredView || hasInteracted) return;
//     const el = shimmerRef.current;
//     if (!el) return;
 
//     const tl = gsap.timeline({ repeat: 1, repeatDelay: 0.6, delay: 0.5 });
//     tl.fromTo(
//       el,
//       { xPercent: -130, opacity: 0.9 },
//       { xPercent: 130, opacity: 0.9, duration: 1.1, ease: "power1.inOut" }
//     );
 
//     return () => tl.kill();
//   }, [isMobile, hasEnteredView, hasInteracted]);
 
//   useEffect(() => {
//     const root = svgWrapRef.current;
//     if (!root) return;
 
//     // Прозрачность/курсор/pointer-events у path теперь задаются CSS-классами
//     // на обёртке (см. className ниже) — они применяются сразу при первом рендере,
//     // ДО этого эффекта, поэтому больше нет вспышки цветных path при загрузке.
//     // Здесь остаётся только a11y-разметка и обработчики событий.
 
//     const paths = root.querySelectorAll("path[id]");
//     const cleanupFns = [];
 
//     // Позиция точки-подсказки: берём реальный bbox path'а HINT_FIGURE_ID
//     // и переводим его в проценты относительно viewBox, чтобы точка легла
//     // ровно на фигуру при любом размере блока. Считаем и на мобилке, и на
//     // десктопе — точка-подсказка теперь показывается в обоих случаях.
//     const svgEl = root.querySelector("svg");
//     const hintPath = root.querySelector(`path#${CSS.escape(HINT_FIGURE_ID)}`);
//     if (svgEl && hintPath && svgEl.viewBox?.baseVal) {
//       const { x: vbX, y: vbY, width: vbW, height: vbH } = svgEl.viewBox.baseVal;
//       const bbox = hintPath.getBBox();
//       const cx = bbox.x + bbox.width / 2;
//       const cy = bbox.y + bbox.height / 2;
//       setHintDotPos({
//         xPercent: ((cx - vbX) / vbW) * 100,
//         yPercent: ((cy - vbY) / vbH) * 100,
//       });
//     }
 
//     paths.forEach((path) => {
//       const figure = figureById[path.id];
//       if (!figure) return;
 
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
//         // const onMove = (e) => {
//         //   if (!isMobile && typeof window !== "undefined") {
//         //     setNotePos({ side: e.clientX > window.innerWidth / 2 ? "left" : "right" });
//         //   }
//         // };
//         const onLeave = () => hideAllLayers();
//         const onFocus = (e) => showLayer(figure.id, e.target.getBoundingClientRect().x);
//         const onBlur = () => hideAllLayers();
 
//         path.addEventListener("mouseenter", onEnter);
//         // path.addEventListener("mousemove", onMove);
//         path.addEventListener("mouseleave", onLeave);
//         path.addEventListener("focus", onFocus);
//         path.addEventListener("blur", onBlur);
 
//         cleanupFns.push(() => {
//           path.removeEventListener("mouseenter", onEnter);
//           // path.removeEventListener("mousemove", onMove);
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
//   }, [isTouch, isMobile]);
 
//   const activeFigure = active ? figureById[active] : null;
 
//   return (
//     <section ref={sectionRef} className="relative bg-[#0a0a0a] min-h-[100svh] flex flex-col justify-center">
//       {/* Заголовок-підказка над картою — той самий патерн, що й у Gallery/Categories,
//           щоб зона одразу читалась як окрема інтерактивна секція, а не просто фото. */}
//       <div className="max-w-[640px] mx-auto pt-16 pb-8 max-[720px]:pt-12 max-[720px]:pb-6 px-6 text-center relative z-[2]">
//         <span className="inline-block font-mono text-[11px] tracking-[0.14em] uppercase text-[#d4ff3f] mb-2.5">
//           Карта парку
//         </span>
//         <h2 className="font-['Anton','Arial_Narrow',sans-serif] text-[clamp(28px,5vw,48px)] leading-none m-0 mb-3 text-[#f2f0e6] uppercase">
//           Інтерактивна карта
//         </h2>
//         <p className="text-[15px] leading-[1.5] text-[#8a8a83] m-0">
//           {isTouch
//             ? "Торкнись будь-якої фігури на карті — з'явиться фото і опис саме цього елемента."
//             : "Наведи курсор на будь-яку фігуру на карті — з'явиться фото і опис саме цього елемента."}
//         </p>
//       </div>

//       {/* data-cursor-trail="off" выключает CursorImageTrail именно в этой зоне.
//           Высота этого блока теперь фиксирована (h-[100svh] на карте секции),
//           а фото растягивается через object-cover, чтобы карта помещалась
//           в один экран вместе с заголовком выше. SVG (viewBox 2477x1274) и
//           все остальные слои с absolute inset-0 растягиваются на 100%/100%
//           этого же блока и совпадают с фото автоматически. */}
//       <div
//         data-cursor-trail="off"
//         className="relative w-full flex-1 min-h-0 overflow-hidden select-none bg-[#0a0a0a]"
//       >
//         {/* Базовое фото — растягивается на всю доступную высоту блока */}
//         <img
//           className="relative z-[1] block w-full h-full object-cover object-top pointer-events-none"
//           src={baseImage}
//           alt="Скейтпарк, загальний вигляд"
//         />

//         {/* Слой картинки для каждой фигуры — проявляется поверх базового при наведении */}
//         {figures.map((item) => (
//           <img
//             key={item.id}
//             ref={(el) => (layers.current[item.id] = el)}
//             className="absolute inset-0 z-[2] w-full h-full object-cover object-top opacity-0 pointer-events-none will-change-[opacity]"
//             src={isMobile && item.mobileImage ? item.mobileImage : item.image}
//             alt={item.title}
//           />
//         ))}

//         {/* SVG поверх всего — прозрачные path работают как hit-зоны для наведения.
//             fill-transparent/stroke-transparent/pointer-events-auto/cursor-pointer
//             заданы CSS-классами (а не inline-стилями в JS), поэтому они применяются
//             мгновенно при первом рендере — никакой вспышки цветных path при загрузке. */}
//         <div
//           ref={svgWrapRef}
//           className="absolute inset-0 z-10 pointer-events-none [&_path]:fill-transparent [&_path]:stroke-transparent [&_path]:pointer-events-auto [&_path]:cursor-pointer [&_path]:outline-none"
//         >
//           <ParkMap
//             className="w-full h-full block"
//             preserveAspectRatio="xMidYMid slice"
//           />
//         </div>

//         {/* Подсказка "тут всё кликабельно" — показывается до первого выбора фигуры,
//             на мобилке и на десктопе. Мобилка: шиммер + текстовий чіп біля точки.
//             Десктоп: текстовий чіп біля точки з підказкою навести курсор. */}
//         {hasEnteredView && !hasInteracted && (
//           <>
//             {/* Диагональная светлая полоса — только на мобилке, дважды пробегает по карте */}
//             {isMobile && (
//               <div
//                 ref={shimmerRef}
//                 className="absolute inset-0 z-[15] pointer-events-none opacity-0"
//                 style={{
//                   background:
//                     "linear-gradient(75deg, transparent 42%, rgba(242,240,230,0.55) 50%, transparent 58%)",
//                 }}
//               />
//             )}

//             {/* Пульсирующая точка-подсказка на выбранной фигуре (HINT_FIGURE_ID) +
//                 текстовый чип рядом с ней, чтобы было однозначно понятно, что делать. */}
//             {hintDotPos && (
//               <div
//                 className="absolute z-[16] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
//                 style={{ left: `${hintDotPos.xPercent}%`, top: `${hintDotPos.yPercent}%` }}
//               >
//                 <span className="absolute inset-0 rounded-full bg-[#d4ff3f]/70 animate-ping" />
//                 <span className="relative block w-3.5 h-3.5 rounded-full bg-[#d4ff3f] shadow-[0_0_10px_rgba(212,255,63,0.8)]" />

//                 <span
//                   className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] tracking-[0.04em] uppercase text-[#0d0d0d] bg-[#d4ff3f] px-2.5 py-1 shadow-[0_6px_16px_rgba(0,0,0,0.4)] ${
//                     isMobile ? "-top-9" : "-top-10"
//                   }`}
//                 >
//                   {isMobile ? "👆 Тисни на фігуру" : "🖱 Наведи курсором"}
//                 </span>
//               </div>
//             )}
//           </>
//         )}

//         {/* Журнальная заметка — на десктопе сбоку от активной фигуры,
//             на мобилке снизу/сверху рядом с ней */}
//         <div
//           className={`
//             absolute z-20
//             w-[min(260px,calc(100%-24px))]
//             p-[14px_16px_16px]
//             bg-[rgba(242,240,230,0.78)]
//             backdrop-blur-xl
//             border border-white/40
//             text-[#111]
//             shadow-[0_10px_30px_rgba(0,0,0,0.3)]
//             pointer-events-none
//             opacity-0
//             transition-[opacity,transform] duration-250 ease-out
//             ${activeFigure ? "opacity-100" : ""}
//           `}
//           style={
//             activeFigure
//               ? {
//                   left: `${notePos.left}px`,
//                   top: `${notePos.top}px`,
//                   transform: isMobile
//                     ? "rotate(-1deg)"
//                     : notePos.side === "left"
//                     ? "rotate(2deg)"
//                     : "rotate(-2deg)",
//                 }
//               : undefined
//           }
//         >
//           {activeFigure && (
//             <>
//               <span className="inline-block font-['Space_Mono',monospace] text-[10px] tracking-[0.12em] uppercase bg-[#111] text-[#d4ff3f] px-1.5 py-0.5 mb-2">
//                 Зона парку
//               </span>

//               <h4 className="m-0 mb-1.5 font-['Anton','Arial_Narrow',sans-serif] text-[22px] max-[720px]:text-[18px] leading-none uppercase">
//                 {activeFigure.title}
//               </h4>

//               <p className="m-0 text-[13px] max-[720px]:text-[12px] leading-[1.4]">
//                 {activeFigure.note}
//               </p>
//             </>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// } топчик!!!!!!!!!!!! 



import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParkMapDesktop from "./park.svg?react";
import ParkMapMobile from "./park-mobile.svg?react"; // отдельный SVG с той же структурой id, но под вертикальный кадр

gsap.registerPlugin(ScrollTrigger);

// Базовое фото парка (общий план, без подсветки)
const BASE_IMAGE_DESKTOP =
  "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257521/voltparkvisual2_k4c3fr.jpg";
const BASE_IMAGE_MOBILE =
  "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/voltparkvisual2_h7bxoy.jpg"; // ваше вертикальное фото

// Каждая фигура: id должен ТОЧНО совпадать с id path в park.svg,
// image — картинка именно этой фигуры, note — короткая "журнальная" подпись сбоку.
// image — фото для десктопного (горизонтального) SVG
// mobileImage — то же фото, но скадрированное/подготовленное под вертикальний park-mobile.svg
// (если mobileImage не указан — на мобилке используется тот же image, что и на десктопе)
const figures = [
  { id: "ramp", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual12_kuncse.jpg", title: "Рампа", note: "Класична рампа для набору швидкості й повітряних трюків.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual12_unvhp8.jpg" },
  { id: "quater3", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual11_vjekyg.jpg", title: "Квотер 3", note: "Один із трьох квотерів парку, свій розмір і свій характер.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual11_cewrz7.jpg" },
  { id: "roll-in", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual10_2_accbsl.jpg", title: "Ролл-ін", note: "Заїзд, з якого стартують у секцію з фігурами.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257520/volt_park_visual10_2_oo1az0.jpg" },
  { id: "bank", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual9_2_nnmnay.jpg", title: "Бенк", note: "Похила поверхня для зв'язок і плавних переходів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual9_2_jrzknr.jpg" },
  { id: "box", mobileImage:  "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual13_l168i9.jpg", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual13_z6hp1g.jpg" },
  { id: "jumpbox", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/voltparkvisual3_x9m10k.jpg", title: "Джампбокс", note: "Фігура для стрибків і відпрацювання ейр-трюків.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/voltparkvisual4_rrbeeo.jpg" },
  { id: "flybox", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/voltparkvisual4_f9b6hb.jpg", title: "Флайбокс", note: "Одна з фірмових фігур парку з ухилом в ейр.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/voltparkvisual3_kpnpkk.jpg" },
  { id: "volcano", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual5_2_qdoyk5.jpg", title: "Волкано", note: "Фігура для складніших заходів і виходів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual5_2_w899yo.jpg" },
  { id: "quater2", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual6_2_jxskkx.jpg", title: "Квотер 2", note: "Другий квотер — частина великої ейр-зони.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual6_2_gl0q0k.jpg" },
  { id: "vertwall", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual8_2_zk97cn.jpg", title: "Vert wall", note: "Вертикальна стіна для найвищого рівня катання.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual8_2_zwmivn.jpg" },
  { id: "quater", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503280/volt_park_visual7_2_qm6fku.jpg", title: "Квотер", note: "Базовий квотер парку, з нього зручно починати.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257518/volt_park_visual7_2_rrpf7v.jpg" },
  { id: "box2", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual14_rwvnmc.jpg", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual14_dnjash.jpg" },
  { id: "wallride", mobileImage: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785503281/volt_park_visual15_xgkol6.jpg", title: "Бокс", note: "Один із двох боксів парку — для слайдів і грайндів.", image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785308365/volt_park_visual15_ktwiqp.jpg" },
];



 
const figureById = Object.fromEntries(figures.map((f) => [f.id, f]));
 
// id фигуры, на которой показываем пульсирующую точку-подсказку "тисни/наведи сюди"
// (выберите любую заметную/крупную фигуру из списка выше) — работает и на мобилке, и на десктопе
const HINT_FIGURE_ID = "box";
 
export default function Skatepark() {
  const svgWrapRef = useRef(null);
  const layers = useRef({});
  const [active, setActive] = useState(null);
  const [notePos, setNotePos] = useState({
    left: 0,
    top: 0,
    side: "right",
    vertical: "bottom",
  });

  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;
 
  // Отдельный брейкпоинт под "мобильную" версию SVG/фото (совпадает с max-[720px] в остальной верстке).
  // Слушаем через matchMedia + resize, чтобы переключение SVG/фото происходило и при повороте
  // экрана / ресайзе окна, а не только при первом рендере.
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches
  );
 
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 720px)");
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
 
  const ParkMap = isMobile ? ParkMapMobile : ParkMapDesktop;
  const baseImage = isMobile ? BASE_IMAGE_MOBILE : BASE_IMAGE_DESKTOP;
 
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hintDotPos, setHintDotPos] = useState(null); // { xPercent, yPercent } в координатах viewBox
  const shimmerRef = useRef(null);

  
  const sectionRef = useRef(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setHasEnteredView(true);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        }
      );
    });
    return () => ctx.revert();
  }, []);
 
 

const showLayer = (id, clientX) => {
  setActive(id);
  setHasInteracted(true);

  const root = svgWrapRef.current;
  const path = root?.querySelector(`path#${CSS.escape(id)}`);

  if (!root || !path) return;

  const rootBox = root.getBoundingClientRect();
  const pathBox = path.getBoundingClientRect();

  const figureX =
    pathBox.left + pathBox.width / 2 - rootBox.left;

  const figureY =
    pathBox.top + pathBox.height / 2 - rootBox.top;

  const gap = 14;

  // ==========================================
  // МОБИЛЬНЫЙ — карточка сверху или снизу
  // ==========================================

  if (isMobile) {
    const cardWidth = Math.min(rootBox.width - 24, 300);
    const cardHeight = 145;

  
    let left = figureX - cardWidth / 2;

  
    left = Math.max(
      12,
      Math.min(left, rootBox.width - cardWidth - 12)
    );

    // Сколько места сверху и снизу от фигуры
    const spaceTop = pathBox.top - rootBox.top;
    const spaceBottom =
      rootBox.height -
      (pathBox.bottom - rootBox.top);

    let top;
    let vertical;

   
    if (spaceTop >= cardHeight + gap) {
      top =
        figureY -
        pathBox.height / 2 -
        cardHeight -
        gap;

      vertical = "top";
    } else {
      // Иначе показываем снизу
      top =
        figureY +
        pathBox.height / 2 +
        gap;

      vertical = "bottom";
    }


    top = Math.max(
      12,
      Math.min(top, rootBox.height - cardHeight - 12)
    );

    setNotePos({
      left,
      top,
      side: "center",
      vertical,
    });
  }

  // ==========================================
  // ДЕСКТОП — карточка слева или справа
  // ==========================================

  else {
    const cardWidth = Math.min(
      260,
      rootBox.width * 0.38
    );

    const cardHeight = 150;

    let side = "right";

    let left =
      figureX +
      pathBox.width / 2 +
      gap;

    // Справа нет места → ставим слева
    if (
      left + cardWidth >
      rootBox.width - 12
    ) {
      side = "left";

      left =
        figureX -
        pathBox.width / 2 -
        cardWidth -
        gap;
    }

    left = Math.max(
      12,
      Math.min(
        left,
        rootBox.width - cardWidth - 12
      )
    );

    let top =
      figureY -
      cardHeight / 2;

    top = Math.max(
      12,
      Math.min(
        top,
        rootBox.height - cardHeight - 12
      )
    );

    setNotePos({
      left,
      top,
      side,
      vertical: "center",
    });
  }

  
  Object.entries(layers.current).forEach(
    ([key, el]) => {
      if (!el) return;

      gsap.to(el, {
        opacity: key === id ? 1 : 0,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    }
  );
};



 
  const hideAllLayers = () => {
    setActive(null);
    Object.values(layers.current).forEach((el) => {
      if (!el) return;
      gsap.to(el, { opacity: 0, duration: 0.35, ease: "power2.out", overwrite: true });
    });
  };
 
  useEffect(() => {
    if (!hasEnteredView || hasInteracted) return;
    
    const timer = setTimeout(() => setHasInteracted(true), 6000);
    return () => clearTimeout(timer);
  }, [hasEnteredView, hasInteracted]);
 
  
  useEffect(() => {
    if (!isMobile || !hasEnteredView || hasInteracted) return;
    const el = shimmerRef.current;
    if (!el) return;
 
    const tl = gsap.timeline({ repeat: 1, repeatDelay: 0.6, delay: 0.5 });
    tl.fromTo(
      el,
      { xPercent: -130, opacity: 0.9 },
      { xPercent: 130, opacity: 0.9, duration: 1.1, ease: "power1.inOut" }
    );
 
    return () => tl.kill();
  }, [isMobile, hasEnteredView, hasInteracted]);
 
  useEffect(() => {
    const root = svgWrapRef.current;
    if (!root) return;
 
 
    const paths = root.querySelectorAll("path[id]");
    const cleanupFns = [];
 
    
    const svgEl = root.querySelector("svg");
    const hintPath = root.querySelector(`path#${CSS.escape(HINT_FIGURE_ID)}`);
    if (svgEl && hintPath && svgEl.viewBox?.baseVal) {
      const { x: vbX, y: vbY, width: vbW, height: vbH } = svgEl.viewBox.baseVal;
      const bbox = hintPath.getBBox();
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;
      setHintDotPos({
        xPercent: ((cx - vbX) / vbW) * 100,
        yPercent: ((cy - vbY) / vbH) * 100,
      });
    }
 
    paths.forEach((path) => {
      const figure = figureById[path.id];
      if (!figure) return;
 
      path.setAttribute("tabindex", "0");
      path.setAttribute("role", "button");
      path.setAttribute("aria-label", figure.title);
 
      if (isTouch) {
        const onTap = (e) => {
          e.stopPropagation();
          setActive((prev) => {
            const next = prev === figure.id ? null : figure.id;
            if (next) showLayer(next, e.clientX);
            else hideAllLayers();
            return next;
          });
        };
        path.addEventListener("click", onTap);
        cleanupFns.push(() => path.removeEventListener("click", onTap));
      } else {
        const onEnter = (e) => showLayer(figure.id, e.clientX);

        const onLeave = () => hideAllLayers();
        const onFocus = (e) => showLayer(figure.id, e.target.getBoundingClientRect().x);
        const onBlur = () => hideAllLayers();
 
        path.addEventListener("mouseenter", onEnter);
        // path.addEventListener("mousemove", onMove);
        path.addEventListener("mouseleave", onLeave);
        path.addEventListener("focus", onFocus);
        path.addEventListener("blur", onBlur);
 
        cleanupFns.push(() => {
          path.removeEventListener("mouseenter", onEnter);
          // path.removeEventListener("mousemove", onMove);
          path.removeEventListener("mouseleave", onLeave);
          path.removeEventListener("focus", onFocus);
          path.removeEventListener("blur", onBlur);
        });
      }
    });
 
    let outsideTapHandler;
    if (isTouch) {
      outsideTapHandler = (e) => {
        if (!root.contains(e.target)) hideAllLayers();
      };
      document.addEventListener("click", outsideTapHandler);
    }
 
    return () => {
      cleanupFns.forEach((fn) => fn());
      if (outsideTapHandler) document.removeEventListener("click", outsideTapHandler);
    };
  }, [isTouch, isMobile]);
 
  const activeFigure = active ? figureById[active] : null;
 
  return (
    <section ref={sectionRef} className="relative bg-[#707070] h-[100svh] flex flex-col justify-center overflow-hidden">
      {/* Заголовок-підказка над картою — той самий патерн, що й у Gallery/Categories,
          щоб зона одразу читалась як окрема інтерактивна секція, а не просто фото. */}
      <div className="max-w-[640px] mx-auto pt-16 pb-6 max-[720px]:pt-8 max-[720px]:pb-3 px-6 text-center relative z-[2]">
        <span className="inline-block font-mono text-[11px] max-[720px]:text-[10px] tracking-[0.14em] uppercase text-[#d4ff3f] mb-2.5 max-[720px]:mb-1">
          Карта парку
        </span>
        <h2 className="font-['Anton','Arial_Narrow',sans-serif] text-[clamp(22px,5vw,48px)] leading-none m-0 mb-3 max-[720px]:mb-1 text-[#f2f0e6] uppercase">
          Інтерактивна карта
        </h2>
        <p className="text-[15px] max-[720px]:text-[12px] leading-[1.5] max-[720px]:leading-[1.3] text-[#FFFF8F] m-0 max-[720px]:hidden">
          {isTouch
            ? "Торкнись будь-якої фігури на карті — з'явиться фото і опис саме цього елемента."
            : "Наведи курсор на будь-яку фігуру на карті — з'явиться фото і опис саме цього елемента."}
        </p>
      </div>

  
      <div
        data-cursor-trail="off"
        className="relative w-full flex-1 min-h-0 overflow-hidden select-none bg-[#707070]"
      >

        <img
          className="relative z-[1] block w-full h-full object-contain pointer-events-none"
          src={baseImage}
          alt="Скейтпарк, загальний вигляд"
        />

       
        {figures.map((item) => (
          <img
            key={item.id}
            ref={(el) => (layers.current[item.id] = el)}
            className="absolute inset-0 z-[2] w-full h-full object-contain opacity-0 pointer-events-none will-change-[opacity]"
            src={isMobile && item.mobileImage ? item.mobileImage : item.image}
            alt={item.title}
          />
        ))}

      
        <div
          ref={svgWrapRef}
          className="absolute inset-0 z-10 pointer-events-none [&_path]:fill-transparent [&_path]:stroke-transparent [&_path]:pointer-events-auto [&_path]:cursor-pointer [&_path]:outline-none"
        >
          <ParkMap
            className="w-full h-full block"
            preserveAspectRatio="xMidYMid meet"
          />
        </div>

       
        {hasEnteredView && !hasInteracted && (
          <>
          
            {isMobile && (
              <div
                ref={shimmerRef}
                className="absolute inset-0 z-[15] pointer-events-none opacity-0"
                style={{
                  background:
                    "linear-gradient(75deg, transparent 42%, rgba(242,240,230,0.55) 50%, transparent 58%)",
                }}
              />
            )}

            
            {hintDotPos && (
              <div
                className="absolute z-[16] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${hintDotPos.xPercent}%`, top: `${hintDotPos.yPercent}%` }}
              >
                <span className="absolute inset-0 rounded-full bg-[#d4ff3f]/70 animate-ping" />
                <span className="relative block w-3.5 h-3.5 rounded-full bg-[#d4ff3f] shadow-[0_0_10px_rgba(212,255,63,0.8)]" />

                <span
                  className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] tracking-[0.04em] uppercase text-[#0d0d0d] bg-[#d4ff3f] px-2.5 py-1 shadow-[0_6px_16px_rgba(0,0,0,0.4)] ${
                    isMobile ? "-top-9" : "-top-10"
                  }`}
                >
                  {isMobile ? "👆 Тисни на фігуру" : "🖱 Наведи курсором"}
                </span>
              </div>
            )}
          </>
        )}

        {/* Журнальная заметка — на десктопе сбоку от активной фигуры,
            на мобилке снизу/сверху рядом с ней */}
        <div
          className={`
            absolute z-20
            w-[min(260px,calc(100%-24px))]
            p-[14px_16px_16px]
            bg-[rgba(242,240,230,0.78)]
            backdrop-blur-xl
            border border-white/40
            text-[#111]
            shadow-[0_10px_30px_rgba(0,0,0,0.3)]
            pointer-events-none
            opacity-0
            transition-[opacity,transform] duration-250 ease-out
            ${activeFigure ? "opacity-100" : ""}
          `}
          style={
            activeFigure
              ? {
                  left: `${notePos.left}px`,
                  top: `${notePos.top}px`,
                  transform: isMobile
                    ? "rotate(-1deg)"
                    : notePos.side === "left"
                    ? "rotate(2deg)"
                    : "rotate(-2deg)",
                }
              : undefined
          }
        >
          {activeFigure && (
            <>
              <span className="inline-block font-['Space_Mono',monospace] text-[10px] tracking-[0.12em] uppercase bg-[#111] text-[#d4ff3f] px-1.5 py-0.5 mb-2">
                Зона парку
              </span>

              <h4 className="m-0 mb-1.5 font-['Anton','Arial_Narrow',sans-serif] text-[22px] max-[720px]:text-[18px] leading-none uppercase">
                {activeFigure.title}
              </h4>

              <p className="m-0 text-[13px] max-[720px]:text-[12px] leading-[1.4]">
                {activeFigure.note}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
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