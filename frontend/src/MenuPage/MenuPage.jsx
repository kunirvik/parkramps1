// import React, { useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import Hero3D from "../Hero3D";
// // import CategoryRoulette from "../Categoryroulette";
// import LoadingScreen from "../LoadingScreen/LodingScreen";
// import "./MenuPage.css";

// const IMAGE_DURATION_MS = 1000;
// const CROSSFADE_DURATION = 0.7;

// // ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ: каждая категория = title + media.
// // Когда появятся новые категории — просто добавляй объекты сюда,
// // media.type может быть "image" или "video".
// const categories = [
//   {
//     title: "Skateparks",
//     media: {
//       type: "image",
//       url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1780427037/project_nkkaef.png",
//     },
//   },
//   // {
//   //   title: "Ramps",
//   //   media: { type: "video", url: "..." },
//   // },
//   // {
//   //   title: "Events",
//   //   media: { type: "image", url: "..." },
//   // },
// ];

// export default function MenuPage() {
//   const [index, setIndex] = useState(0);
//   const [mediaLoaded, setMediaLoaded] = useState(false);
//   const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });

//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(true);
//   const [isFadingOut, setIsFadingOut] = useState(false);
//   const videoRef = useRef(null);

//   const currentCategory = categories[index];
//   const currentMedia = currentCategory.media;

//   const handleStepCategory = (direction) => {
//     setIndex((prev) => {
//       const next = (prev + direction) % categories.length;
//       return next < 0 ? next + categories.length : next;
//     });
//   };

//   // сброс флага загрузки при смене категории
//   useEffect(() => {
//     setMediaLoaded(false);
//   }, [index]);

//   // прелоад следующей категории заранее
//   useEffect(() => {
//     if (categories.length < 2) return;

//     const nextIndex = (index + 1) % categories.length;
//     const nextMedia = categories[nextIndex].media;

//     if (!nextMedia) return;

//     if (nextMedia.type === "image") {
//       const preloadImg = new Image();
//       preloadImg.src = nextMedia.url;
//     } else if (nextMedia.type === "video") {
//       const preloadVideo = document.createElement("video");
//       preloadVideo.preload = "auto";
//       preloadVideo.muted = true;
//       preloadVideo.src = nextMedia.url;
//       preloadVideo.load();
//     }
//   }, [index]);

//   // автоматическая смена категории: видео — по 'ended', фото — по таймеру
//   useEffect(() => {
//     if (categories.length < 2) return; // одна категория — крутить некуда

//     const goNext = () => handleStepCategory(1);

//     if (currentMedia.type === "video") {
//       const videoEl = videoRef.current;
//       if (!videoEl) return;

//       videoEl.addEventListener("ended", goNext);
//       return () => videoEl.removeEventListener("ended", goNext);
//     }

//     const timer = setTimeout(goNext, IMAGE_DURATION_MS);
//     return () => clearTimeout(timer);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [index, currentMedia.type]);

//   const handleMouseMove = (e) => {
//     setTooltip({ visible: true, x: e.clientX, y: e.clientY });
//   };

//   const handleMouseLeave = () => {
//     setTooltip({ visible: false, x: 0, y: 0 });
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => setIsFadingOut(true), 1500);
//     const removeLoadingScreen = setTimeout(() => setIsLoading(false), 2300);

//     return () => {
//       clearTimeout(timer);
//       clearTimeout(removeLoadingScreen);
//     };
//   }, []);

//   const modelUrl =
//     "https://res.cloudinary.com/dbx6muxub/image/upload/v1786811336/model_eteyx8.glb";

//   return (
//     <>
//       {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}

//       <div className="hero3d relative w-full h-screen flex items-center justify-center overflow-hidden">
//         <AnimatePresence initial={false}>
//           {currentMedia.type === "video" ? (
//             <motion.video
//               key={currentMedia.url}
//               ref={videoRef}
//               className="absolute top-0 left-0 w-full h-full object-cover z-[2]"
//               crossOrigin="anonymous"
//               src={currentMedia.url}
//               autoPlay
//               muted
//               playsInline
//               onLoadedData={() => setMediaLoaded(true)}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: mediaLoaded ? 1 : 0 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: CROSSFADE_DURATION, ease: "easeInOut" }}
//             />
//           ) : (
//             <motion.img
//               key={currentMedia.url}
//               src={currentMedia.url}
//               alt="Background"
//               onLoad={() => setMediaLoaded(true)}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: mediaLoaded ? 1 : 0 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: CROSSFADE_DURATION, ease: "easeInOut" }}
//               className="absolute top-0 left-0 w-full h-full object-cover z-[2]"
//             />
//           )}
//         </AnimatePresence>

//         <Hero3D
//           modelUrl={modelUrl}
//           media={currentMedia}
//           videoRef={videoRef}
//           restRotationY={Math.PI / 4}
//         />

//         {/* <CategoryRoulette
//           words={categories.map((c) => c.title)}
//           activeIndex={index}
//           onSelect={setIndex}
//           onStep={handleStepCategory}
//         /> */}

//         <div className="relative z-10 flex flex-col items-center overflow-visible">
//           <motion.h1
//             key={index}
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//             transition={{ duration: 0.5 }}
//             className={`
//               text-center break-words whitespace-normal font-futura
//               tracking-[-5px] mb-6 cursor-pointer overflow-hidden bg-clip-text
//               ${
//                 index === categories.length - 1
//                   ? "font-bold text-transparent bg-pink-300"
//                   : "font-medium text-transparent bg-white/50"
//               }
//             `}
//             style={{ fontSize: "clamp(60px, 10vw, 150px)", padding: "0 20px" }}
//             onMouseMove={handleMouseMove}
//             onMouseLeave={handleMouseLeave}
//           >
//             {currentCategory.title}
//           </motion.h1>

//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-lg text-lg font-futura font-light shadow-lg hover:bg-pink-300 cursor-pointer"
//             onClick={() => navigate("/catalogue")}
//           >
//             explore
//           </motion.button>
//         </div>
//       </div>
//     </>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import Hero3D from "../Hero3D";
// import LoadingScreen from "../LoadingScreen/LodingScreen";
// import "./MenuPage.css";

// // utils/youtube.js
//  function getYouTubeId(url) {
//   const match = url.match(
//     /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/
//   );
//   return match ? match[1] : null;
// }

// const TEXT_DURATION_MS = 3000;
// const EXIT_ANIM_MS = 500; // длительность анимации исчезновения текста/кнопки

// const categories = ["Skateparks", "Ramps", "Events", "Parkramps"];

// // const background = {
// //   type: "image",
// //   url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1780427037/project_nkkaef.png",
// // };

// const background = {
//   type: "youtube",
//   url: "https://www.youtube.com/watch?v=rIMW7uRKCEM&list=LL&index=3&t=1s", // ваша ссылка
// };
// const heroModelUrl =
//   "https://res.cloudinary.com/dbx6muxub/image/upload/v1786811336/model_eteyx8.glb";

// const logoModelUrl = "/model.glb"; // тот же файл, что в LoadingScreen/LogoModel

// // Размер геройской модели в состоянии меню и размер, до которого она
// // должна СЖАТЬСЯ, превращаясь в "логотип" — подберите под визуал вашей
// // LogoModel (scale 0.01 там — но это в других единицах three-fiber,
// // тут ориентируйтесь на итоговый размер на экране).
// const HERO_SIZE = 4.5;
// const LOGO_SIZE = 0.9;

// export default function MenuPage() {
//   const [index, setIndex] = useState(0);
//   const navigate = useNavigate();

//   const [isLoading, setIsLoading] = useState(true);
//   const [isFadingOut, setIsFadingOut] = useState(false);

//   // состояние перехода на страницу каталога
//   const [isExploring, setIsExploring] = useState(false);
//   const [activeModelUrl, setActiveModelUrl] = useState(heroModelUrl);
//   const [activeModelSize, setActiveModelSize] = useState(HERO_SIZE);

//   const currentCategory = categories[index];

//   useEffect(() => {
//     if (isExploring) return; // не крутим категории во время перехода
//     const timer = setInterval(() => {
//       setIndex((prev) => (prev + 1) % categories.length);
//     }, TEXT_DURATION_MS);
//     return () => clearInterval(timer);
//   }, [isExploring]);

//   useEffect(() => {
//     const fadeTimer = setTimeout(() => setIsFadingOut(true), 1500);
//     const removeTimer = setTimeout(() => setIsLoading(false), 2300);
//     return () => {
//       clearTimeout(fadeTimer);
//       clearTimeout(removeTimer);
//     };
//   }, []);

