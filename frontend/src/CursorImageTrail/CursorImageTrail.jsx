// "use client";

// import { useEffect, useRef } from "react";
// import gsap from "gsap";


// // const images = [
// //   "/1.png",
// //   "/2.png",
// //   "/3.png",
// //   "/4.png",
// //   "/5.png",
// // ];
// const images = [
// "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257191/4_dywada.png",
// "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257191/2_gqcetl.png",
// "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257192/1_wcwpjq.png"
// ];


// export default function CursorImageTrail() {

//   const container = useRef(null);

//   const lastPosition = useRef({
//     x: 0,
//     y: 0,
//   });

//   const counter = useRef(0);



//   useEffect(() => {

//     const wrapper = container.current;

//     if (!wrapper) return;



//     const createImage = (x, y) => {

//       const img = document.createElement("img");


//       img.src =
//         images[
//           Math.floor(
//             Math.random() * images.length
//           )
//         ];


//       const size =
//         120 + Math.random() * 80;


//       const rotation =
//         Math.random() * 50 - 25;



//       Object.assign(img.style, {
//         position: "absolute",
//         width: `${size}px`,
//         pointerEvents: "none",
//         borderRadius: "16px",
//         left: `${x}px`,
//         top: `${y}px`,
//         zIndex: 999,
//         transformOrigin: "center",
//       });



//       wrapper.appendChild(img);



//       // появление

//       gsap.fromTo(
//         img,
//         {
//           opacity: 0,
//           scale: 0.4,
//           rotate: rotation,
//           xPercent: -50,
//           yPercent: -50,
//         },
//         {
//           opacity: 1,
//           scale: 1,
//           duration: 0.3,
//           ease: "power2.out",
//         }
//       );



//       // падение вниз

//       gsap.to(
//         img,
//         {
//           y:
//             window.innerHeight + 300,


//           x:
//             (Math.random() - 0.5) * 300,


//           rotate:
//             rotation +
//             (Math.random() * 80 - 40),


//           opacity: 0,


//           scale:
//             0.8 +
//             Math.random() * 0.4,


//           duration:
//             2.5 +
//             Math.random(),


//           ease: "power3.in",


//           onComplete: () => {
//             img.remove();
//           },
//         }
//       );

//     };





//     const handleMouseMove = (e) => {


//       const dx =
//         e.clientX -
//         lastPosition.current.x;


//       const dy =
//         e.clientY -
//         lastPosition.current.y;



//       const distance =
//         Math.sqrt(
//           dx * dx +
//           dy * dy
//         );



//       // расстояние между появлениями

//       if (distance < 50) return;



//       lastPosition.current = {
//         x: e.clientX,
//         y: e.clientY,
//       };



//       createImage(
//         e.clientX,
//         e.clientY
//       );



//       counter.current++;



//       // ограничение количества картинок

//       if (counter.current > 40) {

//         if (wrapper.children[0]) {
//           wrapper.children[0].remove();
//         }

//         counter.current = 20;
//       }

//     };





//     window.addEventListener(
//       "mousemove",
//       handleMouseMove
//     );



//     return () => {

//       window.removeEventListener(
//         "mousemove",
//         handleMouseMove
//       );

//     };


//   }, []);




//   return (
//     <div
//       ref={container}
//       style={{
//         position: "fixed",
//         inset: 0,
//         overflow: "hidden",
//         pointerEvents: "none",
//         zIndex: 9999,
//       }}
//     />
//   );
// }

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Замени на свои изображения проекта
const images = [
  "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257191/4_dywada.png",
  "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257191/2_gqcetl.png",
  "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257192/1_wcwpjq.png",
];

// ── Настройки поведения ────────────────────────────────────────────
const MAX_ACTIVE_IMAGES = 5;   // сколько картинок одновременно видно на экране
const MIN_DISTANCE = 110;      // px — курсор должен пройти столько, чтобы спавнилась новая картинка
const MIN_INTERVAL = 160;      // ms — минимальная пауза между спавнами (защита от "пулемёта")
const SIZE_MIN = 90;          // px
const SIZE_MAX = 100;          // px

// Атрибут, которым помечаются зоны, где трейл должен быть выключен.
// Повесь data-cursor-trail="off" на любой блок (например .skatepark)
const DISABLE_ATTR = "data-cursor-trail";

