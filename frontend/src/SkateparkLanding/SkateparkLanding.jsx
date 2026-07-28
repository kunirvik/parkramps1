// import React, { useLayoutEffect, useRef, useState } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// /**
//  * ============================================================================
//  *  SKATEPARK LANDING — "PAPER CUT-OUT / ZINE" STYLE
//  * ============================================================================
//  *  Стек: React + Tailwind + GSAP (ScrollTrigger)
//  *
//  *  ЧТО НУЖНО ПОДКЛЮЧИТЬ ДО ИСПОЛЬЗОВАНИЯ:
//  *  1) npm i gsap
//  *  2) В index.html добавить шрифты (или через @font-face):
//  *     <link rel="preconnect" href="https://fonts.googleapis.com">
//  *     <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
//  *  3) В tailwind.config.js прокинуть кастомные токены (см. блок в конце файла
//  *     "TAILWIND CONFIG PATCH") — цвета, шрифты, keyframes.
//  *  4) Заменить все PLACEHOLDER_IMG / PLACEHOLDER_LOGO на реальные пути к
//  *     фото стройки и логотипам партнёров (папка /public/images, /public/logos).
//  *  5) Три формы (SPONSOR_EMAIL / TRAINER_EMAIL / RIDER_EMAIL) — подставить
//  *     реальные адреса или API-эндпоинты.
//  * ============================================================================
//  */

// // ---------------------------------------------------------------------------
// // ДАННЫЕ (заменить на реальные)
// // ---------------------------------------------------------------------------

// const SPONSOR_EMAIL = "partners@airpark.kyiv.ua";
// const TRAINER_EMAIL = "coach@airpark.kyiv.ua";
// const RIDER_EMAIL = "hello@airpark.kyiv.ua";

// const STATS = [
//   { value: "2 400", label: "м² критої вертикалі та стріта", unit: "м²" },
//   { value: "6", label: "метрів висота бетонного боула" },
//   { value: "№1", label: "за розміром критий эір-парк в Україні" },
//   { value: "365", label: "днів на рік — незалежно від погоди" },
// ];

// const BUILD_PHOTOS = [
//   { src: "/images/construction-01.jpg", cap: "Заливка боула, липень 2026" },
//   { src: "/images/construction-02.jpg", cap: "Каркас ангару, 40м прольот" },
//   { src: "/images/construction-03.jpg", cap: "Арматура vert-рампи" },
//   { src: "/images/construction-04.jpg", cap: "Команда на об'єкті" },
// ];

// const PARTNERS = [
//   { name: "Vans", logo: "/logos/vans.svg" },
//   { name: "Independent", logo: "/logos/independent.svg" },
//   { name: "Nova Poshta", logo: "/logos/novaposhta.svg" },
//   { name: "Monobank", logo: "/logos/monobank.svg" },
//   { name: "Red Bull", logo: "/logos/redbull.svg" },
//   { name: "Kyivstar", logo: "/logos/kyivstar.svg" },
// ];

// const SPONSOR_TIERS = [
//   {
//     id: "bronze",
//     name: "БРОНЗА",
//     tag: "Locals Support",
//     price: "від 50 000 ₴ / рік",
//     color: "bg-tape",
//     rotate: "-rotate-2",
//     perks: [
//       "Лого на «стіні спонсорів» біля входу (наліпка на бетоні, довговічний вініл)",
//       "Згадка в Instagram/TikTok (1 пост + 3 stories на рік)",
//       "10 гостьових абонементів на місяць для співробітників партнёра",
//       "Лого на сайті проєкту в розділі «Нас підтримують»",
//     ],
//   },
//   {
//     id: "silver",
//     name: "СРІБЛО",
//     tag: "Event Partner",
//     price: "від 150 000 ₴ / рік",
//     color: "bg-electric",
//     rotate: "rotate-1",
//     perks: [
//       "Все з пакету «Бронза»",
//       "Брендування однієї зони парку (наприклад, зона розминки або зона стріта)",
//       "Право проводити 2 власні контести/активації на рік на території парку",
//       "Лого на банерах при вході та на сітці огородження боула",
//       "20 гостьових абонементів на місяць + знижка 15% для клієнтів партнёра",
//       "Інтеграція в розсилку та push-повідомлення (700+ активних райдерів)",
//     ],
//   },
//   {
//     id: "gold",
//     name: "ЗОЛОТО",
//     tag: "Core Partner",
//     price: "від 400 000 ₴ / рік",
//     color: "bg-hotpink",
//     rotate: "-rotate-1",
//     perks: [
//       "Все з пакету «Срібло»",
//       "Іменна рампа/елемент парку («Quarter Pipe by [Бренд]») з постійним брендуванням",
//       "Продакт-плейсмент: брендований вендинг, зона відпочинку, стійка сервісу дощок",
//       "Спільний мерч-дроп (капсульна колаборація 1 раз на рік)",
//       "Пріоритетне право на titlе спонсорство головного щорічного контесту",
//       "Квартальний звіт з охопленнями (відвідування, соцмережі, медіа)",
//     ],
//   },
//   {
//     id: "title",
//     name: "ТАЙТЛ-СПОНСОР",
//     tag: "Naming Rights",
//     price: "за домовленістю",
//     color: "bg-acid text-ink",
//     rotate: "rotate-2",
//     perks: [
//       "Назва парку: «[Бренд] Air Park Kyiv» — на вивісці, сайті, мерчі, у ЗМІ",
//       "Ексклюзивність категорії (тільки один бренд з ніші на весь термін контракту)",
//       "Голос у програмній сітці парку: школа, контести, резидентство райдерів",
//       "Постійна присутність у PR-кампанії запуску (прес-конференція, відкриття)",
//       "Брендування головного фасаду будівлі та точки при вході",
//       "Персональна інтеграція в контент-план (YouTube/TikTok серія про будівництво і життя парку)",
//     ],
//   },
// ];

// const TRAINER_OFFER = [
//   {
//     title: "Оренда часу під власні групи",
//     text:
//       "Прозорий погодинний тариф на боул/вертикаль/стрит-зону нижче ринкового — для тренерів, які набирають власні групи та ведуть приватні заняття.",
//   },
//   {
//     title: "Резидентство школи",
//     text:
//       "Постійний слот у розкладі, власна сторінка тренера на сайті парку, потрапляння в загальну афішу і розсилку 700+ підписників.",
//   },
//   {
//     title: "Обладнання та сервіс",
//     text:
//       "Доступ до майстерні для обслуговування дощок/роликів, страхувальне спорядження в оренду, зона для дітей-початківців окремо від профі-зони.",
//   },
//   {
//     title: "Спільний маркетинг",
//     text:
//       "Парк бере на себе просування груп тренера в соцмережах і на сайті; тренер — контент і методику. Split доходу від абонементів обговорюється індивідуально.",
//   },
//   {
//     title: "Сертифікація та зростання",
//     text:
//       "Пріоритет у запрошеннях на семінари з приїжджими райдерами/тренерами, можливість стати частиною судейської колегії контестів парку.",
//   },
// ];

// // ---------------------------------------------------------------------------
// // ДРІБНІ UI-ЕЛЕМЕНТИ (стикери, рвана лінія, halftone-фон)
// // ---------------------------------------------------------------------------

// function TornEdge({ flip = false, className = "" }) {
//   // «рваний папір» між секціями — SVG-зигзаг
//   return (
//     <svg
//       viewBox="0 0 1200 40"
//       preserveAspectRatio="none"
//       className={`w-full h-8 md:h-10 ${flip ? "-scale-y-100" : ""} ${className}`}
//     >
//       <polygon
//         points="0,0 40,28 80,6 120,32 160,10 200,26 240,4 280,30 320,8 360,24 400,2 440,28 480,12 520,34 560,6 600,22 640,0 680,30 720,10 760,26 800,4 840,32 880,8 920,24 960,2 1000,28 1040,12 1080,34 1120,6 1160,22 1200,0 1200,40 0,40"
//         className="fill-paper"
//       />
//     </svg>
//   );
// }