//   const handleExplore = () => {
//     if (isExploring) return;

//     setIsExploring(true); // скрывает текст и кнопку

//     // ключевой момент: меняем модель И её целевой размер ОДНОВРЕМЕННО —
//     // Hero3D внутри одного и того же кроссфейда и подменит геометрию
//     // на logoModelUrl, и уменьшит её до LOGO_SIZE. Никакого пересоздания
//     // канваса, поэтому это выглядит как непрерывное "сжатие" модели,
//     // а не как исчезновение одной и появление другой.
//     setActiveModelUrl(logoModelUrl);
//     setActiveModelSize(LOGO_SIZE);

//     // ждём, пока доиграет анимация исчезновения текста/кнопки и сам
//     // 3D-переход (transitionDuration в Hero3D по умолчанию 0.9с),
//     // и уходим на каталог
//     setTimeout(() => {
//       navigate("/catalogue");
//     }, EXIT_ANIM_MS + 400);
//   };

//   return (
//     <>
//       {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}

//       <div className="hero3d relative w-full h-screen flex items-center justify-center overflow-hidden">
//         {/* {background.type === "image" && (
//           <img
//             src={background.url}
//             alt="Background"
//             className="absolute top-0 left-0 w-full h-full object-cover z-[2]"
//           />
//         )} */}

//         {background.type === "youtube" && (() => {
//   const videoId = getYouTubeId(background.url);
//   return (
//     <div className="yt-bg-wrap absolute top-0 left-0 w-full h-full z-[2] overflow-hidden pointer-events-none">
//       <iframe
//         className="yt-bg-iframe"
//         src={
          
//           `https://www.youtube.com/embed/${videoId}` +
//           `?autoplay=1&mute=1&loop=1&playlist=${videoId}` +
//           `&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&playsinline=1`
//         }
//         title="background"
//         frameBorder="0"
//         allow="autoplay; encrypted-media"
//       />
//     </div>
//   );
// })()}



//         <Hero3D
//           modelUrl={activeModelUrl}
//           media={background}
//           modelSize={activeModelSize}
//           restRotationY={isExploring ? 0 : (72 * Math.PI) / 180}
//           grayscale={isExploring}
//         />

//         <AnimatePresence>
//           {!isExploring && (
//             <motion.div
//               key="menu-content"
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: EXIT_ANIM_MS / 1000, ease: "easeInOut" }}
//               className="relative z-10 flex flex-col items-center overflow-visible"
//             >
//               <AnimatePresence mode="wait">
//                 <motion.h1
//                   key={currentCategory}
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 20 }}
//                   transition={{ duration: 0.4, ease: "easeInOut" }}
//                   className={`text-center break-words whitespace-normal font-futura tracking-[-5px] mb-6 cursor-pointer overflow-hidden bg-clip-text text-transparent ${
//                     currentCategory === "Parkramps"
//                       ? "font-bold bg-pink-400"
//                       : "font-medium bg-white/50"
//                   }`}
//                   style={{ fontSize: "clamp(60px, 10vw, 150px)", padding: "0 20px" }}
//                 >
//                   {currentCategory}
//                 </motion.h1>
//               </AnimatePresence>

//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-lg text-lg font-futura font-light shadow-lg hover:bg-pink-300 cursor-pointer"
//                 onClick={handleExplore}
//               >
//                 explore
//               </motion.button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </>
//   );
// }

// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import LoadingScreen from "../LoadingScreen/LodingScreen";

// const words = ["Skateparks",  "Ramps", "Events", "Parkramps"];

// export default function MenuPage() {
//   const [index, setIndex] = useState(0);
//   const [tooltip, setTooltip] = useState({ visible: false, x:0 , y: 0 });
//   const tooltipRef = useRef(null);
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(true); 
//     const [isFadingOut, setIsFadingOut] = useState(false);
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prevIndex) => (prevIndex + 1) % words.length);
//     }, 2000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleMouseMove = (e) => {
//     setTooltip({ visible: true, x: e.clientX , y: e.clientY  });
//   };

//   const handleMouseLeave = () => {
//     setTooltip({ visible: false, x: 0, y: 0 });
//   };

//    useEffect(() => {
//     // Запускаем анимацию исчезновения перед снятием лоадинга
//     const timer = setTimeout(() => setIsFadingOut(true), 1500);
//     const removeLoadingScreen = setTimeout(() => setIsLoading(false), 2300);
    
//     return () => {
//       clearTimeout(timer);
//       clearTimeout(removeLoadingScreen);
//     };
//   }, []);  

//   return (<>
//    {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}
   
//     <div className="relative w-full  bg-white-200  h-screen flex items-center justify-center overflow-visible ">
//       {/* Фоновое видео */}
//       {/* <video
//         autoPlay
//         loop
//         muted
//         className="absolute top-0 left-0 w-full h-full object-cover grayscale"
//       >
//         <source src="/tlprshrt.mp4" type="video/mp4" />
//       </video> */}



//   {/* <div className="  absolute inset-0 w-full h-[100vh] overflow-hidden lg:w-full lg:h-full">
//   <img
//     src="/project2.png"
//     alt="Project"
//     className="w-full h-full object-contain lg:object-fill lg:rotate-90"
//   />
// </div>
//  */}

// <picture>
//   {/* для телефонов и планшетов */}
//   <source srcSet="/project2.png" media="(max-width: 1024px)" />
//   {/* для десктопа */}
//   <img
//     src="/project.png"
//     alt="Project"
//     className="absolute top-0 left-0 w-full h-full object-cover"
//   />
// </picture>



      
//       {/* Анимированный текст */}
//       <div className="relative z-10 flex flex-col items-center overflow-visible">
//        <motion.h1
//   key={index}
//   initial={{ opacity: 0, y: -20 }}
//   animate={{ opacity: 1, y: 0 }}
//   exit={{ opacity: 0, y: 20 }}
//   transition={{ duration: 0.5 }}
//   className={`
//     text-center
//     break-words
//     whitespace-normal
//     font-futura
//     tracking-[-5px]
//     mb-6
//     cursor-pointer
//     overflow-hidden
//     bg-clip-text
//     ${index === words.length - 1 
//       ? "font-bold text-transparent bg-pink-300" 
//       : "font-medium text-transparent bg-white/50"}
//   `}
//   style={{
//     fontSize: "clamp(60px, 10vw, 150px)",
//     padding: "0 20px"
//   }}
//   onMouseMove={handleMouseMove}
//   onMouseLeave={handleMouseLeave}
// >
//   {words[index]}
// </motion.h1>

      

//              {/* Подсказка */}
//              {/* {tooltip.visible && (
//           <motion.div
//             ref={tooltipRef}
//             className="absolute bg-black font-futura font-medium text-white text-sm px-3 py-1 rounded-lg shadow-lg "
//             style={{ top: tooltip.y, left: tooltip.x }}
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//           >
//           <PiEyesFill />
//           </motion.div>
//         )} */}




//         {/* Кнопка перехода */}
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}

//           className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-lg text-lg font-futura font-light shadow-lg hover:bg-pink-300 cursor-pointer"
//          onClick={() =>{
 
        
//            navigate("/catalogue")
//         }
          
//           }>
//             explore
//         </motion.button>
//       </div>
//     </div></>
//   );
// }
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { useFBX } from "@react-three/drei";
import { Leva, useControls } from "leva";
import LoadingScreen from "../LoadingScreen/LodingScreen";
// поправьте путь под вашу структуру папок
import SkateparkStage, { preloadModels } from "../SkateparkStage/SkateparkStage";
import MorphPoints from "../SkateparkStage/MorphPoints";
import Dancers from "../SkateparkStage/Dancers";
import Effects from "../SkateparkStage/Effects";
import { LOOKS } from "../SkateparkStage/GlitchMaterial";

/*
  Одно слово = одна модель. Единственный источник правды — index.
  Когда index меняется, текст анимируется, а модель стирается (глитч)
  и перерисовывается в модель, привязанную к новому слову.

  Переключать можно: колесом мыши, свайпом, стрелками, точками внизу,
  а если ничего не трогать — само раз в AUTO_MS.

  Настройка внешнего вида: откройте страницу с ?debug (например /?debug) —
  появится панель с пресетами и ползунками. Понравившиеся значения
  перенесите в DEFAULT_LOOK / DEFAULT_STYLE ниже.
*/

