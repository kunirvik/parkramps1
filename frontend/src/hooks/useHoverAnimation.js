// import { useCallback, useRef } from "react";

// export function useHoverAnimation(isTouchDevice, setState) {
//   const hoverIntervalRef = useRef(null);

//   const getIntervalDuration = useCallback((totalImages) => {
//     if (totalImages <= 1) return null;

//     const minImages = 3;
//     const maxImages = 15;
//     const minInterval = 200;
//     const maxInterval = 1500;

//     if (totalImages <= minImages) return maxInterval;
//     if (totalImages >= maxImages) return minInterval;

//     const ratio = (totalImages - minImages) / (maxImages - minImages);
//     return maxInterval - ratio * (maxInterval - minInterval);
//   }, []);

//   const stopHoverAnimation = useCallback(() => {
//     clearInterval(hoverIntervalRef.current);
//     hoverIntervalRef.current = null;
//   }, []);

//   const startHoverAnimation = useCallback(
//     (index, product) => {
//       if (isTouchDevice) return;

//       stopHoverAnimation();

//       const totalImages = 1 + (product?.altImages?.length || 0);
//       if (totalImages <= 1) return;

//       const intervalDuration = getIntervalDuration(totalImages);

//       hoverIntervalRef.current = setInterval(() => {
//         setState((prev) => {
//           const newIndices = [...prev.selectedImageIndices];
//           const cur = newIndices[index] ?? 0;
//           newIndices[index] = (cur + 1) % totalImages;

//           return {
//             ...prev,
//             selectedImageIndices: newIndices,
//           };
//         });
//       }, intervalDuration);
//     },
//     [getIntervalDuration, isTouchDevice, setState, stopHoverAnimation]
//   );

//   const handleMouseEnter = useCallback(
//     (index, product, canAnimate = true) => {
//       if (isTouchDevice || !canAnimate) return;

//       setState((prev) => ({
//         ...prev,
//         hoveredIndex: index,
//       }));

//       startHoverAnimation(index, product);
//     },
//     [isTouchDevice, setState, startHoverAnimation]
//   );

//   const handleMouseLeave = useCallback(() => {
//     setState((prev) => ({
//       ...prev,
//       hoveredIndex: null,
//     }));
//     stopHoverAnimation();
//   }, [setState, stopHoverAnimation]);

//   return {
//     handleMouseEnter,
//     handleMouseLeave,
//     startHoverAnimation,
//     stopHoverAnimation,
//     getIntervalDuration,
//     hoverIntervalRef,
//   };
// }

// import { useCallback, useRef } from "react";

// export function useHoverAnimation(isTouchDevice, setState) {
//   const hoverIntervalRef = useRef(null);
//   const speedRef = useRef(600);
//   const modeRef = useRef("scrub"); // "scrub" | "interval"

//   const stopHoverAnimation = useCallback(() => {
//     clearInterval(hoverIntervalRef.current);
//     hoverIntervalRef.current = null;
//   }, []);

//   const setSpeed = useCallback((ms) => {
//     speedRef.current = ms;
//   }, []);

//   // Вызывается при mousemove — передаёт конкретный индекс кадра
//   const scrubToFrame = useCallback((productIndex, frameIndex, totalImages) => {
//     if (isTouchDevice || totalImages <= 1) return;
//     setState((prev) => {
//       const newIndices = [...prev.selectedImageIndices];
//       if (newIndices[productIndex] === frameIndex) return prev;
//       newIndices[productIndex] = frameIndex % totalImages;
//       return { ...prev, selectedImageIndices: newIndices };
//     });
//   }, [isTouchDevice, setState]);

//   // Запускает интервальную анимацию (кнопка Play или авто)
//   const startHoverAnimation = useCallback((index, product) => {
//     if (isTouchDevice) return;
//     stopHoverAnimation();
//     const totalImages = 1 + (product?.altImages?.length || 0);
//     if (totalImages <= 1) return;

//     hoverIntervalRef.current = setInterval(() => {
//       setState((prev) => {
//         const newIndices = [...prev.selectedImageIndices];
//         const cur = newIndices[index] ?? 0;
//         newIndices[index] = (cur + 1) % totalImages;
//         return { ...prev, selectedImageIndices: newIndices };
//       });
//     }, speedRef.current);
//   }, [isTouchDevice, setState, stopHoverAnimation]);