// function Sticker({ children, className = "", color = "bg-acid text-ink" }) {
//   return (
//     <span
//       className={`sticker inline-block px-4 py-1.5 border-[3px] border-ink font-mono text-xs md:text-sm font-bold uppercase tracking-wider shadow-[4px_4px_0_0_#121212] ${color} ${className}`}
//     >
//       {children}
//     </span>
//   );
// }

// function HalftoneLayer({ className = "" }) {
//   return (
//     <div
//       aria-hidden
//       className={`pointer-events-none absolute inset-0 opacity-[0.08] ${className}`}
//       style={{
//         backgroundImage:
//           "radial-gradient(#121212 1.4px, transparent 1.4px)",
//         backgroundSize: "10px 10px",
//       }}
//     />
//   );
// }

// // ---------------------------------------------------------------------------
// // NAV
// // ---------------------------------------------------------------------------

// function NavBar() {
//   const links = [
//     ["Про проєкт", "#project"],
//     ["Будівництво", "#build"],
//     ["Партнери", "#partners"],
//     ["Спонсорам", "#sponsors"],
//     ["Тренерам", "#trainers"],
//     ["Райдерам", "#riders"],
//     ["Контакти", "#contacts"],
//   ];
//   const [open, setOpen] = useState(false);
//   return (
//     <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b-4 border-ink">
//       <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
//         <a href="#top" className="font-display text-2xl tracking-tight text-ink">
//           AIR<span className="text-hotpink">PARK</span>.KYIV
//         </a>
//         <nav className="hidden lg:flex items-center gap-6 font-mono text-xs uppercase tracking-wide">
//           {links.map(([label, href]) => (
//             <a key={href} href={href} className="hover:text-hotpink transition-colors">
//               {label}
//             </a>
//           ))}
//         </nav>
//         <a
//           href="#sponsors"
//           className="hidden lg:inline-block border-[3px] border-ink bg-acid px-4 py-2 font-mono text-xs font-bold uppercase shadow-[3px_3px_0_0_#121212] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
//         >
//           Стати партнёром
//         </a>
//         <button
//           className="lg:hidden border-2 border-ink px-3 py-1.5 font-mono text-xs uppercase"
//           onClick={() => setOpen((v) => !v)}
//         >
//           Меню
//         </button>
//       </div>
//       {open && (
//         <nav className="lg:hidden flex flex-col gap-1 px-4 pb-4 font-mono text-sm uppercase">
//           {links.map(([label, href]) => (
//             <a key={href} href={href} onClick={() => setOpen(false)} className="py-2 border-b border-ink/20">
//               {label}
//             </a>
//           ))}
//         </nav>
//       )}
//     </header>
//   );
// }

// // ---------------------------------------------------------------------------
// // HERO
// // ---------------------------------------------------------------------------

// function Hero() {
//   return (
//     <section id="top" className="relative overflow-hidden bg-ink text-paper pt-16 pb-24 md:pt-24 md:pb-32">
//       <HalftoneLayer className="opacity-[0.06] invert" />
//       <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
//         <div className="hero-badge mb-8">
//           <Sticker color="bg-hotpink text-paper" className="-rotate-3">
//             Будується зараз · Kyiv · Відкриття 2027
//           </Sticker>
//         </div>

//         <h1 className="hero-line font-display leading-[0.85] uppercase text-[15vw] md:text-[8.5vw] text-paper">
//           Перший
//         </h1>
//         <h1 className="hero-line font-display leading-[0.85] uppercase text-[15vw] md:text-[8.5vw] text-acid">
//           критий
//         </h1>
//         <h1 className="hero-line font-display leading-[0.85] uppercase text-[15vw] md:text-[8.5vw] text-paper">
//           <span className="relative inline-block">
//             эір-парк
//             <svg className="absolute -bottom-2 left-0 w-full h-4" viewBox="0 0 300 20" preserveAspectRatio="none">
//               <path d="M0,10 Q75,0 150,10 T300,10" stroke="#FF2E88" strokeWidth="6" fill="none" />
//             </svg>
//           </span>
//         </h1>
//         <h1 className="hero-line font-display leading-[0.85] uppercase text-[15vw] md:text-[8.5vw] text-electric">
//           такого масштабу
//         </h1>

//         <p className="hero-sub mt-8 max-w-xl font-body text-base md:text-lg text-paper/80">
//           2 400 м² боула, вертикалі та стріт-секцій під одним дахом. Без сезону, без дощу,
//           без «закрито на зиму». Ми будуємо простір, якого в Україні ще не було — і шукаємо
//           тих, хто побудує його разом із нами.
//         </p>

//         <div className="hero-cta mt-10 flex flex-wrap gap-4">
//           <a
//             href="#sponsors"
//             className="border-[3px] border-paper bg-acid text-ink px-6 py-3 font-mono text-sm font-bold uppercase shadow-[4px_4px_0_0_#F4E409] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
//           >
//             Пакети для спонсорів
//           </a>
//           <a
//             href="#build"
//             className="border-[3px] border-paper px-6 py-3 font-mono text-sm font-bold uppercase text-paper hover:bg-paper hover:text-ink transition-colors"
//           >
//             Дивитись стройку →
//           </a>
//         </div>
//       </div>

//       <TornEdge className="absolute -bottom-1 left-0" />
//     </section>
//   );
// }

// // ---------------------------------------------------------------------------
// // STATS / О ПРОЕКТЕ
// // ---------------------------------------------------------------------------

// function ProjectScale() {
//   return (
//     <section id="project" className="relative bg-paper py-20 md:py-28">
//       <div className="max-w-7xl mx-auto px-4 md:px-8">
//         <div className="flex items-end justify-between flex-wrap gap-4 mb-14">
//           <h2 className="font-display uppercase text-4xl md:text-6xl text-ink leading-none">
//             Масштаб <span className="text-hotpink">не для галочки</span>
//           </h2>
//           <Sticker className="rotate-2">01 / Про проєкт</Sticker>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           {STATS.map((s, i) => (
//             <div
//               key={i}
//               className={`stat-card relative border-[3px] border-ink p-5 md:p-6 bg-white shadow-[6px_6px_0_0_#121212] ${
//                 i % 2 ? "rotate-1" : "-rotate-1"
//               }`}
//             >
//               <div className="font-display text-3xl md:text-5xl text-ink">{s.value}</div>
//               <div className="font-mono text-[11px] md:text-xs uppercase text-ink/70 mt-2 leading-snug">
//                 {s.label}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-14 grid md:grid-cols-3 gap-6">
//           <p className="scale-text md:col-span-2 font-body text-lg md:text-xl text-ink/85 leading-relaxed">
//             Сьогодні райдери Києва залежні від погоди і від кількох невеликих майданчиков.
//             Ми будуємо ангар на 2 400 м² з бетонним боулом, вертикальною стіною, street-зоною
//             та окремою зоною для початківців — простір, розрахований на школу, контести
//             та щоденні тренування 365 днів на рік.
//           </p>
//           <div className="border-[3px] border-ink bg-electric text-paper p-6 shadow-[6px_6px_0_0_#121212] -rotate-1">
//             <div className="font-mono text-xs uppercase tracking-wide mb-2">Статус будівництва</div>
//             <div className="font-display text-4xl mb-1">62%</div>
//             <div className="w-full h-3 bg-ink/30 border-2 border-ink">
//               <div className="h-full bg-acid" style={{ width: "62%" }} />
//             </div>
//             <div className="font-mono text-[11px] mt-2 text-paper/80">Відкриття заплановане на 2027</div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ---------------------------------------------------------------------------
// // СТРОЙКА (реальные фото/рендеры)
// // ---------------------------------------------------------------------------

