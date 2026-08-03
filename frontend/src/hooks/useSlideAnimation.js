// import { useCallback, useRef, useState } from "react";
// import gsap from "gsap";

// const ANIMATION_CONFIG = {
//   DURATION: 0.6,
//   EASE: "power2.out",
//   HALF_DURATION: 0.3,
// };

// export function useSlideAnimation({ imageData, refs, thumbsShown, updateState, onTransitionComplete }) {
//   const [animationState, setAnimationState] = useState({
//     complete: !imageData,
//     inProgress: false,
//     slideChanging: false,
//   });

//   const animationInProgressRef = useRef(false);

//   const updateAnimationState = useCallback((updates) => {
//     setAnimationState((prev) => ({ ...prev, ...updates }));
//   }, []);

//   const animateInfo = useCallback((direction = "in") => {
//     if (!refs.current.info) return Promise.resolve();

//     const isIn = direction === "in";

//     return new Promise((resolve) => {
//       gsap.to(refs.current.info, {
//         opacity: isIn ? 1 : 0,
//         y: isIn ? 0 : 20,
//         duration: isIn
//           ? ANIMATION_CONFIG.DURATION
//           : ANIMATION_CONFIG.HALF_DURATION,
//         ease: ANIMATION_CONFIG.EASE,
//         onComplete: resolve,
//       });
//     });
//   }, [refs]);

//   const showInfoAndThumbs = useCallback(() => {
//     const targets = [
//       refs.current.info,
//       refs.current.thumbs,
//       refs.current.purchaceAccordion,
//       refs.current.productionAccordion,
//     ].filter(Boolean);

//     const animations = targets.map((el) =>
//       gsap.fromTo(
//         el,
//         { opacity: 0, y: 20 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: ANIMATION_CONFIG.DURATION,
//           ease: ANIMATION_CONFIG.EASE,
//         }
//       )
//     );

//     return Promise.all(
//       animations.map(
//         (anim) =>
//           new Promise((resolve) => anim.eventCallback("onComplete", resolve))
//       )
//     );
//   }, [refs]);

//   const startTransitionAnimation = useCallback(() => {
//     if (
//       !refs.current.transitionImage ||
//       !refs.current.swiperContainer ||
//       !imageData ||
//       animationInProgressRef.current
//     ) {
//       updateAnimationState({ complete: true });
//       return;
//     }

//     animationInProgressRef.current = true;
//     updateAnimationState({ inProgress: true });

//     const { top, left, width, height } = imageData.rect;
//     const transitionEl = refs.current.transitionImage;
//     const swiperEl = refs.current.swiperContainer;
//     const firstSlideImage = swiperEl.querySelector(".swiper-slide-active img");

//     if (!firstSlideImage) {
//       console.warn("Активное изображение слайда не найдено");
//       animationInProgressRef.current = false;
//       updateAnimationState({ complete: true, inProgress: false });
//       return;
//     }

//     const finalRect = firstSlideImage.getBoundingClientRect();

//     if (finalRect.width === 0 || finalRect.height === 0) {
//       animationInProgressRef.current = false;
//       setTimeout(() => {
//         updateAnimationState({ inProgress: false });
//         startTransitionAnimation();
//       }, 100);
//       return;
//     }

//     gsap.set(swiperEl, { visibility: "hidden", opacity: 0 });

//     gsap.set(transitionEl, {
//       position: "absolute",
//        top: top,     // без вычитания
//   left: left,
//       // top: top - window.scrollY,
//       // left: left - window.scrollX,
//       width,
//       height,
//       zIndex: 1000,
//       opacity: 1,
//       visibility: "visible",
//       objectFit: "contain",
//       borderRadius: imageData.borderRadius || "0px",
//       pointerEvents: "none",
//     });

//     gsap.to(transitionEl, {
      
//        top: finalRect.top,
//   left: finalRect.left,
//       // top: finalRect.top - window.scrollY,
//       // left: finalRect.left - window.scrollX,
//       width: finalRect.width,
//       height: finalRect.height,
//       borderRadius: "12px",
//       duration: ANIMATION_CONFIG.DURATION,
//       ease: ANIMATION_CONFIG.EASE,
//       onComplete: async () => {
//         gsap.set(swiperEl, { visibility: "visible", opacity: 1 });
//         gsap.set(transitionEl, { visibility: "hidden", opacity: 0 });

  
//         updateAnimationState({ complete: true });
// if (typeof onTransitionComplete === "function") {
//     onTransitionComplete();
//   }
//         if (!thumbsShown) {
//           await showInfoAndThumbs();
//           updateState({ thumbsShown: true });
//         }

//         animationInProgressRef.current = false;
//         updateAnimationState({ inProgress: false });
//       },
//     });
//   }, [
//     imageData,
//     refs,
//     thumbsShown,
//     showInfoAndThumbs,
//     updateAnimationState,
//     updateState,
//   ]);

//   return {
//     animationState,
//     animationInProgressRef,
//     updateAnimationState,
//     animateInfo,
//     showInfoAndThumbs,
//     startTransitionAnimation,
//   };
// }

import { useCallback, useRef, useState } from "react";
import gsap from "gsap";

const ANIMATION_CONFIG = {
  DURATION: 0.6,
  EASE: "power2.out",
  HALF_DURATION: 0.3,
};