const SLIDES = [
  { word: "Skateparks", model: { url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1793542923/sp1_f0qnhd.glb", scale: 1.15 } },
  { word: "Ramps",      model: { url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1794991173/mini_pwew3g.glb",      scale: 1.0 } },
  { word: "Events",     model: { url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1795107447/box_ohvvi6.glb",    scale: 1.1 } },
  { word: "Parkramps",  model: { url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1786811336/model_eteyx8.glb",  scale: 1.0 } },
];
// const MODELS = SLIDES.map((s) => s.model);

// // Танцующие человечки на слайде Events.
// // Нужен FBX с mixamo.com (Format: FBX Binary, Skin: With Skin, лучше In Place).
// // Загрузите файл в Cloudinary (как raw) и вставьте ссылку.
// const EVENTS_INDEX = 2;
// const DANCER_URL = "https://res.cloudinary.com/dbx6muxub/raw/upload/v1795021355/Hip_Hop_Dancing_1_flomq0.fbx";
// const DANCERS = { count: 5, height: 0.7, spacing: 0.55, y: -0.95, z: 0.8 };

// // грузим модели, пока висит LoadingScreen
// preloadModels(MODELS);
// useFBX.preload(DANCER_URL);

// const AUTO_MS = 5000; // автосмена (переход длится ~2 с)
// const LOCK_MS = 2200; // пауза после смены, чтобы анимация успела доиграть

// // Значения по умолчанию (когда панель скрыта).
// // Пресеты: hologram | wireframe | xray | neon | ink (ink — для светлого фона)
// const DEFAULT_PRESET = "hologram";
// const DEFAULT_STYLE = "mesh"; // 'mesh' (сетка) | 'morph' (точки, перетекают друг в друга)

// // Во сколько раз модель больше на десктопе (ширина ≥ 768px). На мобиле всегда 1.
// // 1.6 — модель почти во весь экран; 2+ — уже вылезает за края.
// const DESKTOP_ZOOM = 1.6;

// export default function MenuPage() {
//   const [index, setIndex] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isFadingOut, setIsFadingOut] = useState(false);
//   const navigate = useNavigate();

//   const lockRef = useRef(0);
//   const touchY = useRef(null);
//   const glitchRef = useRef(0); // сила глитча → хроматическая аберрация

//   // десктоп (как md: в Tailwind) — модель крупнее, сцена на весь экран
//   const [isDesktop, setIsDesktop] = useState(
//     () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
//   );
//   useEffect(() => {
//     const mq = window.matchMedia("(min-width: 768px)");
//     const on = () => setIsDesktop(mq.matches);
//     mq.addEventListener("change", on);
//     return () => mq.removeEventListener("change", on);
//   }, []);
//   const zoom = isDesktop ? DESKTOP_ZOOM : 1;

//   const reduced =
//     typeof window !== "undefined" &&
//     window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//   const debug =
//     typeof window !== "undefined" &&
//     new URLSearchParams(window.location.search).has("debug");

//   // панель настройки эффектов (скрыта без ?debug, но значения работают всегда)
//   const [look, setLook] = useControls(() => ({
//     preset: {
//       value: DEFAULT_PRESET,
//       options: Object.keys(LOOKS),
//       onChange: (p, _path, ctx) => {
//         if (!ctx.initial) setLook(LOOKS[p]);
//       },
//     },
//     style: { value: DEFAULT_STYLE, options: ["mesh", "morph"] },
//     color: LOOKS[DEFAULT_PRESET].color,
//     color2: LOOKS[DEFAULT_PRESET].color2,
//     blending: { value: LOOKS[DEFAULT_PRESET].blending, options: ["additive", "normal"] },
//     fill: { value: LOOKS[DEFAULT_PRESET].fill, min: 0, max: 1 },
//     lines: { value: LOOKS[DEFAULT_PRESET].lines, min: 0, max: 1 },
//     fresnel: { value: LOOKS[DEFAULT_PRESET].fresnel, min: 0.5, max: 6 },
//     scan: { value: LOOKS[DEFAULT_PRESET].scan, min: 0, max: 1 },
//     edge: { value: LOOKS[DEFAULT_PRESET].edge, min: 0, max: 1.5 },
//     ca: { value: LOOKS[DEFAULT_PRESET].ca, min: 0, max: 1 },
//     dots: { value: LOOKS[DEFAULT_PRESET].dots, min: 0, max: 1 },
//     point: { value: LOOKS[DEFAULT_PRESET].point, min: 0.5, max: 6 },
//     scatter: { value: LOOKS[DEFAULT_PRESET].scatter, min: 0, max: 2 },
//   }));

//   // лоадер (как у вас было)
//   useEffect(() => {
//     const timer = setTimeout(() => setIsFadingOut(true), 1500);
//     const removeLoadingScreen = setTimeout(() => setIsLoading(false), 2300);
//     return () => {
//       clearTimeout(timer);
//       clearTimeout(removeLoadingScreen);
//     };
//   }, []);

//   // смена слова/модели с защитой от слишком частых переключений
//   const change = useCallback((next) => {
//     const now = performance.now();
//     if (now < lockRef.current) return;
//     lockRef.current = now + LOCK_MS;
//     setIndex(next);
//   }, []);

//   const step = useCallback(
//     (dir) => change((index + dir + SLIDES.length) % SLIDES.length),
//     [change, index]
//   );

//   // автосмена: таймер перезапускается после каждой смены
//   useEffect(() => {
//     if (isLoading) return;
//     const id = setTimeout(() => step(1), AUTO_MS);
//     return () => clearTimeout(id);
//   }, [index, isLoading, step]);

//   // колесо мыши и клавиши
//   useEffect(() => {
//     if (isLoading) return;
//     const onWheel = (e) => {
//       if (Math.abs(e.deltaY) < 20) return;
//       step(e.deltaY > 0 ? 1 : -1);
//     };
//     const onKey = (e) => {
//       if (e.key === "ArrowDown" || e.key === "ArrowRight") step(1);
//       if (e.key === "ArrowUp" || e.key === "ArrowLeft") step(-1);
//     };
//     window.addEventListener("wheel", onWheel, { passive: true });
//     window.addEventListener("keydown", onKey);
//     return () => {
//       window.removeEventListener("wheel", onWheel);
//       window.removeEventListener("keydown", onKey);
//     };
//   }, [isLoading, step]);

//   // свайп на телефоне
//   const onTouchStart = (e) => (touchY.current = e.touches[0].clientY);
//   const onTouchEnd = (e) => {
//     if (touchY.current == null) return;
//     const dy = touchY.current - e.changedTouches[0].clientY;
//     touchY.current = null;
//     if (Math.abs(dy) > 50) step(dy > 0 ? 1 : -1);
//   };

//   const isLast = index === SLIDES.length - 1;

//   /*
//     Раскладка (одинаково на десктопе и мобиле):

//       ┌────────────────────────┐
//       │  сцена (flex-1)        │  ← слово лежит ЗА моделью (z-1),
//       │   слово  ← z-1         │    3D-канвас поверх (z-5)
//       │   модель ← z-5         │
//       ├────────────────────────┤
//       │  кнопка                │  ← отдельная полоса снизу (z-10):
//       │  ● ● ● ●               │    с моделями и танцорами не пересекается
//       └────────────────────────┘
//   */
//   return (
//     <>
//       {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}

//       {/* панель настройки эффектов: только с ?debug */}
//       <Leva hidden={!debug} collapsed />

//       {/* 100svh вместо h-screen: на телефонах не прыгает от адресной строки */}
//       <div
//         className="relative flex h-[100svh] w-full flex-col overflow-hidden"
//         style={{ touchAction: "none" }}
//         onTouchStart={onTouchStart}
//         onTouchEnd={onTouchEnd}
//       >
//         <picture>
//           {/* для телефонов и планшетов */}
//           <source srcSet="/project2.png" media="(max-width: 1024px)" />
//           {/* для десктопа */}
//           <img
//             src="/project.png"
//             alt="Project"
//             className="absolute top-0 left-0 w-full h-full object-cover"
//           />
//         </picture>

//         {/* ===== Сцена: слово + 3D-модель ===== */}
//         <div className="relative min-h-0 flex-1 md:absolute md:inset-0">
//           {/* Слово ЗА моделью. Модель полупрозрачная, поэтому буквы
//               просвечивают сквозь неё. На мобиле слово уходит наверх,
//               чтобы не спорить с моделью; на md+ стоит по центру. */}
//           <div className="pointer-events-none absolute inset-0 z-[1] flex items-start justify-center pt-[12%] md:items-center md:pt-0">
//             <motion.h1
//               key={index}
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0, x: [0, -8, 6, -3, 0] }}
//               transition={{ duration: 0.5, x: { duration: 0.4 } }}
//               className={`
//                 select-none
//                 whitespace-nowrap
//                 text-center
//                 font-futura
//                 tracking-[-0.04em]
//                 leading-none
//                 ${isLast ? "font-bold text-pink-300" : "font-medium text-white/50"}
//               `}
//               style={{ fontSize: "clamp(56px, 15vw, 220px)", padding: "0 20px" }}
//             >
//               {SLIDES[index].word}
//             </motion.h1>
//           </div>

//           {/* 3D-сцена поверх слова; клики проходят насквозь */}
//           {!isLoading && (
//             <div className="pointer-events-none absolute inset-0 z-[5]">
//               <Canvas
//                 camera={{ position: [0, 1.4, 4.2], fov: 35 }}
//                 dpr={[1, 1.75]}
//                 gl={{ alpha: true }}
//               >
//                 <Suspense fallback={null}>
//                   {look.style === "morph" ? (
//                     <MorphPoints
//                       models={MODELS}
//                       activeIndex={index}
//                       look={look}
//                       zoom={zoom}
//                       reduced={reduced}
//                       glitchRef={glitchRef}
//                     />
//                   ) : (
//                     <SkateparkStage
//                       models={MODELS}
//                       mode="swap"
//                       activeIndex={index}
//                       look={look}
//                       zoom={zoom}
//                       reduced={reduced}
//                       glitchRef={glitchRef}
//                     />
//                   )}

//                   {/* танцующие человечки только на слайде Events */}
//                   <Dancers
//                     visible={index === EVENTS_INDEX}
//                     url={DANCER_URL}
//                     look={look}
//                     reduced={reduced}
//                     {...DANCERS}
//                   />
//                 </Suspense>

//                 {/* хроматическая аберрация (ca = 0 → выключена) */}
//                 <Effects amount={look.ca} glitchRef={glitchRef} />
//               </Canvas>
//             </div>
//           )}
//         </div>

//         {/* ===== Низ: кнопка + индикаторы ===== */}
//         <div className="relative z-10 flex flex-col items-center gap-3 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:absolute md:inset-x-0 md:bottom-0 md:pb-8">
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-lg text-lg font-futura font-light shadow-lg hover:bg-pink-300 cursor-pointer"
//             onClick={() => navigate("/catalogue")}
//           >
//             explore
//           </motion.button>

//           {/* «сторис»: 4 полоски. Прошедшие залиты, текущая заполняется
//               за AUTO_MS (ровно до автосмены), остальные пустые. Клик → к слову. */}
//           <div className="flex w-[min(78vw,320px)] items-center gap-1.5">
//             {SLIDES.map((s, i) => (
//               <button
//                 key={s.word}
//                 aria-label={s.word}
//                 onClick={() => i !== index && change(i)}
//                 className="group flex-1 cursor-pointer py-2"
//               >
//                 <div className="h-[3px] overflow-hidden rounded-full bg-white/25 transition-colors group-hover:bg-white/40">
//                   {i < index && <div className="h-full w-full bg-white" />}
//                   {i === index && (
//                     <motion.div
//                       key={index}
//                       className="h-full w-full origin-left bg-white"
//                       initial={{ scaleX: 0 }}
//                       animate={{ scaleX: isLoading ? 0 : 1 }}
//                       transition={{ duration: reduced ? 0 : AUTO_MS / 1000, ease: "linear" }}
//                     />
//                   )}
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

const MODELS = SLIDES.map((s) => s.model);

// Танцующие человечки на слайде Events.
// Нужен FBX с mixamo.com (Format: FBX Binary, Skin: With Skin, лучше In Place).
// Загрузите файл в Cloudinary (как raw) и вставьте ссылку.
const EVENTS_INDEX = 2;
const DANCER_URL = "https://res.cloudinary.com/dbx6muxub/raw/upload/v1795021355/Hip_Hop_Dancing_1_flomq0.fbx";
const DANCERS = { count: 5, height: 0.7, spacing: 0.55, y: -0.95, z: 0.8 };

// грузим модели, пока висит LoadingScreen
preloadModels(MODELS);
useFBX.preload(DANCER_URL);

const AUTO_MS = 5000; // автосмена (переход длится ~2 с)
const LOCK_MS = 2200; // пауза после смены, чтобы анимация успела доиграть

// Значения по умолчанию (когда панель скрыта).
// Пресеты: hologram | wireframe | xray | neon | ink (ink — для светлого фона)
const DEFAULT_PRESET = "hologram";
const DEFAULT_STYLE = "mesh"; // 'mesh' (сетка) | 'morph' (точки, перетекают друг в друга)

// Во сколько раз модель больше на десктопе (ширина ≥ 768px). На мобиле всегда 1.
// 1.6 — модель почти во весь экран; 2+ — уже вылезает за края.
const DESKTOP_ZOOM = 1.6;

// Если что-то в 3D упало (не загрузился файл, нет WebGL), страница не белеет —
// просто не показывается этот кусок. Причина будет в консоли.
class Safe extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(e) {
    console.warn("[3D] не загрузилось:", e);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function MenuPage() {
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const navigate = useNavigate();

  const lockRef = useRef(0);
  const touchY = useRef(null);
  const glitchRef = useRef(0); // сила глитча → хроматическая аберрация

  // десктоп (как md: в Tailwind) — модель крупнее, сцена на весь экран
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setIsDesktop(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", on);
    else mq.addListener(on);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", on);
      else mq.removeListener(on);
    };
  }, []);
  const zoom = isDesktop ? DESKTOP_ZOOM : 1;

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const debug =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("debug");

  // панель настройки эффектов (скрыта без ?debug, но значения работают всегда)
  const [look, setLook] = useControls(() => ({
    preset: {
      value: DEFAULT_PRESET,
      options: Object.keys(LOOKS),
      onChange: (p, _path, ctx) => {
        if (!ctx.initial) setLook(LOOKS[p]);
      },
    },
    style: { value: DEFAULT_STYLE, options: ["mesh", "morph"] },
    color: LOOKS[DEFAULT_PRESET].color,
    color2: LOOKS[DEFAULT_PRESET].color2,
    blending: { value: LOOKS[DEFAULT_PRESET].blending, options: ["additive", "normal"] },
    fill: { value: LOOKS[DEFAULT_PRESET].fill, min: 0, max: 1 },
    lines: { value: LOOKS[DEFAULT_PRESET].lines, min: 0, max: 1 },
    fresnel: { value: LOOKS[DEFAULT_PRESET].fresnel, min: 0.5, max: 6 },
    scan: { value: LOOKS[DEFAULT_PRESET].scan, min: 0, max: 1 },
    edge: { value: LOOKS[DEFAULT_PRESET].edge, min: 0, max: 1.5 },
    ca: { value: LOOKS[DEFAULT_PRESET].ca, min: 0, max: 1 },
    dots: { value: LOOKS[DEFAULT_PRESET].dots, min: 0, max: 1 },
    point: { value: LOOKS[DEFAULT_PRESET].point, min: 0.5, max: 6 },
    scatter: { value: LOOKS[DEFAULT_PRESET].scatter, min: 0, max: 2 },
  }));

  // лоадер (как у вас было)
  useEffect(() => {
    const timer = setTimeout(() => setIsFadingOut(true), 1500);
    const removeLoadingScreen = setTimeout(() => setIsLoading(false), 2300);
    return () => {
      clearTimeout(timer);
      clearTimeout(removeLoadingScreen);
    };
  }, []);

  // смена слова/модели с защитой от слишком частых переключений
  const change = useCallback((next) => {
    const now = performance.now();
    if (now < lockRef.current) return;
    lockRef.current = now + LOCK_MS;
    setIndex(next);
  }, []);

  const step = useCallback(
    (dir) => change((index + dir + SLIDES.length) % SLIDES.length),
    [change, index]
  );

  // автосмена: таймер перезапускается после каждой смены
  useEffect(() => {
    if (isLoading) return;
    const id = setTimeout(() => step(1), AUTO_MS);
    return () => clearTimeout(id);
  }, [index, isLoading, step]);

  // колесо мыши и клавиши
  useEffect(() => {
    if (isLoading) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < 20) return;
      step(e.deltaY > 0 ? 1 : -1);
    };
    const onKey = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") step(1);
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [isLoading, step]);

  // свайп на телефоне
  const onTouchStart = (e) => (touchY.current = e.touches[0].clientY);
  const onTouchEnd = (e) => {
    if (touchY.current == null) return;
    const dy = touchY.current - e.changedTouches[0].clientY;
    touchY.current = null;
    if (Math.abs(dy) > 50) step(dy > 0 ? 1 : -1);
  };

  const isLast = index === SLIDES.length - 1;

  /*
    Раскладка (одинаково на десктопе и мобиле):

      ┌────────────────────────┐
      │  сцена (flex-1)        │  ← слово лежит ЗА моделью (z-1),
      │   слово  ← z-1         │    3D-канвас поверх (z-5)
      │   модель ← z-5         │
      ├────────────────────────┤
      │  кнопка                │  ← отдельная полоса снизу (z-10):
      │  ● ● ● ●               │    с моделями и танцорами не пересекается
      └────────────────────────┘
  */
  return (
    <>
      {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}

      {/* панель настройки эффектов: только с ?debug */}
      <Leva hidden={!debug} collapsed />

      {/* 100svh вместо h-screen: на телефонах не прыгает от адресной строки */}
      <div
        className="relative flex h-screen h-[100svh] w-full flex-col overflow-hidden"
        style={{ touchAction: "none" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <picture>
          {/* для телефонов и планшетов */}
          <source srcSet="/project2.png" media="(max-width: 1024px)" />
          {/* для десктопа */}
          <img
            src="/project.png"
            alt="Project"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </picture>

        {/* ===== Сцена: слово + 3D-модель ===== */}
        <div className="relative min-h-0 flex-1 md:absolute md:inset-0">
          {/* Слово ЗА моделью. Модель полупрозрачная, поэтому буквы
              просвечивают сквозь неё. На мобиле слово уходит наверх,
              чтобы не спорить с моделью; на md+ стоит по центру. */}
          <div className="pointer-events-none absolute inset-0 z-[1] flex items-start justify-center pt-[12%] md:items-center md:pt-0">
            <motion.h1
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, x: [0, -8, 6, -3, 0] }}
              transition={{ duration: 0.5, x: { duration: 0.4 } }}
              className={`
                select-none
                whitespace-nowrap
                text-center
                font-futura
                tracking-[-0.04em]
                leading-none
                ${isLast ? "font-bold text-pink-300" : "font-medium text-white/50"}
              `}
              style={{ fontSize: "clamp(56px, 15vw, 220px)", padding: "0 20px" }}
            >
              {SLIDES[index].word}
            </motion.h1>
          </div>

          {/* 3D-сцена поверх слова; клики проходят насквозь */}
          {!isLoading && (
            <div className="pointer-events-none absolute inset-0 z-[5]">
              <Safe>
              <Canvas
                camera={{ position: [0, 1.4, 4.2], fov: 35 }}
                dpr={[1, 1.75]}
                gl={{ alpha: true }}
              >
                <Suspense fallback={null}>
                  {look.style === "morph" ? (
                    <MorphPoints
                      models={MODELS}
                      activeIndex={index}
                      look={look}
                      zoom={zoom}
                      reduced={reduced}
                      glitchRef={glitchRef}
                    />
                  ) : (
                    <SkateparkStage
                      models={MODELS}
                      mode="swap"
                      activeIndex={index}
                      look={look}
                      zoom={zoom}
                      reduced={reduced}
                      glitchRef={glitchRef}
                    />
                  )}

                </Suspense>

                {/* танцующие человечки только на слайде Events.
                    Свой Suspense и Safe: если FBX грузится долго или не загрузился,
                    модели и текст всё равно показываются. */}
                <Safe>
                  <Suspense fallback={null}>
                    <Dancers
                      visible={index === EVENTS_INDEX}
                      url={DANCER_URL}
                      look={look}
                      reduced={reduced}
                      {...DANCERS}
                    />
                  </Suspense>
                </Safe>

                {/* хроматическая аберрация (ca = 0 → выключена) */}
                <Effects amount={isDesktop ? look.ca : 0} glitchRef={glitchRef} />
              </Canvas>
              </Safe>
            </div>
          )}
        </div>

        {/* ===== Низ: кнопка + индикаторы ===== */}
        <div className="relative z-10 flex flex-col items-center gap-3 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:absolute md:inset-x-0 md:bottom-0 md:pb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-lg text-lg font-futura font-light shadow-lg hover:bg-pink-300 cursor-pointer"
            onClick={() => navigate("/catalogue")}
          >
            explore
          </motion.button>

          {/* «сторис»: 4 полоски. Прошедшие залиты, текущая заполняется
              за AUTO_MS (ровно до автосмены), остальные пустые. Клик → к слову. */}
          <div className="flex w-[min(78vw,320px)] items-center gap-1.5">
            {SLIDES.map((s, i) => (
              <button
                key={s.word}
                aria-label={s.word}
                onClick={() => i !== index && change(i)}
                className="group flex-1 cursor-pointer py-2"
              >
                <div className="h-[3px] overflow-hidden rounded-full bg-white/25 transition-colors group-hover:bg-white/40">
                  {i < index && <div className="h-full w-full bg-white" />}
                  {i === index && (
                    <motion.div
                      key={index}
                      className="h-full w-full origin-left bg-white"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isLoading ? 0 : 1 }}
                      transition={{ duration: reduced ? 0 : AUTO_MS / 1000, ease: "linear" }}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


// import { useState, useEffect, useRef, useCallback, Suspense } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Canvas } from "@react-three/fiber";
// import LoadingScreen from "../LoadingScreen/LodingScreen";
// // поправте путь под вашу структуру папок
// import SkateparkStage, { preloadModels } from "../SkateparkStage/SkateparkStage";

/*
  Одно слово = одна модель. Единственный источник правды — index.
  Когда index меняется, текст анимируется, а модель стирается (глитч)
  и перерисовывается в модель, привязанную к новому слову.

  Переключать можно: колесом мыши, свайпом, стрелками, точками внизу,
  а если ничего не трогать — само раз в AUTO_MS.
*/
// import { useState, useEffect, useRef, useCallback, Suspense } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Canvas } from "@react-three/fiber";
// import { useGLTF } from "@react-three/drei";
// import { Leva, useControls } from "leva";
// import LoadingScreen from "../LoadingScreen/LodingScreen";
// import SkateparkStage, { preloadModels } from "../SkateparkStage/SkateparkStage";
// import MorphPoints from "../SkateparkStage/MorphPoints";
// import Dancers from "../SkateparkStage/Dancers";
// import Effects from "../SkateparkStage/Effects";
// import { LOOKS } from "../SkateparkStage/GlitchMaterial";

// /*
//   Одно слово = одна модель. Единственный источник правды — index.
//   Когда index меняется, текст анимируется, а модель стирается (глитч)
//   и перерисовывается в модель, привязанную к новому слову.

//   Переключать можно: колесом мыши, свайпом, стрелками, точками внизу,
//   а если ничего не трогать — само раз в AUTO_MS.

//   Настройка внешнего вида: откройте страницу с ?debug (например /?debug) —
//   появится панель с пресетами и ползунками. Понравившиеся значения
//   перенесите в DEFAULT_LOOK / DEFAULT_STYLE ниже.
// */

// const SLIDES = [
//   { word: "Skateparks", model: { url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1794991173/mini_pwew3g.glb", scale: 1.15 } },
//   { word: "Ramps",      model: { url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1795018424/quater1_jj9ndf.glb",      scale: 1.0 } },
//   { word: "Events",     model: { url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1793542923/sp1_f0qnhd.glb",    scale: 1.1 } },
//   { word: "Parkramps",  model: { url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1793542923/sp1_f0qnhd.glb",  scale: 1.0 } },
// ];
// const MODELS = SLIDES.map((s) => s.model);

// // Танцующие человечки на слайде Events.
// // Нужен GLB со скелетом и анимацией танца (Michelle.glb из примеров three.js
// // или танец с mixamo.com). Загрузите в Cloudinary и вставьте ссылку.
// const EVENTS_INDEX = 2;
// const DANCER_URL = "https://res.cloudinary.com/dbx6muxub/image/upload/ВАШ_ФАЙЛ/Michelle.glb";
// const DANCERS = { count: 5, height: 0.7, spacing: 0.55, y: -0.95, z: 0.8 };

// // грузим модели, пока висит LoadingScreen
// preloadModels(MODELS);
// useGLTF.preload(DANCER_URL);

// const AUTO_MS = 5000; // автосмена (переход длится ~2 с)
// const LOCK_MS = 2200; // пауза после смены, чтобы анимация успела доиграть

// // Значения по умолчанию (когда панель скрыта).
// // Пресеты: hologram | wireframe | xray | neon | ink (ink — для светлого фона)
// const DEFAULT_PRESET = "hologram";
// const DEFAULT_STYLE = "mesh"; // 'mesh' (сетка) | 'morph' (точки, перетекают друг в друга)

// export default function MenuPage() {
//   const [index, setIndex] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isFadingOut, setIsFadingOut] = useState(false);
//   const navigate = useNavigate();

//   const lockRef = useRef(0);
//   const touchY = useRef(null);
//   const glitchRef = useRef(0); // сила глитча → хроматическая аберрация

//   const reduced =
//     typeof window !== "undefined" &&
//     window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//   const debug =
//     typeof window !== "undefined" &&
//     new URLSearchParams(window.location.search).has("debug");

//   // панель настройки эффектов (скрыта без ?debug, но значения работают всегда)
//   const [look, setLook] = useControls(() => ({
//     preset: {
//       value: DEFAULT_PRESET,
//       options: Object.keys(LOOKS),
//       onChange: (p, _path, ctx) => {
//         if (!ctx.initial) setLook(LOOKS[p]);
//       },
//     },
//     style: { value: DEFAULT_STYLE, options: ["mesh", "morph"] },
//     color: LOOKS[DEFAULT_PRESET].color,
//     color2: LOOKS[DEFAULT_PRESET].color2,
//     blending: { value: LOOKS[DEFAULT_PRESET].blending, options: ["additive", "normal"] },
//     fill: { value: LOOKS[DEFAULT_PRESET].fill, min: 0, max: 1 },
//     lines: { value: LOOKS[DEFAULT_PRESET].lines, min: 0, max: 1 },
//     fresnel: { value: LOOKS[DEFAULT_PRESET].fresnel, min: 0.5, max: 6 },
//     scan: { value: LOOKS[DEFAULT_PRESET].scan, min: 0, max: 1 },
//     edge: { value: LOOKS[DEFAULT_PRESET].edge, min: 0, max: 1.5 },
//     ca: { value: LOOKS[DEFAULT_PRESET].ca, min: 0, max: 1 },
//     dots: { value: LOOKS[DEFAULT_PRESET].dots, min: 0, max: 1 },
//     point: { value: LOOKS[DEFAULT_PRESET].point, min: 0.5, max: 6 },
//     scatter: { value: LOOKS[DEFAULT_PRESET].scatter, min: 0, max: 2 },
//   }));

//   // лоадер (как у вас было)
//   useEffect(() => {
//     const timer = setTimeout(() => setIsFadingOut(true), 1500);
//     const removeLoadingScreen = setTimeout(() => setIsLoading(false), 2300);
//     return () => {
//       clearTimeout(timer);
//       clearTimeout(removeLoadingScreen);
//     };
//   }, []);

//   // смена слова/модели с защитой от слишком частых переключений
//   const change = useCallback((next) => {
//     const now = performance.now();
//     if (now < lockRef.current) return;
//     lockRef.current = now + LOCK_MS;
//     setIndex(next);
//   }, []);

//   const step = useCallback(
//     (dir) => change((index + dir + SLIDES.length) % SLIDES.length),
//     [change, index]
//   );

//   // автосмена: таймер перезапускается после каждой смены
//   useEffect(() => {
//     if (isLoading) return;
//     const id = setTimeout(() => step(1), AUTO_MS);
//     return () => clearTimeout(id);
//   }, [index, isLoading, step]);

//   // колесо мыши и клавиши
//   useEffect(() => {
//     if (isLoading) return;
//     const onWheel = (e) => {
//       if (Math.abs(e.deltaY) < 20) return;
//       step(e.deltaY > 0 ? 1 : -1);
//     };
//     const onKey = (e) => {
//       if (e.key === "ArrowDown" || e.key === "ArrowRight") step(1);
//       if (e.key === "ArrowUp" || e.key === "ArrowLeft") step(-1);
//     };
//     window.addEventListener("wheel", onWheel, { passive: true });
//     window.addEventListener("keydown", onKey);
//     return () => {
//       window.removeEventListener("wheel", onWheel);
//       window.removeEventListener("keydown", onKey);
//     };
//   }, [isLoading, step]);

//   // свайп на телефоне
//   const onTouchStart = (e) => (touchY.current = e.touches[0].clientY);
//   const onTouchEnd = (e) => {
//     if (touchY.current == null) return;
//     const dy = touchY.current - e.changedTouches[0].clientY;
//     touchY.current = null;
//     if (Math.abs(dy) > 50) step(dy > 0 ? 1 : -1);
//   };

//   const isLast = index === SLIDES.length - 1;

//   return (
//     <>
//       {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}

//       {/* панель настройки эффектов: только с ?debug */}
//       <Leva hidden={!debug} collapsed />

//       <div
//         className="relative w-full h-screen flex items-center justify-center overflow-hidden"
//         style={{ touchAction: "none" }}
//         onTouchStart={onTouchStart}
//         onTouchEnd={onTouchEnd}
//       >
//         <picture>
//           {/* для телефонов и планшетов */}
//           <source srcSet="/project2.png" media="(max-width: 1024px)" />
//           {/* для десктопа */}
//           <img
//             src="/project.png"
//             alt="Project"
//             className="absolute top-0 left-0 w-full h-full object-cover"
//           />
//         </picture>

//         {/* 3D-сцена между фоном и текстом; клики проходят насквозь */}
//         {!isLoading && (
//           <div className="absolute inset-0 z-[5] pointer-events-none">
//             <Canvas
//               camera={{ position: [0, 1.4, 4.2], fov: 35 }}
//               dpr={[1, 1.75]}
//               gl={{ alpha: true }}
//             >
//               <Suspense fallback={null}>
//                 {look.style === "morph" ? (
//                   <MorphPoints
//                     models={MODELS}
//                     activeIndex={index}
//                     look={look}
//                     reduced={reduced}
//                     glitchRef={glitchRef}
//                   />
//                 ) : (
//                   <SkateparkStage
//                     models={MODELS}
//                     mode="swap"
//                     activeIndex={index}
//                     look={look}
//                     reduced={reduced}
//                     glitchRef={glitchRef}
//                   />
//                 )}

//                 {/* танцующие человечки только на слайде Events */}
//                 <Dancers
//                   visible={index === EVENTS_INDEX}
//                   url={DANCER_URL}
//                   look={look}
//                   reduced={reduced}
//                   {...DANCERS}
//                 />
//               </Suspense>

//               {/* хроматическая аберрация (ca = 0 → выключена) */}
//               <Effects amount={look.ca} glitchRef={glitchRef} />
//             </Canvas>
//           </div>
//         )}

//         {/* Анимированный текст */}
//         <div className="relative z-10 flex flex-col items-center overflow-visible">
//           <motion.h1
//             key={index}
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0, x: [0, -8, 6, -3, 0] }}
//             transition={{ duration: 0.5, x: { duration: 0.4 } }}
//             className={`
//               text-center
//               break-words
//               whitespace-normal
//               font-futura
//               tracking-[-5px]
//               mb-6
//               overflow-hidden
//               bg-clip-text
//               ${isLast
//                 ? "font-bold text-transparent bg-pink-300"
//                 : "font-medium text-transparent bg-white/50"}
//             `}
//             style={{ fontSize: "clamp(60px, 10vw, 150px)", padding: "0 20px" }}
//           >
//             {SLIDES[index].word}
//           </motion.h1>

//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-lg text-lg font-futura font-light shadow-lg hover:bg-pink-300 cursor-pointer"
//             onClick={() => navigate("/catalogue")}
//           >
//             explore
//           </motion.button>
//         </div>

//         {/* точки-индикаторы: можно кликнуть и перейти к нужному слову */}
//         <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 font-futura text-xs text-white/60">
//           <span>{String(index + 1).padStart(2, "0")}</span>
//           {SLIDES.map((s, i) => (
//             <button
//               key={s.word}
//               aria-label={s.word}
//               onClick={() => change(i)}
//               className={`h-2 w-2 rounded-full transition-all ${
//                 i === index ? "scale-125 bg-white" : "bg-white/30 hover:bg-white/60"
//               }`}
//             />
//           ))}
//           <span>{String(SLIDES.length).padStart(2, "0")}</span>
//         </div>
//       </div>
//     </>
//   );
// }

// const SLIDES = [
//   { word: "Skateparks", model: { url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1793542923/sp1_f0qnhd.glb", scale: 1.15 } },
//   { word: "Ramps",      model: { url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1794991173/mini_pwew3g.glb",      scale: 1.0 } },
//   { word: "Events",     model: { url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1786869663/logo_alatkf.glb",    scale: 1.1 } },
//   { word: "Parkramps",  model: { url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1786811336/model_eteyx8.glb",  scale: 1.0 } },
// ];
// const MODELS = SLIDES.map((s) => s.model);

// // грузим модели, пока висит LoadingScreen
// preloadModels(MODELS);

// const AUTO_MS = 5000; // автосмена (переход длится ~2 с, поэтому не 2000 как раньше)
// const LOCK_MS = 2200; // пауза после смены, чтобы анимация успела доиграть

// // Фон страницы тёмный → 'additive'. Если картинка светлая:
// // поставьте MODEL_BLEND = "normal" и MODEL_COLOR = "#111111".
// const MODEL_BLEND = "additive";
// const MODEL_COLOR = "#e5e5e5";

// export default function MenuPage() {
//   const [index, setIndex] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isFadingOut, setIsFadingOut] = useState(false);
//   const navigate = useNavigate();

//   const lockRef = useRef(0);
//   const touchY = useRef(null);

//   const reduced =
//     typeof window !== "undefined" &&
//     window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//   // лоадер (как у вас было)
//   useEffect(() => {
//     const timer = setTimeout(() => setIsFadingOut(true), 1500);
//     const removeLoadingScreen = setTimeout(() => setIsLoading(false), 2300);
//     return () => {
//       clearTimeout(timer);
//       clearTimeout(removeLoadingScreen);
//     };
//   }, []);

//   // смена слова/модели с защитой от слишком частых переключений
//   const change = useCallback((next) => {
//     const now = performance.now();
//     if (now < lockRef.current) return;
//     lockRef.current = now + LOCK_MS;
//     setIndex(next);
//   }, []);

//   const step = useCallback(
//     (dir) => change((index + dir + SLIDES.length) % SLIDES.length),
//     [change, index]
//   );

//   // автосмена: таймер перезапускается после каждой смены
//   useEffect(() => {
//     if (isLoading) return;
//     const id = setTimeout(() => step(1), AUTO_MS);
//     return () => clearTimeout(id);
//   }, [index, isLoading, step]);

//   // колесо мыши и клавиши
//   useEffect(() => {
//     if (isLoading) return;
//     const onWheel = (e) => {
//       if (Math.abs(e.deltaY) < 20) return;
//       step(e.deltaY > 0 ? 1 : -1);
//     };
//     const onKey = (e) => {
//       if (e.key === "ArrowDown" || e.key === "ArrowRight") step(1);
//       if (e.key === "ArrowUp" || e.key === "ArrowLeft") step(-1);
//     };
//     window.addEventListener("wheel", onWheel, { passive: true });
//     window.addEventListener("keydown", onKey);
//     return () => {
//       window.removeEventListener("wheel", onWheel);
//       window.removeEventListener("keydown", onKey);
//     };
//   }, [isLoading, step]);

//   // свайп на телефоне
//   const onTouchStart = (e) => (touchY.current = e.touches[0].clientY);
//   const onTouchEnd = (e) => {
//     if (touchY.current == null) return;
//     const dy = touchY.current - e.changedTouches[0].clientY;
//     touchY.current = null;
//     if (Math.abs(dy) > 50) step(dy > 0 ? 1 : -1);
//   };

//   const isLast = index === SLIDES.length - 1;

//   return (
//     <>
//       {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}

//       <div
//         className="relative w-full h-screen flex items-center justify-center overflow-hidden"
//         style={{ touchAction: "none" }}
//         onTouchStart={onTouchStart}
//         onTouchEnd={onTouchEnd}
//       >
//         <picture>
//           {/* для телефонов и планшетов */}
//           <source srcSet="/project2.png" media="(max-width: 1024px)" />
//           {/* для десктопа */}
//           <img
//             src="/project.png"
//             alt="Project"
//             className="absolute top-0 left-0 w-full h-full object-cover"
//           />
//         </picture>

//         {/* 3D-модель между фоном и текстом; клики проходят насквозь */}
//         {!isLoading && (
//           <div className="absolute inset-0 z-[5] pointer-events-none">
//             <Canvas
//               camera={{ position: [0, 1.4, 4.2], fov: 35 }}
//               dpr={[1, 1.75]}
//             >
//               <Suspense fallback={null}>
//                 <SkateparkStage
//                   models={MODELS}
//                   mode="swap"
//                   activeIndex={index}
//                   blending={MODEL_BLEND}
//                   color={MODEL_COLOR}
//                   reduced={reduced}
//                 />
//               </Suspense>
//             </Canvas>
//           </div>
//         )}

//         {/* Анимированный текст */}
//         <div className="relative z-10 flex flex-col items-center overflow-visible">
//           <motion.h1
//             key={index}
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0, x: [0, -8, 6, -3, 0] }}
//             transition={{ duration: 0.5, x: { duration: 0.4 } }}
//             className={`
//               text-center
//               break-words
//               whitespace-normal
//               font-futura
//               tracking-[-5px]
//               mb-6
//               overflow-hidden
//               bg-clip-text
//               ${isLast
//                 ? "font-bold text-transparent bg-pink-300"
//                 : "font-medium text-transparent bg-white/50"}
//             `}
//             style={{ fontSize: "clamp(60px, 10vw, 150px)", padding: "0 20px" }}
//           >
//             {SLIDES[index].word}
//           </motion.h1>

//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-lg text-lg font-futura font-light shadow-lg hover:bg-pink-300 cursor-pointer"
//             onClick={() => navigate("/catalogue")}
//           >
//             explore
//           </motion.button>
//         </div>

//         {/* точки-индикаторы: можно кликнуть и перейти к нужному слову */}
//         <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 font-futura text-xs text-white/60">
//           <span>{String(index + 1).padStart(2, "0")}</span>
//           {SLIDES.map((s, i) => (
//             <button
//               key={s.word}
//               aria-label={s.word}
//               onClick={() => change(i)}
//               className={`h-2 w-2 rounded-full transition-all ${
//                 i === index ? "scale-125 bg-white" : "bg-white/30 hover:bg-white/60"
//               }`}
//             />
//           ))}
//           <span>{String(SLIDES.length).padStart(2, "0")}</span>
//         </div>
//       </div>
//     </>
//   );
// }
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import LoadingScreen from "../LoadingScreen/LodingScreen";
// import ModelBackground from "../ModelBackground"; // <-- новый компонент

// const words = ["Skateparks", "Ramps", "Events", "Parkramps"];

// // по одной .glb модели на каждое слово (лежат в public/models/)
// const models = [
//   "https://res.cloudinary.com/dbx6muxub/image/upload/v1793542923/sp1_f0qnhd.glb",
//   "/models/ramp.glb",
//   "/models/events.glb",
//   "/models/parkramp.glb",
// ];

// // цвет частиц для каждого слова (последнее — розовый, как у текста)
// const colors = ["#111111", "#111111", "#111111", "#f9a8d4"];

// export default function MenuPage() {
//   const [index, setIndex] = useState(0);
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(true);
//   const [isFadingOut, setIsFadingOut] = useState(false);
//   const [modelsReady, setModelsReady] = useState(false);

//   // смена слова
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % words.length);
//     }, 3000); // чуть больше, чтобы анимация (1.8с) успевала проиграться
//     return () => clearInterval(interval);
//   }, []);

//   // лоадер: держим, пока не загрузятся модели (минимум 1.5с)
//   useEffect(() => {
//     if (!modelsReady) return;
//     const timer = setTimeout(() => setIsFadingOut(true), 1500);
//     const removeLoadingScreen = setTimeout(() => setIsLoading(false), 2300);
//     return () => {
//       clearTimeout(timer);
//       clearTimeout(removeLoadingScreen);
//     };
//   }, [modelsReady]);

//   return (
//     <>
//       {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}

//       <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
//         {/* 3D-фон: index связывает смену слова со сменой модели */}
//         <ModelBackground
//           index={index}
//           models={models}
//           colors={colors}
//           onReady={() => setModelsReady(true)}
//         />

//         {/* Анимированный текст */}
//         <div className="relative z-10 flex flex-col items-center overflow-visible">
//           <motion.h1
//             key={index}
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//             transition={{ duration: 0.5 }}
//             className={`
//               text-center break-words whitespace-normal font-futura
//               tracking-[-5px] mb-6 cursor-pointer overflow-hidden bg-clip-text
//               ${
//                 index === words.length - 1
//                   ? "font-bold text-transparent bg-pink-300"
//                   : "font-medium text-transparent bg-white/50"
//               }
//             `}
//             style={{
//               fontSize: "clamp(60px, 10vw, 150px)",
//               padding: "0 20px",
//             }}
//           >
//             {words[index]}
//           </motion.h1>

//           {/* Кнопка перехода */}
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-lg text-lg font-futura font-light shadow-lg hover:bg-pink-300 cursor-pointer"
//             onClick={() => navigate("/catalogue")}
//           >
//             explore
//           </motion.button>
//         </div>
//       </div>
//     </>
//   );
// }

//  import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import Hero3D from "../Hero3D";
// import LoadingScreen from "../LoadingScreen/LodingScreen";
// import "./MenuPage.css";

// const TEXT_DURATION_MS = 3000;
// const EXIT_ANIM_MS = 500; // длительность анимации исчезновения текста/кнопки

// const categories = ["Skateparks", "Ramps", "Events", "Parkramps"];

// const background = {
//   type: "image",
//   url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1789665160/photo_2026-09-17_20-12-09_fqn0r2.jpg",
// };

// const heroModelUrl =
//   "https://res.cloudinary.com/dbx6muxub/image/upload/v1786811336/model_eteyx8.glb";

// const logoModelUrl = "/model.glb"; // тот же файл, что в LoadingScreen/LogoModel

// export default function MenuPage() {
//   const [index, setIndex] = useState(0);
//   const navigate = useNavigate();

//   const [isLoading, setIsLoading] = useState(true);
//   const [isFadingOut, setIsFadingOut] = useState(false);

//   // НОВОЕ: состояние перехода на страницу каталога
//   const [isExploring, setIsExploring] = useState(false);
//   const [activeModelUrl, setActiveModelUrl] = useState(heroModelUrl);

//   const currentCategory = categories[index];

//   useEffect(() => {
//     if (isExploring) return; // не крутим категории во время перехода
//     const timer = setInterval(() => {
//       setIndex((prev) => (prev + 1) % categories.length);
//     }, TEXT_DURATION_MS);
//     return () => clearInterval(timer);
//   }, [isExploring]);

//   useEffect(() => {
//     const fadeTimer = setTimeout(() => setIsFadingOut(true), 1500);
//     const removeTimer = setTimeout(() => setIsLoading(false), 2300);
//     return () => {
//       clearTimeout(fadeTimer);
//       clearTimeout(removeTimer);
//     };
//   }, []);

//   const handleExplore = () => {
//     if (isExploring) return;

//     setIsExploring(true);           // скрывает текст и кнопку
//     setActiveModelUrl(logoModelUrl); // переключаем модель на логотип

//     // ждём, пока доиграет анимация исчезновения, и уходим на каталог
//     setTimeout(() => {
//       navigate("/catalogue");
//     }, EXIT_ANIM_MS + 400);
//   };

//   return (
//     <>
//       {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}

//       <div className="hero3d relative w-full h-screen flex items-center justify-center overflow-hidden">
//         {background.type === "image" && (
//           <img
//             src={background.url}
//             alt="Background"
//             className="absolute top-0 left-0 w-full h-full object-cover z-[2]"
//           />
//         )}

//         <Hero3D
//           modelUrl={activeModelUrl}
//           media={background}
//           restRotationY={isExploring ? 0 : (72 * Math.PI) / 180}
//         />

//         <AnimatePresence>
//           {!isExploring && (
//             <motion.div
//               key="menu-content"
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: EXIT_ANIM_MS / 1000, ease: "easeInOut" }}
//               className="relative z-10 flex flex-col items-center overflow-visible"
//             >
//               <AnimatePresence mode="wait">
//                 <motion.h1
//                   key={currentCategory}
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 20 }}
//                   transition={{ duration: 0.4, ease: "easeInOut" }}
//                   className="text-center break-words whitespace-normal font-futura tracking-[-5px] mb-6 cursor-pointer overflow-hidden bg-clip-text font-medium text-transparent bg-white/50"
//                   style={{ fontSize: "clamp(60px, 10vw, 150px)", padding: "0 20px" }}
//                 >
//                   {currentCategory}
//                 </motion.h1>
//               </AnimatePresence>