// function BuildGallery() {
//   return (
//     <section id="build" className="relative bg-ink py-20 md:py-28">
//       <div className="max-w-7xl mx-auto px-4 md:px-8">
//         <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
//           <h2 className="font-display uppercase text-4xl md:text-6xl text-paper leading-none">
//             Стройка <span className="text-acid">наживо</span>
//           </h2>
//           <Sticker color="bg-electric text-paper" className="-rotate-2">
//             02 / Реальні фото об'єкта
//           </Sticker>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
//           {BUILD_PHOTOS.map((p, i) => (
//             <figure
//               key={i}
//               className={`photo-tile relative border-[3px] border-paper bg-paper/10 aspect-[3/4] overflow-hidden shadow-[5px_5px_0_0_#F4E409] ${
//                 i % 2 ? "rotate-2" : "-rotate-2"
//               }`}
//             >
//               {/* Заменить src на реальное фото стройки */}
//               <img src={p.src} alt={p.cap} className="w-full h-full object-cover" loading="lazy" />
//               <span className="absolute top-2 left-2 w-6 h-3 bg-acid/80 rotate-[-8deg]" aria-hidden />
//               <figcaption className="absolute bottom-0 left-0 right-0 bg-ink/80 text-paper font-mono text-[10px] px-2 py-1 uppercase">
//                 {p.cap}
//               </figcaption>
//             </figure>
//           ))}
//         </div>

//         <p className="mt-8 font-mono text-xs text-paper/60 uppercase">
//           * Оновлюємо галерею щотижня — прогрес будівництва у реальному часі.
//         </p>
//       </div>
//       <TornEdge className="absolute -bottom-1 left-0" />
//     </section>
//   );
// }

// // ---------------------------------------------------------------------------
// // ПАРТНЁРЫ (логотипы, бегущая строка)
// // ---------------------------------------------------------------------------

// function PartnersMarquee() {
//   const track = useRef(null);
//   useLayoutEffect(() => {
//     const el = track.current;
//     if (!el) return;
//     const ctx = gsap.context(() => {
//       const width = el.scrollWidth / 2;
//       gsap.to(el, {
//         x: -width,
//         duration: 22,
//         ease: "none",
//         repeat: -1,
//       });
//     });
//     return () => ctx.revert();
//   }, []);

//   const loop = [...PARTNERS, ...PARTNERS];

//   return (
//     <section id="partners" className="relative bg-paper py-16 md:py-20 border-y-4 border-ink overflow-hidden">
//       <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8 flex items-center justify-between flex-wrap gap-4">
//         <h2 className="font-display uppercase text-3xl md:text-5xl text-ink">
//           Нам вже <span className="text-electric">довіряють</span>
//         </h2>
//         <Sticker className="rotate-1">03 / Партнери проєкту</Sticker>
//       </div>
//       <div className="relative w-full overflow-hidden">
//         <div ref={track} className="flex items-center gap-14 w-max">
//           {loop.map((p, i) => (
//             <div key={i} className="h-14 md:h-16 flex items-center opacity-80 hover:opacity-100 transition-opacity">
//               {/* Заменить на реальный логотип партнёра (SVG/PNG, monochrome предпочтительно) */}
//               <img src={p.logo} alt={p.name} className="h-full w-auto object-contain grayscale" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ---------------------------------------------------------------------------
// // ПАКЕТЫ ДЛЯ СПОНСОРОВ
// // ---------------------------------------------------------------------------

// function SponsorPackages() {
//   return (
//     <section id="sponsors" className="relative bg-paper py-20 md:py-28">
//       <div className="max-w-7xl mx-auto px-4 md:px-8">
//         <div className="flex items-end justify-between flex-wrap gap-4 mb-14">
//           <h2 className="font-display uppercase text-4xl md:text-6xl text-ink leading-none">
//             Пакети для <span className="text-hotpink">спонсорів</span>
//           </h2>
//           <Sticker color="bg-hotpink text-paper" className="-rotate-1">
//             04 / Комерційна пропозиція
//           </Sticker>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8">
//           {SPONSOR_TIERS.map((tier) => (
//             <div
//               key={tier.id}
//               className={`tier-card relative border-[3px] border-ink bg-white p-7 shadow-[7px_7px_0_0_#121212] ${tier.rotate}`}
//             >
//               <div className={`absolute -top-4 -left-3 px-3 py-1 border-[3px] border-ink font-mono text-[11px] uppercase font-bold ${tier.color}`}>
//                 {tier.tag}
//               </div>
//               <h3 className="font-display text-3xl md:text-4xl text-ink mt-4">{tier.name}</h3>
//               <div className="font-mono text-sm text-ink/60 mb-5">{tier.price}</div>
//               <ul className="space-y-2.5">
//                 {tier.perks.map((perk, i) => (
//                   <li key={i} className="font-body text-sm text-ink/85 leading-snug flex gap-2">
//                     <span className="text-hotpink font-bold">—</span>
//                     <span>{perk}</span>
//                   </li>
//                 ))}
//               </ul>
//               <a
//                 href={`mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent(
//                   "Партнёрство: пакет " + tier.name
//                 )}`}
//                 className="mt-6 inline-block border-[3px] border-ink px-5 py-2.5 font-mono text-xs font-bold uppercase shadow-[3px_3px_0_0_#121212] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
//               >
//                 Обговорити пакет →
//               </a>
//             </div>
//           ))}
//         </div>

//         <p className="mt-10 font-mono text-xs text-ink/50 uppercase max-w-2xl">
//           * Всі пакети — база для перемовин. Готові адаптувати наповнення під формат і бюджет
//           конкретного бренду, включно з бартером (обладнання, мерч, спорядження).
//         </p>
//       </div>
//     </section>
//   );
// }

// // ---------------------------------------------------------------------------
// // ТРЕНЕРАМ
// // ---------------------------------------------------------------------------

// function TrainersSection() {
//   return (
//     <section id="trainers" className="relative bg-electric text-paper py-20 md:py-28 overflow-hidden">
//       <HalftoneLayer className="invert opacity-[0.07]" />
//       <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
//         <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
//           <h2 className="font-display uppercase text-4xl md:text-6xl leading-none">
//             Тренерам <span className="text-acid">і школам</span>
//           </h2>
//           <Sticker color="bg-acid text-ink" className="rotate-2">
//             05 / Резидентство
//           </Sticker>
//         </div>

//         <div className="grid md:grid-cols-2 gap-6">
//           {TRAINER_OFFER.map((item, i) => (
//             <div
//               key={i}
//               className={`border-[3px] border-paper p-6 bg-ink/20 backdrop-blur-sm ${i % 2 ? "rotate-1" : "-rotate-1"}`}
//             >
//               <h3 className="font-display text-2xl mb-2 text-acid">{item.title}</h3>
//               <p className="font-body text-sm text-paper/85 leading-relaxed">{item.text}</p>
//             </div>
//           ))}
//         </div>

//         <div className="mt-10">
//           <a
//             href={`mailto:${TRAINER_EMAIL}?subject=${encodeURIComponent("Резидентство тренера в Air Park Kyiv")}`}
//             className="inline-block border-[3px] border-paper bg-acid text-ink px-6 py-3 font-mono text-sm font-bold uppercase shadow-[4px_4px_0_0_#F4E409] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
//           >
//             Написати як тренер →
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ---------------------------------------------------------------------------
// // РАЙДЕРАМ / КЛИЕНТАМ
// // ---------------------------------------------------------------------------

// function RidersSection() {
//   return (
//     <section id="riders" className="relative bg-paper py-20 md:py-28">
//       <div className="max-w-7xl mx-auto px-4 md:px-8">
//         <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
//           <h2 className="font-display uppercase text-4xl md:text-6xl text-ink leading-none">
//             Райдерам <span className="text-electric">та клієнтам</span>
//           </h2>
//           <Sticker className="-rotate-2">06 / Раннiй доступ</Sticker>
//         </div>

