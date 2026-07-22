
const CLOUDINARY = import.meta.env.VITE_CLOUDINARY_BASE_URL; 
 
const productCatalogRamps = [
  {
    id: 1,
    name: "ramp60",
    image: `${CLOUDINARY}v1783065914/minir180h60w200d40alt_gu3fkf.webp`,
    altImages: [
     ` "/images/ramps/webp/minir180h60w200d40.webp"`,
      "/images/ramps/webp/minir180h60w200d40frontalt.webp",
      `${CLOUDINARY}v1783070408/minir180h60w200d40top_vqigeg.webp`,
      `${CLOUDINARY}v1783065931/minir180h60w200d40frontalt_vv0u3h.webp`,
    ],
    // sample: [
      // { type: "image", src: "/images/sample1.jpg" },
      // { type: "image", src: "/images/sample2.jpg" },
      // { type: "image", src: "/images/sample3.jpg" },
    // ],
     specs: [
    { label: "Висота", value: "80 см" },
    { label: "Ширина", value: "125 см" },
    { label: "Матеріал", value: " фанера / брус / cталь " },

  ],
    designer: "",
    year: 2023,
        description: "Замовити можна за посиланням нижче. Підберемо розміри, порахуємо вартість і зробимо проєкт під ваш майданчик.",

    description2:
    "найменше матеріалу найменше місця найменша ціна. можна поставити хоч у квартирі. для будь-якого рівня катання. матеріали преміум-класу. довговічність. ",
    relatedProducts: [2, 3, 4],
  },

  {
    id: 2,
    name: "ramp95",
    image: `${CLOUDINARY}v1784729679/minir180h60w200d40alt_fzqqxg.png`,
    altImages: [
      `${CLOUDINARY}v1783082001/ramp95garagetop_jsjk7m.webp`,
      `${CLOUDINARY}v1783081994/ramp95garage_dgrjv7.webp`,
    ],
     specs: [
    { label: "Висота", value: "80 см" },
    { label: "Ширина", value: "125 см" },
    { label: "Матеріал", value: " фанера / брус / cталь " },

  ],
    // sample: [
    //   { type: "image", src: "/images/sample1.jpg" },
    //   { type: "image", src: "/images/sample2.jpg" },
    //   { type: "image", src: "/images/sample3.jpg" },
    // ],
    designer: "",
    year: 2024,
    description:
      "Замовити можна за посиланням нижче. Підберемо розміри, порахуємо вартість і зробимо проєкт під ваш майданчик.",
    description2:
      "маленька рампа. Універсальний halfpipe для шкіл, спортивних секцій та молодіжних центрів. Поєднує безпечну геометрію та достатній розмір для регулярних тренувань. Добре підходить для навчальних програм, занять з інструктором та розвитку навичок райдерів різного рівня.",
    details: [{ title: "kаталог фигур", link: "#catalog" }],
    relatedProducts: [1, 3, 4],
  },

  {
    id: 3,
    name: "ramp125",
    image: `${CLOUDINARY}v1783081903/rampr250h125w375d125_bufljg.webp`,
    altImages: [
      `${CLOUDINARY}v1783081900/rampr250h125w375d125top_mgndpe.webp`,
      `${CLOUDINARY}v1783081897/rampr250h125w375d125front_vltlhx.webp`,
    ],
     specs: [
    { label: "Висота", value: "80 см" },
    { label: "Ширина", value: "125 см" },
    { label: "Матеріал", value: " фанера / брус / cталь " },

  ],
    // sample: [
    //   { type: "image", src: "/images/sample1.jpg" },
    //   { type: "image", src: "/images/sample2.jpg" },
    //   { type: "image", src: "/images/sample3.jpg" },
    // ],
    designer: "",
    year: 2024,
    description:
      "Замовити можна за посиланням нижче. Підберемо розміри, порахуємо вартість і зробимо проєкт під ваш майданчик.",
    description2:
      "Середньорозмірний halfpipe для фестивалів, міських заходів та спортивних подій. Забезпечує динамічне катання та видовищні виступи, залишаючись доступним для широкого кола райдерів. Оптимальний вибір для тимчасових або мобільних екстрим-зон.",
    details: [{ title: "kаталог фигур", link: "#catalog" }],
    relatedProducts: [1, 2, 4],
  },

  {
    id: 4,
    name: "ramp125",
    image: `${CLOUDINARY}v1783081688/rampskl_jc8h6k.webp`,
    altImages: [
      `${CLOUDINARY}v1783081688/rampsklfront_ayuxqi.webp`,
     `${CLOUDINARY}v1783081688/rampskltop_ayuxqi.webp`,
    ],
     specs: [
    { label: "Висота", value: "80 см" },
    { label: "Ширина", value: "125 см" },
    { label: "Матеріал", value: " фанера / брус / cталь " },

  ],
    // sample: [
    //   { type: "image", src: "/images/sample1.jpg" },
    //   { type: "image", src: "/images/sample2.jpg" },
    //   { type: "image", src: "/images/sample3.jpg" },
    // ],
    designer: "",
    year: 2023,
    description:
      "Пиши нам у месенджер...",
    description2:
      "Повнорозмірний halfpipe для скейтпарків та спортивних комплексів. Створений для інтенсивного використання та щоденних тренувань. Дозволяє набирати високу швидкість, виконувати серії трюків та органічно доповнює професійну інфраструктуру парк",
    details: [{ title: "kаталог фигур", link: "#catalog" }],
    relatedProducts: [1, 2, 3],
  },

  {
    id: 5,
    name: "ramp180",
    image: `${CLOUDINARY}v1783081610/midiramp_oyrfpm.webp`,
    altImages: [
      `${CLOUDINARY}v1783065928/midiramptop_gio5ap.webp`,
      `${CLOUDINARY}v1783081609/midirampfront_t43qas.webp`,
    ],
    // sample: [
    //   { type: "image", src: "/images/sample1.jpg" },
    //   { type: "image", src: "/images/sample2.jpg" },
    //   { type: "image", src: "/images/sample3.jpg" },
    // ],
         specs: [
    { label: "Висота", value: "80 см" },
    { label: "Ширина", value: "125 см" },
    { label: "Матеріал", value: " фанера / брус / cталь " },

  ],
    designer: "DIY Workshop",
    year: 2023,
    description:
      "Замовити можна за посиланням нижче. Підберемо розміри, порахуємо вартість і зробимо проєкт під ваш майданчик.",
    description2:
      "Професійна рампа збільшеної висоти та ширини для змагань, шоу та досвідчених райдерів. Забезпечує максимальну амплітуду руху та широкі можливості для складних повітряних трюків. Часто використовується як центральний елемент великих скейтпарків та спортивних подій.",
    details: [{ title: "kаталог фигур", link: "#catalog" }],
    relatedProducts: [1, 2, 3],
  },

  {
    id: 6,
    name: "skatepark",
    image: "/images/skateparks/park.png",
    altImages: [
      "/images/skateparks/parkfront.png",
      "/images/skateparks/parktop.png",
    ],
    specs: [
      { label: "Висота", value: "80 см" },
      { label: "Ширина", value: "125 см" },
      { label: "Матеріал", value: " фанера / брус / cталь " },
    ],
    sample: [
      { type: "image", src: "/images/sample/skateparks/skatepark1.jpg" },
      { type: "image", src: "/images/sample/skateparks/skatepark1.1.jpg" },
    ],
    designer: "",
    year: 2023,
    description: "Замовити можна за посиланням нижче. Підберемо розміри, порахуємо вартість і зробимо проєкт під ваш майданчик.",
    description2:
      "Компактний сет з базових фігур",
    details: [{ title: "Каталог фигур", link: "#catalog" }],
    relatedProducts: [1, 2, 3, 4, 5, 6, 7],
  },
];

export default productCatalogRamps;