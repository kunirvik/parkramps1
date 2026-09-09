import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import Hero3D from "../Hero3D";

const SceneDockCtx = createContext(null);

// Модель, в которую превращается герой при "стыковке" в шапку.
// Замените на реальный путь к вашей 3D-модели логотипа.
const DEFAULT_DOCK_MODEL_URL = "/logo-model.glb";

// Нейтральная заглушка фона на случай, если страница не передала
// media — шейдеру Hero3D всегда нужна какая-то текстура для сэмплинга.
const NEUTRAL_MEDIA = {
  type: "image",
  url:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'><rect width='8' height='8' fill='%23999999'/></svg>",
};

// Фиксированный размер самого WebGL-канваса (в пикселях). Реальный
// видимый размер на экране (большая геройская модель / крошечный
// логотип в шапке) задаётся ИСКЛЮЧИТЕЛЬНО через CSS-transform: scale()
// внешней обёртки — так канвасу не нужно ничего пересчитывать во
// время полёта, и анимация остаётся идеально плавной (60fps, GPU).
const CANVAS_BASE_PX = 500;

export function SceneDockProvider({ children }) {
  const navigate = useNavigate();

  const wrapperRef = useRef(null);
  // два возможных места стыковки — десктопная и мобильная шапка
  const dockTargetsRef = useRef({ desktop: null, mobile: null });

  const [modelUrl, setModelUrl] = useState(null);
  const [modelSize, setModelSize] = useState(4.5);
  const [restRotationY, setRestRotationY] = useState(0);
  const [media, setMedia] = useState(NEUTRAL_MEDIA);
  const [grayscale, setGrayscale] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isDocked, setIsDocked] = useState(false);

  const busyRef = useRef(false);

  // Текущее видимое место стыковки (десктоп или мобилка) —
  // выбираем то, у которого реально есть размеры на экране.
  const getVisibleDockRect = useCallback(() => {
    const { desktop, mobile } = dockTargetsRef.current;
    for (const el of [desktop, mobile]) {
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) return rect;
    }
    return null;
  }, []);

  // SocialButtons вызывает это на монтировании, передавая ref на
  // реальный <img> лого (десктопный и мобильный варианты отдельно).
  const registerDockTarget = useCallback((el, variant = "desktop") => {
    dockTargetsRef.current[variant] = el;
  }, []);

  // Показать "геройскую" модель на текущей странице — большая, по
  // центру экрана. Вызывается страницей вроде MenuPage при монтировании.
  const showHero = useCallback((url, opts = {}) => {
    const { size = 4.5, rotation = 0, media: mediaOpt = NEUTRAL_MEDIA } = opts;

    if (wrapperRef.current) {
      gsap.set(wrapperRef.current, {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        scale: 1,
      });
    }

    setMedia(mediaOpt);
    setModelUrl(url);
    setModelSize(size);
    setRestRotationY(rotation);
    setGrayscale(false);
    setIsDocked(false);
    setVisible(true);
  }, []);

  // Клик "explore": модель меняет геометрию на dock-модель и сереет
  // (кроссфейд внутри Hero3D), и ОДНОВРЕМЕННО физически перелетает и
  // уменьшается в точку лого в шапке (CSS-transform обёртки, GSAP).
  // По завершении полёта переключаем роут и модель остаётся
  // "пристыкованной" — на всех последующих страницах она и есть лого.
  const flyToDock = useCallback(
    ({ toUrl = DEFAULT_DOCK_MODEL_URL, navigateTo, duration = 0.9 } = {}) => {
      if (busyRef.current) return;
      busyRef.current = true;

      // 1) смена геометрии + посерение — обрабатывает сам Hero3D
      setModelUrl(toUrl);
      setGrayscale(true);

      // 2) параллельно летим CSS-transform'ом к месту в шапке
      const rect = getVisibleDockRect();
      const wrapper = wrapperRef.current;

      if (rect && wrapper) {
        const targetScale =
          Math.max(rect.width, rect.height) / CANVAS_BASE_PX;

        gsap.to(wrapper, {
          top: rect.top + rect.height / 2,
          left: rect.left + rect.width / 2,
          xPercent: -50,
          yPercent: -50,
          scale: targetScale,
          duration,
          ease: "power3.inOut",
        });
      }

      // 3) когда всё доиграло — переключаем роут, фиксируем стыковку
      setTimeout(() => {
        if (navigateTo) navigate(navigateTo);
        setIsDocked(true);
        busyRef.current = false;
      }, duration * 1000 + 50);
    },
    [navigate, getVisibleDockRect]
  );

  // Если модель уже пристыкована, а окно ресайзится (например, смена
  // десктоп/мобильной раскладки) — перепривязываем позицию без анимации.
  useEffect(() => {
    if (!isDocked) return;

    const reposition = () => {
      const rect = getVisibleDockRect();
      const wrapper = wrapperRef.current;
      if (!rect || !wrapper) return;

      const targetScale = Math.max(rect.width, rect.height) / CANVAS_BASE_PX;
      gsap.set(wrapper, {
        top: rect.top + rect.height / 2,
        left: rect.left + rect.width / 2,
        xPercent: -50,
        yPercent: -50,
        scale: targetScale,
      });
    };

    window.addEventListener("resize", reposition);
    return () => window.removeEventListener("resize", reposition);
  }, [isDocked, getVisibleDockRect]);

  const value = {
    showHero,
    flyToDock,
    registerDockTarget,
    isDocked,
  };

  return (
    <SceneDockCtx.Provider value={value}>
      {children}

      {/* Персистентный канвас — рендерится здесь, ВЫШЕ <Routes>,
          поэтому НЕ размонтируется при переходах между страницами. */}
      <div
        ref={wrapperRef}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          width: CANVAS_BASE_PX,
          height: CANVAS_BASE_PX,
          transform: "translate(-50%, -50%)",
          pointerEvents: isDocked ? "auto" : "none",
          zIndex: isDocked ? 60 : 9999, // выше шапки (z-50), когда пристыковано
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
          cursor: isDocked ? "pointer" : "default",
        }}
        onClick={isDocked ? () => navigate("/catalogue") : undefined}
      >
        {modelUrl && (
          <Hero3D
            modelUrl={modelUrl}
            media={media}
            modelSize={modelSize}
            restRotationY={restRotationY}
            grayscale={grayscale}
            canvasSizePx={CANVAS_BASE_PX}
          />
        )}
      </div>
    </SceneDockCtx.Provider>
  );
}

export function useSceneDock() {
  const ctx = useContext(SceneDockCtx);
  if (!ctx) {
    throw new Error("useSceneDock must be used within SceneDockProvider");
  }
  return ctx;
}