//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="border-[3px] border-ink p-6 bg-white shadow-[6px_6px_0_0_#121212] rotate-1">
//             <div className="font-display text-2xl mb-2">Founders Pass</div>
//             <p className="font-body text-sm text-ink/80">
//               Абонемент за спецціною для перших 300 райдерів, які підпишуться до відкриття.
//             </p>
//           </div>
//           <div className="border-[3px] border-ink p-6 bg-white shadow-[6px_6px_0_0_#121212] -rotate-1">
//             <div className="font-display text-2xl mb-2">Community Chat</div>
//             <p className="font-body text-sm text-ink/80">
//               Закрита спільнота у Telegram: анонси прогресу будівництва, сесії, контести.
//             </p>
//           </div>
//           <div className="border-[3px] border-ink p-6 bg-white shadow-[6px_6px_0_0_#121212] rotate-1">
//             <div className="font-display text-2xl mb-2">Open Day</div>
//             <p className="font-body text-sm text-ink/80">
//               Перші катання для підписників — за 2 тижні до офіційного відкриття для всіх.
//             </p>
//           </div>
//         </div>

//         <div className="mt-10">
//           <a
//             href={`mailto:${RIDER_EMAIL}?subject=${encodeURIComponent("Хочу в спільноту Air Park Kyiv")}`}
//             className="inline-block border-[3px] border-ink px-6 py-3 font-mono text-sm font-bold uppercase hover:bg-ink hover:text-paper transition-colors"
//           >
//             Приєднатись →
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ---------------------------------------------------------------------------
// // КОНТАКТЫ (три разных направления)
// // ---------------------------------------------------------------------------

// function ContactsSection() {
//   const [tab, setTab] = useState("sponsor");

//   const configs = {
//     sponsor: {
//       title: "Для спонсорів і партнёрів",
//       email: SPONSOR_EMAIL,
//       color: "bg-hotpink",
//       note: "Пришлемо PDF-презентацію з пакетами, медіакітом і графіком будівництва.",
//     },
//     trainer: {
//       title: "Для тренерів і шкіл",
//       email: TRAINER_EMAIL,
//       color: "bg-electric",
//       note: "Розкажемо про графік, тарифи оренди та умови резидентства.",
//     },
//     rider: {
//       title: "Для райдерів і клієнтів",
//       email: RIDER_EMAIL,
//       color: "bg-acid text-ink",
//       note: "Додамо в спільноту та повідомимо про дату відкриття першими.",
//     },
//   };
//   const c = configs[tab];

//   return (
//     <section id="contacts" className="relative bg-ink text-paper py-20 md:py-28">
//       <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
//         <h2 className="font-display uppercase text-4xl md:text-6xl mb-10">
//           Пишіть <span className="text-hotpink">за темою</span>
//         </h2>

//         <div className="flex justify-center gap-3 mb-10 flex-wrap font-mono text-xs uppercase">
//           {Object.entries(configs).map(([key, val]) => (
//             <button
//               key={key}
//               onClick={() => setTab(key)}
//               className={`px-4 py-2 border-[3px] border-paper transition-colors ${
//                 tab === key ? `${val.color} text-ink` : "text-paper hover:bg-paper/10"
//               }`}
//             >
//               {val.title}
//             </button>
//           ))}
//         </div>

//         <div className={`border-[3px] border-paper p-8 md:p-10 inline-block ${tab === "sponsor" ? "-rotate-1" : tab === "trainer" ? "rotate-1" : "-rotate-1"}`}>
//           <p className="font-body text-paper/80 mb-5">{c.note}</p>
//           <a
//             href={`mailto:${c.email}`}
//             className="font-display text-2xl md:text-4xl text-acid underline decoration-hotpink decoration-4 underline-offset-4"
//           >
//             {c.email}
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ---------------------------------------------------------------------------
// // FOOTER
// // ---------------------------------------------------------------------------

// function Footer() {
//   return (
//     <footer className="bg-paper border-t-4 border-ink py-8">
//       <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs uppercase text-ink/60">
//         <span>© {new Date().getFullYear()} Air Park Kyiv — Perший критий эір-парк такого масштабу в Україні</span>
//         <span>Instagram · TikTok · Telegram</span>
//       </div>
//     </footer>
//   );
// }

// // ---------------------------------------------------------------------------
// // ГЛАВНЫЙ КОМПОНЕНТ + GSAP scroll-анимации
// // ---------------------------------------------------------------------------

// export default function SkateparkLanding() {
//   const rootRef = useRef(null);

//   useLayoutEffect(() => {
//     const ctx = gsap.context(() => {
//       // Hero — вступление построчно
//       gsap.timeline({ defaults: { ease: "power3.out" } })
//         .from(".hero-badge", { y: -20, opacity: 0, duration: 0.5 })
//         .from(".hero-line", { y: 60, opacity: 0, duration: 0.7, stagger: 0.08 }, "-=0.2")
//         .from(".hero-sub", { y: 20, opacity: 0, duration: 0.6 }, "-=0.3")
//         .from(".hero-cta", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4");

//       // Общий паттерн: reveal карточек/секций при скролле
//       const revealGroups = [
//         ".stat-card",
//         ".photo-tile",
//         ".tier-card",
//       ];
//       revealGroups.forEach((sel) => {
//         gsap.utils.toArray(sel).forEach((el, i) => {
//           gsap.from(el, {
//             y: 40,
//             opacity: 0,
//             duration: 0.6,
//             ease: "power2.out",
//             delay: (i % 4) * 0.06,
//             scrollTrigger: {
//               trigger: el,
//               start: "top 88%",
//               toggleActions: "play none none reverse",
//             },
//           });
//         });
//       });

//       // Заголовки секций
//       gsap.utils.toArray("h2").forEach((el) => {
//         gsap.from(el, {
//           x: -30,
//           opacity: 0,
//           duration: 0.7,
//           ease: "power2.out",
//           scrollTrigger: { trigger: el, start: "top 90%" },
//         });
//       });

//       // Лёгкое покачивание стикеров (ambient)
//       gsap.utils.toArray(".sticker").forEach((el, i) => {
//         gsap.to(el, {
//           rotate: "+=4",
//           duration: 2 + (i % 3) * 0.4,
//           yoyo: true,
//           repeat: -1,
//           ease: "sine.inOut",
//         });
//       });
//     }, rootRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div ref={rootRef} className="font-body bg-paper text-ink">
//       <NavBar />
//       <Hero />
//       <ProjectScale />
//       <BuildGallery />
//       <PartnersMarquee />
//       <SponsorPackages />
//       <TrainersSection />
//       <RidersSection />
//       <ContactsSection />
//       <Footer />
//     </div>
//   );
// }

// /**
//  * ============================================================================
//  *  TAILWIND CONFIG PATCH — добавить в tailwind.config.js
//  * ============================================================================
//  *
//  * module.exports = {
//  *   theme: {
//  *     extend: {
//  *       colors: {
//  *         paper:   "#E7E3D4", // ньюсprint-бумага, тёплый серо-бежевый
//  *         ink:     "#121212", // почти чёрный
//  *         electric:"#1E4FFF", // электрик-синий
//  *         hotpink: "#FF2E88", // кислотный маджента
//  *         acid:    "#F4E409", // кислотный жёлтый
//  *         tape:    "#FF7A1A", // "оранжевый скотч"-акцент
//  *       },
//  *       fontFamily: {
//  *         display: ["Anton", "sans-serif"],
//  *         body: ["'Space Grotesk'", "sans-serif"],
//  *         mono: ["'JetBrains Mono'", "monospace"],
//  *       },
//  *     },
//  *   },
//  * };
//  *
//  *  Не забудьте добавить "tape-orange" -> используется как bg-tape-orange
//  *  в SPONSOR_TIERS[0].color — либо переименуйте в bg-tape по токену выше.
//  * ============================================================================
//  */

import React, { useEffect, useRef } from "react";
 