//   const handleMouseEnter = useCallback((index, product, canAnimate = true) => {
//     if (isTouchDevice || !canAnimate) return;
//     setState((prev) => ({ ...prev, hoveredIndex: index }));
//     // НЕ запускаем интервал при ховере — используем scrub по mousemove
//   }, [isTouchDevice, setState]);

//   const handleMouseLeave = useCallback(() => {
//     setState((prev) => ({ ...prev, hoveredIndex: null }));
//     stopHoverAnimation();
//   }, [setState, stopHoverAnimation]);

//   return {
//     handleMouseEnter,
//     handleMouseLeave,
//     startHoverAnimation,
//     stopHoverAnimation,
//     scrubToFrame,
//     setSpeed,
//     speedRef,
//   };
// }

// import { useCallback, useRef } from "react";

// const SCRUB_THRESHOLD = 10; // порог переключения режимов

// export function useHoverAnimation(isTouchDevice, setState) {
//   const playIntervalRef = useRef(null);
//   const speedRef = useRef(500);

//   const getTotalImages = (product) =>
//     1 + (product?.altImages?.length || 0);

//   // Определяем режим для конкретного продукта
//   const getMode = useCallback((product) => {
//     return getTotalImages(product) >= SCRUB_THRESHOLD ? "scrub" : "play";
//   }, []);

//   const stopHoverAnimation = useCallback(() => {
//     clearInterval(playIntervalRef.current);
//     playIntervalRef.current = null;
//   }, []);

//   // Скраб: вызывается из onMouseMove, передаём конкретный frameIndex
//   const scrubToFrame = useCallback(
//     (productIndex, frameIndex, totalImages) => {
//       if (isTouchDevice) return;
//       setState((prev) => {
//         const newIndices = [...prev.selectedImageIndices];
//         const clamped = Math.max(0, Math.min(totalImages - 1, frameIndex));
//         if (newIndices[productIndex] === clamped) return prev;
//         newIndices[productIndex] = clamped;
//         return { ...prev, selectedImageIndices: newIndices };
//       });
//     },
//     [isTouchDevice, setState]
//   );

//   // Play-режим: запускает интервал (вызывается по клику)
//   const startPlayAnimation = useCallback(
//     (productIndex, product) => {
//       if (isTouchDevice) return;
//       stopHoverAnimation();
//       const totalImages = getTotalImages(product);
//       if (totalImages <= 1) return;

//       playIntervalRef.current = setInterval(() => {
//         setState((prev) => {
//           const newIndices = [...prev.selectedImageIndices];
//           const cur = newIndices[productIndex] ?? 0;
//           newIndices[productIndex] = (cur + 1) % totalImages;
//           return { ...prev, selectedImageIndices: newIndices };
//         });
//       }, speedRef.current);
//     },
//     [isTouchDevice, setState, stopHoverAnimation]
//   );

//   // handleMouseEnter — только обновляет hoveredIndex, без анимации
//   const handleMouseEnter = useCallback(
//     (index, product, canAnimate = true) => {
//       if (isTouchDevice || !canAnimate) return;
//       setState((prev) => ({ ...prev, hoveredIndex: index }));
//     },
//     [isTouchDevice, setState]
//   );

//   const handleMouseLeave = useCallback(() => {
//     setState((prev) => ({ ...prev, hoveredIndex: null }));
//     stopHoverAnimation();
//   }, [setState, stopHoverAnimation]);

//   return {
//     getMode,
//     handleMouseEnter,
//     handleMouseLeave,
//     scrubToFrame,
//     startPlayAnimation,
//     stopHoverAnimation,
//     playIntervalRef,
//   };
// }

// import { useCallback, useRef, useState } from "react";

// const SCRUB_THRESHOLD = 10;

// export function useHoverAnimation(isTouchDevice, setState) {
//   const playIntervalRef = useRef(null);
//   const scrubReadyRef = useRef(true); // задержка после смены продукта
//   const [userMode, setUserMode] = useState("scrub"); // "scrub" | "play"

//   const getTotalImages = (product) => 1 + (product?.altImages?.length || 0);

//   const getMode = useCallback(
//     (product) => (getTotalImages(product) >= SCRUB_THRESHOLD ? "scrub" : "play"),
//     []
//   );

//   // Заблокировать скраб на N мс (вызывать при смене продукта)
//   const blockScrubBriefly = useCallback((ms = 800) => {
//     scrubReadyRef.current = false;
//     setTimeout(() => { scrubReadyRef.current = true; }, ms);
//   }, []);

