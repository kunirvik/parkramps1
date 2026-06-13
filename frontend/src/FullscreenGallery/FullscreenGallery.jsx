
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── КАТЕГОРІЇ ─────────────────────────────────────────────────────────────
export const CAT_LABEL = {
  sets:       "Sets",
  ramps:      "Ramps",
  skateparks: "Skateparks",
  video:      "Video",
  stroyka:    "Stroyka",
  figures:    "3D Models",
};

function getCat(slide) {
  if (slide.cat) return slide.cat;
  if (slide.type === "video") return "video";
  return null;
}

// ─── Стилі ─────────────────────────────────────────────────────────────────
const STYLE_ID = "pyoshi-kf";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes pySlideIn {
      from { opacity: 0; transform: translateX(-24px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .py-card { animation: pySlideIn 0.55s cubic-bezier(0.16,1,0.3,1) both; }
    .py-hscroll::-webkit-scrollbar { display: none; }
    .py-hscroll { -ms-overflow-style: none; scrollbar-width: none; }
  `;
  document.head.appendChild(s);
}

// ─── Константи ─────────────────────────────────────────────────────────────
const COL_W         = 148;
const COL_GAP       = 4;
const ITEMS_PER_COL = 6;
const PARALLAX_MAX  = 20;

// ─── ScrollHint ────────────────────────────────────────────────────────────
function ScrollHint() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className="fixed bottom-6 right-6 flex items-center gap-2 text-[10px] tracking-widest uppercase text-neutral-400 pointer-events-none z-40"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease" }}
    >
      <svg width="20" height="10" viewBox="0 0 20 10" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="0" y1="5" x2="16" y2="5"/>
        <polyline points="12,1 17,5 12,9"/>
      </svg>
      scroll
    </div>
  );
}

// ─── Основний компонент ────────────────────────────────────────────────────
export default function FullscreenGallery({ slides = [], onClose, onSelectSlide }) {
  const [hoveredCat, setHoveredCat] = useState(null);
  // activeCat — постійний фільтр (клік по кнопці категорії)
  const [activeCat,  setActiveCat]  = useState(null);

  const scrollRef = useRef(null);
  const colRefs   = useRef([]);

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Кількість по категоріях
  const catCounts = useMemo(() =>
    slides.reduce((acc, s) => {
      const c = getCat(s);
      if (c && CAT_LABEL[c]) {
        acc[c] = (acc[c] || 0) + 1;
      }
      return acc;
    }, {}),
  [slides]);

  // Відфільтровані елементи (зберігаємо globalIndex для ключів)
  const filteredItems = useMemo(() => {
    if (!activeCat) {
      return slides.map((slide, i) => ({ slide, globalIndex: i }));
    }
    return slides
      .map((slide, i) => ({ slide, globalIndex: i }))
      .filter(({ slide }) => getCat(slide) === activeCat);
  }, [slides, activeCat]);

  // Колонки
  const columns = useMemo(() => {
    const cols = [];
    for (let i = 0; i < filteredItems.length; i += ITEMS_PER_COL) {
      cols.push(filteredItems.slice(i, i + ITEMS_PER_COL));
    }
    return cols;
  }, [filteredItems]);

  // Паралакс
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || columns.length < 2) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    const progress = el.scrollLeft / maxScroll;
    colRefs.current.forEach((col, i) => {
      if (!col) return;
      const t = i / (columns.length - 1);
      const y = (1 - 2 * t) * PARALLAX_MAX * progress;
      col.style.transform = `translateY(${y.toFixed(2)}px)`;
    });
  }, [columns.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Клік на фото → передаємо відфільтрований масив + локальний індекс
  const handleSelect = useCallback((localIndex) => {
    const filteredSlides = filteredItems.map(({ slide }) => slide);
    onSelectSlide({ slides: filteredSlides, index: localIndex });
    // onClose();
  }, [filteredItems, onSelectSlide]);

  // Toggle фільтра
  const toggleCat = useCallback((cat) => {
    setActiveCat(prev => prev === cat ? null : cat);
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, []);

  const displayCat   = activeCat || hoveredCat;
  const displayLabel = displayCat ? (CAT_LABEL[displayCat] ?? displayCat) : null;

  return (
    <div className="fixed inset-0 z-[200] bg-[#e8e3db] flex flex-col overflow-hidden">

      {/* ── Шапка ── */}
      <header className="flex-none flex items-center justify-between px-6 py-3 z-20 select-none">
        <span
          className="text-neutral-800 tracking-tight font-bold"
          style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(1rem,2vw,1.4rem)" }}
        >
          {activeCat
            ? `${CAT_LABEL[activeCat] ?? activeCat} (${catCounts[activeCat] ?? 0})`
            : "All Photos"
          }
        </span>

        <div className="flex items-center gap-4 flex-wrap justify-end">
          {/* "All" — скидає фільтр */}
          {activeCat && (
            <button
              onClick={() => { setActiveCat(null); if (scrollRef.current) scrollRef.current.scrollLeft = 0; }}
              className="text-[11px] tracking-[0.15em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              ← all
            </button>
          )}

          {/* Кнопки категорій */}
          {Object.entries(catCounts).map(([cat, n]) => (
            <button
              key={cat}
              onMouseEnter={() => !activeCat && setHoveredCat(cat)}
              onMouseLeave={() => !activeCat && setHoveredCat(null)}
              onClick={() => toggleCat(cat)}
              className={`
                text-[11px] tracking-[0.15em] uppercase transition-all duration-200
                ${activeCat === cat
                  ? "text-neutral-900 font-bold border-b border-neutral-800 pb-px"
                  : hoveredCat === cat
                    ? "text-neutral-700"
                    : "text-neutral-400 hover:text-neutral-600"
                }
              `}
            >
              {CAT_LABEL[cat] ?? cat}
              <span className="ml-1 text-neutral-300 font-light">({n})</span>
            </button>
          ))}

          {/* Закрити */}
          <button
            onClick={onClose}
            className="ml-1 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6"  x2="6"  y2="18"/>
              <line x1="6"  y1="6"  x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </header>

      {/* ── Горизонтальний скролл ── */}
      <div
        ref={scrollRef}
        className="py-hscroll flex-1 overflow-x-auto overflow-y-hidden"
      >
        <div
          className="flex items-start h-full gap-[4px] px-1.5 pb-20"
          style={{ minWidth: `${columns.length * (COL_W + COL_GAP)}px` }}
        >
          {columns.map((col, colIdx) => (
            <div
              key={`col-${activeCat ?? "all"}-${colIdx}`}
              ref={el => (colRefs.current[colIdx] = el)}
              className="flex flex-col gap-1 will-change-transform"
              style={{ width: COL_W, flexShrink: 0 }}
            >
              {col.map(({ slide, globalIndex }, itemIdx) => {
                const flatLocalIndex = colIdx * ITEMS_PER_COL + itemIdx;
                const cat = getCat(slide);

                // Затухання:
                // - якщо activeCat → тільки та категорія яскрава, решта не відображається (вже відфільтровано)
                // - якщо тільки hoveredCat → традиційне затухання
                const isFaded =
                  !activeCat && hoveredCat !== null && cat !== hoveredCat;

                return (
                  <div
                    key={globalIndex}
                    className="py-card overflow-hidden cursor-pointer relative group flex-shrink-0"
                    style={{ animationDelay: `${Math.min(flatLocalIndex * 0.02, 0.7)}s` }}
                    onMouseEnter={() => !activeCat && cat && setHoveredCat(cat)}
                    onMouseLeave={() => !activeCat && setHoveredCat(null)}
                    onClick={() => handleSelect(flatLocalIndex)}
                  >
                    {slide.type === "video" ? (
                      <div
                        className={`
                          w-full aspect-video bg-neutral-600 flex flex-col items-center
                          justify-center gap-1 transition-all duration-500 relative
                          ${isFaded ? "opacity-[0.11] saturate-0 brightness-[1.7]" : "opacity-100"}
                        `}
                      >
                        {slide.poster && (
                          <img
                            src={slide.poster}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                            alt=""
                          />
                        )}
                        <div className="relative z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 10 10" fill="white">
                            <polygon points="2,1 9,5 2,9"/>
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={slide.src}
                        alt={slide.caption || cat || ""}
                        loading="lazy"
                        className={`
                          w-full h-auto block transition-all duration-500 ease-out group-hover:scale-[1.04]
                          ${isFaded
                            ? "opacity-[0.11] saturate-0 brightness-[1.7]"
                            : "opacity-100 saturate-100 brightness-100"
                          }
                        `}
                      />
                    )}

                    {cat && CAT_LABEL[cat] && (
                      <div className="absolute bottom-1 left-1 text-[9px] tracking-widest uppercase text-white/0 group-hover:text-white/70 transition-colors bg-black/40 px-1.5 py-0.5 rounded-sm pointer-events-none">
                        {CAT_LABEL[cat]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Великий лейбл знизу ── */}
      <div
        className="fixed bottom-0 left-0 right-0 text-center pointer-events-none pb-4 z-30"
        style={{
          opacity:    displayCat ? 1 : 0,
          transform:  displayCat ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.32s ease, transform 0.32s ease",
        }}
      >
        <div
          className="font-bold text-neutral-900 leading-none tracking-tight"
          style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(2.2rem, 7vw, 6.5rem)" }}
        >
          {displayLabel}
          {displayCat && (
            <span
              className="text-neutral-400 align-super"
              style={{ fontSize: "clamp(0.65rem, 1.2vw, 1rem)", marginLeft: "0.3em", fontFamily: "sans-serif", fontWeight: 300 }}
            >
              ({catCounts[displayCat] ?? 0})
            </span>
          )}
        </div>
        <p className="text-[10px] tracking-[0.22em] uppercase text-neutral-400 mt-0.5">
          {activeCat ? "/ filtered view" : "/ All Photos"}
        </p>
      </div>

      <ScrollHint />
    </div>
  );
}
