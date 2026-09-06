

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Hero3D from "../Hero3D";
import CategoryRoulette from "../CategoryRoulette";
import LoadingScreen from "../LoadingScreen/LodingScreen";
import "./MenuPage.css";

const words = ["Skateparks", "Ramps", "Events", "Parkramps"];

// =============================================================
// МЕДИА ПОД КАЖДУЮ КАТЕГОРИЮ
// type: 'video' — переключение по событию 'ended'
// type: 'image' — переключение через IMAGE_DURATION_MS
// =============================================================

const IMAGE_DURATION_MS = 30000;
const mediaByWord = [
  {
    type: "video",
    url:
      "https://res.cloudinary.com/dbx6muxub/video/upload/v1785325905/volt_park_visual2kwide_sjelea.mp4",
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/dbx6muxub/image/upload/v1784205745/DSC02873_w91eia.webp",
  },
  {
    type: "video",
    url:
      "https://res.cloudinary.com/dbx6muxub/video/upload/v1754506398/20220206_214037_qbp9jd.mp4",
  },
  {
    type: "image",
    url: "/parkramps.png",
  },
];


export default function MenuPage() {
  const [index, setIndex] = useState(0);

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
  // ПЕРЕКЛЮЧЕНИЕ КАТЕГОРИИ ВРУЧНУЮ (рулетка)
  //
  // ДОБАВЛЕНО: клик по слову — сразу на него; скролл — на 1
  // категорию вперёд/назад. Оба пути идут через setIndex,
  // поэтому автоматически переиспользуют защиту от
  // отрицательных/переполненных индексов и сбрасывают таймер
  // автосмены ниже (он зависит от index).
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
  // видео — по 'ended', фото — через IMAGE_DURATION_MS.
  // Пересоздаётся при каждой смене index (в т.ч. ручной, через
  // рулетку) — то есть ручное переключение всегда "обнуляет"
  // отсчёт для новой категории.
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
    const timer = setTimeout(
      () => setIsFadingOut(true),
      1500
    );

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
      {isLoading && (
        <LoadingScreen isFadingOut={isFadingOut} />
      )}

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
            ФОН КАТЕГОРИИ: ВИДЕО ИЛИ ФОТО
            =================================================== */}

        {currentMedia.type === "video" ? (
          <video
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
          />
        ) : (
          <motion.img
            key={currentMedia.url}
            src={currentMedia.url}
            alt="Background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
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

        {/* ===================================================
            3D MODEL (центр экрана, адаптивный размер —
            см. Hero3D.jsx)
            =================================================== */}

        <Hero3D
          modelUrl={modelUrl}
          media={currentMedia}
          videoRef={videoRef}
          restRotationY={Math.PI / 4}
        />

        {/* ===================================================
            РУЛЕТКА КАТЕГОРИЙ
            ДОБАВЛЕНО: подсветка активной, клик и скролл
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
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 20,
            }}
            transition={{
              duration: 0.5,
            }}
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
            whileHover={{
              scale: 1.1,
            }}
            whileTap={{
              scale: 0.9,
            }}
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