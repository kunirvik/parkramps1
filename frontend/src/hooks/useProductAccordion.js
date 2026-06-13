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

  return {
    accordionState,
    setAccordionState,
    handleAccordionToggle,
  };
}