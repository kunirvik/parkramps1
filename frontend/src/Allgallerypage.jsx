
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
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import FullscreenGallery from "./FullscreenGallery/FullscreenGallery";
import FilmGallery       from "./FilmGallery";

import productCatalogSets       from "./data/productCatalogSets";
import productCatalogRamps      from "./data/productCatalogRamps";
import productCatalogSkateparks from "./data/productCatalogSkateparks";

// ── Произвольные категории, которых нет в продуктах ──────────────────────────
// Добавляй сколько угодно блоков. Слайды — обычный массив { type, src, caption? }
const EXTRA_CATEGORIES = [
  {
    key:    "foam_pit",
    label:  "Поролон. яма",
    slides: [
      { type: "image", src: "/images/foam/foam1.webp", caption: "Поролоновая яма" },
      { type: "image", src: "/images/foam/foam2.webp" },
      { type: "video", src: "/videos/foam_pit_demo.mp4", caption: "В деле" },
    ],
  },
  {
    key:    "events",
    label:  "Events",
    slides: [
      { type: "image", src: "/images/events/ev1.webp", caption: "Соревнование 2024" },
      { type: "image", src: "/images/events/ev2.webp" },
    ],
  },
  // добавляй новые блоки здесь...
];

const extraSlides = [
  { src: "/images/project2026/2015.jpg", cat: "stroyka", caption: "Будівництво рампи" },
  { src: "/images/project2026/2016.jpg", cat: "figures", caption: "3D модель" },
  { src: "/images/project2026/2017.jpg", cat: "stroyka" },
];

// ─── Сборка всех слайдов ─────────────────────────────────────────────────────
function buildGeneralSlides() {
  const fromCatalog = (catalog, defaultCat) =>
    catalog.flatMap((p) =>
      (p.sample || []).map((s) => ({
        ...s,
        cat:         s.type === "video" ? "video" : defaultCat,
        productName: p.name, // <-- ключевое поле для CategoryPanel
      }))
    );

  return [
    ...fromCatalog(productCatalogSets,       "sets"),
    ...fromCatalog(productCatalogRamps,      "ramps"),
    ...fromCatalog(productCatalogSkateparks, "skateparks"),
    ...extraSlides,
  ];
}

export default function AllGalleryPage() {
  const navigate = useNavigate();
  const [filmState, setFilmState] = useState(null);
  const generalSlides = useMemo(buildGeneralSlides, []);

  const handleSelectSlide = ({ slides, index }) =>
    setFilmState({ slides, index });

  const handleCloseFilm = () => setFilmState(null);
  const handleCloseGrid = () => navigate(-1);

  if (filmState) {
    return (
      <FilmGallery
        slides={filmState.slides}
        startIndex={filmState.index}
        onClose={handleCloseFilm}
        extraCategories={EXTRA_CATEGORIES}  // <-- передаём сюда
      />
    );
  }

  return (
    <FullscreenGallery
      slides={generalSlides}
      onClose={handleCloseGrid}
      onSelectSlide={handleSelectSlide}
    />
  );
}