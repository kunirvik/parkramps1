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

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import "./Skatepark.css";
import ParkMap from "./park.svg?react";

// Базовое фото парка (общий план, без подсветки)
const BASE_IMAGE =
  "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257521/voltparkvisual2_k4c3fr.jpg";

// Каждая фигура: id должен ТОЧНО совпадать с id path в park.svg,
// image — картинка именно этой фигуры, note — короткая "журнальная" подпись сбоку.
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
];

const figureById = Object.fromEntries(figures.map((f) => [f.id, f]));

export default function Skatepark() {
  const svgWrapRef = useRef(null);
  const layers = useRef({});
  const [active, setActive] = useState(null);
  const [notePos, setNotePos] = useState({ side: "right" });

  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  const showLayer = (id, clientX) => {
    setActive(id);
    // если фигура в правой половине экрана — карточка выезжает слева, и наоборот
    if (typeof window !== "undefined" && typeof clientX === "number") {
      setNotePos({ side: clientX > window.innerWidth / 2 ? "left" : "right" });
    }
    Object.entries(layers.current).forEach(([key, el]) => {
      if (!el) return;
      gsap.to(el, {
        opacity: key === id ? 1 : 0,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    });
  };

  const hideAllLayers = () => {
    setActive(null);
    Object.values(layers.current).forEach((el) => {
      if (!el) return;
      gsap.to(el, { opacity: 0, duration: 0.35, ease: "power2.out", overwrite: true });
    });
  };

  useEffect(() => {
    const root = svgWrapRef.current;
    if (!root) return;

    const paths = root.querySelectorAll("path[id]");
    const cleanupFns = [];

    paths.forEach((path) => {
      const figure = figureById[path.id];
      if (!figure) return;

      path.style.cursor = "pointer";
      path.style.pointerEvents = "auto";
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
        const onMove = (e) => {
          if (typeof window !== "undefined") {
            setNotePos({ side: e.clientX > window.innerWidth / 2 ? "left" : "right" });
          }
        };
        const onLeave = () => hideAllLayers();
        const onFocus = (e) => showLayer(figure.id, e.target.getBoundingClientRect().x);
        const onBlur = () => hideAllLayers();

        path.addEventListener("mouseenter", onEnter);
        path.addEventListener("mousemove", onMove);
        path.addEventListener("mouseleave", onLeave);
        path.addEventListener("focus", onFocus);
        path.addEventListener("blur", onBlur);

        cleanupFns.push(() => {
          path.removeEventListener("mouseenter", onEnter);
          path.removeEventListener("mousemove", onMove);
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
  }, [isTouch]);

  const activeFigure = active ? figureById[active] : null;

  return (
    // data-cursor-trail="off" выключает CursorImageTrail именно в этой зоне
    <div className="skatepark" data-cursor-trail="off">
      {/* Базовое фото — видно всегда */}
      <img className="park-image" src={BASE_IMAGE} alt="Скейтпарк, загальний вигляд" />

      {/* Слой картинки для каждой фигуры — проявляется поверх базового при наведении */}
      {figures.map((item) => (
        <img
          key={item.id}
          ref={(el) => (layers.current[item.id] = el)}
          className="park-layer"
          src={item.image}
          alt={item.title}
        />
      ))}

      {/* SVG поверх всего — прозрачные path работают как hit-зоны для наведения */}
      <div ref={svgWrapRef} className="park-svg-wrap">
        <ParkMap className="park-svg" />
      </div>

      {/* Журнальная заметка сбоку от активной фигуры */}
      <div
        className={`skate-note skate-note--${notePos.side} ${
          activeFigure ? "skate-note--visible" : ""
        }`}
      >
        {activeFigure && (
          <>
            <span className="skate-note__tag">Зона парку</span>
            <h4 className="skate-note__title">{activeFigure.title}</h4>
            <p className="skate-note__text">{activeFigure.note}</p>
          </>
        )}
      </div>
    </div>
  );
}
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