/**
 * ANGAR — лендинг крытого эйр-скейтпарка (Киев)
 * Стиль: paper cut-out / зин Thrasher magazine.
 * Стек: React (vanilla) + Tailwind (только базовые утилиты) + кастомный CSS для
 * "вырезанной бумаги", хальфтона, скотча и рваных краёв (Tailwind без компилятора
 * не умеет в произвольные значения, поэтому вся кастомная механика — в <style>).
 *
 * ГДЕ АНИМАЦИИ: реэйлы работают через IntersectionObserver + CSS-классы
 * (.reveal / .reveal-in), чтобы превью гарантированно работало без GSAP.
 * В своём проекте, где GSAP реально установлен, замени hook useReveal()
 * на gsap.fromTo(..., { scrollTrigger: ... }) — блок с примером внизу файла.
 *
 * ЧТО ЗАМЕНИТЬ ПЕРЕД ОТПРАВКОЙ:
 *  - PROJECT.name / PROJECT.city — название и подтверждённые данные проекта
 *  - STATS — реальные цифры площади/высоты/этапов
 *  - GALLERY — реальные рендеры/фото стройки (сейчас стоковые фото с меткой "ЗАМЕНИТЬ")
 *  - PARTNER_LOGOS — логотипы подтверждённых партнёров (сейчас плейсхолдеры)
 *  - CONTACTS — реальные почты/телефоны под каждую аудиторию
 */
 
// ---------------------------------------------------------------------------
// ДАННЫЕ — редактируй тут, разметка ниже почти не трогать
// ---------------------------------------------------------------------------
 
const PROJECT = {
  name: "АНГАР",
  sub: "AIR SKATEPARK KYIV",
  city: "Киев",
};
 
const STATS = [
  { n: "3 200", u: "м²", l: "крытой площади" },
  { n: "№1", u: "", l: "по размеру в Украине" },
  { n: "9", u: "м", l: "высота вертикальной стены" },
  { n: "365", u: "дн", l: "катаемся круглый год" },
];
 
const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=900&q=80",
    alt: "Райдер в прыжке",
    label: "ФОТО СО СТРОЙКИ №1",
    rot: "torn-r1",
  },
  {
    src: "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=900&q=80",
    alt: "Рампа скейтпарка",
    label: "РЕНДЕР ЧАШИ",
    rot: "torn-r2",
  },
  {
    src: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=900&q=80",
    alt: "Скейт-рампа изнутри",
    label: "ФОТО СО СТРОЙКИ №2",
    rot: "torn-r3",
  },
  {
    src: "https://images.unsplash.com/photo-1531282984929-eb95c94d29a1?auto=format&fit=crop&w=900&q=80",
    alt: "Стройка ангара",
    label: "СТРОЙКА: КАРКАС",
    rot: "torn-r2",
  },
];
 
const PARTNER_LOGOS = [
  "ЛОГО ПАРТНЁРА",
  "ЛОГО СПОНСОРА",
  "ЛОГО БРЕНДА",
  "ЛОГО ПАРТНЁРА",
  "ЛОГО СПОНСОРА",
  "ЛОГО БРЕНДА",
];
 
const SPONSOR_TIERS = [
  {
    tag: "STREET",
    color: "yellow",
    price: "от [СУММА] / год",
    pitch: "Точка входа для брендов, которым важно быть в поле зрения комьюнити.",
    perks: [
      "Логотип на сайте и в соцсетях в разделе партнёров",
      "2 упоминания в постах/сторис в квартал",
      "Брендинг на 1 зоне парка (стойка, стена скейт-чек)",
      "Место на общем стенде на открытии",
    ],
  },
  {
    tag: "VERT",
    color: "blue",
    price: "от [СУММА] / год",
    pitch: "Присутствие в самом парке — там, где райдеры проводят часы, а не секунды.",
    perks: [
      "Всё из уровня STREET",
      "Брендированная зона (зона отдыха, скейт-чек, вендинг-корнер)",
      "Продукт-плейсмент: тестирование деки/экипировки райдерами парка",
      "4 интеграции в контент (видео триков, сторис, рилс) с отметкой бренда",
      "Участие в 2 ивентах парка как co-host",
    ],
  },
  {
    tag: "AIR",
    color: "pink",
    price: "от [СУММА] / год",
    pitch: "Статус титульного партнёра одной из зон — узнаваемость на уровне сцены.",
    perks: [
      "Всё из уровня VERT",
      "Нейминг зоны/секции парка (например «Vert-стена от [Бренд]»)",
      "Брендинг на форме тренерского состава",
      "Эксклюзив в своей товарной категории (никаких конкурентов рядом)",
      "Съёмка контент-дня с топ-райдерами парка для бренда",
      "VIP-доступ на все соревнования и ивенты (гостевая ложа)",
    ],
  },
  {
    tag: "LEGEND",
    color: "orange",
    price: "по запросу",
    pitch: "Титульное партнёрство всего проекта — «[Бренд] Air Skatepark».",
    perks: [
      "Всё из уровня AIR",
      "Нейминг всего парка и приоритет в названии на всех носителях",
      "Совместная PR-стратегия и участие в открытии как ключевой спикер",
      "Собственный ежегодный турнир под брендом партнёра",
      "Первое право продления контракта и голос в развитии парка",
    ],
  },
];
 
const COACH_OFFER = [
  {
    t: "Доля с занятий",
    d: "Прозрачный процент с каждого группового и индивидуального занятия — без аренды часа из своего кармана.",
  },
  {
    t: "Оборудование топ-уровня",
    d: "Foam pit, airbag, resi-рампа, разминочная зона — то, чего нет в большинстве парков страны.",
  },
  {
    t: "Готовый поток учеников",
    d: "Парк приводит клиентов через маркетинг и сайт — тебе не нужно самому искать группы.",
  },
  {
    t: "Личный бренд тренера",
    d: "Отдельная карточка тренера на сайте, промо в соцсетях парка, съёмка для портфолио.",
  },
  {
    t: "Приоритет по слотам",
    d: "Фиксированные часы под личный тренинг и подготовку райдеров к соревнованиям.",
  },
  {
    t: "Сообщество и рост",
    d: "Совместные сборы, судейство на турнирах парка, путь к статусу главного тренера направления.",
  },
];
 
const RIDER_PLANS = [
  {
    t: "Разовый сеанс",
    p: "[ЦЕНА] / визит",
    d: "2 часа катка, прокат защиты включён — для первого раза и гостей.",
  },
  {
    t: "Абонемент",
    p: "[ЦЕНА] / мес",
    d: "Безлимит в будни + приоритет записи на секции по выходным.",
  },
  {
    t: "Скейт-школа",
    p: "[ЦЕНА] / курс",
    d: "Группы для детей и взрослых с 0 — от первого олли до первого дропа в чашу.",
  },
  {
    t: "Райдер-карта",
    p: "по приглашению",
    d: "Для спонсируемых и соревнующихся райдеров: свободный доступ + участие в контенте парка.",
  },
];
 
const CONTACTS = [
  {
    who: "Спонсорам и партнёрам",
    color: "pink",
    text: "Готовим индивидуальный пакет под ваш бренд и категорию.",
    email: "partners@angar.ua",
    cta: "Обсудить партнёрство",
  },
  {
    who: "Тренерам",
    color: "blue",
    text: "Набираем тренерский состав по вертикали, стрит-секции и для детской школы.",
    email: "coaches@angar.ua",
    cta: "Стать тренером",
  },
  {
    who: "Райдерам и клиентам",
    color: "yellow",
    text: "Вопросы про абонементы, школу и открытие — сюда.",
    email: "hello@angar.ua",
    cta: "Написать нам",
  },
];
 
// ---------------------------------------------------------------------------
// УТИЛИТЫ
// ---------------------------------------------------------------------------
 
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}
 
const ROT = ["r-2", "r1", "r-1", "r2", "r-3", "r3"];
 