//   const stopHoverAnimation = useCallback(() => {
//     clearInterval(playIntervalRef.current);
//     playIntervalRef.current = null;
//   }, []);

//   const scrubToFrame = useCallback(
//     (productIndex, frameIndex, totalImages) => {
//       if (isTouchDevice || !scrubReadyRef.current) return;
//       setState((prev) => {
//         const newIndices = [...prev.selectedImageIndices];
//         const clamped = Math.max(0, Math.min(totalImages - 1, frameIndex));
//         if (newIndices[productIndex] === clamped) return prev;
//         newIndices[productIndex] = clamped;
//         return { ...prev, selectedImageIndices: newIndices };
//       });
//     },
//     [isTouchDevice, setState]
//   );

//   const startPlayAnimation = useCallback(
//     (productIndex, product, speed = 450) => {
//       if (isTouchDevice) return;
//       stopHoverAnimation();
//       const totalImages = getTotalImages(product);
//       if (totalImages <= 1) return;
//       playIntervalRef.current = setInterval(() => {
//         setState((prev) => {
//           const newIndices = [...prev.selectedImageIndices];
//           const cur = newIndices[productIndex] ?? 0;
//           newIndices[productIndex] = (cur + 1) % totalImages;
//           return { ...prev, selectedImageIndices: newIndices };
//         });
//       }, speed);
//     },
//     [isTouchDevice, setState, stopHoverAnimation]
//   );

//   const handleMouseEnter = useCallback(
//     (index, product, canAnimate = true) => {
//       if (isTouchDevice || !canAnimate) return;
//       setState((prev) => ({ ...prev, hoveredIndex: index }));
//     },
//     [isTouchDevice, setState]
//   );

//   const handleMouseLeave = useCallback(() => {
//     setState((prev) => ({ ...prev, hoveredIndex: null }));
//     stopHoverAnimation();
//   }, [setState, stopHoverAnimation]);

//   return {
//     getMode,
//     userMode,
//     setUserMode,
//     handleMouseEnter,
//     handleMouseLeave,
//     scrubToFrame,
//     startPlayAnimation,
//     stopHoverAnimation,
//     blockScrubBriefly,
//   };
// }


import { useCallback, useRef, useState } from "react";

export function useHoverAnimation(isTouchDevice, setState) {
  const playIntervalRef = useRef(null);
  const [userMode, setUserMode] = useState("play");

  const getTotalImages = (product) => 1 + (product?.altImages?.length || 0);

  // Все продукты теперь в режиме play
  const getMode = useCallback(() => "play", []);

  // Заглушка — blockScrubBriefly больше не нужен, но оставим для совместимости
  const blockScrubBriefly = useCallback(() => {}, []);

  const stopHoverAnimation = useCallback(() => {
    clearInterval(playIntervalRef.current);
    playIntervalRef.current = null;
  }, []);

  // scrubToFrame — заглушка (убран скраб)
  const scrubToFrame = useCallback(() => {}, []);

  const startPlayAnimation = useCallback(
    (productIndex, product, speed = 450) => {
      stopHoverAnimation();
      const totalImages = getTotalImages(product);
      if (totalImages <= 1) return;
      playIntervalRef.current = setInterval(() => {
        setState((prev) => {
          const newIndices = [...prev.selectedImageIndices];
          const cur = newIndices[productIndex] ?? 0;
          newIndices[productIndex] = (cur + 1) % totalImages;
          return { ...prev, selectedImageIndices: newIndices };
        });
      }, speed);
    },
    [setState, stopHoverAnimation]
  );

  const handleMouseEnter = useCallback(
    (index, product, canAnimate = true) => {
      if (isTouchDevice || !canAnimate) return;
      setState((prev) => ({ ...prev, hoveredIndex: index }));
    },
    [isTouchDevice, setState]
  );

  const handleMouseLeave = useCallback(() => {
    setState((prev) => ({ ...prev, hoveredIndex: null }));
    stopHoverAnimation();
  }, [setState, stopHoverAnimation]);

  return {
    getMode,
    userMode,
    setUserMode,
    handleMouseEnter,
    handleMouseLeave,
    scrubToFrame,
    startPlayAnimation,
    stopHoverAnimation,
    blockScrubBriefly,
  };
}