import React, { useRef } from "react";
import { motion } from "framer-motion";

// ==============================================================
// CATEGORY ROULETTE
//
// Вертикальный список категорий. Активная — крупнее, ярче,
// с полоской-акцентом справа. Переключение:
//   - клик по любому слову → сразу переходим на него
//   - колесо мыши (wheel) над рулеткой → двигаемся на 1 категорию
//     вперёд/назад за "щелчок" (с debounce, чтобы один долгий
//     скролл не пролистал сразу несколько категорий)
// ==============================================================

const SCROLL_THRESHOLD = 40; // px накопленного deltaY на одно переключение
const SCROLL_COOLDOWN_MS = 450; // защита от "перелистывания" нескольких сразу

export default function CategoryRoulette({
  words,
  activeIndex,
  onSelect, // (index: number) => void
  onStep, // (direction: 1 | -1) => void
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
      className="category-roulette"
      onWheel={handleWheel}
      style={{
        position: "absolute",
        right: "clamp(16px, 4vw, 64px)",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "6px",
        cursor: "ns-resize",
        userSelect: "none",
      }}
    >
      {words.map((word, i) => {
        const distance = Math.abs(i - activeIndex);
        const isActive = i === activeIndex;

        return (
          <motion.div
            key={word}
            onClick={() => onSelect(i)}
            animate={{
              opacity: isActive ? 1 : Math.max(0.28, 0.65 - distance * 0.18),
              scale: isActive ? 1.15 : Math.max(0.8, 1 - distance * 0.08),
              x: isActive ? -6 : 0,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              fontFamily: "inherit",
              fontWeight: isActive ? 700 : 400,
              fontSize: isActive ? "24px" : "16px",
              lineHeight: 1.2,
              color: isActive
                ? "rgb(249, 168, 212)" // pink-300
                : "rgba(255,255,255,0.65)",
              cursor: "pointer",
              padding: "4px 12px 4px 0",
              whiteSpace: "nowrap",
              borderRight: isActive
                ? "3px solid rgb(249, 168, 212)"
                : "3px solid transparent",
              transition: "color 0.25s ease",
            }}
          >
            {word}
          </motion.div>
        );
      })}
    </div>
  );
}