//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-lg text-lg font-futura font-light shadow-lg hover:bg-pink-300 cursor-pointer"
//                 onClick={handleExplore}
//               >
//                 explore
//               </motion.button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import Hero3D from "../Hero3D";
// import LoadingScreen from "../LoadingScreen/LodingScreen";
// import "./MenuPage.css";

// const TEXT_DURATION_MS = 3000;

// // Только категории — они меняются быстро
// const categories = [
//   "Skateparks",
//   "Ramps",
//   "Events",
//   "Parkramps",
// ];

// // Один постоянный фон
// const background = {
//   type: "image",
//   url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1780427037/project_nkkaef.png",
// };

// const modelUrl =
//   "https://res.cloudinary.com/dbx6muxub/image/upload/v1786811336/model_eteyx8.glb";

// export default function MenuPage() {
//   const [index, setIndex] = useState(0);
//   const [mediaLoaded, setMediaLoaded] = useState(false);

//   const navigate = useNavigate();

//   const [isLoading, setIsLoading] = useState(true);
//   const [isFadingOut, setIsFadingOut] = useState(false);

//   const currentCategory = categories[index];

//   // Быстрая смена текста
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setIndex((prev) => (prev + 1) % categories.length);
//     }, TEXT_DURATION_MS);

//     return () => clearInterval(timer);
//   }, []);

