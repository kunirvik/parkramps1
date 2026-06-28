import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const THUMB_H = 68;
const MOBILE_THUMB_FULL  = 40;
const MOBILE_THUMB_SMALL = 28;

const STYLE_ID = "film-gallery-styles";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes fg-spin { to { transform: rotate(360deg); } }
    @keyframes fg-enter {
      from { opacity: 0; transform: scale(1.03); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes fg-slide-up {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fg-slide-left {
      from { opacity: 0; transform: translateX(18px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes fg-slide-right {
      from { opacity: 0; transform: translateX(-18px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes fg-slide-down {
      from { opacity: 0; transform: translateY(-18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fg-enter       { animation: fg-enter      0.45s cubic-bezier(0.16,1,0.3,1) both; }
    .fg-slide-up    { animation: fg-slide-up   0.45s cubic-bezier(0.16,1,0.3,1) both; }
    .fg-slide-left  { animation: fg-slide-left  0.45s cubic-bezier(0.16,1,0.3,1) both; }
    .fg-slide-right { animation: fg-slide-right 0.45s cubic-bezier(0.16,1,0.3,1) both; }
    .fg-slide-down  { animation: fg-slide-down 0.45s cubic-bezier(0.16,1,0.3,1) both; }
    .fg-no-scroll::-webkit-scrollbar { display: none; }
    .fg-no-scroll { -ms-overflow-style: none; scrollbar-width: none; }
  `;
  document.head.appendChild(s);
}

// ─── Спиннер ─────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-950 z-10 pointer-events-none">
      <div className="relative w-9 h-9">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/70"
          style={{ animation: "fg-spin 0.8s linear infinite" }}
        />
      </div>
    </div>
  );
}

function IconClose() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6"  y2="18"/>
      <line x1="6"  y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function IconGrid() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
      <rect x="0"    y="0"    width="4.5" height="4.5" rx="0.8"/>
      <rect x="5.75" y="0"    width="4.5" height="4.5" rx="0.8"/>
      <rect x="11.5" y="0"    width="4.5" height="4.5" rx="0.8"/>
      <rect x="0"    y="5.75" width="4.5" height="4.5" rx="0.8"/>
      <rect x="5.75" y="5.75" width="4.5" height="4.5" rx="0.8"/>
      <rect x="11.5" y="5.75" width="4.5" height="4.5" rx="0.8"/>
      <rect x="0"    y="11.5" width="4.5" height="4.5" rx="0.8"/>
      <rect x="5.75" y="11.5" width="4.5" height="4.5" rx="0.8"/>
      <rect x="11.5" y="11.5" width="4.5" height="4.5" rx="0.8"/>
    </svg>
  );
}

function IconOpenProduct() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7"/>
      <path d="M7 7h10v10"/>
    </svg>
  );
}

// ─── Панель категорий — только десктоп ───────────────────────────────────────
function CategoryPanel({ categories, activeCategory, onSelect, slides }) {
  return (
    <div
      className="fg-slide-right flex flex-col gap-0.5 py-3 px-2 bg-neutral-900
                 border-r border-neutral-800 overflow-y-auto fg-no-scroll flex-shrink-0"
      style={{ minWidth: 130, maxWidth: 150, animationDelay: "0.15s" }}
    >
      <button
        onClick={() => onSelect(null)}
        className={`text-left px-3 py-1.5 rounded-md transition-colors
          font-futura text-xs tracking-wide
          ${activeCategory === null
            ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/50"
            : "text-white/40 hover:text-white/80 hover:bg-white/5"
          }`}
      >
        All
      </button>

      <div className="h-px bg-neutral-700/50 my-1.5" />

      {categories.map((cat) => {
        const isActive = activeCategory === cat.key;
        const thumb    = slides.find((s) => (s.productName || s._extraCat) === cat.key);
        const thumbSrc = thumb?.productImage || thumb?.src;

        return (
          <button
            key={cat.key}
            onClick={() => onSelect(cat.key)}
            className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md
              transition-colors font-futura text-xs tracking-wide
              ${isActive
                ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/50"
                : "text-white/40 hover:text-white/80 hover:bg-white/5"
              }`}
          >
            {thumbSrc && (
              <div className="flex-shrink-0 w-8 h-8 rounded-sm overflow-hidden bg-neutral-800">
                <img src={thumbSrc} className="w-full h-full object-cover" loading={Math.abs(i - activeIndex) <= 3 ? "eager" : "lazy"} alt="" />
              </div>
            )}
            <span className="truncate">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Мобильная панель категорий (горизонтальный скролл сверху) ────────────────
function MobileCategoryBar({ categories, activeCategory, onSelect, slides }) {
  return (
    <div className="flex gap-1.5 px-2 py-1.5 overflow-x-auto fg-no-scroll bg-neutral-900/90
                    backdrop-blur-sm border-b border-neutral-800 flex-shrink-0">
      <button
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full
          font-futura text-[10px] tracking-wide transition-colors
          ${activeCategory === null
            ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/50"
            : "bg-neutral-800 text-white/50"
          }`}
      >
        All
      </button>

      {categories.map((cat) => {
        const isActive = activeCategory === cat.key;
        const thumb    = slides.find((s) => (s.productName || s._extraCat) === cat.key);
        const thumbSrc = thumb?.productImage || thumb?.src;

        return (
          <button
            key={cat.key}
            onClick={() => onSelect(cat.key)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-full
              font-futura text-[10px] tracking-wide transition-colors
              ${isActive
                ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/50"
                : "bg-neutral-800 text-white/50"
              }`}
          >
            {thumbSrc && (
              <div className="w-5 h-5 rounded-full overflow-hidden bg-neutral-700 flex-shrink-0">
                <img src={thumbSrc} className="w-full h-full object-cover" alt="" />
              </div>
            )}
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Вертикальная лента СПРАВА (десктоп) ─────────────────────────────────────
function ThumbStripVertical({ slides, activeIndex, onSelect, highlightedIndices }) {
  const stripRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!frameRef.current) return;
    const top = activeIndex * (THUMB_H + 4);
    frameRef.current.style.transform = `translateY(${top}px)`;
    if (stripRef.current) {
      const containerH = stripRef.current.clientHeight;
      stripRef.current.scrollTo({
        top: top - containerH / 2 + THUMB_H / 2,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  return (
    <div
      ref={stripRef}
      className="fg-no-scroll relative h-full overflow-y-auto bg-neutral-900 py-1 ml-2"
      style={{ width: 80 }}
    >
      <div
        ref={frameRef}
        className="absolute left-0.5 right-0.5 h-[68px] border-2 border-yellow-400/90
                   rounded-sm pointer-events-none z-50 transition-transform duration-300"
      />
      <div className="flex flex-col gap-1 px-0.5">
        {slides.map((slide, i) => {
          const isActive      = i === activeIndex;
          const isHighlighted = highlightedIndices === null || highlightedIndices.has(i);
          return (
            <div
              key={i}
              onClick={() => onSelect(i)}
              className="h-[68px] overflow-hidden cursor-pointer transition-opacity duration-300"
              style={{ opacity: isActive ? 1 : isHighlighted ? 0.55 : 0.12 }}
            >
              {slide.type === "video"
                ? <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-white/60 text-sm">▶</div>
                : <img
                    src={slide.src}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    alt=""
                  />
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Горизонтальная лента СНИЗУ (мобилка) ────────────────────────────────────
function MobileThumbStrip({ slides, activeIndex, onSelect, highlightedIndices, isScrolling }) {
  const stripRef = useRef(null);
  const frameRef = useRef(null);
  const THUMB_W  = 56;
  const gap      = 3;

  useEffect(() => {
    if (!frameRef.current || !stripRef.current) return;
    const left = activeIndex * (THUMB_W + gap);
    frameRef.current.style.transform = `translateX(${left}px)`;
    stripRef.current.scrollTo({
      left: left - stripRef.current.clientWidth / 2 + THUMB_W / 2,
      behavior: "smooth",
    });
  }, [activeIndex]);

  return (
    // <div
    //   style={{
    //     maxHeight:  isScrolling ? 0 : 60,
    //     opacity:    isScrolling ? 0 : 1,
    //     overflow:   "hidden",
    //     flexShrink: 0,
    //     transition: "max-height 0.35s ease, opacity 0.3s ease",
    //   }}
    // >
    // ✅ стало
<div style={{ flexShrink: 0 }}>
      <div
        ref={stripRef}
        className="fg-no-scroll relative overflow-x-auto bg-neutral-900
                   border-t border-neutral-800"
        style={{ height: 60, paddingLeft: 8, paddingRight: 8 }}
      >
        {/* Рамка-индикатор */}
        <div
          ref={frameRef}
          className="absolute top-1.5 bottom-1.5 border border-yellow-400/80
                     rounded-sm pointer-events-none z-50"
          style={{
            width: THUMB_W,
            left:  8,
            transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
          }}
        />

        <div
          className="flex h-full"
          style={{ gap, minWidth: slides.length * (THUMB_W + gap) }}
        >
          {slides.map((slide, i) => {
            const isActive      = i === activeIndex;
            const isHighlighted = highlightedIndices === null || highlightedIndices.has(i);

            return (
              <div
                key={i}
                onClick={() => onSelect(i)}
                className="flex-shrink-0 overflow-hidden cursor-pointer rounded-sm"
                style={{
                  width:      THUMB_W,
                  height:     "100%",
                  opacity:    isActive ? 1 : isHighlighted ? 0.55 : 0.12,
                  transition: "opacity 0.3s ease",
                }}
              >
                {slide.type === "video"
                  ? <div className="w-full h-full bg-neutral-800 flex items-center
                                    justify-center text-white/60 text-xs">▶</div>
                  : <img
                      src={slide.src}  // ← именно src, не productImage
                      className="w-full h-full object-cover"
                      loading="lazy"
                      alt=""
                    />
                }
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
// ─── Предзагрузка соседних слайдов ───────────────────────────────────────────
function usePreload(slides, activeIndex) {
  useEffect(() => {
    // грузим текущий + 2 вперёд + 1 назад
    const indices = [
      activeIndex,
      activeIndex + 1,
      activeIndex + 2,
      activeIndex - 1,
    ].map((i) => (i + slides.length) % slides.length);

    const unique = [...new Set(indices)];

    unique.forEach((i) => {
      const slide = slides[i];
      if (!slide || slide.type === "video") return;
      const img = new Image();
      img.src = slide.src;
    });
  }, [activeIndex, slides]);
} 


// // ─── Главный вид ──────────────────────────────────────────────────────────────
// function MainView({ slide, index, total }) {
//   const videoRef              = useRef(null);
//   const [loading, setLoading]  = useState(true);
//   const [animKey, setAnimKey]  = useState(0);

//   useEffect(() => { setLoading(true); setAnimKey((k) => k + 1); }, [slide]);
//   useEffect(() => { if (videoRef.current) videoRef.current.play().catch(() => {}); }, [slide]);

//   if (!slide) return null;

//   return (
//     <div key={animKey} className="fg-enter relative flex justify-center w-full h-full
//                                   bg-neutral-950 overflow-hidden">
//       {loading && <Spinner />}

//       {slide.type === "video"
//         ? <video ref={videoRef} src={slide.src} autoPlay muted loop playsInline
//             className="w-auto h-full object-contain"
//             onCanPlay={() => setLoading(false)} />
//         : <img src={slide.src}
//             className="w-auto h-full object-contain"
//             style={{ opacity: loading ? 0 : 1, transition: "opacity 0.35s ease" }}
//             onLoad={() => setLoading(false)}
//             onError={() => setLoading(false)}
//             alt={slide.caption || ""} />
//       }

//       <div className="absolute inset-0 pointer-events-none
//                       bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />

//       {slide.caption && (
//         <div className="fg-slide-up absolute bottom-0 left-0 right-0 p-10
//                         bg-gradient-to-t from-black/70 to-transparent">
//           <p className="text-white/90 font-bold">{slide.caption}</p>
//         </div>
//       )}

//       <div className="fg-slide-down absolute top-5 left-6 text-white/50 text-xs font-mono
//                       bg-black/30 px-3 py-1 rounded-full">
//         {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";

// ─── Главный вид ──────────────────────────────────────────────────────────────
const MainView = memo(function MainView({ slide, index, total }) {
  const videoRef              = useRef(null);
  const [loading, setLoading]  = useState(true);
  // const [animKey, setAnimKey]  = useState(0);

  // useEffect(() => { setLoading(true); setAnimKey((k) => k + 1); }, [slide]);
  useEffect(() => { setLoading(true); }, [slide]);
  useEffect(() => { if (videoRef.current) videoRef.current.play().catch(() => {}); }, [slide]);

  if (!slide) return null;

  return (
    <div key={animKey} className="relative flex justify-center w-full h-full
                                  bg-neutral-950 overflow-hidden">
      {loading && <Spinner />}

      {slide.type === "video"
        ? <video ref={videoRef} preload="none"  src={slide.src} autoPlay muted loop playsInline
            className="w-auto h-full object-contain"
            onCanPlay={() => setLoading(false)} />
        : <img src={slide.src}
        loading={Math.abs(i - activeIndex) <= 3 ? "eager" : "lazy"}
            // важно: размер явно не задан — браузер не знает сколько места резервировать
            // добавляем contain чтобы не было layout shift
            className="w-auto h-full object-contain"
            style={{ opacity: loading ? 0 : 1, transition: "opacity 0.35s ease" }}
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
            decoding="async"        // ← не блокирует main thread
            fetchpriority="high"    // ← текущий слайд грузится первым
            alt={slide.caption || ""} />
      }

      <div className="absolute inset-0 pointer-events-none
                      bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />

      {slide.caption && (
        <div className="fg-slide-up absolute bottom-0 left-0 right-0 p-10
                        bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white/90 font-bold">{slide.caption}</p>
        </div>
      )}

      <div className="fg-slide-down absolute top-5 left-6 text-white/50 text-xs font-mono
                      bg-black/30 px-3 py-1 rounded-full">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
});
// ─── Кнопка с тултипом (десктоп) ─────────────────────────────────────────────
function IconButton({ onClick, label, children, disabled = false }) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className="flex items-center justify-center w-9 h-9 rounded-full
          bg-neutral-800/70 hover:bg-neutral-700 text-white/80 hover:text-white
          transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {children}
      </button>
      <div className="absolute right-11 top-1/2 -translate-y-1/2 pointer-events-none
        opacity-0 group-hover:opacity-100 transition-opacity duration-150
        bg-black/80 text-white/90 text-xs font-mono px-2 py-1 rounded whitespace-nowrap">
        {label}
      </div>
    </div>
  );
}

// ─── Основной компонент ───────────────────────────────────────────────────────
export default function FilmGallery({
  slides: slidesProp,
  startIndex      = 0,
  onClose:        onCloseProp,
  extraCategories = [],
  initialCategory = null,
  originPath      = "/",
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Объединяем слайды, не дублируя extraCategories
  const slides = useMemo(() => {
    const extraKeys = new Set(slidesProp.map((s) => s._extraCat).filter(Boolean));
    const extra = extraCategories
      .filter((ec) => !extraKeys.has(ec.key))
      .flatMap((ec) => ec.slides.map((s) => ({ ...s, _extraCat: ec.key })));
    return [...slidesProp, ...extra];
  }, [slidesProp, extraCategories]);

  const categories = useMemo(() => {
    const seen = new Set();
    const fromProducts = [];
    slides.forEach((s) => {
      if (s.productName && !seen.has(s.productName)) {
        seen.add(s.productName);
        fromProducts.push({ key: s.productName, label: s.productName });
      }
    });
    const fromExtra = extraCategories.map((ec) => ({ key: ec.key, label: ec.label }));
    return [...fromProducts, ...fromExtra];
  }, [slides, extraCategories]);

  const [activeIndex, setActiveIndex]       = useState(startIndex);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [mounted, setMounted]               = useState(false);
  const [isScrolling, setIsScrolling]       = useState(false);
  const [isMobile, setIsMobile]             = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  const scrollTimerRef = useRef(null);
  const containerRef   = useRef(null);
  const touchStartX    = useRef(null);
  const touchStartY    = useRef(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => () => clearTimeout(scrollTimerRef.current), []);

  const highlightedIndices = useMemo(() => {
    if (activeCategory === null) return null;
    const set = new Set();
    slides.forEach((s, i) => {
      const cat = s.productName || s._extraCat || null;
      if (cat === activeCategory) set.add(i);
    });
    return set;
  }, [activeCategory, slides]);

  // Автосмена категории при смене слайда
  useEffect(() => {
    const slide = slides[activeIndex];
    if (!slide) return;
    const cat = slide.productName || slide._extraCat || null;
    setActiveCategory(cat);
  }, [activeIndex, slides]);

  const handleSelectCategory = useCallback((catKey) => {
    setActiveCategory(catKey);
    if (catKey === null) return;
    const firstIdx = slides.findIndex((s) =>
      (s.productName || s._extraCat || null) === catKey
    );
    if (firstIdx !== -1) setActiveIndex(firstIdx);
  }, [slides]);

  const currentSlide   = slides[activeIndex];
  usePreload(slides, activeIndex);
  const canOpenProduct = !!(currentSlide?.productType && currentSlide?.productId);

  const handleOpenProduct = useCallback(() => {
    if (!canOpenProduct) return;
    navigate(`/product/${currentSlide.productType}/${currentSlide.productId}`, {
      state: { originPath: location.pathname },
    });
  }, [canOpenProduct, currentSlide, navigate, location.pathname]);

  const handleClose = useCallback(
    () => (onCloseProp ? onCloseProp() : navigate(originPath)),
    [onCloseProp, navigate, originPath]
  );

  const handleOpenAllGallery = useCallback(() => navigate("/gallery/all"), [navigate]);

  const goTo = useCallback((idx) => {
    setActiveIndex((idx + slides.length) % slides.length);
    if (isMobile) {
      setIsScrolling(true);
      clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => setIsScrolling(false), 1500);
    }
  }, [slides.length, isMobile]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape")                               handleClose();
      if (e.key === "ArrowRight" || e.key === "ArrowDown")  goTo(activeIndex + 1);
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")    goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose, activeIndex, goTo]);

  const handleWheel = useCallback(
    (e) => { e.preventDefault(); goTo(activeIndex + (e.deltaY > 0 ? 1 : -1)); },
    [activeIndex, goTo]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isMobile) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel, isMobile]);

  // touch — только на главном виде, не на боковых лентах
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40)
      goTo(activeIndex + (dx < 0 ? 1 : -1));
    touchStartX.current = null;
    touchStartY.current = null;
  }, [activeIndex, goTo]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-neutral-950 overflow-hidden"
      style={{
        opacity:    mounted ? 1 : 0,
        transform:  mounted ? "scale(1)" : "scale(1.04)",
        transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        // на мобилке flex-col: сверху категории, снизу [лента | фото | лента]
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {/* ══ ДЕСКТОП ══════════════════════════════════════════════════════════ */}
      {!isMobile && (
        <>
          {/* Категории слева */}
          <CategoryPanel
            categories={categories}
            activeCategory={activeCategory}
            onSelect={handleSelectCategory}
            slides={slides}
          />

          {/* Главный вид */}
          <div className="flex-1 relative">
            <MainView slide={currentSlide} index={activeIndex} total={slides.length} />
          </div>

          {/* Миниатюры + кнопки справа */}
          <div className="flex items-stretch fg-slide-left" style={{ animationDelay: "0.2s" }}>
            <ThumbStripVertical
              slides={slides}
              activeIndex={activeIndex}
              onSelect={goTo}
              highlightedIndices={highlightedIndices}
            />
            <div className="flex flex-col items-center justify-start gap-2 px-2 py-3
                            bg-neutral-950 border-l border-neutral-800">
              <IconButton onClick={handleClose} label="Закрити"><IconClose /></IconButton>
              <IconButton onClick={handleOpenAllGallery} label="Всі фото"><IconGrid /></IconButton>
              <div className="h-px w-6 bg-neutral-700/60 my-0.5" />
              <IconButton onClick={handleOpenProduct} label="Відкрити виріб" disabled={!canOpenProduct}>
                <IconOpenProduct />
              </IconButton>
            </div>
          </div>
        </>
      )}

{/* ══ МОБИЛКА ══════════════════════════════════════════════════════════ */}
{isMobile && (
  <>
    {/* Категории сверху */}
    {/* <div style={{
      maxHeight:  isScrolling ? 0 : 56,
      opacity:    isScrolling ? 0 : 1,
      overflow:   "hidden",
      transition: "max-height 0.35s ease, opacity 0.3s ease",
      flexShrink: 0,
    }}> */}
    <div
  // ref={stripRef}
  className="fg-no-scroll relative overflow-x-auto bg-neutral-900 border-t border-neutral-800"
  style={{ height: 60, paddingLeft: 8, paddingRight: 8, flexShrink: 0 }}>
      <MobileCategoryBar
        categories={categories}
        activeCategory={activeCategory}
        onSelect={handleSelectCategory}
        slides={slides}
      />
    </div>

    {/* Главный вид */}
    <div
      className="flex-1 relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <MainView slide={currentSlide} index={activeIndex} total={slides.length} />
    </div>

    {/* Горизонтальная лента снизу */}
    <MobileThumbStrip
      slides={slides}
      activeIndex={activeIndex}
      onSelect={goTo}
      highlightedIndices={highlightedIndices}
      isScrolling={isScrolling}
    />

    {/* Кнопки */}
    {/* <div
      className="absolute top-14 right-1 z-50 flex flex-col gap-2"
      style={{
        opacity:       isScrolling ? 0 : 1,
        transition:    "opacity 0.25s ease",
        pointerEvents: isScrolling ? "none" : "auto",
      }}
    > */}
    <div className="absolute top-14 right-1 z-50 flex flex-col gap-2">
      <button onClick={handleClose}
        className="flex items-center justify-center w-8 h-8 rounded-full
                   bg-neutral-800/80 text-white/80 backdrop-blur-sm">
        <IconClose />
      </button>
      <button onClick={handleOpenAllGallery}
        className="flex items-center justify-center w-8 h-8 rounded-full
                   bg-neutral-800/80 text-white/80 backdrop-blur-sm">
        <IconGrid />
      </button>
      {canOpenProduct && (
        <button onClick={handleOpenProduct}
          className="flex items-center justify-center w-8 h-8 rounded-full
                     bg-neutral-800/80 text-white/80 backdrop-blur-sm">
          <IconOpenProduct />
        </button>
      )}
    </div>
  </>
)}
    </div>
  );
} 

