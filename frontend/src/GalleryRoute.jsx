
// import { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
 
// import FullscreenGallery from "./FullscreenGallery/FullscreenGallery";
// import FilmGallery       from "./FilmGallery";
 
// import productCatalogSets       from "./data/productCatalogSets";
// import productCatalogRamps      from "./data/productCatalogRamps";
// import productCatalogSkateparks from "./data/productCatalogSkateparks";
 

// const extraSlides = [
//    // ── Фото ──────────────────────────────────────────────────────────────────
//   {
//     src:     "/images/project2026/2015.jpg",
//     cat:     "stroyka",
//     caption: "Будівництво рампи",
//   },
//   {
//     src:     "/images/project2026/2016.jpg",
//     cat:     "figures",
//     caption: "3D модель",
//   },
//   {
//     src:     "/images/project2026/2017.jpg",
//     cat:     "stroyka",
//   },
// ];
 

 
// // ─── Збірка всіх слайдів загальної галереї ────────────────────────────────
// function buildGeneralSlides() {
//   const fromCatalog = (catalog, defaultCat) =>
//     catalog.flatMap((p) =>
//       (p.sample || []).map((s) => ({
//         ...s,
//         cat: s.type === "video" ? "video" : defaultCat,
//       }))
//     );
//   return [
//     ...fromCatalog(productCatalogSets,       "sets"),
//     ...fromCatalog(productCatalogRamps,      "ramps"),
//     ...fromCatalog(productCatalogSkateparks, "skateparks"),
//     ...extraSlides,
//   ];
// }
 
// export default function AllGalleryPage() {
//   const navigate = useNavigate();
 
//   // null = сітка, { slides, index } = FilmGallery
//   const [filmState, setFilmState] = useState(null);
 
//   const generalSlides = useMemo(buildGeneralSlides, []);
 
//   // FullscreenGallery тепер передає { slides, index }:
//   //   slides = відфільтрований масив (або всі)
//   //   index  = позиція кліканого фото у цьому масиві
//   const handleSelectSlide = ({ slides, index }) => {
//     setFilmState({ slides, index });
//   };
 
//   // Закрити FilmGallery → назад у сітку
//   const handleCloseFilm = () => setFilmState(null);
 
//   // Закрити сітку → назад (каталог / продукт)
//   const handleCloseGrid = () => navigate(-1);
 
//   if (filmState) {
//     return (
//       <FilmGallery
//         slides={filmState.slides}
//         startIndex={filmState.index}
//         // onClose → кнопка × і кнопка сітки обидві повертають у сітку
//         onClose={handleCloseFilm}
//       />
//     );
//   }
 
//   return (
//     <FullscreenGallery
//       slides={generalSlides}
//       onClose={handleCloseGrid}
//       onSelectSlide={handleSelectSlide}
//     />
//   );
// }
// AllGalleryPage.jsx
// src/pages/GalleryRoute.jsx  (или где у тебя роут /gallery/:type/:id)
import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FilmGallery from "./FilmGallery";
import productCatalogSets       from "./data/productCatalogSets";
import productCatalogRamps      from "./data/productCatalogRamps";
import productCatalogSkateparks from "./data/productCatalogSkateparks";

const ALL_CATALOGS = [
  ...productCatalogSets,
  ...productCatalogRamps,
  ...productCatalogSkateparks,
];

export const EXTRA_CATEGORIES = [
  {
    key:   "foam_pit",
    label: "Поролон. яма",
    slides: [
      { type: "image", src: "/images/foam/foam1.webp", caption: "Поролонова яма" },
      { type: "image", src: "/images/foam/foam2.webp" },
    ],
  },
  {
    key:   "events",
    label: "Events",
    slides: [
      { type: "image", src: "/images/events/ev1.webp", caption: "Змагання 2024" },
    ],
  },
];

// productType вычисляется один раз при импорте модуля
const TYPE_MAP = new Map([
  ...productCatalogSets.map((p)       => [p.id, "sets"]),
  ...productCatalogRamps.map((p)      => [p.id, "ramps"]),
  ...productCatalogSkateparks.map((p) => [p.id, "skateparks"]),
]);

function buildAllSlides() {
  const fromCatalog = ALL_CATALOGS.flatMap((p) =>
    (p.sample || []).map((s) => ({
      ...s,
      productName: p.name,
      productId:   p.id,
      productType: TYPE_MAP.get(p.id) ?? null,
    }))
  );

  // extraCategories слайды — добавляем _extraCat, НЕ передаём в FilmGallery
  // отдельно через extraCategories проп, чтобы не дублировались
  const fromExtra = EXTRA_CATEGORIES.flatMap((ec) =>
    ec.slides.map((s) => ({ ...s, _extraCat: ec.key }))
  );

  return [...fromCatalog, ...fromExtra];
}

export default function GalleryRoute() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    startIndex  = 0,
    originPath  = "/",
    productName = null,
  } = location.state || {};

  // allSlides уже содержат extraCategories слайды — передаём пустой массив
  // в FilmGallery чтобы они не добавились второй раз
  const allSlides = useMemo(buildAllSlides, []);

  const handleClose = () => navigate(originPath);

  return (
    <FilmGallery
      slides={allSlides}
      startIndex={startIndex}
      initialCategory={productName}
      onClose={handleClose}
      extraCategories={EXTRA_CATEGORIES}
      originPath={originPath}
    />
  );
} 