//   // Loading screen
//   useEffect(() => {
//     const fadeTimer = setTimeout(() => {
//       setIsFadingOut(true);
//     }, 1500);

//     const removeTimer = setTimeout(() => {
//       setIsLoading(false);
//     }, 2300);

//     return () => {
//       clearTimeout(fadeTimer);
//       clearTimeout(removeTimer);
//     };
//   }, []);

//   return (
//     <>
//       {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}

//       <div className="hero3d relative w-full h-screen flex items-center justify-center overflow-hidden">

//         {/* ОДИН ПОСТОЯННЫЙ ФОН */}
//         {background.type === "image" && (
//           <img
//             src={background.url}
//             alt="Background"
//             onLoad={() => setMediaLoaded(true)}
//             className="absolute top-0 left-0 w-full h-full object-cover z-[2]"
//           />
//         )}

//         {background.type === "video" && (
//           <video
//             src={background.url}
//             autoPlay
//             muted
//             loop
//             playsInline
//             onLoadedData={() => setMediaLoaded(true)}
//             className="absolute top-0 left-0 w-full h-full object-cover z-[2]"
//           />
//         )}

//         {/* 3D MODEL */}
//         <Hero3D
//           modelUrl={modelUrl}
//           media={background}
//           // restRotationY={Math.PI / 4}
//           restRotationY={(65 * Math.PI) / 180}
//         />

