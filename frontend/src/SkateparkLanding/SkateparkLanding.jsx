// import { useEffect, useRef, useState } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { ArrowUpRight, Mail, Instagram, Youtube, Send, X as CloseIcon } from "lucide-react";

// gsap.registerPlugin(ScrollTrigger);

// /**
//  * ZLIT — лендинг крытого эир-скейтпарка в Киеве.
//  * Стиль: thrasher-zine × X Games broadcast.
//  *
//  * Установка:
//  *   npm install gsap lucide-react
//  *
//  * Шрифты (добавьте в public/index.html <head>):
//  *   https://fonts.googleapis.com/css2?family=Oswald:wght@500;700;900
//  *     &family=Teko:wght@500;600;700&family=Inter:wght@400;500;600
//  *     &family=JetBrains+Mono:wght@400;500;700&display=swap
//  *
//  * ЗАМЕНИТЕ:
//  *  - BUILDER_LOGO / PARTNER_LOGO — два лого в шапке
//  *  - GALLERY — фото со стройки (сейчас плейсхолдеры)
//  *  - CONFIRMED_PARTNERS — логотипы подтверждённых партнёров
//  *  - SPECS / TIERS / ROADMAP — реальные данные
//  */

// // ---------- Данные (замените на реальные) ----------

// const BUILDER_LOGO = "parkramps"; // кто строит
// const PARTNER_LOGO = "VOLT"; // для кого строят / бренд-инициатор

// const SPECS = [
//   { label: "Площа комплексу", value: 1000, unit: "м²", decimals: 0 },
//   { label: "Висота стелі", value: 11, unit: "м", decimals: 0 },
//   { label: "Глибина bowl", value: 3.6, unit: "м", decimals: 1 },
//   // { label: "Вертикальна стіна", value: 4.2, unit: "м", decimals: 1 },
//   // { label: "Пропускна здатність", value: 450, unit: "райдерів/день", decimals: 0 },
//   // { label: "Зон катання", value: 6, unit: "дисциплін", decimals: 0 },
// ];

// const GALLERY = [
//   { id: 1, caption: "початок · 03.2026" },
//   { id: 2, caption: "КАРКАС ПІВНІЧНОЇ СТІНИ" },
//   { id: 3, caption: "МОНТАЖ ФЕРМ ПОКРІВЛІ" },
//   { id: 4, caption: "BOWL, ЧОРНОВА ГЕОМЕТРІЯ" },
//   { id: 5, caption: "VERT WALL, ОПАЛУБКА" },
//   { id: 6, caption: "ЗАГАЛЬНИЙ ВИГЛЯД, ДРОН" },
// ];

// const CONFIRMED_PARTNERS = ["VANS", "RED BULL", "NOVA POSHTA", "KYIVSTAR", "MONSTER"]; // плейсхолдер

// const TIERS = [
//   {
//     code: "T-01",
//     name: "Title Partner",
//     desc: "Ваш бренд у назві парку та на головній рампі. Ексклюзивність у категорії. Пріоритет у медіа та на подіях.",
//     highlight: true,
//   },
//   {
//     code: "T-02",
//     name: "Structural Partner",
//     desc: "Брендування окремої зони — bowl, vert або street. Лого на екіпіруванні тренерів, участь у відкритті.",
//     highlight: false,
//   },
//   {
//     code: "T-03",
//     name: "Community Partner",
//     desc: "Лого на сайті, мерчі та в соцмережах. Підтримка контестів і подій для райдерів і місцевої спільноти.",
//     highlight: false,
//   },
// ];

// const ROADMAP = [
//   { step: "01", title: "Проєктування та інженерні розрахунки", period: "2025 Q3 — Q4", status: "done" },
//   { step: "02", title: "Будівництво каркасу та покрівлі", period: "2026 Q1 — Q2", status: "active" },
//   { step: "03", title: "Монтаж рамп, покриття, освітлення", period: "2026 Q3 — Q4", status: "upcoming" },
//   { step: "04", title: "Тестові заїзди, сертифікація, відкриття", period: "2027 Q2", status: "upcoming" },
// ];

// // ---------- Формы модалок по аудиториям ----------

// const MODAL_CONFIG = {
//   sponsor: {
//     title: "Спонсорський запит",
//     tag: "SPONSOR / PARTNER INQUIRY",
//     fields: [
//       { name: "company", label: "Компанія", type: "text", required: true },
//       { name: "contact", label: "Контактна особа", type: "text", required: true },
//       { name: "email", label: "Email", type: "email", required: true },
//       {
//         name: "tier",
//         label: "Цікавий пакет",
//         type: "select",
//         options: ["Title Partner", "Structural Partner", "Community Partner", "Ще не визначились"],
//       },
//       { name: "message", label: "Коментар", type: "textarea" },
//     ],
//   },
//   trainer: {
//     title: "Заявка тренера / федерації",
//     tag: "COACH / FEDERATION APPLICATION",
//     fields: [
//       { name: "name", label: "Ім'я", type: "text", required: true },
//       {
//         name: "role",
//         label: "Хто ви",
//         type: "select",
//         options: ["Тренер", "Федерація", "Бренд екіпіровки", "Інше"],
//       },
//       { name: "experience", label: "Досвід / деталі", type: "textarea" },
//       { name: "email", label: "Email", type: "email", required: true },
//     ],
//   },
//   rider: {
//     title: "Реєстрація райдера",
//     tag: "EARLY ACCESS WAITLIST",
//     fields: [
//       { name: "name", label: "Ім'я", type: "text", required: true },
//       { name: "email", label: "Email", type: "email", required: true },
//       {
//         name: "discipline",
//         label: "Дисципліна",
//         type: "select",
//         options: ["Street", "Bowl", "Vert", "Mini-ramp", "Все з перерахованого"],
//       },
//     ],
//   },
// };

// // ---------- Допоміжні компоненти ----------

// function GrungeStyles() {
//   // Глобальные текстуры/паттерны, инжектим один раз.
//   return (
//     <style>{`
//       .halftone {
//         background-image: radial-gradient(circle, #000 1px, transparent 1.4px);
//         background-size: 6px 6px;
//       }
//       .halftone-red {
//         background-image: radial-gradient(circle, #e2001a 1px, transparent 1.4px);
//         background-size: 7px 7px;
//       }
//       .torn-top {
//         clip-path: polygon(
//           0% 12px, 4% 0, 9% 10px, 14% 2px, 19% 12px, 24% 0, 29% 9px, 34% 1px, 39% 11px,
//           44% 3px, 49% 12px, 54% 0, 59% 9px, 64% 2px, 69% 12px, 74% 0, 79% 10px, 84% 1px,
//           89% 11px, 94% 3px, 100% 12px, 100% 100%, 0% 100%
//         );
//       }
//       .tape {
//         background: repeating-linear-gradient(115deg, rgba(242,237,228,0.85) 0 4px, rgba(242,237,228,0.65) 4px 8px);
//         box-shadow: 0 1px 2px rgba(0,0,0,0.3);
//       }
//       .stamp {
//         border: 3px dashed #e2001a;
//         color: #e2001a;
//         mix-blend-mode: multiply;
//       }
//     `}</style>
//   );
// }

// function HazardMarquee() {
//   const text = "СПОНСОРСТВО — ТРЕНЕРИ — ПАРТНЕРСТВО — МЕДІА — РАЙДЕРИ — ОБ'ЄКТ У СТРОЙЦІ — ";
//   return (
//     <div className="relative overflow-hidden border-y-4 border-black bg-black py-3">
//       <div
//         className="absolute inset-0 opacity-90"
//         style={{
//           backgroundImage:
//             "repeating-linear-gradient(135deg, #e2001a 0px, #e2001a 22px, #000 22px, #000 44px)",
//         }}
//       />
//       <div className="marquee-track relative flex w-max whitespace-nowrap">
//         {[0, 1].map((i) => (
//           <span
//             key={i}
//             className="px-4 font-futura text-sm font-bold uppercase tracking-[0.2em] text-black"
//           >
//             <span className="bg-[#f2ede4] px-3 py-1">{text.repeat(4)}</span>
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }

// function RampBlueprint({ pathRef, className }) {
//   return (
//     <svg viewBox="0 0 600 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
//       <g stroke="#3a3a3a" strokeWidth="1" strokeDasharray="2 4" opacity="0.5">
//         <line x1="0" y1="50" x2="600" y2="50" />
//         <line x1="0" y1="150" x2="600" y2="150" />
//         <line x1="0" y1="250" x2="600" y2="250" />
//         <line x1="100" y1="0" x2="100" y2="300" />
//         <line x1="300" y1="0" x2="300" y2="300" />
//         <line x1="500" y1="0" x2="500" y2="300" />
//       </g>
//       <path
//         ref={pathRef}
//         d="M 20 250 L 140 250 C 200 250 200 130 260 130 C 300 130 300 60 300 20 M 300 130 C 340 130 340 250 400 250 L 580 250"
//         stroke="#e2001a"
//         strokeWidth="3"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <text x="24" y="270" fill="#8a8a8a"  fontSize="10" letterSpacing="1">
//         SECTION A—A · VERT + BOWL · SCALE 1:120
//       </text>
//     </svg>
//   );
// }

// function StatNumber({ value, decimals }) {
//   return (
//     <span
//       className="stat-number font-futura text-6xl font-semibold leading-none text-[#f2ede4] md:text-7xl"
//       data-value={value}
//       data-decimals={decimals}
//     >
//       0
//     </span>
//   );
// }

// function TornDivider() {
//   return <div className="torn-top h-4 w-full bg-[#f2ede4]" />;
// }

// function Modal({ type, onClose }) {
//   const config = MODAL_CONFIG[type];
//   const [sent, setSent] = useState(false);
//   if (!config) return null;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSent(true);
//   };

//   return (
//     <div
//       className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
//       onClick={onClose}
//     >
//       <div
//         className="relative w-full max-w-md border-4 border-black bg-[#f2ede4] p-8 text-black shadow-[8px_8px_0_#e2001a]"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           aria-label="Закрити"
//           className="absolute right-3 top-3 border-2 border-black bg-[#f2ede4] p-1 transition hover:bg-black hover:text-[#f2ede4]"
//         >
//           <CloseIcon size={18} />
//         </button>

//         <p className="font-futura text-xs font-bold uppercase tracking-[0.2em] text-[#e2001a]">
//           {config.tag}
//         </p>
//         <h3 className="mt-2 font-futura text-3xl font-bold uppercase leading-none">
//           {config.title}
//         </h3>

//         {sent ? (
//           <p className="mt-8 font-futura text-sm">
//             Прийнято. Ми зв'яжемось найближчим часом.
//           </p>
//         ) : (
//           <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
//             {config.fields.map((f) => (
//               <label key={f.name} className="flex flex-col gap-1">
//                 <span className="font-futura text-[11px] font-bold uppercase tracking-widest text-black/70">
//                   {f.label}
//                   {f.required ? " *" : ""}
//                 </span>
//                 {f.type === "textarea" ? (
//                   <textarea
//                     required={f.required}
//                     rows={3}
//                     className="border-2 border-black bg-white px-3 py-2 text-sm outline-none focus:border-[#e2001a]"
//                   />
//                 ) : f.type === "select" ? (
//                   <select
//                     required={f.required}
//                     className="border-2 border-black bg-white px-3 py-2 text-sm outline-none focus:border-[#e2001a]"
//                   >
//                     {f.options.map((o) => (
//                       <option key={o}>{o}</option>
//                     ))}
//                   </select>
//                 ) : (
//                   <input
//                     type={f.type}
//                     required={f.required}
//                     className="border-2 border-black bg-white px-3 py-2 text-sm outline-none focus:border-[#e2001a]"
//                   />
//                 )}
//               </label>
//             ))}
//             <button
//               type="submit"
//               className="mt-2 bg-black px-6 py-3 font-futura text-sm font-bold uppercase tracking-widest text-[#f2ede4] transition hover:bg-[#e2001a]"
//             >
//               Надіслати
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

// // ---------- Основной компонент ----------

// export default function ZlitLanding() {
//   const heroPathRef = useRef(null);
//   const roadmapRef = useRef(null);
//   const [activeModal, setActiveModal] = useState(null); // null | 'sponsor' | 'trainer' | 'rider'

