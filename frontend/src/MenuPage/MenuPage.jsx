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

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Hero3D from "../Hero3D";
import LoadingScreen from "../LoadingScreen/LodingScreen";
import "./MenuPage.css";

const TEXT_DURATION_MS = 3000;
const EXIT_ANIM_MS = 500; // длительность анимации исчезновения текста/кнопки

const categories = ["Skateparks", "Ramps", "Events", "Parkramps"];

const background = {
  type: "image",
  url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1780427037/project_nkkaef.png",
};

const heroModelUrl =
  "https://res.cloudinary.com/dbx6muxub/image/upload/v1786811336/model_eteyx8.glb";

const logoModelUrl = "/model.glb"; // тот же файл, что в LoadingScreen/LogoModel

// Размер геройской модели в состоянии меню и размер, до которого она
// должна СЖАТЬСЯ, превращаясь в "логотип" — подберите под визуал вашей
// LogoModel (scale 0.01 там — но это в других единицах three-fiber,
// тут ориентируйтесь на итоговый размер на экране).
const HERO_SIZE = 4.5;
const LOGO_SIZE = 0.9;

export default function MenuPage() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // состояние перехода на страницу каталога
  const [isExploring, setIsExploring] = useState(false);
  const [activeModelUrl, setActiveModelUrl] = useState(heroModelUrl);
  const [activeModelSize, setActiveModelSize] = useState(HERO_SIZE);

  const currentCategory = categories[index];

  useEffect(() => {
    if (isExploring) return; // не крутим категории во время перехода
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % categories.length);
    }, TEXT_DURATION_MS);
    return () => clearInterval(timer);
  }, [isExploring]);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFadingOut(true), 1500);
    const removeTimer = setTimeout(() => setIsLoading(false), 2300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const handleExplore = () => {
    if (isExploring) return;

    setIsExploring(true); // скрывает текст и кнопку

    // ключевой момент: меняем модель И её целевой размер ОДНОВРЕМЕННО —
    // Hero3D внутри одного и того же кроссфейда и подменит геометрию
    // на logoModelUrl, и уменьшит её до LOGO_SIZE. Никакого пересоздания
    // канваса, поэтому это выглядит как непрерывное "сжатие" модели,
    // а не как исчезновение одной и появление другой.
    setActiveModelUrl(logoModelUrl);
    setActiveModelSize(LOGO_SIZE);

    // ждём, пока доиграет анимация исчезновения текста/кнопки и сам
    // 3D-переход (transitionDuration в Hero3D по умолчанию 0.9с),
    // и уходим на каталог
    setTimeout(() => {
      navigate("/catalogue");
    }, EXIT_ANIM_MS + 400);
  };

  return (
    <>
      {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}

      <div className="hero3d relative w-full h-screen flex items-center justify-center overflow-hidden">
        {background.type === "image" && (
          <img
            src={background.url}
            alt="Background"
            className="absolute top-0 left-0 w-full h-full object-cover z-[2]"
          />
        )}

        <Hero3D
          modelUrl={activeModelUrl}
          media={background}
          modelSize={activeModelSize}
          restRotationY={isExploring ? 0 : (72 * Math.PI) / 180}
          grayscale={isExploring}
        />

        <AnimatePresence>
          {!isExploring && (
            <motion.div
              key="menu-content"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: EXIT_ANIM_MS / 1000, ease: "easeInOut" }}
              className="relative z-10 flex flex-col items-center overflow-visible"
            >
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentCategory}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className={`text-center break-words whitespace-normal font-futura tracking-[-5px] mb-6 cursor-pointer overflow-hidden bg-clip-text text-transparent ${
                    currentCategory === "Parkramps"
                      ? "font-bold bg-pink-400"
                      : "font-medium bg-white/50"
                  }`}
                  style={{ fontSize: "clamp(60px, 10vw, 150px)", padding: "0 20px" }}
                >
                  {currentCategory}
                </motion.h1>
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-lg text-lg font-futura font-light shadow-lg hover:bg-pink-300 cursor-pointer"
                onClick={handleExplore}
              >
                explore
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
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
//   url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1780427037/project_nkkaef.png",
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
