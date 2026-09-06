


import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Hero3D from "../Hero3D";
import CategoryRoulette from "../Categoryroulette";
import LoadingScreen from "../LoadingScreen/LodingScreen";
import "./MenuPage.css";

const words = ["Skateparks", "Ramps", "Events", "Parkramps"];

const IMAGE_DURATION_MS = 30000;

// ИЗМЕНЕНО: длительность кроссфейда между медиа. Пока новое медиа
// не загрузилось — старое остаётся видимым на 100%, поэтому
// "рывка"/пустого кадра не будет, даже если фото грузится долго.
const CROSSFADE_DURATION = 0.7;
const mediaByWord = [
  {
    type: "video",
    url:
      "https://res.cloudinary.com/dbx6muxub/video/upload/v1785513025/video_2026-07-31_18-49-25_ehskzk.mp4",
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1784562318/DSC02879_e4exjb.webp",
  },
  {
    type: "video",
    url:
      "https://res.cloudinary.com/dbx6muxub/video/upload/v1754506398/20220206_214037_qbp9jd.mp4",
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1780427037/project_nkkaef.png",
  },
];


export default function MenuPage() {
  const [index, setIndex] = useState(0);

  // ИЗМЕНЕНО: флаг "текущее медиа реально загружено". Пока false —
  // новый слой держим на opacity 0, старый слой остаётся видимым.
  const [mediaLoaded, setMediaLoaded] = useState(false);

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const tooltipRef = useRef(null);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const videoRef = useRef(null);

  const currentMedia = mediaByWord[index];

  // =========================================================
  // СБРОС ФЛАГА ЗАГРУЗКИ ПРИ СМЕНЕ КАТЕГОРИИ
  // =========================================================

  useEffect(() => {
    setMediaLoaded(false);
  }, [index]);

  // =========================================================
  // ПРЕЛОАД СЛЕДУЮЩЕЙ КАТЕГОРИИ ЗАРАНЕЕ
  //
  // ДОБАВЛЕНО: пока показывается текущая категория, в фоне
  // начинаем грузить фото/видео следующей — к моменту реального
  // переключения оно, скорее всего, уже будет в кэше браузера,
  // и кроссфейд пройдёт без задержки.
  // =========================================================

  useEffect(() => {
    const nextIndex = (index + 1) % words.length;
    const nextMedia = mediaByWord[nextIndex];

    if (!nextMedia) return;

    if (nextMedia.type === "image") {
      const preloadImg = new Image();
      preloadImg.src = nextMedia.url;
    } else if (nextMedia.type === "video") {
      const preloadVideo = document.createElement("video");
      preloadVideo.preload = "auto";
      preloadVideo.muted = true;
      preloadVideo.src = nextMedia.url;
      // просто инициируем загрузку, в DOM не вставляем и не играем
      preloadVideo.load();
    }
  }, [index]);

  // =========================================================
  // ПЕРЕКЛЮЧЕНИЕ КАТЕГОРИИ ВРУЧНУЮ (рулетка)
  // =========================================================

  const handleSelectCategory = (i) => {
    setIndex(i);
  };

  const handleStepCategory = (direction) => {
    setIndex((prev) => {
      const next = (prev + direction) % words.length;
      return next < 0 ? next + words.length : next;
    });
  };

  // =========================================================
  // АВТОМАТИЧЕСКАЯ СМЕНА КАТЕГОРИИ
  // видео — по 'ended', фото — через IMAGE_DURATION_MS
  // =========================================================

  useEffect(() => {
    const goNext = () => handleStepCategory(1);

    if (currentMedia.type === "video") {
      const videoEl = videoRef.current;

      if (!videoEl) return;

      videoEl.addEventListener("ended", goNext);

      return () => {
        videoEl.removeEventListener("ended", goNext);
      };
    }

    const timer = setTimeout(goNext, IMAGE_DURATION_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, currentMedia.type]);

  // =========================================================
  // TOOLTIP
  // =========================================================

  const handleMouseMove = (e) => {
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({
      visible: false,
      x: 0,
      y: 0,
    });
  };

  // =========================================================
  // LOADING
  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => setIsFadingOut(true), 1500);

    const removeLoadingScreen = setTimeout(
      () => setIsLoading(false),
      2300
    );

    return () => {
      clearTimeout(timer);
      clearTimeout(removeLoadingScreen);
    };
  }, []);

  // =========================================================
  // ASSETS
  // =========================================================

  const modelUrl =
    "https://res.cloudinary.com/dbx6muxub/image/upload/v1786811336/model_eteyx8.glb";

  return (
    <>
      {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}

      <div
        className="
          hero3d
          relative
          w-full
          h-screen
          flex
          items-center
          justify-center
          overflow-hidden
        "
      >
        {/* ===================================================
            ФОН КАТЕГОРИИ: ВИДЕО ИЛИ ФОТО, С КРОССФЕЙДОМ
            ===================================================

            ИЗМЕНЕНО: раньше при смене key старый слой мгновенно
            размонтировался, а новый сразу показывался (даже если
            фото ещё не успело загрузиться — был "рывок"/пустой
            кадр). Теперь:
              - AnimatePresence держит старый слой видимым, пока
                играет его exit-анимация (плавно гаснет);
              - новый слой стартует с opacity 0 и получает
                opacity 1 только после onLoad/onLoadedData —
                то есть кроссфейд начинается ровно в момент,
                когда медиа реально готово показываться.
            =================================================== */}

        <AnimatePresence initial={false}>
          {currentMedia.type === "video" ? (
            <motion.video
              key={currentMedia.url}
              ref={videoRef}
              className="
                absolute
                top-0
                left-0
                w-full
                h-full
                object-cover
                z-[2]
              "
              crossOrigin="anonymous"
              src={currentMedia.url}
              autoPlay
              muted
              playsInline
              onLoadedData={() => setMediaLoaded(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: mediaLoaded ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: CROSSFADE_DURATION,
                ease: "easeInOut",
              }}
            />
          ) : (
            <motion.img
              key={currentMedia.url}
              src={currentMedia.url}
              alt="Background"
              onLoad={() => setMediaLoaded(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: mediaLoaded ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: CROSSFADE_DURATION,
                ease: "easeInOut",
              }}
              className="
                absolute
                top-0
                left-0
                w-full
                h-full
                object-cover
                z-[2]
              "
            />
          )}
        </AnimatePresence>

        {/* ===================================================
            3D MODEL
            =================================================== */}

        <Hero3D
          modelUrl={modelUrl}
          media={currentMedia}
          videoRef={videoRef}
          restRotationY={Math.PI / 4}
        />

        {/* ===================================================
            РУЛЕТКА КАТЕГОРИЙ (слева)
            =================================================== */}

        <CategoryRoulette
          words={words}
          activeIndex={index}
          onSelect={handleSelectCategory}
          onStep={handleStepCategory}
        />

        {/* ===================================================
            КОНТЕНТ
            =================================================== */}

        <div
          className="
            relative
            z-10
            flex
            flex-col
            items-center
            overflow-visible
          "
        >
          <motion.h1
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className={`
              text-center
              break-words
              whitespace-normal
              font-futura
              tracking-[-5px]
              mb-6
              cursor-pointer
              overflow-hidden
              bg-clip-text

              ${
                index === words.length - 1
                  ? "font-bold text-transparent bg-pink-300"
                  : "font-medium text-transparent bg-white/50"
              }
            `}
            style={{
              fontSize: "clamp(60px, 10vw, 150px)",
              padding: "0 20px",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {words[index]}
          </motion.h1>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="
              px-6
              py-3
              bg-white/20
              backdrop-blur-md
              rounded-lg
              text-lg
              font-futura
              font-light
              shadow-lg
              hover:bg-pink-300
              cursor-pointer
            "
            onClick={() => {
              navigate("/catalogue");
            }}
          >
            explore
          </motion.button>
        </div>
      </div>
    </>
  );
}