//         {/* CATEGORY */}
//         <div className="relative z-10 flex flex-col items-center overflow-visible">

//           <AnimatePresence mode="wait">
//             <motion.h1
//               key={currentCategory}
//               initial={{
//                 opacity: 0,
//                 y: -20,
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//               }}
//               exit={{
//                 opacity: 0,
//                 y: 20,
//               }}
//               transition={{
//                 duration: 0.4,
//                 ease: "easeInOut",
//               }}
//               className="
//                 text-center
//                 break-words
//                 whitespace-normal
//                 font-futura
//                 tracking-[-5px]
//                 mb-6
//                 cursor-pointer
//                 overflow-hidden
//                 bg-clip-text
//                 font-medium
//                 text-transparent
//                 bg-white/50
//               "
//               style={{
//                 fontSize: "clamp(60px, 10vw, 150px)",
//                 padding: "0 20px",
//               }}
//             >
//               {currentCategory}
//             </motion.h1>
//           </AnimatePresence>

//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             className="
//               px-6
//               py-3
//               bg-white/20
//               backdrop-blur-md
//               rounded-lg
//               text-lg
//               font-futura
//               font-light
//               shadow-lg
//               hover:bg-pink-300
//               cursor-pointer
//             "
//             onClick={() => navigate("/catalogue")}
//           >
//             explore
//           </motion.button>

//         </div>
//       </div>
//     </>
//   );
// }
