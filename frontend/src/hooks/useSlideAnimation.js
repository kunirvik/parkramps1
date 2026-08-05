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

  const startTransitionAnimation = useCallback(() => {
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

    const { top, left, width, height } = imageData.rect;
    const transitionEl = refs.current.transitionImage;
    const swiperEl = refs.current.swiperContainer;
    const firstSlideImage = swiperEl.querySelector(".swiper-slide-active img");

    if (!firstSlideImage) {
      console.warn("Активное изображение слайда не найдено");
      animationInProgressRef.current = false;
      updateAnimationState({ complete: true, inProgress: false });
      return;
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

    gsap.set(swiperEl, { visibility: "hidden", opacity: 0 });

    gsap.set(transitionEl, {
      position: "absolute",
       top: top,     // без вычитания
  left: left,
      // top: top - window.scrollY,
      // left: left - window.scrollX,
      width,
      height,
      zIndex: 1000,
      opacity: 1,
      visibility: "visible",
      objectFit: "contain",
      borderRadius: imageData.borderRadius || "0px",
      pointerEvents: "none",
    });

    gsap.to(transitionEl, {
      
       top: finalRect.top,
  left: finalRect.left,
      // top: finalRect.top - window.scrollY,
      // left: finalRect.left - window.scrollX,
      width: finalRect.width,
      height: finalRect.height,
      borderRadius: "12px",
      duration: ANIMATION_CONFIG.DURATION,
      ease: ANIMATION_CONFIG.EASE,
      onComplete: async () => {
        gsap.set(swiperEl, { visibility: "visible", opacity: 1 });
        gsap.set(transitionEl, { visibility: "hidden", opacity: 0 });

  
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

//   const startTransitionAnimation = useCallback(async () => {
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

//     const startRect = imageData.rect;
//     const transitionEl = refs.current.transitionImage;
//     const swiperEl = refs.current.swiperContainer;
//     const firstSlideImage = swiperEl.querySelector(".swiper-slide-active img");

//     if (!firstSlideImage) {
//       console.warn("Активное изображение слайда не найдено");
//       animationInProgressRef.current = false;
//       updateAnimationState({ complete: true, inProgress: false });
//       return;
//     }

//     if (!firstSlideImage.complete) {
//       try {
//         await firstSlideImage.decode();
//       } catch {
//         // игнорируем ошибку декодирования
//       }
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

//     // ── FLIP (без искажения пропорций) ──────────────────────────────────
//     // Элемент сразу получает финальный layout-размер (finalRect),
//     // а "визуальный откат" к стартовой позиции/размеру делаем через
//     // ЕДИНЫЙ (uniform) scale — не scaleX/scaleY по отдельности.
//     // Это гарантирует, что пиксели картинки никогда не растягиваются
//     // неравномерно по осям (никакого "сплющивания").

//     const startCenterX = startRect.left + startRect.width / 2;
//     const startCenterY = startRect.top + startRect.height / 2;
//     const finalCenterX = finalRect.left + finalRect.width / 2;
//     const finalCenterY = finalRect.top + finalRect.height / 2;

//     const scaleX = startRect.width / finalRect.width;
//     const scaleY = startRect.height / finalRect.height;
//     // Берём меньший коэффициент: тогда элемент точно "войдёт" в размер
//     // стартовой рамки хотя бы по одной оси, без растяжения по другой.
//     // (альтернатива — Math.max, если хочется наоборот "перекрыть" рамку)
//     const scale = Math.min(scaleX, scaleY);

//     const translateX = startCenterX - finalCenterX;
//     const translateY = startCenterY - finalCenterY;

//     gsap.set(swiperEl, { visibility: "hidden", opacity: 0 });

//     gsap.set(transitionEl, {
//       position: "fixed",
//       top: finalRect.top,
//       left: finalRect.left,
//       width: finalRect.width,
//       height: finalRect.height,
//       zIndex: 1000,
//       opacity: 1,
//       visibility: "visible",
//       objectFit: "contain",
//       borderRadius: imageData.borderRadius || "0px",
//       pointerEvents: "none",
//       transformOrigin: "center center",
//       willChange: "transform, opacity",
//       x: translateX,
//       y: translateY,
//       scale: scale,
//     });

//     gsap.to(transitionEl, {
//       x: 0,
//       y: 0,
//       scale: 1,
//       borderRadius: "12px",
//       duration: ANIMATION_CONFIG.DURATION,
//       ease: ANIMATION_CONFIG.EASE,
//       onComplete: async () => {
//         gsap.set(swiperEl, { visibility: "visible", opacity: 1 });
//         gsap.set(transitionEl, { visibility: "hidden", opacity: 0, willChange: "auto" });

//         updateAnimationState({ complete: true });
//         if (typeof onTransitionComplete === "function") {
//           onTransitionComplete();
//         }
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
//     onTransitionComplete,
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