//   useEffect(() => {
//     const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//     const ctx = gsap.context(() => {
//       if (!prefersReduced) {
//         const path = heroPathRef.current;
//         if (path) {
//           const length = path.getTotalLength();
//           gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
//           gsap.to(path, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", delay: 0.3 });
//         }

//         gsap.from(".speed-line", {
//           xPercent: -120,
//           opacity: 0,
//           duration: 1,
//           stagger: 0.07,
//           ease: "power3.out",
//           delay: 0.2,
//         });

//         gsap.from(".hero-reveal", {
//           y: 36,
//           opacity: 0,
//           duration: 0.8,
//           stagger: 0.1,
//           ease: "power3.out",
//           delay: 0.5,
//         });

//         gsap.to(".marquee-track", { xPercent: -50, repeat: -1, duration: 22, ease: "linear" });
//       } else {
//         gsap.set([".speed-line", ".hero-reveal"], { opacity: 1, x: 0, y: 0 });
//       }

//       gsap.utils.toArray(".reveal-up").forEach((el) => {
//         gsap.from(el, {
//           y: 50,
//           opacity: 0,
//           duration: 0.9,
//           ease: "power3.out",
//           scrollTrigger: { trigger: el, start: "top 88%" },
//         });
//       });

//       gsap.utils.toArray(".stat-number").forEach((el) => {
//         const target = parseFloat(el.dataset.value);
//         const decimals = parseInt(el.dataset.decimals, 10) || 0;
//         const obj = { val: 0 };
//         ScrollTrigger.create({
//           trigger: el,
//           start: "top 90%",
//           once: true,
//           onEnter: () =>
//             gsap.to(obj, {
//               val: target,
//               duration: 1.6,
//               ease: "power2.out",
//               onUpdate: () => {
//                 el.textContent = obj.val.toFixed(decimals).replace(".", ",");
//               },
//             }),
//         });
//       });

//       if (roadmapRef.current) {
//         gsap.fromTo(
//           ".roadmap-progress",
//           { scaleY: 0 },
//           {
//             scaleY: 1,
//             transformOrigin: "top",
//             ease: "none",
//             scrollTrigger: {
//               trigger: roadmapRef.current,
//               start: "top 60%",
//               end: "bottom 80%",
//               scrub: 0.6,
//             },
//           }
//         );
//       }

//       // лёгкий "дрожащий" hover на карточках галереи и тиров задаётся классами Tailwind,
//       // GSAP тут не нужен — оставляем CSS transition для производительности.
//     });

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#f2ede4] font-futura text-black antialiased">
//       <GrungeStyles />

//       {/* NAV — два лого через "×" */}
//       <header className="fixed inset-x-0 top-0 z-50 border-b-4 border-black bg-[#f2ede4]">
//         <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
//           <div className="flex items-center gap-3">
//             <div className="border-2 border-black px-3 py-1.5">
//               <span className="font-futura text-sm font-bold uppercase tracking-wide">
//                 {BUILDER_LOGO}
//               </span>
//             </div>
//             <span className="font-futura text-xl font-black text-[#e2001a]">×</span>
//             <div className="border-2 border-black bg-black px-3 py-1.5">
//               <span className="font-futura text-sm font-bold uppercase tracking-wide text-[#f2ede4]">
//                 {PARTNER_LOGO}
//               </span>
//             </div>
//           </div>

//           <nav className="hidden gap-6 font-futura text-xs font-bold uppercase tracking-widest md:flex">
//             <a href="#specs" className="transition hover:text-[#e2001a]">Об'єкт</a>
//             <a href="#gallery" className="transition hover:text-[#e2001a]">Стройка</a>
//             <a href="#sponsors" className="transition hover:text-[#e2001a]">Спонсорам</a>
//             <a href="#roadmap" className="transition hover:text-[#e2001a]">Хід робіт</a>
//           </nav>

//           <button
//             onClick={() => setActiveModal("sponsor")}
//             className="border-2 border-black bg-[#e2001a] px-4 py-2 font-futura text-xs font-bold uppercase tracking-widest text-[#f2ede4] transition hover:bg-black"
//           >
//             Партнерство
//           </button>
//         </div>
//       </header>

//       {/* HERO */}
//       <section className="relative overflow-hidden pt-28 pb-16 md:pt-36">
//         <div className="halftone pointer-events-none absolute inset-0 opacity-[0.06]" />
//         <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <div
//               key={i}
//               className="speed-line absolute h-[3px] bg-black"
//               style={{ top: `${14 + i * 16}%`, width: "140%", left: "-20%", transform: "rotate(-5deg)" }}
//             />
//           ))}
//         </div>

//         <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-2 md:items-center">
//           <div>
//             <span className="stamp hero-reveal inline-block rotate-[-6deg] border-3 px-3 py-1 font-futura text-xs font-bold uppercase tracking-widest">
//               Under Construction
//             </span>
//             <h1
//               className="hero-reveal mt-6 font-futura text-7xl font-black uppercase leading-[0.85] tracking-tight md:text-9xl"
//               style={{ textShadow: "5px 5px 0 #e2001a" }}
//             >
//               Zlit
//             </h1>
//             <p className="hero-reveal mt-4 max-w-md font-futura text-sm uppercase tracking-wide text-black/70">
//               Kyiv · Indoor Air Park · Est. 2027
//             </p>
//             <p className="hero-reveal mt-6 max-w-md text-lg font-medium text-black/80 md:text-xl">
//               Перший в Україні критий скейтпарк такого масштабу. Без сезонів,
//               без погоди, без обмежень — лише швидкість, повітря і фанера.
//             </p>
//             <div className="hero-reveal mt-9 flex flex-wrap gap-3">
//               <button
//                 onClick={() => setActiveModal("sponsor")}
//                 className="inline-flex items-center gap-2 border-2 border-black bg-black px-6 py-3 font-futura text-sm font-bold uppercase tracking-wider text-[#f2ede4] transition hover:bg-[#e2001a]"
//               >
//                 Стати спонсором <ArrowUpRight size={16} />
//               </button>
//               <a
//                 href="#specs"
//                 className="inline-flex items-center gap-2 border-2 border-black px-6 py-3 font-futura text-sm font-bold uppercase tracking-wider transition hover:bg-black hover:text-[#f2ede4]"
//               >
//                 Специфікація
//               </a>
//             </div>
//           </div>

//           <div className="hero-reveal relative border-4 border-black bg-black p-4">
//             <RampBlueprint pathRef={heroPathRef} className="w-full" />
//           </div>
//         </div>
//       </section>

//       <HazardMarquee />

//       {/* VISION — вырезка из зина */}
//       <section className="mx-auto max-w-7xl px-6 py-20">
//         <div className="reveal-up grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.4fr]">
//           <p className="font-futura text-xs font-bold uppercase tracking-[0.25em] text-[#e2001a]">
//             Чому це важливо
//           </p>
//           <div className="border-l-4 border-black pl-6">
//             <h2 className="font-futura text-4xl font-bold uppercase leading-[0.95] md:text-6xl">
//               В Україні немає критого парку такого масштабу.
//               <span className="text-black/50"> Ми будуємо перший.</span>
//             </h2>
//             <p className="mt-6 max-w-2xl font-medium text-black/70">
//               Сьогодні райдери залежні від погоди й сезону, тренери — від
//               випадкових локацій, а спорт — від ентузіазму, а не інфраструктури.
//               ЗЛІТ — це цілорічний об'єкт олімпійського рівня: bowl, vert,
//               street-зона та мегарампа під одним дахом у Києві.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* SPECS — scoreboard */}
//       <section id="specs" className="relative bg-black py-20 text-[#f2ede4]">
//         <div className="halftone-red pointer-events-none absolute inset-0 opacity-[0.08]" />
//         <div className="relative mx-auto max-w-7xl px-6">
//           <div className="reveal-up mb-12 flex items-end justify-between border-b-2 border-[#e2001a] pb-4">
//             <h2 className="font-futura text-2xl font-bold uppercase md:text-4xl">Специфікація об'єкта</h2>
//             <span className="hidden font-futura text-xs text-white/50 md:block">
//               DWG-ZLIT-001 / REV.03
//             </span>
//           </div>
//           <div className="reveal-up grid grid-cols-2 gap-px overflow-hidden border-2 border-white/10 bg-white/10 md:grid-cols-3">
//             {SPECS.map((s) => (
//               <div key={s.label} className="bg-black p-6 md:p-8">
//                 <StatNumber value={s.value} decimals={s.decimals} />
//                 <span className="ml-2 font-futura text-sm text-white/50">{s.unit}</span>
//                 <p className="mt-2 text-sm font-medium uppercase tracking-wide text-white/60">{s.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <TornDivider />

//       {/* GALLERY — фото со стройки, "приклеены скотчем" */}
//       <section id="gallery" className="mx-auto max-w-7xl px-6 py-20">
//         <p className="reveal-up font-futura text-xs font-bold uppercase tracking-[0.25em] text-[#e2001a]">
//           Стройка наживо
//         </p>
//         <h2 className="reveal-up mt-3 font-futura text-3xl font-bold uppercase md:text-5xl">
//           Прогрес об'єкта
//         </h2>
   
//         <div className="reveal-up mt-12 grid grid-cols-2 gap-8 md:grid-cols-3">
//           {GALLERY.map((g, i) => (
//             <figure
//               key={g.id}
//               className="relative border-2 border-black bg-black/5 p-2 shadow-[4px_4px_0_#000]"
//               style={{ transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }}
//             >
//               <div className="tape absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-1 border border-black/20" />
//               {/* Замените div ниже на <img src="..." className="aspect-[4/3] w-full object-cover" /> */}
//               <div className="halftone flex aspect-[4/3] w-full items-center justify-center bg-[#d9d3c7]">
//                 <span className="font-futura text-[10px] font-bold uppercase tracking-widest text-black/40">
//                   ФОТО {g.id}
//                 </span>
//               </div>
//               <figcaption className="mt-2 text-center font-futura text-[11px] font-bold uppercase tracking-wide text-black/70">
//                 {g.caption}
//               </figcaption>
//             </figure>
//           ))}
//         </div>
//       </section>

//       {/* CONFIRMED PARTNERS — trust bar */}
//       <section className="border-y-2 border-black bg-[#e9e3d6] py-10">
//         <div className="mx-auto max-w-7xl px-6">
//           <p className="reveal-up mb-6 text-center font-futura text-xs font-bold uppercase tracking-[0.25em] text-black/50">
//             Вже з нами
//           </p>
//           <div className="reveal-up flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
//             {CONFIRMED_PARTNERS.map((p) => (
//               // Замените span на <img src="..." className="h-8 w-auto grayscale opacity-70" />
//               <span
//                 key={p}
//                 className="font-futura text-lg font-bold uppercase tracking-wide text-black/40"
//               >
//                 {p}
//               </span>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* SPONSORS */}
//       <section id="sponsors" className="mx-auto max-w-7xl px-6 py-20">
//         <p className="reveal-up font-futura text-xs font-bold uppercase tracking-[0.25em] text-[#e2001a]">
//           Партнерство
//         </p>
//         <h2 className="reveal-up mt-3 max-w-2xl font-futura text-4xl font-bold uppercase leading-none md:text-6xl">
//           Три способи бути частиною першого зльоту
//         </h2>

