// // src/hooks/useOpenGallery.js
// import { useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import productCatalogSets from "../data/productCatalogSets";
// import productCatalogRamps from "../data/productCatalogRamps";
// import productCatalogSkateparks from "../data/productCatalogSkateparks";

// const ALL_CATALOGS = [
//   ...productCatalogSets,
//   ...productCatalogRamps,
//   ...productCatalogSkateparks,
// ];

// const CATALOGS = {
//   sets: productCatalogSets,
//   ramps: productCatalogRamps,
//   skateparks: productCatalogSkateparks,
// };

// export function useOpenGallery() {
//   const navigate = useNavigate();

//   const openGallery = useCallback((type, activeProductIndex) => {
//     const catalog = CATALOGS[type];
//     if (!catalog) return;

//     const currentProduct = catalog[activeProductIndex];
//     if (!currentProduct) return;

//     const globalIndex = ALL_CATALOGS.findIndex(
//       (product) => product.id === currentProduct.id
//     );

//     if (globalIndex === -1) return;

//     const startIndex = ALL_CATALOGS
//       .slice(0, globalIndex)
//       .reduce((acc, product) => acc + (product.sample?.length || 0), 0);

//     navigate(`/gallery/${type}/${currentProduct.id}`, {
//       state: { startIndex },
//     });
//   }, [navigate]);

//   return openGallery;
// }


import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import productCatalogSets       from "../data/productCatalogSets";
import productCatalogRamps      from "../data/productCatalogRamps";
import productCatalogSkateparks from "../data/productCatalogSkateparks";

const ALL_CATALOGS = [
  ...productCatalogSets,
  ...productCatalogRamps,
  ...productCatalogSkateparks,
];

const CATALOGS = {
  sets:       productCatalogSets,
  ramps:      productCatalogRamps,
  skateparks: productCatalogSkateparks,
};


const TYPED_CATALOGS = [
  ...productCatalogSets.map((p)       => ({ ...p, _type: "sets" })),
  ...productCatalogRamps.map((p)      => ({ ...p, _type: "ramps" })),
  ...productCatalogSkateparks.map((p) => ({ ...p, _type: "skateparks" })),
]; 

export function useOpenGallery() {
  const navigate = useNavigate();
  const location = useLocation();

  const openGallery = useCallback((type, activeProductIndex) => {
    const catalog = CATALOGS[type];
    if (!catalog) return;

    const currentProduct = catalog[activeProductIndex];
    if (!currentProduct) return;

    // const globalIndex = ALL_CATALOGS.findIndex(
    //   (p) => p.id === currentProduct.id
    // );
    const globalIndex = TYPED_CATALOGS.findIndex(
  (p) => p.id === currentProduct.id && p._type === type  // ← добавить && p._type === type
);
    if (globalIndex === -1) return;

    // const startIndex = ALL_CATALOGS
    //   .slice(0, globalIndex)
    //   .reduce((acc, p) => acc + (p.sample?.length || 0), 0);

    const startIndex = TYPED_CATALOGS
  .slice(0, globalIndex)
  .reduce((acc, p) => acc + (p.sample?.length || 0), 0);

    navigate(`/gallery/${type}/${currentProduct.id}`, {
      state: {
        // startIndex,
         productId: currentProduct.id,
        // откуда пришли — чтобы вернуться при закрытии
        originPath:  location.pathname,
        // имя продукта — чтобы автоматически выставить активную категорию
        productName: currentProduct.name,
      },
    });
  }, [navigate, location.pathname]);

  return openGallery;
}

// import { useMemo }          from "react";
// import { useNavigate, useLocation, useParams } from "react-router-dom";
// import FilmGallery          from "../FilmGallery.jsx";
// import productCatalogSets       from "../data/productCatalogSets";
// import productCatalogRamps      from "../data/productCatalogRamps";
// import productCatalogSkateparks from "../data/productCatalogSkateparks";

// const ALL_CATALOGS = [
//   ...productCatalogSets,
//   ...productCatalogRamps,
//   ...productCatalogSkateparks,
// ];

// // ── Произвольные категории без страниц продуктов ──────────────────────────────
// export const EXTRA_CATEGORIES = [
//   {
//     key:   "foam_pit",
//     label: "Поролон. яма",
//     slides: [
//       { type: "image", src: "/images/foam/foam1.webp",  caption: "Поролонова яма" },
//       { type: "image", src: "/images/foam/foam2.webp" },
//     ],
//   },
//   {
//     key:   "events",
//     label: "Events",
//     slides: [
//       { type: "image", src: "/images/events/ev1.webp", caption: "Змагання 2024" },
//     ],
//   },
//   // додавай нові блоки тут...
// ];

// // ── Собираем ВСЕ слайды: каталоги + extraCategories ──────────────────────────
// function buildAllSlides() {
//   const fromCatalog = ALL_CATALOGS.flatMap((p) =>
//     (p.sample || []).map((s) => ({
//       ...s,
//       productName: p.name,   // для категорий
//       productId:   p.id,     // для кнопки "відкрити виріб"
//       productType: (() => {
//         if (productCatalogSets.find((x) => x.id === p.id))       return "sets";
//         if (productCatalogRamps.find((x) => x.id === p.id))      return "ramps";
//         if (productCatalogSkateparks.find((x) => x.id === p.id)) return "skateparks";
//         return null;
//       })(),
//     }))
//   );

//   const fromExtra = EXTRA_CATEGORIES.flatMap((ec) =>
//     ec.slides.map((s) => ({ ...s, _extraCat: ec.key }))
//   );

//   return [...fromCatalog, ...fromExtra];
// }

// export default function useOpenGallery() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { startIndex = 0, originPath = "/", productName = null } =
//     location.state || {};

//   const allSlides = useMemo(buildAllSlides, []);

//   // Закрыть → вернуться туда, откуда пришли
//   const handleClose = () => navigate(originPath);

//   return (
//     <FilmGallery
//       slides={allSlides}
//       startIndex={startIndex}
//       initialCategory={productName}   // автоматически активная категория
//       onClose={handleClose}
//       extraCategories={EXTRA_CATEGORIES}
//       originPath={originPath}
//     />
//   );
// }