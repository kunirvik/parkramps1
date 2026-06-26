// Здесь добавляй произвольные категории, которых нет в productCatalog*
// Формат слайда: { type: "image" | "video", src: "...", caption: "..." }

const extraCategories = [
  {
    name: "foam pit",           // ← будет отображаться как кнопка
    label: "Поролонова яма",    // ← человекочитаемый заголовок (опционально)
    slides: [
      { type: "image", src: "/images/sample/foampit1.webp", caption: "Поролонова яма" },
      { type: "image", src: "/images/sample/foampit2.webp" },
      { type: "video", src: "/videos/foampit.mp4", caption: "Прыжок в яму" },
    ],
  },
  // Добавляй новые категории по той же схеме:
  // {
  //   name: "halfpipe",
  //   label: "Халфпайп",
  //   slides: [ ... ],
  // },
];

export default extraCategories;