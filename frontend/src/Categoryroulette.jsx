import React, { useRef } from "react";
import { motion } from "framer-motion";

// ==============================================================
// CATEGORY ROULETTE
//
// Вертикальный список категорий СЛЕВА от экрана.
//   - активная категория: opacity 1, ярче/крупнее, акцент слева
//   - остальные: одинаковый приглушённый opacity (без градиента
//     по расстоянию — просто "накинутая" полупрозрачность)
//   - клик по слову → переход на него
//   - колесо мыши над рулеткой → шаг вперёд/назад, с debounce
// ==============================================================

const SCROLL_THRESHOLD = 40;
const SCROLL_COOLDOWN_MS = 450;

const INACTIVE_OPACITY = 0.4; // ИЗМЕНЕНО: единая приглушённость для неактивных

export default function CategoryRoulette({
  words,
  activeIndex,
  onSelect,
  onStep,
}) {
  const wheelAccumRef = useRef(0);
  const cooldownRef = useRef(false);

  const handleWheel = (e) => {
    e.preventDefault();

    if (cooldownRef.current) return;

    wheelAccumRef.current += e.deltaY;

    if (Math.abs(wheelAccumRef.current) > SCROLL_THRESHOLD) {
      const direction = wheelAccumRef.current > 0 ? 1 : -1;

      onStep(direction);

      wheelAccumRef.current = 0;
      cooldownRef.current = true;

      setTimeout(() => {
        cooldownRef.current = false;
      }, SCROLL_COOLDOWN_MS);
    }
  };

  return (
    <div
      className="category-roulette font-futura"
      onWheel={handleWheel}
      style={{
        position: "absolute",
        left: "clamp(16px, 4vw, 64px)", // ИЗМЕНЕНО: было right → теперь left
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start", // ИЗМЕНЕНО: выравнивание по левому краю
        gap: "10px",
        cursor: "ns-resize",
        userSelect: "none",
      }}
    >
      {words.map((word, i) => {
        const isActive = i === activeIndex;

        return (
          <motion.div
            key={word}
            onClick={() => onSelect(i)}
            animate={{
              opacity: isActive ? 1 : INACTIVE_OPACITY,
              scale: isActive ? 1.15 : 1,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="font-futura"
            style={{
              fontWeight: isActive ? 700 : 400,
              fontSize: isActive ? "26px" : "18px",
              lineHeight: 1.2,
              color: isActive
                ? "rgb(249, 168, 212)" // pink-300 — яркая активная
                : "rgba(255,255,255,0.9)",
              cursor: "pointer",
              padding: "4px 0 4px 12px",
              whiteSpace: "nowrap",
              borderLeft: isActive
                ? "3px solid rgb(249, 168, 212)"
                : "3px solid transparent",
              transition: "color 0.25s ease, font-size 0.25s ease",
            }}
          >
            {word}
          </motion.div>
        );
      })}
    </div>
  );
}