function Sticker({ children, color = "yellow", rot = "r-1", className = "" }) {
  return (
    <span className={`sticker bg-${color} ${rot} ${className}`}>{children}</span>
  );
}
 
function RansomTitle({ text, size = "lg" }) {
  const words = text.split(" ");
  const colors = ["yellow", "pink", "blue", "orange"];
  return (
    <span className={`ransom ransom-${size}`}>
      {words.map((w, i) => (
        <span
          key={i}
          className={`ransom-word bg-${colors[i % colors.length]} ${ROT[i % ROT.length]}`}
        >
          {w}
        </span>
      ))}
    </span>
  );
}
 
function PhotoSlot({ src, alt, label, rot }) {
  return (
    <div className={`photo-slot ${rot}`}>
      <img
        src={src}
        alt={alt}
        onError={(e) => {
          e.currentTarget.src =
            "https://placehold.co/900x700/121212/F1ECDD?text=" +
            encodeURIComponent(label);
        }}
      />
      <span className="photo-tag">{label}</span>
    </div>
  );
}
 
// ---------------------------------------------------------------------------
// СЕКЦИИ
// ---------------------------------------------------------------------------
 
function Header() {
  const links = [
    ["О проекте", "#about"],
    ["Стройка", "#build"],
    ["Спонсорам", "#sponsors"],
    ["Тренерам", "#coaches"],
    ["Райдерам", "#riders"],
    ["Контакты", "#contacts"],
  ];
  return (
    <header className="site-header">
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        <a href="#hero" className="logo-mark">
          {PROJECT.name}
        </a>
        <nav className="hidden md:flex items-center gap-5">
          {links.map(([t, href]) => (
            <a key={href} href={href} className="nav-link">
              {t}
            </a>
          ))}
        </nav>
        <a href="#contacts" className="btn-tape">
          Написать
        </a>
      </div>
    </header>
  );
}
 
function Ticker() {
  const items = [
    "ПЕРВЫЙ КРЫТЫЙ ЭЙР-СКЕЙТПАРК ТАКОГО МАСШТАБА В УКРАИНЕ",
    "СТРОИМ В КИЕВЕ",
    "3200 М² ПОД КРЫШЕЙ",
    "ИЩЕМ ПАРТНЁРОВ И ТРЕНЕРОВ",
    "ОТКРЫТИЕ СКОРО",
  ];
  const line = items.join("  ★  ") + "  ★  ";
  return (
    <div className="ticker">
      <div className="ticker-track">
        <span>{line}</span>
        <span aria-hidden="true">{line}</span>
      </div>
    </div>
  );
}
 