export function useSlideAnimation({ imageData, refs, thumbsShown, updateState, onTransitionComplete }) {
  const [animationState, setAnimationState] = useState({
    complete: !imageData,
    inProgress: false,
    slideChanging: false,
  });

  const animationInProgressRef = useRef(false);

  const updateAnimationState = useCallback((updates) => {
    setAnimationState((prev) => ({ ...prev, ...updates }));
  }, []);

  const animateInfo = useCallback((direction = "in") => {
    if (!refs.current.info) return Promise.resolve();

    const isIn = direction === "in";

    return new Promise((resolve) => {
      gsap.to(refs.current.info, {
        opacity: isIn ? 1 : 0,
        y: isIn ? 0 : 20,
        duration: isIn
          ? ANIMATION_CONFIG.DURATION
          : ANIMATION_CONFIG.HALF_DURATION,
        ease: ANIMATION_CONFIG.EASE,
        onComplete: resolve,
      });
    });
  }, [refs]);

  const showInfoAndThumbs = useCallback(() => {
    const targets = [
      refs.current.info,
      refs.current.thumbs,
      refs.current.purchaceAccordion,
      refs.current.productionAccordion,
    ].filter(Boolean);

    const animations = targets.map((el) =>
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: ANIMATION_CONFIG.DURATION,
          ease: ANIMATION_CONFIG.EASE,
        }
      )
    );

    return Promise.all(
      animations.map(
        (anim) =>
          new Promise((resolve) => anim.eventCallback("onComplete", resolve))
      )
    );
  }, [refs]);

  const startTransitionAnimation = useCallback(async () => {
    if (
      !refs.current.transitionImage ||
      !refs.current.swiperContainer ||
      !imageData ||
      animationInProgressRef.current
    ) {
      updateAnimationState({ complete: true });
      return;
    }

    animationInProgressRef.current = true;
    updateAnimationState({ inProgress: true });

    const startRect = imageData.rect; // откуда стартуем (клик в каталоге)
    const transitionEl = refs.current.transitionImage;
    const swiperEl = refs.current.swiperContainer;
    const firstSlideImage = swiperEl.querySelector(".swiper-slide-active img");

    if (!firstSlideImage) {
      console.warn("Активное изображение слайда не найдено");
      animationInProgressRef.current = false;
      updateAnimationState({ complete: true, inProgress: false });
      return;
    }

    // Дожидаемся, пока целевая картинка реально декодирована —
    // иначе finalRect уже есть (layout посчитан), а пиксели ещё не готовы,
    // и в момент показа свайпера будет видимый "скачок" картинки.
    if (!firstSlideImage.complete) {
      try {
        await firstSlideImage.decode();
      } catch {
        // игнорируем ошибку декодирования, продолжаем как есть
      }
    }

    const finalRect = firstSlideImage.getBoundingClientRect();

    if (finalRect.width === 0 || finalRect.height === 0) {
      animationInProgressRef.current = false;
      setTimeout(() => {
        updateAnimationState({ inProgress: false });
        startTransitionAnimation();
      }, 100);
      return;
    }

    // ── FLIP ──────────────────────────────────────────────────────────
    // 1) Ставим элемент СРАЗУ в конечные position/size (как раньше делали
    //    только в конце анимации), но добавляем "инвертирующий" transform,
    //    визуально помещающий его в стартовую позицию/размер.
    // 2) Анимируем ТОЛЬКО transform к identity — это работает на
    //    композиторе (GPU), не трогая layout на каждом кадре.

    const scaleX = startRect.width / finalRect.width;
    const scaleY = startRect.height / finalRect.height;

    // Смещение от левого верхнего угла конечного прямоугольника
    // до левого верхнего угла стартового (с поправкой на разницу
    // в масштабе, чтобы это была именно точка top-left).
    const translateX = startRect.left - finalRect.left;
    const translateY = startRect.top - finalRect.top;

    gsap.set(swiperEl, { visibility: "hidden", opacity: 0 });

    gsap.set(transitionEl, {
      position: "fixed",
      top: finalRect.top,
      left: finalRect.left,
      width: finalRect.width,
      height: finalRect.height,
      zIndex: 1000,
      opacity: 1,
      visibility: "visible",
      objectFit: "contain",
      borderRadius: imageData.borderRadius || "0px",
      pointerEvents: "none",
      transformOrigin: "top left",
      willChange: "transform, opacity",
      // Инвертирующий transform — визуально элемент выглядит
      // так, будто он всё ещё в startRect
      x: translateX,
      y: translateY,
      scaleX,
      scaleY,
    });

    gsap.to(transitionEl, {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      borderRadius: "12px",
      duration: ANIMATION_CONFIG.DURATION,
      ease: ANIMATION_CONFIG.EASE,
      onComplete: async () => {
        gsap.set(swiperEl, { visibility: "visible", opacity: 1 });
        gsap.set(transitionEl, { visibility: "hidden", opacity: 0, willChange: "auto" });

        updateAnimationState({ complete: true });
        if (typeof onTransitionComplete === "function") {
          onTransitionComplete();
        }
        if (!thumbsShown) {
          await showInfoAndThumbs();
          updateState({ thumbsShown: true });
        }

        animationInProgressRef.current = false;
        updateAnimationState({ inProgress: false });
      },
    });
  }, [
    imageData,
    refs,
    thumbsShown,
    showInfoAndThumbs,
    updateAnimationState,
    updateState,
    onTransitionComplete,
  ]);

  return {
    animationState,
    animationInProgressRef,
    updateAnimationState,
    animateInfo,
    showInfoAndThumbs,
    startTransitionAnimation,
  };
} 