//         <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
//           {TIERS.map((t) => (
//             <div
//               key={t.code}
//               className={`reveal-up flex flex-col justify-between border-2 border-black p-7 transition hover:-translate-y-1 ${
//                 t.highlight ? "bg-black text-[#f2ede4] shadow-[6px_6px_0_#e2001a]" : "bg-[#f2ede4] shadow-[6px_6px_0_#000]"
//               }`}
//             >
//               <div>
//                 <span
//                   className={`font-futura text-xs font-bold ${
//                     t.highlight ? "text-[#e2001a]" : "text-black/50"
//                   }`}
//                 >
//                   {t.code}
//                 </span>
//                 <h3 className="mt-2 font-futura text-2xl font-bold uppercase">{t.name}</h3>
//                 <p className={`mt-4 text-sm leading-relaxed ${t.highlight ? "text-white/70" : "text-black/70"}`}>
//                   {t.desc}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setActiveModal("sponsor")}
//                 className={`mt-7 inline-flex items-center gap-1 self-start font-futura text-xs font-bold uppercase tracking-widest ${
//                   t.highlight ? "text-[#e2001a]" : "text-black"
//                 }`}
//               >
//                 Обговорити пакет <ArrowUpRight size={14} />
//               </button>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* TRAINERS */}
//       <section className="border-y-2 border-black bg-black py-20 text-[#f2ede4]">
//         <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2">
//           <div className="reveal-up">
//             <p className="font-futura text-xs font-bold uppercase tracking-[0.25em] text-[#e2001a]">
//               Тренерам і федераціям
//             </p>
//             <h2 className="mt-3 font-futura text-3xl font-bold uppercase leading-none md:text-5xl">
//               Об'єкт олімпійського рівня потребує команди олімпійського рівня
//             </h2>
//             <p className="mt-5 text-white/70">
//               Ми відкриті до співпраці з тренерськими штабами, федераціями
//               скейтбордингу та брендами екіпіровки — від методичних програм
//               до сумісних заходів і зборів.
//             </p>
//             <button
//               onClick={() => setActiveModal("trainer")}
//               className="mt-7 inline-flex items-center gap-2 border-2 border-[#f2ede4] px-6 py-3 font-futura text-sm font-bold uppercase tracking-wider transition hover:bg-[#e2001a] hover:border-[#e2001a]"
//             >
//               Долучитися як тренер / партнер <ArrowUpRight size={16} />
//             </button>
//           </div>
//           <div className="reveal-up grid grid-cols-2 gap-px overflow-hidden border-2 border-white/10 bg-white/10 font-futura text-sm">
//             {["Bowl", "Vert", "Street Plaza", "Mini-ramp", "Foam Pit", "Mega Ramp"].map((zone) => (
//               <div key={zone} className="bg-black px-5 py-6 text-white/60">
//                 {zone}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* RIDERS */}
//       <section className="mx-auto max-w-7xl px-6 py-20">
//         <div className="reveal-up mx-auto max-w-xl text-center">
//           <span className="stamp inline-block rotate-3 border-3 px-3 py-1 font-futura text-xs font-bold uppercase tracking-widest">
//             Riders Only
//           </span>
//           <h2 className="mt-5 font-futura text-4xl font-bold uppercase md:text-5xl">
//             Стань першим на старті
//           </h2>
//           <p className="mt-4 text-black/70">
//             Ранній доступ до передпродажу абонементів і запрошення на
//             тестові заїзди — до офіційного відкриття.
//           </p>
//           <button
//             onClick={() => setActiveModal("rider")}
//             className="mt-8 inline-flex items-center gap-2 bg-black px-7 py-3 font-futura text-sm font-bold uppercase tracking-wider text-[#f2ede4] transition hover:bg-[#e2001a]"
//           >
//             Отримати ранній доступ <ArrowUpRight size={16} />
//           </button>
//         </div>
//       </section>

//       {/* ROADMAP */}
//       <section id="roadmap" ref={roadmapRef} className="border-t-2 border-black bg-[#e9e3d6] py-20">
//         <div className="mx-auto max-w-4xl px-6">
//           <h2 className="reveal-up font-futura text-2xl font-bold uppercase md:text-4xl">
//             Хід будівництва
//           </h2>
//           <div className="relative mt-12">
//             <div className="absolute left-[27px] top-0 h-full w-1 bg-black/15" />
//             <div className="roadmap-progress absolute left-[27px] top-0 h-full w-1 bg-[#e2001a]" />
//             <div className="flex flex-col gap-10">
//               {ROADMAP.map((r) => (
//                 <div key={r.step} className="reveal-up relative flex gap-7 pl-14">
//                   <span
//                     className={`absolute left-0 flex h-14 w-14 items-center justify-center border-2 font-futura text-xl font-semibold ${
//                       r.status === "done"
//                         ? "border-black bg-black text-[#f2ede4]"
//                         : r.status === "active"
//                         ? "border-[#e2001a] bg-[#e2001a] text-[#f2ede4]"
//                         : "border-black/30 text-black/40"
//                     }`}
//                   >
//                     {r.step}
//                   </span>
//                   <div>
//                     <p className="font-futura text-xs font-bold uppercase tracking-widest text-black/50">
//                       {r.period}
//                     </p>
//                     <h3 className="mt-1 font-futura text-xl font-bold uppercase md:text-2xl">
//                       {r.title}
//                     </h3>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* FOOTER */}
//       <section className="relative overflow-hidden bg-black pt-20 text-[#f2ede4]">
//         <div
//           className="absolute inset-0 opacity-[0.05]"
//           style={{
//             backgroundImage:
//               "repeating-linear-gradient(135deg, #e2001a 0px, #e2001a 22px, transparent 22px, transparent 44px)",
//           }}
//         />
//         <div className="relative mx-auto max-w-7xl px-6 pb-16">
//           <div className="reveal-up max-w-2xl">
//             <h2
//               className="font-futura text-5xl font-black uppercase leading-[0.85] md:text-7xl"
//               style={{ textShadow: "4px 4px 0 #e2001a" }}
//             >
//               Долучайся
//               <br /> до зльоту
//             </h2>
//             <p className="mt-6 text-white/60">
//               Спонсорство, тренерська співпраця, медіа-запити чи просто
//               питання про проєкт — оберіть свою роль, форма займе хвилину.
//             </p>
//             <div className="mt-8 flex flex-wrap gap-3">
//               <button
//                 onClick={() => setActiveModal("sponsor")}
//                 className="border-2 border-[#f2ede4] px-5 py-2.5 font-futura text-xs font-bold uppercase tracking-widest transition hover:bg-[#e2001a] hover:border-[#e2001a]"
//               >
//                 Спонсорам
//               </button>
//               <button
//                 onClick={() => setActiveModal("trainer")}
//                 className="border-2 border-[#f2ede4] px-5 py-2.5 font-futura text-xs font-bold uppercase tracking-widest transition hover:bg-[#e2001a] hover:border-[#e2001a]"
//               >
//                 Тренерам
//               </button>
//               <button
//                 onClick={() => setActiveModal("rider")}
//                 className="border-2 border-[#f2ede4] px-5 py-2.5 font-futura text-xs font-bold uppercase tracking-widest transition hover:bg-[#e2001a] hover:border-[#e2001a]"
//               >
//                 Райдерам
//               </button>
//             </div>
//             <a
//               href="mailto:hello@zlit.kyiv.ua"
//               className="mt-8 inline-flex items-center gap-2 border-b-2 border-[#f2ede4] pb-1 font-futura text-lg"
//             >
//               <Mail size={18} /> hello@zlit.kyiv.ua
//             </a>
//           </div>

//           <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t-2 border-white/15 pt-8 md:flex-row md:items-center">
//             <span className="font-futura text-lg font-black uppercase">ZLIT</span>
//             <div className="flex gap-5 text-white/60">
//               <a href="#" aria-label="Instagram" className="transition hover:text-[#e2001a]">
//                 <Instagram size={18} />
//               </a>
//               <a href="#" aria-label="YouTube" className="transition hover:text-[#e2001a]">
//                 <Youtube size={18} />
//               </a>
//               <a href="#" aria-label="Telegram" className="transition hover:text-[#e2001a]">
//                 <Send size={18} />
//               </a>
//             </div>
//             <span className="font-futura text-xs text-white/40">
//               Kyiv, Ukraine © {new Date().getFullYear()}
//             </span>
//           </div>
//         </div>
//       </section>

//       {activeModal && <Modal type={activeModal} onClose={() => setActiveModal(null)} />}
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Mail, Instagram, Youtube, Send, X as CloseIcon, Play } from "lucide-react";
import CursorImageTrail from "../CursorImageTrail/CursorImageTrail";
import Skatepark from "../Skatepark/Skatepark";

gsap.registerPlugin(ScrollTrigger);


const BUILDER_LOGO = "parkramps"; // хто будує
const PARTNER_LOGO = "volt"; // для кого будують / бренд-ініціатор