export default function CursorImageTrail() {
  const container = useRef(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const lastSpawnTime = useRef(0);
  const activeQueue = useRef([]); // очередь живых <img>, чтобы держать их количество ограниченным

  useEffect(() => {
    const wrapper = container.current;
    if (!wrapper) return;

    const isDisabledZone = (target) => {
      if (!(target instanceof Element)) return false;
      return !!target.closest(`[${DISABLE_ATTR}="off"]`);
    };

    const removeOldestIfNeeded = () => {
      while (activeQueue.current.length >= MAX_ACTIVE_IMAGES) {
        const oldest = activeQueue.current.shift();
        if (oldest && oldest.isConnected) {
          gsap.to(oldest, {
            opacity: 0,
            scale: 0.7,
            duration: 0.25,
            ease: "power1.in",
            onComplete: () => oldest.remove(),
          });
        }
      }
    };

    const createImage = (x, y) => {
      removeOldestIfNeeded();

      const img = document.createElement("img");
      img.src = images[Math.floor(Math.random() * images.length)];

      const size = SIZE_MIN + Math.random() * (SIZE_MAX - SIZE_MIN);
      const rotation = Math.random() * 30 - 15;

      Object.assign(img.style, {
        position: "absolute",
        width: `${size}px`,
        pointerEvents: "none",
        borderRadius: "18px",
        left: `${x}px`,
        top: `${y}px`,
        zIndex: 999,
        transformOrigin: "center",
      });

      wrapper.appendChild(img);
      activeQueue.current.push(img);

      // появление
      gsap.fromTo(
        img,
        { opacity: 0, scale: 0.5, rotate: rotation, xPercent: -50, yPercent: -50 },
        { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
      );

      // лёгкое покачивание и уход, спокойнее, чем раньше
      gsap.to(img, {
        y: `+=${40 + Math.random() * 40}`,
        rotate: rotation + (Math.random() * 20 - 10),
        opacity: 0,
        duration: 1.6 + Math.random() * 0.6,
        delay: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          img.remove();
          activeQueue.current = activeQueue.current.filter((el) => el !== img);
        },
      });
    };

    const handleMouseMove = (e) => {
      if (isDisabledZone(e.target)) {
        // просто синхронизируем позицию, чтобы при выходе из зоны
        // не спавнилась картинка из-за резкого "прыжка" расстояния
        lastPosition.current = { x: e.clientX, y: e.clientY };
        return;
      }

      const now = performance.now();
      if (now - lastSpawnTime.current < MIN_INTERVAL) return;

      const dx = e.clientX - lastPosition.current.x;
      const dy = e.clientY - lastPosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < MIN_DISTANCE) return;

      lastPosition.current = { x: e.clientX, y: e.clientY };
      lastSpawnTime.current = now;

      createImage(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={container}
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
// import { useEffect, useRef } from "react";
// import gsap from "gsap";

// // Замени на свои изображения проекта
// const images = [
//   "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257191/4_dywada.png",
//   "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257191/2_gqcetl.png",
//   "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257192/1_wcwpjq.png",
// ];

// // ── Настройки поведения ────────────────────────────────────────────
// const MAX_ACTIVE_IMAGES = 5;   // сколько картинок одновременно видно на экране
// const MIN_DISTANCE = 110;      // px — курсор должен пройти столько, чтобы спавнилась новая картинка
// const MIN_INTERVAL = 160;      // ms — минимальная пауза между спавнами (защита от "пулемёта")
// const SIZE_MIN = 190;          // px
// const SIZE_MAX = 300;          // px

// // Атрибут, которым помечаются зоны, где трейл должен быть выключен.
// // Повесь data-cursor-trail="off" на любой блок (например .skatepark)
// const DISABLE_ATTR = "data-cursor-trail";

// export default function CursorImageTrail() {
//   const container = useRef(null);
//   const lastPosition = useRef({ x: 0, y: 0 });
//   const lastSpawnTime = useRef(0);
//   const activeQueue = useRef([]); // очередь живых <img>, чтобы держать их количество ограниченным

//   useEffect(() => {
//     const wrapper = container.current;
//     if (!wrapper) return;

//     const isDisabledZone = (target) => {
//       if (!(target instanceof Element)) return false;
//       return !!target.closest(`[${DISABLE_ATTR}="off"]`);
//     };

//     const removeOldestIfNeeded = () => {
//       while (activeQueue.current.length >= MAX_ACTIVE_IMAGES) {
//         const oldest = activeQueue.current.shift();
//         if (oldest && oldest.isConnected) {
//           gsap.to(oldest, {
//             opacity: 0,
//             scale: 0.7,
//             duration: 0.25,
//             ease: "power1.in",
//             onComplete: () => oldest.remove(),
//           });
//         }
//       }
//     };

//     const createImage = (x, y) => {
//       removeOldestIfNeeded();

//       const img = document.createElement("img");
//       img.src = images[Math.floor(Math.random() * images.length)];

//       const size = SIZE_MIN + Math.random() * (SIZE_MAX - SIZE_MIN);
//       const rotation = Math.random() * 30 - 15;

//       Object.assign(img.style, {
//         position: "absolute",
//         width: `${size}px`,
//         pointerEvents: "none",
//         borderRadius: "18px",
//         left: `${x}px`,
//         top: `${y}px`,
//         zIndex: 999,
//         transformOrigin: "center",
//       });

//       wrapper.appendChild(img);
//       activeQueue.current.push(img);

//       // появление
//       gsap.fromTo(
//         img,
//         { opacity: 0, scale: 0.5, rotate: rotation, xPercent: -50, yPercent: -50 },
//         { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
//       );

//       // лёгкое покачивание и уход, спокойнее, чем раньше
//       gsap.to(img, {
//         y: `+=${40 + Math.random() * 40}`,
//         rotate: rotation + (Math.random() * 20 - 10),
//         opacity: 0,
//         duration: 1.6 + Math.random() * 0.6,
//         delay: 0.5,
//         ease: "power2.inOut",
//         onComplete: () => {
//           img.remove();
//           activeQueue.current = activeQueue.current.filter((el) => el !== img);
//         },
//       });
//     };

//     const handleMouseMove = (e) => {
//       if (isDisabledZone(e.target)) {
//         // просто синхронизируем позицию, чтобы при выходе из зоны
//         // не спавнилась картинка из-за резкого "прыжка" расстояния
//         lastPosition.current = { x: e.clientX, y: e.clientY };
//         return;
//       }

//       const now = performance.now();
//       if (now - lastSpawnTime.current < MIN_INTERVAL) return;

//       const dx = e.clientX - lastPosition.current.x;
//       const dy = e.clientY - lastPosition.current.y;
//       const distance = Math.sqrt(dx * dx + dy * dy);

//       if (distance < MIN_DISTANCE) return;

//       lastPosition.current = { x: e.clientX, y: e.clientY };
//       lastSpawnTime.current = now;

//       createImage(e.clientX, e.clientY);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   return (
//     <div
//       ref={container}
//       style={{
//         position: "fixed",
//         inset: 0,
//         overflow: "hidden",
//         pointerEvents: "none",
//         zIndex: 9999,
//       }}
//     />
//   );
// }