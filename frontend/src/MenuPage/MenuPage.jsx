import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Hero3D from "../Hero3D";
import LoadingScreen from "../LoadingScreen/LodingScreen";
import "./MenuPage.css";

const words = ["Skateparks", "Ramps", "Events", "Parkramps"];

// =============================================================
// МЕДИА ПОД КАЖДУЮ КАТЕГОРИЮ
//
// ИЗМЕНЕНО: у каждой категории один источник (type + url),
// который одновременно:
//   1) показывается фоном страницы,
//   2) отражается в 3D-модели (через Hero3D → media prop).
//
// type: 'video' — переключение на следующую категорию произойдёт
//                 по событию 'ended' (видео доиграло до конца).
// type: 'image' — переключение произойдёт через IMAGE_DURATION_MS.
//
// Замени урлы/пути на реальные ассеты.
// =============================================================

const IMAGE_DURATION_MS = 30000; // 30 секунд на фото-категорию

const mediaByWord = [
  {
    // Skateparks
    video:
      "https://res.cloudinary.com/dbx6muxub/video/upload/v1785325905/volt_park_visual2kwide_sjelea.mp4",
    imageDesktop: "/project.png",
    imageMobile: "/project2.png",
  },
  {
    // Ramps
    video:
      "https://res.cloudinary.com/dbx6muxub/video/upload/v1754506398/20220206_214037_qbp9jd.mp4",
    imageDesktop: "https://res.cloudinary.com/dbx6muxub/image/upload/v1784205745/DSC02873_w91eia.webp",
    imageMobile: "https://res.cloudinary.com/dbx6muxub/image/upload/v1784205745/DSC02873_w91eia.webp",
  },
  {
    // Events
    video:
      "",
    imageDesktop: "https://res.cloudinary.com/dbx6muxub/image/upload/v1783061430/jumpboxhatob_tyvaum.webp",
    imageMobile: "https://res.cloudinary.com/dbx6muxub/image/upload/v1783061430/jumpboxhatob_tyvaum.webp",
  },
  {
    // Parkramps
    video:
      "",
    imageDesktop: "/parkramps.png",
    imageMobile: "/parkramps2.png",
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

  // =========================================================
  // VIDEO REF
  // ВАЖНО: этот же video используется внутри Hero3D
  // (используется только когда currentMedia.type === 'video')
  // =========================================================

  const videoRef = useRef(null);

  const currentMedia = mediaByWord[index];

  // =========================================================
  // СМЕНА КАТЕГОРИИ
  //
  // ИЗМЕНЕНО: раньше был setInterval на 2000мс — отсюда
  // "слишком быстро". Теперь:
  //   - для видео ждём событие 'ended' на самом видео,
  //   - для фото просто ставим таймер на IMAGE_DURATION_MS.
  // Эффект пересоздаётся при каждой смене index/типа медиа.
  // =========================================================

  useEffect(() => {
    const goNext = () => {
      setIndex((prev) => (prev + 1) % words.length);
    };

    if (currentMedia.type === "video") {
      const videoEl = videoRef.current;

      if (!videoEl) return;

      videoEl.addEventListener("ended", goNext);

      return () => {
        videoEl.removeEventListener("ended", goNext);
      };
    }

    // type === "image"
    const timer = setTimeout(goNext, IMAGE_DURATION_MS);

    return () => clearTimeout(timer);
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
      {/* =====================================================
          LOADING
          ===================================================== */}

      {isLoading && (
        <LoadingScreen isFadingOut={isFadingOut} />
      )}

      {/* =====================================================
          MAIN
          ===================================================== */}

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
            ===================================================

            ИЗМЕНЕНО: раньше это были два отдельных, независимых
            слоя (статичная картинка + видео поверх неё). Теперь
            это один слой — ровно то, что задано в mediaByWord —
            и он же передаётся в Hero3D для отражения в модели.

            key={currentMedia.url} гарантирует, что React
            полностью пересоздаст DOM-узел при смене категории
            (важно для <video>, чтобы заново сработали события
            loadeddata/loadedmetadata/ended).
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
            // ВАЖНО: loop убран специально — без него сработает
            // событие "ended", по которому переключаем категорию
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
            3D MODEL
            ===================================================

            media передаётся целиком (type + url). videoRef нужен
            Hero3D только когда type === 'video' — для картинки
            он просто игнорируется внутри компонента.
            =================================================== */}

        <Hero3D
          modelUrl={modelUrl}
          media={currentMedia}
          videoRef={videoRef}
          restRotationY={Math.PI / 4}
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
          {/* =================================================
              НАДПИСЬ (меняется вместе с категорией)
              ================================================= */}

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

          {/* =================================================
              КНОПКА
              ================================================= */}

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