const HERO_BG_PHOTOS = [
  { id: 1, src: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785253160/photo_2026-07-28_18-37-46_ceomex.jpg", alt: "Каркас об'єкта, вигляд збоку" },

];

const SPECS = [
  { label: "Загальна площа комплексу", value: 1000, unit: "м²", decimals: 0 },
  { label: "Ейр-скейтпарк", value: 475, unit: "м²", decimals: 0 },
  { label: "Флет-зона · роллердром", value: 525, unit: "м²", decimals: 0 },
  { label: "Флайбокси", value: 2, unit: "шт", decimals: 0 },
  { label: "Квотери різних розмірів", value: 3, unit: "шт", decimals: 0 },
  { label: "Рівнів катання", value: 0, unit: "від новачка до про", decimals: 0, custom: "ВСІ" },
];

// Елементи парку — не числові показники, а перелік фігур/зон.
const FEATURES = [
  "Vert wall",
  "Спайн-квотер",
  "Великий квотерволл-рампа",
  "Бенк",
  "Ролл-ін",
  "2 флайбокси",
  "3 квотери різних розмірів",
  "Флет для роллердрому",
];



// Галерея підтримує фото і відео — тип "video" рендериться з іконкою Play
// та потребує poster (превʼю-кадр) і src (посилання на відео).
const GALLERY = [
  { id: 1, type: "photo", caption: "ФУНДАМЕНТ · ЕТАП 1", src: "" },
  { id: 2, type: "photo", caption: "КАРКАС ПІВНІЧНОЇ СТІНИ", src: "" },
  { id: 3, type: "video", caption: "МОНТАЖ ФЕРМ ПОКРІВЛІ", src: "", poster: "" },
  { id: 4, type: "photo", caption: "БУДУЧА EЙР-ЗОНА, ЧОРНОВА ГЕОМЕТРІЯ", src: "" },
  { id: 5, type: "photo", caption: "VERT WALL, ОПАЛУБКА", src: "" },
  { id: 6, type: "video", caption: "ЗАГАЛЬНИЙ ВИГЛЯД, ДРОН", src: "", poster: "" },
];

const CONFIRMED_PARTNERS = ["VANS", "RED BULL", "NOVA POSHTA", "KYIVSTAR", "MONSTER"]; // плейсхолдер

const TIERS = [
  {
    code: "T-01",
    name: "Title Partner",
    desc: "Ваш бренд у назві парку та на головній рампі. Ексклюзивність у категорії, пріоритет у медіа та на подіях.",
    highlight: true,
  },
  {
    code: "T-02",
    name: "Structural Partner",
    desc: "Брендування окремої фігури — vert wall, квотер, флайбокс чи бенк. Лого на екіпіруванні тренерів, участь у відкритті.",
    highlight: false,
  },
  {
    code: "T-03",
    name: "Community Partner",
    desc: "Логотипи, банери та партнерські програми на сайті й у соцмережах. Проходки для медіа на етапі будівництва за домовленістю плюс проходки на відкриття.",
    highlight: false,
  },
];

const ROADMAP = [
  { step: "01", title: "Проєктування та інженерні розрахунки", period: "2025 Q3 — Q4", status: "done" },
  { step: "02", title: "Будівництво каркасу та покрівлі", period: "2026 Q1 — Q2", status: "active" },
  { step: "03", title: "Монтаж рамп, покриття, освітлення", period: "2026 Q3 — Q4", status: "upcoming" },
  { step: "04", title: "Тестові заїзди, сертифікація, відкриття", period: "2027 Q2", status: "upcoming" },
];

// ---------- Форми модалок по аудиторіях ----------

const MODAL_CONFIG = {
  sponsor: {
    title: "Партнерський запит",
    tag: "PARTNER / SPONSOR INQUIRY",
    fields: [
      { name: "company", label: "Компанія", type: "text", required: true },
      { name: "contact", label: "Контактна особа", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      {
        name: "tier",
        label: "Цікавий формат співпраці",
        type: "select",
        options: ["Title Partner", "Structural Partner", "Community Partner", "Свій варіант"],
      },
      { name: "message", label: "Коментар", type: "textarea" },
    ],
  },
  trainer: {
    title: "Заявка тренера / федерації",
    tag: "COACH / FEDERATION APPLICATION",
    fields: [
      { name: "name", label: "Ім'я", type: "text", required: true },
      {
        name: "role",
        label: "Хто ви",
        type: "select",
        options: ["Тренер зі своєю базою", "Тренер, розвиваю кар'єру з нуля", "Федерація", "Бренд екіпіровки", "Інше"],
      },
      { name: "experience", label: "Досвід / деталі", type: "textarea" },
      { name: "email", label: "Email", type: "email", required: true },
    ],
  },
  rider: {
    title: "Заявка на тестове катання",
    tag: "EARLY ACCESS · TEST RIDE",
    fields: [
      { name: "name", label: "Ім'я", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      {
        name: "discipline",
        label: "Дисципліна",
        type: "select",
        options: ["Ейр / рампа", "Стріт", "Флет / роллердром", "Все з переліченого"],
      },
      { name: "video", label: "Посилання на відео катання (за бажанням)", type: "text" },
    ],
  },
  media: {
    title: "Заявка для медіа",
    tag: "MEDIA / PRESS REQUEST",
    fields: [
      { name: "name", label: "Ім'я", type: "text", required: true },
      { name: "outlet", label: "Медіа / канал / блог", type: "text", required: true },
      { name: "link", label: "Посилання на соцмережі чи портал", type: "text" },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "message", label: "Що хочете зняти чи розповісти", type: "textarea" },
    ],
  },
};


// ---------- Допоміжні компоненти ----------

function GrungeStyles() {
  // Глобальні текстури/патерни, інжектимо один раз.
  return (
    <style>{`
      .halftone {
        background-image: radial-gradient(circle, #000 1px, transparent 1.4px);
        background-size: 6px 6px;
      }
      .halftone-red {
        background-image: radial-gradient(circle, #e200a6 1px, transparent 1.4px);
        background-size: 7px 7px;
      }
      .torn-top {
        clip-path: polygon(
          0% 12px, 4% 0, 9% 10px, 14% 2px, 19% 12px, 24% 0, 29% 9px, 34% 1px, 39% 11px,
          44% 3px, 49% 12px, 54% 0, 59% 9px, 64% 2px, 69% 12px, 74% 0, 79% 10px, 84% 1px,
          89% 11px, 94% 3px, 100% 12px, 100% 100%, 0% 100%
        );
      }
      .tape {
        background: repeating-linear-gradient(115deg, rgba(242,237,228,0.85) 0 4px, rgba(242,237,228,0.65) 4px 8px);
        box-shadow: 0 1px 2px rgba(0,0,0,0.3);
      }
      .stamp {
        border: 3px dashed #e200b1;
        color: #e200b9;
        mix-blend-mode: multiply;
      }
      .hero-photo-duotone {
      
       
      }
      .no-scrollbar {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `}</style>
  );
}


function HazardMarquee() {
  const text = "ПАРТНЕРСТВО — ТРЕНЕРИ — РАЙДЕРИ — МЕДІА — ОБ'ЄКТ У СТРОЙЦІ — ПЕРШИЙ В УКРАЇНІ — ";
  return (
    <div className="relative overflow-hidden border-y-4 border-black bg-black py-3">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #e20075 0px, #e200b1 22px, #000 22px, #000 44px)",
        }}
      />
      <div className="marquee-track relative flex w-max whitespace-nowrap">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="px-4 font-futura text-sm font-bold uppercase tracking-[0.2em] text-black"
          >
            <span className="bg-[#f2ede4] px-3 py-1">{text.repeat(4)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// function RampBlueprint({ pathRef, className }) {
//   return (
//     <svg viewBox="0 0 600 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
//       <g stroke="#3a3a3a" strokeWidth="1" strokeDasharray="2 4" opacity="0.5">
//         <line x1="0" y1="50" x2="600" y2="50" />
//         <line x1="0" y1="150" x2="600" y2="150" />
//         <line x1="0" y1="250" x2="600" y2="250" />
//         <line x1="100" y1="0" x2="100" y2="300" />
//         <line x1="300" y1="0" x2="300" y2="300" />
//         <line x1="500" y1="0" x2="500" y2="300" />
//       </g>
//       <path
//         ref={pathRef}
//         d="M 20 250 L 140 250 C 200 250 200 130 260 130 C 300 130 300 60 300 20 M 300 130 C 340 130 340 250 400 250 L 580 250"
//         stroke="#e200a9"
//         strokeWidth="3"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <text x="24" y="270" fill="#8a8a8a" fontFamily="FuturaPT" fontSize="10" letterSpacing="1">
//         SECTION A—A · VERT + BOWL · SCALE 1:120
//       </text>
//     </svg>
//   );
// }

function StatNumber({ value, decimals, custom }) {
  if (custom) {
    return (
      <span className="stat-number font-futura text-6xl font-semibold leading-none text-[#f2ede4] md:text-7xl">
        {custom}
      </span>
    );
  }
  return (
    <span
      className="stat-number font-futura text-6xl font-semibold leading-none text-[#f2ede4] md:text-7xl"
      data-value={value}
      data-decimals={decimals}
    >
      0
    </span>
  );
}

function TornDivider() {
  return <div className="torn-top h-4 w-full bg-[#f2ede4]" />;
}

function Modal({ type, onClose }) {
  const config = MODAL_CONFIG[type];
  const [sent, setSent] = useState(false);
  if (!config) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md border-4 border-black bg-[#f2ede4] p-8 text-black shadow-[8px_8px_0_#e2001a]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Закрити"
          className="absolute right-3 top-3 border-2 border-black bg-[#f2ede4] p-1 transition hover:bg-black hover:text-[#f2ede4]"
        >
          <CloseIcon size={18} />
        </button>

        <p className="font-futura text-xs font-bold uppercase tracking-[0.2em] text-[#e2001a]">
          {config.tag}
        </p>
        <h3 className="mt-2 font-futura text-3xl font-bold uppercase leading-none">
          {config.title}
        </h3>

        {sent ? (
          <p className="mt-8 font-futura text-sm">
            Прийнято. Ми зв'яжемось найближчим часом.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {config.fields.map((f) => (
              <label key={f.name} className="flex flex-col gap-1">
                <span className="font-futura text-[11px] font-bold uppercase tracking-widest text-black/70">
                  {f.label}
                  {f.required ? " *" : ""}
                </span>
                {f.type === "textarea" ? (
                  <textarea
                    required={f.required}
                    rows={3}
                    className="border-2 border-black bg-white px-3 py-2 text-sm outline-none focus:border-[#e2001a]"
                  />
                ) : f.type === "select" ? (
                  <select
                    required={f.required}
                    className="border-2 border-black bg-white px-3 py-2 text-sm outline-none focus:border-[#e2001a]"
                  >
                    {f.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type}
                    required={f.required}
                    className="border-2 border-black bg-white px-3 py-2 text-sm outline-none focus:border-[#e2001a]"
                  />
                )}
              </label>
            ))}
            <button
              type="submit"
              className="mt-2 bg-black px-6 py-3 font-futura text-sm font-bold uppercase tracking-widest text-rgb(242, 237, 228) transition hover:bg-[#e2001a]"
            >
              Надіслати
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ---------- Основний компонент ----------

export default function ZlitLanding() {
  const heroPathRef = useRef(null);
  const roadmapRef = useRef(null);
  const [activeModal, setActiveModal] = useState(null); // null | 'sponsor' | 'trainer' | 'rider' | 'media'

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (!prefersReduced) {
        const path = heroPathRef.current;
        if (path) {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", delay: 0.3 });
        }

        gsap.from(".speed-line", {
          xPercent: -120,
          opacity: 0,
          duration: 1,
          stagger: 0.07,
          ease: "power3.out",
          delay: 0.2,
        });

        gsap.from(".hero-reveal", {
          y: 36,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.5,
        });

        gsap.from(".hero-bg-photo", {
          opacity: 0,
          scale: 1.08,
          duration: 1.4,
          stagger: 0.15,
          ease: "power2.out",
        });

        gsap.to(".marquee-track", { xPercent: -50, repeat: -1, duration: 22, ease: "linear" });
      } else {
        gsap.set([".speed-line", ".hero-reveal", ".hero-bg-photo"], { opacity: 1, x: 0, y: 0, scale: 1 });
      }

      gsap.utils.toArray(".reveal-up").forEach((el) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      gsap.utils.toArray(".stat-number[data-value]").forEach((el) => {
        const target = parseFloat(el.dataset.value);
        const decimals = parseInt(el.dataset.decimals, 10) || 0;
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.to(obj, {
              val: target,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = obj.val.toFixed(decimals).replace(".", ",");
              },
            }),
        });
      });

      if (roadmapRef.current) {
        gsap.fromTo(
          ".roadmap-progress",
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top",
            ease: "none",
            scrollTrigger: {
              trigger: roadmapRef.current,
              start: "top 60%",
              end: "bottom 80%",
              scrub: 0.6,
            },
          }
        );
      }

      // легкий "тремтливий" hover на картках галереї й тірах задається класами Tailwind,
      // GSAP тут не потрібен — лишаємо CSS transition заради продуктивності.
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#f2ede4] font-futura text-black antialiased">
      <CursorImageTrail></CursorImageTrail>
      <GrungeStyles />

      {/* NAV — два лого через "×" */}
      <header className="fixed inset-x-0 top-0 z-50 border-b-4 border-black bg-[#f2ede4]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="border-2 border-black px-2.5 py-1.5 md:px-3">
              <span className="font-futura text-xs font-bold uppercase tracking-wide md:text-sm">
                {BUILDER_LOGO}
              </span>
            </div>
            <span className="font-futura text-xl font-black text-[#e2001a]">×</span>
            <div className="border-2 border-black bg-black px-2.5 py-1.5 md:px-3">
              <span className="font-futura text-xs font-bold uppercase tracking-wide text-[#f2ede4] md:text-sm">
                {PARTNER_LOGO}
              </span>
            </div>
          </div>

          <nav className="hidden gap-6 font-futura text-xs font-bold uppercase tracking-widest md:flex">
            <a href="#specs" className="transition hover:text-[#e2001a]">Об'єкт</a>
            <a href="#gallery" className="transition hover:text-[#e2001a]">Стройка</a>
            <a href="#sponsors" className="transition hover:text-[#e2001a]">Партнерам</a>
            <a href="#roadmap" className="transition hover:text-[#e2001a]">Хід робіт</a>
          </nav>

          <button
            onClick={() => setActiveModal("sponsor")}
            className="border-2 border-black bg-rgb(226, 0, 218) px-3 py-2 font-futura text-[11px] font-bold uppercase tracking-widest text-[#f2ede4] transition hover:bg-black md:px-4 md:text-xs"
          >
            Партнерство
          </button>
        </div>
      </header>

      {/* HERO — фоновий колаж з фото об'єкта в стилі журналу */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36">
        {/* Фоновий колаж фото: замініть src у HERO_BG_PHOTOS на реальні яскраві кадри стройки.
            duotone/halftone оверлей зверху тримає весь колаж у стилі thrasher-зіну. */}
        {/* <div className="pointer-events-none absolute inset-0 grid grid-cols-3 opacity-70 md:opacity-80">
          {HERO_BG_PHOTOS.map((p) =>
            p.src ? (
              <img
                key={p.id}
                src={p.src}
                alt={p.alt}
                className="hero-bg-photo hero-photo-duotone h-full w-full object-cover"
              />
            ) : (
              <div key={p.id} className="hero-bg-photo h-full w-full bg-[#d9d3c7]" />
            )
          )}

          
        </div> */}

        <div className="pointer-events-none absolute inset-0">
  <img
    src={HERO_BG_PHOTOS[0].src}
    alt={HERO_BG_PHOTOS[0].alt}
    className="h-full w-full object-cover"
  />
</div>
        <div className="halftone pointer-events-none absolute inset-0 opacity-20" />
        {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#f2ede4] via-[#f2ede4]/85 to-[#f2ede4]/60" /> */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="speed-line absolute h-[3px] bg-black"
              style={{ top: `${14 + i * 16}%`, width: "140%", left: "-20%", transform: "rotate(-5deg)" }}
            />
          ))}
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-2 md:items-center">
          <div>
            <span className="stamp hero-reveal inline-block rotate-[-6deg] border-3 px-3 py-1 font-futura text-xs font-bold uppercase tracking-widest">
              Йде будівництво
            </span>
            <h1
              className="hero-reveal mt-6 font-futura text-7xl font-black uppercase leading-[0.85] tracking-tight md:text-9xl"
              style={{ textShadow: "5px 5px 0 #e2009a" }}
            >
            skatepark
            </h1>
            <p className="hero-reveal mt-4 max-w-md font-futura text-sm uppercase tracking-wide text-black/70">
              Київ · Правий берег · Зелена лінія метро
            </p>
            <p className="hero-reveal mt-6 max-w-md text-lg font-medium text-black/80 md:text-xl">
              Нарешті — критий скейтпарк у Києві. Перший в Україні об'єкт
              такого масштабу з ухилом в ейр: флайбокси, квотери, vert wall
              і спайн під одним дахом. Без сезону, без погоди, без пауз.
            </p>
            <p className="hero-reveal mt-4 max-w-md font-futura text-xs uppercase tracking-wide text-[#e2001a]">
              Зараз усі насолоджуються сезоном. Але він, як завжди, закінчиться —
              а ми вже готуємо дещо цікаве.
            </p>
            <div className="hero-reveal mt-9 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveModal("sponsor")}
                className="inline-flex items-center gap-2 border-2 border-black bg-black px-6 py-3 font-futura text-sm font-bold uppercase tracking-wider text-[#f2ede4] transition hover:bg-[#e2001a]"
              >
                Стати партнером <ArrowUpRight size={16} />
              </button>
              <a
                href="#specs"
                className="inline-flex items-center gap-2 border-2 border-black px-6 py-3 font-futura text-sm font-bold uppercase tracking-wider transition hover:bg-black hover:text-[#f2ede4]"
              >
                Специфікація
              </a>
            </div>
          </div>
{/* 
          <div className="hero-reveal relative border-4 border-black bg-black p-4">
            <RampBlueprint pathRef={heroPathRef} className="w-full" />
          </div> */}
        </div><Skatepark></Skatepark>
      </section>

      <HazardMarquee />

      {/* VISION — витяг із зіну */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="reveal-up grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.4fr]">
          <p className="font-futura text-xs font-bold uppercase tracking-[0.25em] text-rgb(26, 162, 96)">
            Чому це важливо
          </p>
          <div className="border-l-4 border-black pl-6">
            <h2 className="font-futura text-4xl font-bold uppercase leading-[0.95] md:text-6xl">
              В Україні немає критого парку такого масштабу.
              <span className="text-black/50"> Ми будуємо перший.</span>
            </h2>
            <p className="mt-6 max-w-2xl font-medium text-black/70">
              Парк поділений на кілька умовних зон — кожен знайде свою
              улюблену фігуру. Різноманітність фігур дозволяє новачку
              поступово підіймати свій рівень, у той час як про може
              поєднувати частини парку між собою і будувати власні лінії.
            </p>
            <p className="mt-4 max-w-2xl font-medium text-black/70">
              Будівництво проходить у кілька етапів. 1000 м² під одним дахом:
              ейр-зона з флайбоксами і квотерами різних розмірів та окрема
              флет-зона для роллердрому — цілорічно, незалежно від сезону.
            </p>
          </div>
        </div>
      </section>

      {/* SPECS — scoreboard */}
      <section id="specs" className="relative bg-black py-20 text-[#f2ede4]">
        <div className="halftone-red pointer-events-none absolute inset-0 opacity-[0.08]" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="reveal-up mb-12 flex items-end justify-between border-b-2 border-[#e2001a] pb-4">
            <h2 className="font-futura text-2xl font-bold uppercase md:text-4xl">Специфікація об'єкта</h2>
            <span className="hidden font-futura text-xs text-white/50 md:block">
              DWG-ZLIT-001 / REV.03
            </span>
          </div>
          <div className="reveal-up grid grid-cols-2 gap-px overflow-hidden border-2 border-white/10 bg-white/10 md:grid-cols-3">
            {SPECS.map((s) => (
              <div key={s.label} className="bg-black p-6 md:p-8">
                <StatNumber value={s.value} decimals={s.decimals} custom={s.custom} />
                <span className="ml-2 font-futura text-sm text-white/50">{s.unit}</span>
                <p className="mt-2 text-sm font-medium uppercase tracking-wide text-white/60">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Перелік фігур і зон парку */}
          <div className="reveal-up mt-8 flex flex-wrap gap-2">
            {FEATURES.map((f) => (
              <span
                key={f}
                className="border border-white/20 px-3 py-1.5 font-futura text-xs uppercase tracking-wide text-white/70"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      <TornDivider />

      

      {/* GALLERY — горизонтальна прокрутка, фото + відео зі стройки */}
      <section id="gallery" className="mx-auto max-w-7xl px-6 py-20">
        <p className="reveal-up font-futura text-xs font-bold uppercase tracking-[0.25em] text-[#e2001a]">
          Стройка наживо
        </p>
        <h2 className="reveal-up mt-3 font-futura text-3xl font-bold uppercase md:text-5xl">
          Прогрес об'єкта
        </h2>
        <p className="reveal-up mt-3 max-w-xl text-black/60">
          Гортайте вбік — тут з'являтимуться нові фото й відео з кожного етапу
          будівництва. Замініть плейсхолдери в масиві GALLERY на реальні кадри.
        </p>

        <div className="reveal-up no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
          {GALLERY.map((g, i) => (
            <figure
              key={g.id}
              className="relative w-[70vw] shrink-0 snap-start border-2 border-black bg-black/5 p-2 shadow-[4px_4px_0_#000] sm:w-[45vw] md:w-[30vw] lg:w-[24vw]"
              style={{ transform: `rotate(${i % 2 === 0 ? -1.5 : 1.5}deg)` }}
            >
              <div className="tape absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-1 border border-black/20" />
              {g.src ? (
                g.type === "video" ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                    <img src={g.poster || g.src} alt={g.caption} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="text-[#f2ede4]" size={36} fill="currentColor" />
                    </div>
                  </div>
                ) : (
                  <img src={g.src} alt={g.caption} className="aspect-[4/3] w-full object-cover" />
                )
              ) : (
                <div className="halftone relative flex aspect-[4/3] w-full items-center justify-center bg-[#d9d3c7]">
                  {g.type === "video" && <Play className="absolute text-black/30" size={32} />}
                  <span className="font-futura text-[10px] font-bold uppercase tracking-widest text-black/40">
                    {g.type === "video" ? "ВІДЕО" : "ФОТО"} {g.id}
                  </span>
                </div>
              )}
              <figcaption className="mt-2 text-center font-futura text-[11px] font-bold uppercase tracking-wide text-black/70">
                {g.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CONFIRMED PARTNERS — trust bar */}
      <section className="border-y-2 border-black bg-[#e9e3d6] py-10">
        <div className="mx-auto max-w-7xl px-6">
          <p className="reveal-up mb-6 text-center font-futura text-xs font-bold uppercase tracking-[0.25em] text-black/50">
            Вже з нами
          </p>
          <div className="reveal-up flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {CONFIRMED_PARTNERS.map((p) => (
              // Замініть span на <img src="..." className="h-8 w-auto grayscale opacity-70" />
              <span
                key={p}
                className="font-futura text-lg font-bold uppercase tracking-wide text-black/40"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SPONSORS / PARTNERS */}
      <section id="sponsors" className="mx-auto max-w-7xl px-6 py-20">
        <p className="reveal-up font-futura text-xs font-bold uppercase tracking-[0.25em] text-[#e2001a]">
          Для партнерів
        </p>
        <h2 className="reveal-up mt-3 max-w-2xl font-futura text-4xl font-bold uppercase leading-none md:text-6xl">
          Підтримуй спорт і вкладайся в майбутнє
        </h2>
        <p className="reveal-up mt-4 max-w-2xl text-black/70">
          Брендування фігур, логотипи, банери, партнерські програми — розглядаємо
          всі варіанти співпраці.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.code}
              className={`reveal-up flex flex-col justify-between border-2 border-black p-7 transition hover:-translate-y-1 ${
                t.highlight ? "bg-black text-[#f2ede4] shadow-[6px_6px_0_#e2001a]" : "bg-[#f2ede4] shadow-[6px_6px_0_#000]"
              }`}
            >
              <div>
                <span
                  className={`font-futura text-xs font-bold ${
                    t.highlight ? "text-[#e2001a]" : "text-black/50"
                  }`}
                >
                  {t.code}
                </span>
                <h3 className="mt-2 font-futura text-2xl font-bold uppercase">{t.name}</h3>
                <p className={`mt-4 text-sm leading-relaxed ${t.highlight ? "text-white/70" : "text-black/70"}`}>
                  {t.desc}
                </p>
              </div>
              <button
                onClick={() => setActiveModal("sponsor")}
                className={`mt-7 inline-flex items-center gap-1 self-start font-futura text-xs font-bold uppercase tracking-widest ${
                  t.highlight ? "text-[#e2001a]" : "text-black"
                }`}
              >
                Обговорити співпрацю <ArrowUpRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TRAINERS */}
      <section className="border-y-2 border-black bg-black py-20 text-[#f2ede4]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2">
          <div className="reveal-up">
            <p className="font-futura text-xs font-bold uppercase tracking-[0.25em] text-[#e2001a]">
              Тренерам і федераціям
            </p>
            <h2 className="mt-3 font-futura text-3xl font-bold uppercase leading-none md:text-5xl">
              Тренуй зі своєю базою — або розвивай кар'єру з нуля
            </h2>
            <p className="mt-5 text-white/70">
              Тренуй у нас на локації. Для тренерів передбачений спеціально
              відведений час — щоб було комфортно і не перетинатися з тими,
              хто просто катається.
            </p>
            <button
              onClick={() => setActiveModal("trainer")}
              className="mt-7 inline-flex items-center gap-2 border-2 border-[#f2ede4] px-6 py-3 font-futura text-sm font-bold uppercase tracking-wider transition hover:bg-[#e2001a] hover:border-[#e2001a]"
            >
              Долучитися як тренер <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="reveal-up grid grid-cols-2 gap-px overflow-hidden border-2 border-white/10 bg-white/10 font-futura text-sm">
            {["Ейр-зона", "Vert wall", "Флайбокси", "Квотери", "Флет / роллердром", "Спайн-квотер"].map((zone) => (
              <div key={zone} className="bg-black px-5 py-6 text-white/60">
                {zone}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIDERS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="reveal-up mx-auto max-w-xl text-center">
          <span className="stamp inline-block rotate-3 border-3 px-3 py-1 font-futura text-xs font-bold uppercase tracking-widest">
            Riders Only
          </span>
          <h2 className="mt-5 font-futura text-4xl font-bold uppercase md:text-5xl">
            Запишись на тестове катання
          </h2>
          <p className="mt-4 text-black/70">
            Місце відкриється для всіх, але у тебе є шанс потрапити на тестове
            катання ще до офіційного відкриття. Місця обмежені.
          </p>
          <p className="mt-3 text-sm text-black/50">
            Розіграємо кілька проходок 1+1, а частину відберемо за відео
            катання — залежно від рівня.
          </p>
          <button
            onClick={() => setActiveModal("rider")}
            className="mt-8 inline-flex items-center gap-2 bg-black px-7 py-3 font-futura text-sm font-bold uppercase tracking-wider text-[#f2ede4] transition hover:bg-[#e2001a]"
          >
            Залишити заявку <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      {/* MEDIA */}
      <section className="border-y-2 border-black bg-[#e9e3d6] py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2">
          <div className="reveal-up order-2 md:order-1">
            <div className="grid grid-cols-2 gap-px overflow-hidden border-2 border-black/10 bg-black/10 font-futura text-sm">
              {["Блогери", "Інфопортали", "Інфопартнери", "Фото / відео команди"].map((z) => (
                <div key={z} className="bg-[#e9e3d6] px-5 py-6 text-black/60">
                  {z}
                </div>
              ))}
            </div>
          </div>
          <div className="reveal-up order-1 md:order-2">
            <p className="font-futura text-xs font-bold uppercase tracking-[0.25em] text-[#e2001a]">
              Медіа
            </p>
            <h2 className="mt-3 font-futura text-3xl font-bold uppercase leading-none md:text-5xl">
              Знімай унікальний репортаж прямо зі стройки
            </h2>
            <p className="mt-5 text-black/70">
              Можливо, саме у тебе — унікальна нагода завітати до нас на етапи
              будівництва і зняти власний ексклюзивний матеріал, поки цього
              місця ще ніхто не бачив.
            </p>
            <button
              onClick={() => setActiveModal("media")}
              className="mt-7 inline-flex items-center gap-2 border-2 border-black px-6 py-3 font-futura text-sm font-bold uppercase tracking-wider transition hover:bg-black hover:text-[#f2ede4]"
            >
              Подати заявку для медіа <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" ref={roadmapRef} className="border-t-2 border-black bg-[#e9e3d6] py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal-up font-futura text-2xl font-bold uppercase md:text-4xl">
            Хід будівництва
          </h2>
          <div className="relative mt-12">
            <div className="absolute left-[27px] top-0 h-full w-1 bg-black/15" />
            <div className="roadmap-progress absolute left-[27px] top-0 h-full w-1 bg-[#e2001a]" />
            <div className="flex flex-col gap-10">
              {ROADMAP.map((r) => (
                <div key={r.step} className="reveal-up relative flex gap-7 pl-14">
                  <span
                    className={`absolute left-0 flex h-14 w-14 items-center justify-center border-2 font-futura text-xl font-semibold ${
                      r.status === "done"
                        ? "border-black bg-black text-[#f2ede4]"
                        : r.status === "active"
                        ? "border-[#e2001a] bg-[#e2001a] text-[#f2ede4]"
                        : "border-black/30 text-black/40"
                    }`}
                  >
                    {r.step}
                  </span>
                  <div>
                    <p className="font-futura text-xs font-bold uppercase tracking-widest text-black/50">
                      {r.period}
                    </p>
                    <h3 className="mt-1 font-futura text-xl font-bold uppercase md:text-2xl">
                      {r.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="relative overflow-hidden bg-black pt-20 text-[#f2ede4]">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #e20084 0px, #e2001a 22px, transparent 22px, transparent 44px)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pb-16">
          <div className="reveal-up max-w-2xl">
            <h2
              className="font-futura text-5xl font-black uppercase leading-[0.85] md:text-7xl"
              style={{ textShadow: "4px 4px 0 #e20088" }}
            >
              Долучайся
              <br /> до зльоту
            </h2>
            <p className="mt-6 text-white/60">
              Партнерство, тренерська співпраця, медіа-запити чи запис на
              тестове катання — обери свою роль, форма займе хвилину.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveModal("sponsor")}
                className="border-2 border-[#f2ede4] px-5 py-2.5 font-futura text-xs font-bold uppercase tracking-widest transition hover:bg-[#e2001a] hover:border-[#e2001a]"
              >
                Партнерам
              </button>
              <button
                onClick={() => setActiveModal("trainer")}
                className="border-2 border-[#f2ede4] px-5 py-2.5 font-futura text-xs font-bold uppercase tracking-widest transition hover:bg-[#e2001a] hover:border-[#e2001a]"
              >
                Тренерам
              </button>
              <button
                onClick={() => setActiveModal("rider")}
                className="border-2 border-[#f2ede4] px-5 py-2.5 font-futura text-xs font-bold uppercase tracking-widest transition hover:bg-[#e2001a] hover:border-[#e2001a]"
              >
                Райдерам
              </button>
              <button
                onClick={() => setActiveModal("media")}
                className="border-2 border-[#f2ede4] px-5 py-2.5 font-futura text-xs font-bold uppercase tracking-widest transition hover:bg-[#e2001a] hover:border-[#e2001a]"
              >
                Медіа
              </button>
            </div>
            <a
              href="mailto:hello@zlit.kyiv.ua"
              className="mt-8 inline-flex items-center gap-2 border-b-2 border-[#f2ede4] pb-1 font-futura text-lg"
            >
              <Mail size={18} /> hello@zlit.kyiv.ua
            </a>
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t-2 border-white/15 pt-8 md:flex-row md:items-center">
            <span className="font-futura text-lg font-black uppercase">SKATEPARK</span>
            <div className="flex gap-5 text-white/60">
              <a href="#" aria-label="Instagram" className="transition hover:text-[#e2001a]">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="YouTube" className="transition hover:text-[#e2001a]">
                <Youtube size={18} />
              </a>
              <a href="#" aria-label="Telegram" className="transition hover:text-[#e2001a]">
                <Send size={18} />
              </a>
            </div>
            <span className="font-futura text-xs text-white/40">
              Kyiv, Ukraine © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </section>

      {activeModal && <Modal type={activeModal} onClose={() => setActiveModal(null)} />}
    </div>
  );
}
// import { useEffect, useRef, useState } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { ArrowUpRight, Mail, Instagram, Youtube, Send, X as CloseIcon } from "lucide-react";

// gsap.registerPlugin(ScrollTrigger);

// /**
//  * ZLIT — лендинг крытого эир-скейтпарка в Киеве.
//  * Стиль: thrasher-zine × X Games broadcast.
//  *
//  * Установка:
//  *   npm install gsap lucide-react
//  *
//  * Шрифты (добавьте в public/index.html <head>):
//  *   https://fonts.googleapis.com/css2?family=Oswald:wght@500;700;900
//  *     &family=Teko:wght@500;600;700&family=Inter:wght@400;500;600
//  *     &family=JetBrains+Mono:wght@400;500;700&display=swap
//  *
//  * ЗАМЕНИТЕ:
//  *  - BUILDER_LOGO / PARTNER_LOGO — два лого в шапке
//  *  - GALLERY — фото со стройки (сейчас плейсхолдеры)
//  *  - CONFIRMED_PARTNERS — логотипы подтверждённых партнёров
//  *  - SPECS / TIERS / ROADMAP — реальные данные
//  */

// // ---------- Данные (замените на реальные) ----------

// const BUILDER_LOGO = "BUILD CO."; // кто строит
// const PARTNER_LOGO = "ZLIT CREW"; // для кого строят / бренд-инициатор

// const SPECS = [
//   { label: "Площа комплексу", value: 4700, unit: "м²", decimals: 0 },
//   { label: "Висота стелі", value: 14, unit: "м", decimals: 0 },
//   { label: "Глибина bowl", value: 3.6, unit: "м", decimals: 1 },
//   { label: "Вертикальна стіна", value: 4.2, unit: "м", decimals: 1 },
//   { label: "Пропускна здатність", value: 450, unit: "райдерів/день", decimals: 0 },
//   { label: "Зон катання", value: 6, unit: "дисциплін", decimals: 0 },
// ];

// const GALLERY = [
//   { id: 1, caption: "ФУНДАМЕНТ · 03.2026" },
//   { id: 2, caption: "КАРКАС ПІВНІЧНОЇ СТІНИ" },
//   { id: 3, caption: "МОНТАЖ ФЕРМ ПОКРІВЛІ" },
//   { id: 4, caption: "BOWL, ЧОРНОВА ГЕОМЕТРІЯ" },
//   { id: 5, caption: "VERT WALL, ОПАЛУБКА" },
//   { id: 6, caption: "ЗАГАЛЬНИЙ ВИГЛЯД, ДРОН" },
// ];

// const CONFIRMED_PARTNERS = ["VANS", "RED BULL", "NOVA POSHTA", "KYIVSTAR", "MONSTER"]; // плейсхолдер

// const TIERS = [
//   {
//     code: "T-01",
//     name: "Title Partner",
//     desc: "Ваш бренд у назві парку та на головній рампі. Ексклюзивність у категорії. Пріоритет у медіа та на подіях.",
//     highlight: true,
//   },
//   {
//     code: "T-02",
//     name: "Structural Partner",
//     desc: "Брендування окремої зони — bowl, vert або street. Лого на екіпіруванні тренерів, участь у відкритті.",
//     highlight: false,
//   },
//   {
//     code: "T-03",
//     name: "Community Partner",
//     desc: "Лого на сайті, мерчі та в соцмережах. Підтримка контестів і подій для райдерів і місцевої спільноти.",
//     highlight: false,
//   },
// ];

// const ROADMAP = [
//   { step: "01", title: "Проєктування та інженерні розрахунки", period: "2025 Q3 — Q4", status: "done" },
//   { step: "02", title: "Будівництво каркасу та покрівлі", period: "2026 Q1 — Q2", status: "active" },
//   { step: "03", title: "Монтаж рамп, покриття, освітлення", period: "2026 Q3 — Q4", status: "upcoming" },
//   { step: "04", title: "Тестові заїзди, сертифікація, відкриття", period: "2027 Q2", status: "upcoming" },
// ];

// // ---------- Формы модалок по аудиториям ----------

// const MODAL_CONFIG = {
//   sponsor: {
//     title: "Спонсорський запит",
//     tag: "SPONSOR / PARTNER INQUIRY",
//     fields: [
//       { name: "company", label: "Компанія", type: "text", required: true },
//       { name: "contact", label: "Контактна особа", type: "text", required: true },
//       { name: "email", label: "Email", type: "email", required: true },
//       {
//         name: "tier",
//         label: "Цікавий пакет",
//         type: "select",
//         options: ["Title Partner", "Structural Partner", "Community Partner", "Ще не визначились"],
//       },
//       { name: "message", label: "Коментар", type: "textarea" },
//     ],
//   },
//   trainer: {
//     title: "Заявка тренера / федерації",
//     tag: "COACH / FEDERATION APPLICATION",
//     fields: [
//       { name: "name", label: "Ім'я", type: "text", required: true },
//       {
//         name: "role",
//         label: "Хто ви",
//         type: "select",
//         options: ["Тренер", "Федерація", "Бренд екіпіровки", "Інше"],
//       },
//       { name: "experience", label: "Досвід / деталі", type: "textarea" },
//       { name: "email", label: "Email", type: "email", required: true },
//     ],
//   },
//   rider: {
//     title: "Реєстрація райдера",
//     tag: "EARLY ACCESS WAITLIST",
//     fields: [
//       { name: "name", label: "Ім'я", type: "text", required: true },
//       { name: "email", label: "Email", type: "email", required: true },
//       {
//         name: "discipline",
//         label: "Дисципліна",
//         type: "select",
//         options: ["Street", "Bowl", "Vert", "Mini-ramp", "Все з перерахованого"],
//       },
//     ],
//   },
// };

// // ---------- Допоміжні компоненти ----------

// function GrungeStyles() {
//   // Глобальные текстуры/паттерны, инжектим один раз.
//   return (
//     <style>{`
//       .halftone {
//         background-image: radial-gradient(circle, #000 1px, transparent 1.4px);
//         background-size: 6px 6px;
//       }
//       .halftone-red {
//         background-image: radial-gradient(circle, #e2001a 1px, transparent 1.4px);
//         background-size: 7px 7px;
//       }
//       .torn-top {
//         clip-path: polygon(
//           0% 12px, 4% 0, 9% 10px, 14% 2px, 19% 12px, 24% 0, 29% 9px, 34% 1px, 39% 11px,
//           44% 3px, 49% 12px, 54% 0, 59% 9px, 64% 2px, 69% 12px, 74% 0, 79% 10px, 84% 1px,
//           89% 11px, 94% 3px, 100% 12px, 100% 100%, 0% 100%
//         );
//       }
//       .tape {
//         background: repeating-linear-gradient(115deg, rgba(242,237,228,0.85) 0 4px, rgba(242,237,228,0.65) 4px 8px);
//         box-shadow: 0 1px 2px rgba(0,0,0,0.3);
//       }
//       .stamp {
//         border: 3px dashed #e2001a;
//         color: #e2001a;
//         mix-blend-mode: multiply;
//       }
//     `}</style>
//   );
// }

// function HazardMarquee() {
//   const text = "СПОНСОРСТВО — ТРЕНЕРИ — ПАРТНЕРСТВО — МЕДІА — РАЙДЕРИ — ОБ'ЄКТ У СТРОЙЦІ — ";
//   return (
//     <div className="relative overflow-hidden border-y-4 border-black bg-black py-3">
//       <div
//         className="absolute inset-0 opacity-90"
//         style={{
//           backgroundImage:
//             "repeating-linear-gradient(135deg, #e2001a 0px, #e2001a 22px, #000 22px, #000 44px)",
//         }}
//       />
//       <div className="marquee-track relative flex w-max whitespace-nowrap">
//         {[0, 1].map((i) => (
//           <span
//             key={i}
//             className="px-4 font-futura text-sm font-bold uppercase tracking-[0.2em] text-black"
//           >
//             <span className="bg-[#f2ede4] px-3 py-1">{text.repeat(4)}</span>
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }

// function RampBlueprint({ pathRef, className }) {
//   return (
//     <svg viewBox="0 0 600 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
//       <g stroke="#3a3a3a" strokeWidth="1" strokeDasharray="2 4" opacity="0.5">
//         <line x1="0" y1="50" x2="600" y2="50" />
//         <line x1="0" y1="150" x2="600" y2="150" />
//         <line x1="0" y1="250" x2="600" y2="250" />
//         <line x1="100" y1="0" x2="100" y2="300" />
//         <line x1="300" y1="0" x2="300" y2="300" />
//         <line x1="500" y1="0" x2="500" y2="300" />
//       </g>
//       <path
//         ref={pathRef}
//         d="M 20 250 L 140 250 C 200 250 200 130 260 130 C 300 130 300 60 300 20 M 300 130 C 340 130 340 250 400 250 L 580 250"
//         stroke="#e2001a"
//         strokeWidth="3"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <text x="24" y="270" fill="#8a8a8a" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1">
//         SECTION A—A · VERT + BOWL · SCALE 1:120
//       </text>
//     </svg>
//   );
// }

// function StatNumber({ value, decimals }) {
//   return (
//     <span
//       className="stat-number font-futura text-6xl font-semibold leading-none text-[#f2ede4] md:text-7xl"
//       data-value={value}
//       data-decimals={decimals}
//     >
//       0
//     </span>
//   );
// }

// function TornDivider() {
//   return <div className="torn-top h-4 w-full bg-[#f2ede4]" />;
// }

// function Modal({ type, onClose }) {
//   const config = MODAL_CONFIG[type];
//   const [sent, setSent] = useState(false);
//   if (!config) return null;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSent(true);
//   };

//   return (
//     <div
//       className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
//       onClick={onClose}
//     >
//       <div
//         className="relative w-full max-w-md border-4 border-black bg-[#f2ede4] p-8 text-black shadow-[8px_8px_0_#e2001a]"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           onClick={onClose}
//           aria-label="Закрити"
//           className="absolute right-3 top-3 border-2 border-black bg-[#f2ede4] p-1 transition hover:bg-black hover:text-[#f2ede4]"
//         >
//           <CloseIcon size={18} />
//         </button>

//         <p className="font-futura text-xs font-bold uppercase tracking-[0.2em] text-[#e2001a]">
//           {config.tag}
//         </p>
//         <h3 className="mt-2 font-futura text-3xl font-bold uppercase leading-none">
//           {config.title}
//         </h3>

//         {sent ? (
//           <p className="mt-8 font-futura text-sm">
//             Прийнято. Ми зв'яжемось найближчим часом.
//           </p>
//         ) : (
//           <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
//             {config.fields.map((f) => (
//               <label key={f.name} className="flex flex-col gap-1">
//                 <span className="font-futura text-[11px] font-bold uppercase tracking-widest text-black/70">
//                   {f.label}
//                   {f.required ? " *" : ""}
//                 </span>
//                 {f.type === "textarea" ? (
//                   <textarea
//                     required={f.required}
//                     rows={3}
//                     className="border-2 border-black bg-white px-3 py-2 text-sm outline-none focus:border-[#e2001a]"
//                   />
//                 ) : f.type === "select" ? (
//                   <select
//                     required={f.required}
//                     className="border-2 border-black bg-white px-3 py-2 text-sm outline-none focus:border-[#e2001a]"
//                   >
//                     {f.options.map((o) => (
//                       <option key={o}>{o}</option>
//                     ))}
//                   </select>
//                 ) : (
//                   <input
//                     type={f.type}
//                     required={f.required}
//                     className="border-2 border-black bg-white px-3 py-2 text-sm outline-none focus:border-[#e2001a]"
//                   />
//                 )}
//               </label>
//             ))}
//             <button
//               type="submit"
//               className="mt-2 bg-black px-6 py-3 font-futura text-sm font-bold uppercase tracking-widest text-[#f2ede4] transition hover:bg-[#e2001a]"
//             >
//               Надіслати
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

// // ---------- Основной компонент ----------

// export default function ZlitLanding() {
//   const heroPathRef = useRef(null);
//   const roadmapRef = useRef(null);
//   const [activeModal, setActiveModal] = useState(null); // null | 'sponsor' | 'trainer' | 'rider'

//   useEffect(() => {
//     const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//     const ctx = gsap.context(() => {
//       if (!prefersReduced) {
//         const path = heroPathRef.current;
//         if (path) {
//           const length = path.getTotalLength();
//           gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
//           gsap.to(path, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", delay: 0.3 });
//         }

//         gsap.from(".speed-line", {
//           xPercent: -120,
//           opacity: 0,
//           duration: 1,
//           stagger: 0.07,
//           ease: "power3.out",
//           delay: 0.2,
//         });

//         gsap.from(".hero-reveal", {
//           y: 36,
//           opacity: 0,
//           duration: 0.8,
//           stagger: 0.1,
//           ease: "power3.out",
//           delay: 0.5,
//         });

//         gsap.to(".marquee-track", { xPercent: -50, repeat: -1, duration: 22, ease: "linear" });
//       } else {
//         gsap.set([".speed-line", ".hero-reveal"], { opacity: 1, x: 0, y: 0 });
//       }

//       gsap.utils.toArray(".reveal-up").forEach((el) => {
//         gsap.from(el, {
//           y: 50,
//           opacity: 0,
//           duration: 0.9,
//           ease: "power3.out",
//           scrollTrigger: { trigger: el, start: "top 88%" },
//         });
//       });

//       gsap.utils.toArray(".stat-number").forEach((el) => {
//         const target = parseFloat(el.dataset.value);
//         const decimals = parseInt(el.dataset.decimals, 10) || 0;
//         const obj = { val: 0 };
//         ScrollTrigger.create({
//           trigger: el,
//           start: "top 90%",
//           once: true,
//           onEnter: () =>
//             gsap.to(obj, {
//               val: target,
//               duration: 1.6,
//               ease: "power2.out",
//               onUpdate: () => {
//                 el.textContent = obj.val.toFixed(decimals).replace(".", ",");
//               },
//             }),
//         });
//       });

//       if (roadmapRef.current) {
//         gsap.fromTo(
//           ".roadmap-progress",
//           { scaleY: 0 },
//           {
//             scaleY: 1,
//             transformOrigin: "top",
//             ease: "none",
//             scrollTrigger: {
//               trigger: roadmapRef.current,
//               start: "top 60%",
//               end: "bottom 80%",
//               scrub: 0.6,
//             },
//           }
//         );
//       }

//       // лёгкий "дрожащий" hover на карточках галереи и тиров задаётся классами Tailwind,
//       // GSAP тут не нужен — оставляем CSS transition для производительности.
//     });

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#f2ede4] font-futura text-black antialiased">
//       <GrungeStyles />

//       {/* NAV — два лого через "×" */}
//       <header className="fixed inset-x-0 top-0 z-50 border-b-4 border-black bg-[#f2ede4]">
//         <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
//           <div className="flex items-center gap-3">
//             <div className="border-2 border-black px-3 py-1.5">
//               <span className="font-futura text-sm font-bold uppercase tracking-wide">
//                 {BUILDER_LOGO}
//               </span>
//             </div>
//             <span className="font-futura text-xl font-black text-[#e2001a]">×</span>
//             <div className="border-2 border-black bg-black px-3 py-1.5">
//               <span className="font-futura text-sm font-bold uppercase tracking-wide text-[#f2ede4]">
//                 {PARTNER_LOGO}
//               </span>
//             </div>
//           </div>

//           <nav className="hidden gap-6 font-futura text-xs font-bold uppercase tracking-widest md:flex">
//             <a href="#specs" className="transition hover:text-[#e2001a]">Об'єкт</a>
//             <a href="#gallery" className="transition hover:text-[#e2001a]">Стройка</a>
//             <a href="#sponsors" className="transition hover:text-[#e2001a]">Спонсорам</a>
//             <a href="#roadmap" className="transition hover:text-[#e2001a]">Хід робіт</a>
//           </nav>

//           <button
//             onClick={() => setActiveModal("sponsor")}
//             className="border-2 border-black bg-[#e2001a] px-4 py-2 font-futura text-xs font-bold uppercase tracking-widest text-[#f2ede4] transition hover:bg-black"
//           >
//             Партнерство
//           </button>
//         </div>
//       </header>

//       {/* HERO */}
//       <section className="relative overflow-hidden pt-28 pb-16 md:pt-36">
//         <div className="halftone pointer-events-none absolute inset-0 opacity-[0.06]" />
//         <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <div
//               key={i}
//               className="speed-line absolute h-[3px] bg-black"
//               style={{ top: `${14 + i * 16}%`, width: "140%", left: "-20%", transform: "rotate(-5deg)" }}
//             />
//           ))}
//         </div>

//         <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-2 md:items-center">
//           <div>
//             <span className="stamp hero-reveal inline-block rotate-[-6deg] border-3 px-3 py-1 font-futura text-xs font-bold uppercase tracking-widest">
//               Under Construction
//             </span>
//             <h1
//               className="hero-reveal mt-6 font-futura text-7xl font-black uppercase leading-[0.85] tracking-tight md:text-9xl"
//               style={{ textShadow: "5px 5px 0 #e2001a" }}
//             >
//               Zlit
//             </h1>
//             <p className="hero-reveal mt-4 max-w-md font-futura text-sm uppercase tracking-wide text-black/70">
//               Kyiv · Indoor Air Park · Est. 2027
//             </p>
//             <p className="hero-reveal mt-6 max-w-md text-lg font-medium text-black/80 md:text-xl">
//               Перший в Україні критий скейтпарк такого масштабу. Без сезонів,
//               без погоди, без обмежень — лише швидкість, повітря і бетон.
//             </p>
//             <div className="hero-reveal mt-9 flex flex-wrap gap-3">
//               <button
//                 onClick={() => setActiveModal("sponsor")}
//                 className="inline-flex items-center gap-2 border-2 border-black bg-black px-6 py-3 font-futura text-sm font-bold uppercase tracking-wider text-[#f2ede4] transition hover:bg-[#e2001a]"
//               >
//                 Стати спонсором <ArrowUpRight size={16} />
//               </button>
//               <a
//                 href="#specs"
//                 className="inline-flex items-center gap-2 border-2 border-black px-6 py-3 font-futura text-sm font-bold uppercase tracking-wider transition hover:bg-black hover:text-[#f2ede4]"
//               >
//                 Специфікація
//               </a>
//             </div>
//           </div>

//           <div className="hero-reveal relative border-4 border-black bg-black p-4">
//             <RampBlueprint pathRef={heroPathRef} className="w-full" />
//           </div>
//         </div>
//       </section>

//       <HazardMarquee />

//       {/* VISION — вырезка из зина */}
//       <section className="mx-auto max-w-7xl px-6 py-20">
//         <div className="reveal-up grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.4fr]">
//           <p className="font-futura text-xs font-bold uppercase tracking-[0.25em] text-[#e2001a]">
//             Чому це важливо
//           </p>
//           <div className="border-l-4 border-black pl-6">
//             <h2 className="font-futura text-4xl font-bold uppercase leading-[0.95] md:text-6xl">
//               В Україні немає критого парку такого масштабу.
//               <span className="text-black/50"> Ми будуємо перший.</span>
//             </h2>
//             <p className="mt-6 max-w-2xl font-medium text-black/70">
//               Сьогодні райдери залежні від погоди й сезону, тренери — від
//               випадкових локацій, а спорт — від ентузіазму, а не інфраструктури.
//               ЗЛІТ — це цілорічний об'єкт олімпійського рівня: bowl, vert,
//               street-зона та мегарампа під одним дахом у Києві.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* SPECS — scoreboard */}
//       <section id="specs" className="relative bg-black py-20 text-[#f2ede4]">
//         <div className="halftone-red pointer-events-none absolute inset-0 opacity-[0.08]" />
//         <div className="relative mx-auto max-w-7xl px-6">
//           <div className="reveal-up mb-12 flex items-end justify-between border-b-2 border-[#e2001a] pb-4">
//             <h2 className="font-futura text-2xl font-bold uppercase md:text-4xl">Специфікація об'єкта</h2>
//             <span className="hidden font-futura text-xs text-white/50 md:block">
//               DWG-ZLIT-001 / REV.03
//             </span>
//           </div>
//           <div className="reveal-up grid grid-cols-2 gap-px overflow-hidden border-2 border-white/10 bg-white/10 md:grid-cols-3">
//             {SPECS.map((s) => (
//               <div key={s.label} className="bg-black p-6 md:p-8">
//                 <StatNumber value={s.value} decimals={s.decimals} />
//                 <span className="ml-2 font-futura text-sm text-white/50">{s.unit}</span>
//                 <p className="mt-2 text-sm font-medium uppercase tracking-wide text-white/60">{s.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <TornDivider />

//       {/* GALLERY — фото со стройки, "приклеены скотчем" */}
//       <section id="gallery" className="mx-auto max-w-7xl px-6 py-20">
//         <p className="reveal-up font-futura text-xs font-bold uppercase tracking-[0.25em] text-[#e2001a]">
//           Стройка наживо
//         </p>
//         <h2 className="reveal-up mt-3 font-futura text-3xl font-bold uppercase md:text-5xl">
//           Прогрес об'єкта
//         </h2>
//         <p className="reveal-up mt-3 max-w-xl text-black/60">
//           Замініть плейсхолдери нижче на реальні фото/рендери зі стройки —
//           компонент &lt;Gallery /&gt; підтримує будь-яку кількість карток.
//         </p>

//         <div className="reveal-up mt-12 grid grid-cols-2 gap-8 md:grid-cols-3">
//           {GALLERY.map((g, i) => (
//             <figure
//               key={g.id}
//               className="relative border-2 border-black bg-black/5 p-2 shadow-[4px_4px_0_#000]"
//               style={{ transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }}
//             >
//               <div className="tape absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-1 border border-black/20" />
//               {/* Замените div ниже на <img src="..." className="aspect-[4/3] w-full object-cover" /> */}
//               <div className="halftone flex aspect-[4/3] w-full items-center justify-center bg-[#d9d3c7]">
//                 <span className="font-futura text-[10px] font-bold uppercase tracking-widest text-black/40">
//                   ФОТО {g.id}
//                 </span>
//               </div>
//               <figcaption className="mt-2 text-center font-futura text-[11px] font-bold uppercase tracking-wide text-black/70">
//                 {g.caption}
//               </figcaption>
//             </figure>
//           ))}
//         </div>
//       </section>

//       {/* CONFIRMED PARTNERS — trust bar */}
//       <section className="border-y-2 border-black bg-[#e9e3d6] py-10">
//         <div className="mx-auto max-w-7xl px-6">
//           <p className="reveal-up mb-6 text-center font-futura text-xs font-bold uppercase tracking-[0.25em] text-black/50">
//             Вже з нами
//           </p>
//           <div className="reveal-up flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
//             {CONFIRMED_PARTNERS.map((p) => (
//               // Замените span на <img src="..." className="h-8 w-auto grayscale opacity-70" />
//               <span
//                 key={p}
//                 className="font-futura text-lg font-bold uppercase tracking-wide text-black/40"
//               >
//                 {p}
//               </span>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* SPONSORS */}
//       <section id="sponsors" className="mx-auto max-w-7xl px-6 py-20">
//         <p className="reveal-up font-futura text-xs font-bold uppercase tracking-[0.25em] text-[#e2001a]">
//           Партнерство
//         </p>
//         <h2 className="reveal-up mt-3 max-w-2xl font-futura text-4xl font-bold uppercase leading-none md:text-6xl">
//           Три способи бути частиною першого зльоту
//         </h2>

//         <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
//           {TIERS.map((t) => (
//             <div
//               key={t.code}
//               className={`reveal-up flex flex-col justify-between border-2 border-black p-7 transition hover:-translate-y-1 ${
//                 t.highlight ? "bg-black text-[#f2ede4] shadow-[6px_6px_0_#e2001a]" : "bg-[#f2ede4] shadow-[6px_6px_0_#000]"
//               }`}
//             >
//               <div>
//                 <span
//                   className={`font-futura text-xs font-bold ${
//                     t.highlight ? "text-[#e2001a]" : "text-black/50"
//                   }`}
//                 >
//                   {t.code}
//                 </span>
//                 <h3 className="mt-2 font-futura text-2xl font-bold uppercase">{t.name}</h3>
//                 <p className={`mt-4 text-sm leading-relaxed ${t.highlight ? "text-white/70" : "text-black/70"}`}>
//                   {t.desc}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setActiveModal("sponsor")}
//                 className={`mt-7 inline-flex items-center gap-1 self-start font-futura text-xs font-bold uppercase tracking-widest ${
//                   t.highlight ? "text-[#e2001a]" : "text-black"
//                 }`}
//               >
//                 Обговорити пакет <ArrowUpRight size={14} />
//               </button>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* TRAINERS */}
//       <section className="border-y-2 border-black bg-black py-20 text-[#f2ede4]">
//         <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2">
//           <div className="reveal-up">
//             <p className="font-futura text-xs font-bold uppercase tracking-[0.25em] text-[#e2001a]">
//               Тренерам і федераціям
//             </p>
//             <h2 className="mt-3 font-futura text-3xl font-bold uppercase leading-none md:text-5xl">
//               Об'єкт олімпійського рівня потребує команди олімпійського рівня
//             </h2>
//             <p className="mt-5 text-white/70">
//               Ми відкриті до співпраці з тренерськими штабами, федераціями
//               скейтбордингу та брендами екіпіровки — від методичних програм
//               до сумісних заходів і зборів.
//             </p>
//             <button
//               onClick={() => setActiveModal("trainer")}
//               className="mt-7 inline-flex items-center gap-2 border-2 border-[#f2ede4] px-6 py-3 font-futura text-sm font-bold uppercase tracking-wider transition hover:bg-[#e2001a] hover:border-[#e2001a]"
//             >
//               Долучитися як тренер / партнер <ArrowUpRight size={16} />
//             </button>
//           </div>
//           <div className="reveal-up grid grid-cols-2 gap-px overflow-hidden border-2 border-white/10 bg-white/10 font-futura text-sm">
//             {["Bowl", "Vert", "Street Plaza", "Mini-ramp", "Foam Pit", "Mega Ramp"].map((zone) => (
//               <div key={zone} className="bg-black px-5 py-6 text-white/60">
//                 {zone}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* RIDERS */}
//       <section className="mx-auto max-w-7xl px-6 py-20">
//         <div className="reveal-up mx-auto max-w-xl text-center">
//           <span className="stamp inline-block rotate-3 border-3 px-3 py-1 font-futura text-xs font-bold uppercase tracking-widest">
//             Riders Only
//           </span>
//           <h2 className="mt-5 font-futura text-4xl font-bold uppercase md:text-5xl">
//             Стань першим на старті
//           </h2>
//           <p className="mt-4 text-black/70">
//             Ранній доступ до передпродажу абонементів і запрошення на
//             тестові заїзди — до офіційного відкриття.
//           </p>
//           <button
//             onClick={() => setActiveModal("rider")}
//             className="mt-8 inline-flex items-center gap-2 bg-black px-7 py-3 font-futura text-sm font-bold uppercase tracking-wider text-[#f2ede4] transition hover:bg-[#e2001a]"
//           >
//             Отримати ранній доступ <ArrowUpRight size={16} />
//           </button>
//         </div>
//       </section>

//       {/* ROADMAP */}
//       <section id="roadmap" ref={roadmapRef} className="border-t-2 border-black bg-[#e9e3d6] py-20">
//         <div className="mx-auto max-w-4xl px-6">
//           <h2 className="reveal-up font-futura text-2xl font-bold uppercase md:text-4xl">
//             Хід будівництва
//           </h2>
//           <div className="relative mt-12">
//             <div className="absolute left-[27px] top-0 h-full w-1 bg-black/15" />
//             <div className="roadmap-progress absolute left-[27px] top-0 h-full w-1 bg-[#e2001a]" />
//             <div className="flex flex-col gap-10">
//               {ROADMAP.map((r) => (
//                 <div key={r.step} className="reveal-up relative flex gap-7 pl-14">
//                   <span
//                     className={`absolute left-0 flex h-14 w-14 items-center justify-center border-2 font-futura text-xl font-semibold ${
//                       r.status === "done"
//                         ? "border-black bg-black text-[#f2ede4]"
//                         : r.status === "active"
//                         ? "border-[#e2001a] bg-[#e2001a] text-[#f2ede4]"
//                         : "border-black/30 text-black/40"
//                     }`}
//                   >
//                     {r.step}
//                   </span>
//                   <div>
//                     <p className="font-futura text-xs font-bold uppercase tracking-widest text-black/50">
//                       {r.period}
//                     </p>
//                     <h3 className="mt-1 font-futura text-xl font-bold uppercase md:text-2xl">
//                       {r.title}
//                     </h3>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* FOOTER */}
//       <section className="relative overflow-hidden bg-black pt-20 text-[#f2ede4]">
//         <div
//           className="absolute inset-0 opacity-[0.05]"
//           style={{
//             backgroundImage:
//               "repeating-linear-gradient(135deg, #e2001a 0px, #e2001a 22px, transparent 22px, transparent 44px)",
//           }}
//         />
//         <div className="relative mx-auto max-w-7xl px-6 pb-16">
//           <div className="reveal-up max-w-2xl">
//             <h2
//               className="font-futura text-5xl font-black uppercase leading-[0.85] md:text-7xl"
//               style={{ textShadow: "4px 4px 0 #e2001a" }}
//             >
//               Долучайся
//               <br /> до зльоту
//             </h2>
//             <p className="mt-6 text-white/60">
//               Спонсорство, тренерська співпраця, медіа-запити чи просто
//               питання про проєкт — оберіть свою роль, форма займе хвилину.
//             </p>
//             <div className="mt-8 flex flex-wrap gap-3">
//               <button
//                 onClick={() => setActiveModal("sponsor")}
//                 className="border-2 border-[#f2ede4] px-5 py-2.5 font-futura text-xs font-bold uppercase tracking-widest transition hover:bg-[#e2001a] hover:border-[#e2001a]"
//               >
//                 Спонсорам
//               </button>
//               <button
//                 onClick={() => setActiveModal("trainer")}
//                 className="border-2 border-[#f2ede4] px-5 py-2.5 font-futura text-xs font-bold uppercase tracking-widest transition hover:bg-[#e2001a] hover:border-[#e2001a]"
//               >
//                 Тренерам
//               </button>
//               <button
//                 onClick={() => setActiveModal("rider")}
//                 className="border-2 border-[#f2ede4] px-5 py-2.5 font-futura text-xs font-bold uppercase tracking-widest transition hover:bg-[#e2001a] hover:border-[#e2001a]"
//               >
//                 Райдерам
//               </button>
//             </div>
//             <a
//               href="mailto:hello@zlit.kyiv.ua"
//               className="mt-8 inline-flex items-center gap-2 border-b-2 border-[#f2ede4] pb-1 font-futura text-lg"
//             >
//               <Mail size={18} /> hello@zlit.kyiv.ua
//             </a>
//           </div>

//           <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t-2 border-white/15 pt-8 md:flex-row md:items-center">
//             <span className="font-futura text-lg font-black uppercase">ZLIT</span>
//             <div className="flex gap-5 text-white/60">
//               <a href="#" aria-label="Instagram" className="transition hover:text-[#e2001a]">
//                 <Instagram size={18} />
//               </a>
//               <a href="#" aria-label="YouTube" className="transition hover:text-[#e2001a]">
//                 <Youtube size={18} />
//               </a>
//               <a href="#" aria-label="Telegram" className="transition hover:text-[#e2001a]">
//                 <Send size={18} />
//               </a>
//             </div>
//             <span className="font-futura text-xs text-white/40">
//               Kyiv, Ukraine © {new Date().getFullYear()}
//             </span>
//           </div>
//         </div>
//       </section>

//       {activeModal && <Modal type={activeModal} onClose={() => setActiveModal(null)} />}
//     </div>
//   );
// }