function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="halftone-layer" aria-hidden="true" />
      <div className="px-4 md:px-8 pt-10 pb-16 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Sticker color="pink" rot="r-2">{PROJECT.city.toUpperCase()}, {new Date().getFullYear()}</Sticker>
          <Sticker color="blue" rot="r1">ИНДОР</Sticker>
          <Sticker color="orange" rot="r-1">СБОР ПАРТНЁРОВ ОТКРЫТ</Sticker>
        </div>
 
        <h1 className="hero-title">
          <RansomTitle text="ПЕРВЫЙ КРЫТЫЙ" size="xl" />
          <br />
          <RansomTitle text="ЭЙР-СКЕЙТПАРК" size="xl" />
          <br />
          <span className="hero-outline">ТАКОГО МАСШТАБА</span>
        </h1>
 
        <p className="hero-copy reveal">
          {PROJECT.name} — новый крытый скейтпарк в {PROJECT.city}: вертикальные стены,
          боул, foam pit и street-зона под одной крышей. Такого объёма и набора
          секций в Украине ещё не строили. Мы ищем спонсоров, тренеров и партнёров,
          чтобы открыться в полную силу.
        </p>
 
        <div className="flex flex-wrap gap-3 mt-6">
          <a href="#sponsors" className="btn-primary bg-pink">Пакеты для спонсоров</a>
          <a href="#coaches" className="btn-primary bg-blue">Стать тренером</a>
          <a href="#build" className="btn-primary bg-yellow">Смотреть стройку</a>
        </div>
      </div>
 
      <div className="stats-strip">
        {STATS.map((s, i) => (
          <div key={i} className="stat-cell reveal" style={{ transitionDelay: `${i * 80}ms` }}>
            <div className="stat-n">{s.n}<span className="stat-u">{s.u}</span></div>
            <div className="stat-l">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
 
function TapeLabel({ children, color = "yellow" }) {
  return <div className={`tape-label bg-${color}`}>{children}</div>;
}
 
function About() {
  return (
    <section id="about" className="section bg-ink">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <TapeLabel color="blue">О ПРОЕКТЕ</TapeLabel>
        <h2 className="section-title text-paper mt-4">
          Почему «первый такого размера» — это не маркетинг, а факт
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <p className="body-copy text-paper reveal">
            Большинство скейтпарков в Украине — это либо уличные площадки, зависящие
            от погоды, либо небольшие индор-залы с одной-двумя секциями. {PROJECT.name} —
            это крытый объект в формате настоящего эйр-хауса: вертикальная стена,
            боул, стрит-зона и зона разгона для больших трюков под одной крышей,
            круглый год, независимо от сезона.
          </p>
          <p className="body-copy text-paper reveal">
            Для города это новая точка на карте райдинг-культуры: место для тренировок
            сборной, соревнований, детской школы и коммьюнити-ивентов. Для партнёров —
            редкая возможность войти в проект на этапе строительства и закрепить за
            собой статус, который потом не купить.
          </p>
        </div>
      </div>
    </section>
  );
}
 
function Build() {
  return (
    <section id="build" className="section bg-paper">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <TapeLabel color="orange">СТРОЙКА</TapeLabel>
        <h2 className="section-title mt-4">Что уже происходит на объекте</h2>
        <p className="body-copy mt-2 max-w-2xl">
          Ниже — фактические фото и рендеры зон парка (сейчас на макете стоковые
          изображения с меткой «заменить» — вставляем реальные кадры по мере съёмки).
        </p>
        <div className="gallery-grid mt-10">
          {GALLERY.map((g, i) => (
            <PhotoSlot key={i} {...g} />
          ))}
        </div>
      </div>
    </section>
  );
}
 
function Partners() {
  return (
    <section className="section bg-ink">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-14">
        <TapeLabel color="pink">ПОДТВЕРЖДЁННЫЕ ПАРТНЁРЫ</TapeLabel>
        <div className="logo-row mt-8">
          {PARTNER_LOGOS.map((l, i) => (
            <div key={i} className="logo-chip reveal" style={{ transitionDelay: `${i * 60}ms` }}>
              {l}
            </div>
          ))}
        </div>
        <p className="text-paper mt-6 text-sm opacity-70">
          Раздел показывает бренды, уже подтвердившие участие — замени плейсхолдеры
          на реальные логотипы по мере подписания соглашений.
        </p>
      </div>
    </section>
  );
}
 
function Sponsors() {
  return (
    <section id="sponsors" className="section bg-paper">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <TapeLabel color="pink">СПОНСОРАМ И ПАРТНЁРАМ</TapeLabel>
        <h2 className="section-title mt-4">Пакеты партнёрства</h2>
        <p className="body-copy mt-2 max-w-2xl">
          Четыре уровня входа — от присутствия в соцсетях до нейминга всего парка.
          Суммы и точное наполнение уточняются под категорию бренда и срок контракта.
        </p>
 
        <div className="tiers-grid mt-10">
          {SPONSOR_TIERS.map((tier, i) => (
            <div key={tier.tag} className={`tier-card reveal ${ROT[i % ROT.length]}`} style={{ transitionDelay: `${i * 90}ms` }}>
              <div className={`tier-head bg-${tier.color}`}>
                <span className="tier-tag">{tier.tag}</span>
                <span className="tier-price">{tier.price}</span>
              </div>
              <p className="tier-pitch">{tier.pitch}</p>
              <ul className="tier-list">
                {tier.perks.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
 
        <div className="callout mt-10 reveal">
          <p>
            Все пакеты можно комбинировать: например, product-placement уровня VERT
            вместе с эксклюзивом по категории уровня AIR. Отправьте бриф вашего
            бренда — соберём предложение под задачу.
          </p>
          <a href="#contacts" className="btn-primary bg-ink text-paper mt-4 inline-block">
            Запросить полное КП
          </a>
        </div>
      </div>
    </section>
  );
}
 
function Coaches() {
  return (
    <section id="coaches" className="section bg-ink">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <TapeLabel color="blue">ТРЕНЕРАМ</TapeLabel>
        <h2 className="section-title text-paper mt-4">Что получает тренер в {PROJECT.name}</h2>
        <p className="body-copy text-paper mt-2 max-w-2xl">
          Мы строим парк как базу для тренерского состава, а не просто зал в аренду.
        </p>
        <div className="coach-grid mt-10">
          {COACH_OFFER.map((c, i) => (
            <div key={i} className="coach-card reveal" style={{ transitionDelay: `${i * 70}ms` }}>
              <div className="coach-num">{String(i + 1).padStart(2, "0")}</div>
              <div>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
              </div>
            </div>
          ))}
        </div>
        <a href="#contacts" className="btn-primary bg-blue mt-10 inline-block">
          Откликнуться тренером
        </a>
      </div>
    </section>
  );
}
 
function Riders() {
  return (
    <section id="riders" className="section bg-paper">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <TapeLabel color="yellow">РАЙДЕРАМ И КЛИЕНТАМ</TapeLabel>
        <h2 className="section-title mt-4">Форматы для катка</h2>
        <div className="plans-grid mt-10">
          {RIDER_PLANS.map((p, i) => (
            <div key={i} className={`plan-card reveal ${ROT[i % ROT.length]}`} style={{ transitionDelay: `${i * 70}ms` }}>
              <h3>{p.t}</h3>
              <div className="plan-price">{p.p}</div>
              <p>{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
 
function Contacts() {
  return (
    <section id="contacts" className="section bg-ink">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <TapeLabel color="orange">КОНТАКТЫ</TapeLabel>
        <h2 className="section-title text-paper mt-4">Кому вы пишете?</h2>
        <div className="contacts-grid mt-10">
          {CONTACTS.map((c, i) => (
            <div key={i} className={`contact-card reveal ${ROT[i % ROT.length]}`} style={{ transitionDelay: `${i * 80}ms` }}>
              <span className={`sticker bg-${c.color} mb-3`}>{c.who}</span>
              <p>{c.text}</p>
              <a href={`mailto:${c.email}`} className="contact-email">{c.email}</a>
              <a href={`mailto:${c.email}`} className={`btn-primary bg-${c.color} mt-4 inline-block`}>
                {c.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
 
function Footer() {
  return (
    <footer className="footer">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 flex flex-wrap items-center justify-between gap-4">
        <span className="logo-mark small">{PROJECT.name}</span>
        <span className="text-paper text-sm opacity-70">
          {PROJECT.sub} · {PROJECT.city} · строится сейчас
        </span>
      </div>
    </footer>
  );
}
 
// ---------------------------------------------------------------------------
// ГЛАВНЫЙ КОМПОНЕНТ
// ---------------------------------------------------------------------------
 
export default function SkateparkLanding() {
  useReveal();
  return (
    <div className="angar-root">
      <GlobalStyle />
      <Header />
      <Ticker />
      <Hero />
      <About />
      <Build />
      <Partners />
      <Sponsors />
      <Coaches />
      <Riders />
      <Contacts />
      <Footer />
    </div>
  );
}
 
// ---------------------------------------------------------------------------
// СТИЛИ — палитра, шрифты, "вырезанная бумага"
// ---------------------------------------------------------------------------
 
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Anton&family=JetBrains+Mono:wght@500;700&family=Work+Sans:wght@400;500;700;800&display=swap');
 
      .angar-root {
        --ink: #121212;
        --paper: #F1ECDD;
        --pink: #FF2E88;
        --blue: #1E4FFF;
        --yellow: #FFD400;
        --orange: #FF5A1F;
        --green: #B4FF39;
        font-family: 'Work Sans', sans-serif;
        background: var(--ink);
        color: var(--ink);
        overflow-x: hidden;
      }
 
      .angar-root .bg-ink{ background: var(--ink); }
      .angar-root .bg-paper{ background: var(--paper); }
      .angar-root .bg-pink{ background: var(--pink); }
      .angar-root .bg-blue{ background: var(--blue); }
      .angar-root .bg-yellow{ background: var(--yellow); }
      .angar-root .bg-orange{ background: var(--orange); }
      .angar-root .bg-green{ background: var(--green); }
      .angar-root .text-paper{ color: var(--paper); }
 
      /* header */
      .site-header{
        position: sticky; top:0; z-index: 40;
        background: var(--ink);
        border-bottom: 3px solid var(--paper);
      }
      .logo-mark{
        font-family: 'Anton', sans-serif;
        letter-spacing: 0.03em;
        font-size: 1.5rem;
        color: var(--paper);
        text-decoration:none;
      }
      .logo-mark.small{ font-size: 1.1rem; }
      .nav-link{
        font-family:'JetBrains Mono', monospace;
        font-size: 0.75rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--paper);
        text-decoration:none;
        opacity:.75;
      }
      .nav-link:hover{ opacity:1; color: var(--yellow); }
      .btn-tape{
        font-family:'JetBrains Mono', monospace;
        font-size:.7rem;
        text-transform:uppercase;
        letter-spacing:.05em;
        background: var(--yellow);
        color: var(--ink);
        padding: .5rem .9rem;
        text-decoration:none;
        transform: rotate(-2deg);
        display:inline-block;
        box-shadow: 3px 3px 0 var(--paper);
      }
 
      /* ticker */
      .ticker{
        background: var(--pink);
        border-bottom: 3px solid var(--ink);
        overflow:hidden;
        white-space:nowrap;
      }
      .ticker-track{
        display:inline-flex;
        animation: marquee 22s linear infinite;
        font-family:'JetBrains Mono', monospace;
        font-weight:700;
        font-size:.75rem;
        letter-spacing:.08em;
        color: var(--ink);
        padding: .5rem 0;
      }
      @keyframes marquee{
        from{ transform: translateX(0); }
        to{ transform: translateX(-50%); }
      }
 
      /* hero */
      .hero{ position:relative; background: var(--ink); }
      .halftone-layer{
        position:absolute; inset:0; pointer-events:none; opacity:.15;
        background-image: radial-gradient(var(--paper) 1px, transparent 1.4px);
        background-size: 10px 10px;
      }
      .sticker{
        display:inline-block;
        font-family:'JetBrains Mono', monospace;
        font-size:.68rem;
        letter-spacing:.05em;
        text-transform:uppercase;
        color: var(--ink);
        padding:.3rem .6rem;
        box-shadow: 2px 2px 0 rgba(0,0,0,.5);
      }
      .r-3{ transform: rotate(-3deg);} .r-2{ transform: rotate(-2deg);} .r-1{ transform: rotate(-1deg);}
      .r1{ transform: rotate(1deg);} .r2{ transform: rotate(2deg);} .r3{ transform: rotate(3deg);}
 
      .hero-title{ position:relative; z-index:1; margin-top: 1rem; line-height: 1; }
      .ransom{ display:inline; }
      .ransom-word{
        font-family:'Anton', sans-serif;
        color: var(--ink);
        padding: 0 .35em;
        margin: 0 .12em .18em 0;
        display:inline-block;
        box-shadow: 4px 4px 0 rgba(0,0,0,.55);
        text-transform:uppercase;
      }
      .ransom-xl .ransom-word{ font-size: clamp(1.8rem, 6vw, 4.2rem); }
      .hero-outline{
        font-family:'Anton', sans-serif;
        text-transform:uppercase;
        font-size: clamp(1.8rem, 6vw, 4.2rem);
        color: transparent;
        -webkit-text-stroke: 2px var(--paper);
      }
      .hero-copy{
        max-width: 46rem; margin-top: 1.5rem;
        color: var(--paper); font-size: 1.05rem; line-height:1.6;
      }
      .btn-primary{
        font-family:'JetBrains Mono', monospace;
        text-transform:uppercase;
        font-size:.78rem; letter-spacing:.04em;
        color: var(--ink);
        padding:.75rem 1.1rem;
        text-decoration:none;
        box-shadow: 4px 4px 0 var(--paper);
        border: 2px solid var(--ink);
      }
      .btn-primary:hover{ transform: translate(2px,2px); box-shadow: 2px 2px 0 var(--paper); }
 
      .stats-strip{
        display:grid; grid-template-columns: repeat(2,1fr);
        border-top: 3px solid var(--paper);
        margin-top: 3rem;
      }
      @media(min-width:768px){ .stats-strip{ grid-template-columns: repeat(4,1fr); } }
      .stat-cell{
        padding: 1.4rem 1rem;
        border-right: 1px dashed rgba(241,236,221,.35);
        border-bottom: 1px dashed rgba(241,236,221,.35);
      }
      .stat-n{ font-family:'Anton', sans-serif; font-size:2.2rem; color: var(--yellow); }
      .stat-u{ font-size:1rem; margin-left:.2rem; color: var(--paper); }
      .stat-l{ font-family:'JetBrains Mono', monospace; font-size:.68rem; text-transform:uppercase; color: var(--paper); opacity:.75; margin-top:.2rem; }
 
      /* section shared */
      .section{ position:relative; }
      .section-title{
        font-family:'Anton', sans-serif;
        text-transform:uppercase;
        font-size: clamp(1.5rem, 3.6vw, 2.6rem);
        line-height:1.05;
      }
      .body-copy{ font-size:1rem; line-height:1.65; }
      .tape-label{
        display:inline-block;
        font-family:'JetBrains Mono', monospace;
        font-size:.7rem; letter-spacing:.08em; text-transform:uppercase;
        color: var(--ink);
        padding:.35rem .7rem;
        transform: rotate(-2deg);
        box-shadow: 3px 3px 0 rgba(0,0,0,.35);
      }
 
      /* gallery */
      .gallery-grid{
        display:grid; grid-template-columns: 1fr; gap: 2.2rem;
      }
      @media(min-width:640px){ .gallery-grid{ grid-template-columns: 1fr 1fr; } }
      .photo-slot{
        position:relative; background: var(--paper);
        padding: 10px 10px 34px 10px;
        box-shadow: 6px 6px 0 rgba(0,0,0,.75);
        border: 2px solid var(--ink);
      }
      .photo-slot img{ width:100%; height: 220px; object-fit:cover; display:block; filter: grayscale(.1) contrast(1.05); }
      .torn-r1{ transform: rotate(-2deg); } .torn-r2{ transform: rotate(1.5deg); } .torn-r3{ transform: rotate(-1deg); }
      .photo-tag{
        position:absolute; bottom:8px; left:10px; right:10px;
        font-family:'JetBrains Mono', monospace; font-size:.62rem; text-transform:uppercase;
        letter-spacing:.05em; color: var(--ink); opacity:.75;
      }
 
      /* partner logos */
      .logo-row{ display:flex; flex-wrap:wrap; gap: 1rem; }
      .logo-chip{
        background: var(--paper);
        color: var(--ink);
        font-family:'JetBrains Mono', monospace;
        font-size:.72rem; text-transform:uppercase; letter-spacing:.04em;
        padding: 1.1rem 1.4rem;
        border: 2px dashed var(--ink);
      }
 
      /* sponsor tiers */
      .tiers-grid{ display:grid; grid-template-columns:1fr; gap:1.8rem; }
      @media(min-width:768px){ .tiers-grid{ grid-template-columns: repeat(2,1fr); } }
      @media(min-width:1100px){ .tiers-grid{ grid-template-columns: repeat(4,1fr); } }
      .tier-card{
        background: var(--paper);
        border: 2px solid var(--ink);
        box-shadow: 6px 6px 0 rgba(0,0,0,.85);
        display:flex; flex-direction:column;
      }
      .tier-head{
        padding: .9rem 1rem;
        display:flex; align-items:baseline; justify-content:space-between;
        border-bottom: 2px solid var(--ink);
      }
      .tier-tag{ font-family:'Anton', sans-serif; font-size:1.3rem; text-transform:uppercase; }
      .tier-price{ font-family:'JetBrains Mono', monospace; font-size:.65rem; text-transform:uppercase; }
      .tier-pitch{ padding: .9rem 1rem 0 1rem; font-size:.88rem; line-height:1.5; }
      .tier-list{ padding: .8rem 1.1rem 1.2rem 1.3rem; font-size:.84rem; line-height:1.55; list-style: disc; flex:1; }
      .tier-list li{ margin-bottom:.35rem; }
 
      .callout{
        background: var(--ink); color: var(--paper);
        padding: 1.6rem; border: 2px solid var(--ink);
        max-width: 40rem;
      }
 
      /* coaches */
      .coach-grid{ display:grid; grid-template-columns:1fr; gap:1.6rem; }
      @media(min-width:768px){ .coach-grid{ grid-template-columns: 1fr 1fr; } }
      .coach-card{ display:flex; gap:1rem; align-items:flex-start; }
      .coach-num{ font-family:'Anton', sans-serif; font-size:2rem; color: var(--blue); }
      .coach-card h3{ font-family:'Anton', sans-serif; text-transform:uppercase; color: var(--paper); font-size:1.05rem; }
      .coach-card p{ color: var(--paper); opacity:.85; font-size:.9rem; margin-top:.2rem; line-height:1.5; }
 
      /* riders */
      .plans-grid{ display:grid; grid-template-columns:1fr; gap:1.6rem; }
      @media(min-width:640px){ .plans-grid{ grid-template-columns: repeat(2,1fr);} }
      @media(min-width:1024px){ .plans-grid{ grid-template-columns: repeat(4,1fr);} }
      .plan-card{
        background: var(--ink); color: var(--paper);
        border: 2px solid var(--ink);
        box-shadow: 5px 5px 0 rgba(0,0,0,.5);
        padding: 1.2rem;
      }
      .plan-card h3{ font-family:'Anton', sans-serif; text-transform:uppercase; font-size:1.05rem; }
      .plan-price{ font-family:'JetBrains Mono', monospace; color: var(--yellow); margin: .4rem 0; font-size:.85rem; }
      .plan-card p{ font-size:.85rem; opacity:.85; line-height:1.5; }
 
      /* contacts */
      .contacts-grid{ display:grid; grid-template-columns:1fr; gap:1.6rem; }
      @media(min-width:768px){ .contacts-grid{ grid-template-columns: repeat(3,1fr); } }
      .contact-card{
        background: var(--paper);
        border: 2px solid var(--ink);
        box-shadow: 6px 6px 0 rgba(0,0,0,.85);
        padding: 1.4rem;
      }
      .contact-card p{ font-size:.88rem; line-height:1.5; margin-top:.6rem; }
      .contact-email{ display:block; margin-top:.7rem; font-family:'JetBrains Mono', monospace; font-size:.8rem; text-decoration: underline; color: var(--ink); }
 
      .footer{ background: var(--ink); border-top: 3px solid var(--paper); }
 
      /* reveal */
      .reveal{ opacity:0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
      .reveal-in{ opacity:1; transform: translateY(0); }
 
      @media (prefers-reduced-motion: reduce){
        .reveal{ opacity:1; transform:none; transition:none; }
        .ticker-track{ animation:none; }
      }
    `}</style>
  );
}
 