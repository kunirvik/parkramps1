// import { useState, useCallback } from "react";

// export function useProductAccordion(openGallery, activeProductIndex) {
//   const [accordionState, setAccordionState] = useState({
//     purchase: null,
//     product: 0,
//     virobi: null,
//   });

//   const handleAccordionToggle = useCallback(
//     (type) => (index) => {
//       if (type === "virobi") {
//         openGallery("sets", activeProductIndex);
//         setAccordionState((prev) => ({ ...prev, virobi: null }));
//         return;
//       }

//       if (type === "purchase") {
//         setAccordionState((prev) => ({
//           virobi: prev.virobi,
//           purchase: prev.purchase === index ? null : index,
//           product: null,
//         }));
//         return;
//       }

//       setAccordionState((prev) => ({
//         virobi: prev.virobi,
//         purchase: null,
//         product: prev.product === index ? null : index,
//       }));
//     },
//     [openGallery, activeProductIndex]
//   );

//   return {
//     accordionState,
//     setAccordionState,
//     handleAccordionToggle,
//   };
// }
import { useState, useCallback } from "react";

export function useProductAccordion(openGallery, productType, activeProductIndex) {
  const [accordionState, setAccordionState] = useState({
    purchase: null,
    product: 0,
    virobi: null,
  });

  // ─── ДЕСКТОП ───────────────────────────────────────────────────────────────
  // У "вироби" на десктопе нет тела аккордеона — клик по заголовку сразу
  // ведёт в галерею. Это осознанный клик по кнопке, поэтому навигация мгновенная.
  const handleAccordionToggle = useCallback(
    (type) => (index) => {
      if (type === "virobi") {
        openGallery(productType, activeProductIndex);
        setAccordionState((prev) => ({ ...prev, virobi: null }));
        return;
      }

      if (type === "purchase") {
        setAccordionState((prev) => ({
          virobi: prev.virobi,
          purchase: prev.purchase === index ? null : index,
          product: null,
        }));
        return;
      }

      setAccordionState((prev) => ({
        virobi: prev.virobi,
        purchase: null,
        product: prev.product === index ? null : index,
      }));
    },
    [openGallery, productType, activeProductIndex]
  );

  // ─── МОБИЛКА ───────────────────────────────────────────────────────────────
  // Тап по вкладке ИЛИ свайп до неё — просто переключает вкладку, включая
  // "вироби": там теперь показывается превью фото, а не мгновенный переход.
  // Сама навигация в галерею происходит только по явному тапу на превью/кнопку
  // внутри контента — см. ProductWorksPreview в ProductInfo.jsx.
  const handleMobileTabSelect = useCallback((index) => {
    setAccordionState((prev) => {
      if (index === 0) {
        return { purchase: prev.purchase === 0 ? null : 0, product: null, virobi: null };
      }
      if (index === 1) {
        return { purchase: null, product: prev.product === 0 ? null : 0, virobi: null };
      }
      if (index === 2) {
        return { purchase: null, product: null, virobi: prev.virobi === 0 ? null : 0 };
      }
      return prev;
    });
  }, []);

  return {
    accordionState,
    setAccordionState,
    handleAccordionToggle,
    handleMobileTabSelect,
  };
}
// import { useState, useCallback } from "react";

// export function useProductAccordion(openGallery, productType, activeProductIndex) {
//   const [accordionState, setAccordionState] = useState({
//     purchase: null,
//     product: 0,
//     virobi: null,
//   });

//   const handleAccordionToggle = useCallback(
//     (type) => (index) => {
//       if (type === "virobi") {
//         openGallery(productType, activeProductIndex);
//         setAccordionState((prev) => ({ ...prev, virobi: null }));
//         return;
//       }

//       if (type === "purchase") {
//         setAccordionState((prev) => ({
//           virobi: prev.virobi,
//           purchase: prev.purchase === index ? null : index,
//           product: null,
//         }));
//         return;
//       }

//       setAccordionState((prev) => ({
//         virobi: prev.virobi,
//         purchase: null,
//         product: prev.product === index ? null : index,
//       }));
//     },
//     [openGallery, productType, activeProductIndex]
//   );

//   return {
//     accordionState,
//     setAccordionState,
//     handleAccordionToggle,
//   };
// }