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
//     <div className="min-h-screen bg-[#f2ede4] font-['Inter'] text-black antialiased">
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
//                     className={`absolute left-0 flex h-14 w-14 items-center justify-center border-2 font-['Teko'] text-xl font-semibold ${
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

import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ============================================================================
 *  SKATEPARK LANDING — "PAPER CUT-OUT / ZINE" STYLE
 * ============================================================================
 *  Стек: React + Tailwind + GSAP (ScrollTrigger)
 *
 *  ЧТО НУЖНО ПОДКЛЮЧИТЬ ДО ИСПОЛЬЗОВАНИЯ:
 *  1) npm i gsap
 *  2) В index.html добавить шрифты (или через @font-face):
 *     <link rel="preconnect" href="https://fonts.googleapis.com">
 *     <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
 *  3) В tailwind.config.js прокинуть кастомные токены (см. блок в конце файла
 *     "TAILWIND CONFIG PATCH") — цвета, шрифты, keyframes.
 *  4) Заменить все PLACEHOLDER_IMG / PLACEHOLDER_LOGO на реальные пути к
 *     фото стройки и логотипам партнёров (папка /public/images, /public/logos).
 *  5) Три формы (SPONSOR_EMAIL / TRAINER_EMAIL / RIDER_EMAIL) — подставить
 *     реальные адреса или API-эндпоинты.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// ДАННЫЕ (заменить на реальные)
// ---------------------------------------------------------------------------

const SPONSOR_EMAIL = "partners@airpark.kyiv.ua";
const TRAINER_EMAIL = "coach@airpark.kyiv.ua";
const RIDER_EMAIL = "hello@airpark.kyiv.ua";

const STATS = [
  { value: "2 400", label: "м² критої вертикалі та стріта", unit: "м²" },
  { value: "6", label: "метрів висота бетонного боула" },
  { value: "№1", label: "за розміром критий эір-парк в Україні" },
  { value: "365", label: "днів на рік — незалежно від погоди" },
];

const BUILD_PHOTOS = [
  { src: "/images/construction-01.jpg", cap: "Заливка боула, липень 2026" },
  { src: "/images/construction-02.jpg", cap: "Каркас ангару, 40м прольот" },
  { src: "/images/construction-03.jpg", cap: "Арматура vert-рампи" },
  { src: "/images/construction-04.jpg", cap: "Команда на об'єкті" },
];

const PARTNERS = [
  { name: "Vans", logo: "/logos/vans.svg" },
  { name: "Independent", logo: "/logos/independent.svg" },
  { name: "Nova Poshta", logo: "/logos/novaposhta.svg" },
  { name: "Monobank", logo: "/logos/monobank.svg" },
  { name: "Red Bull", logo: "/logos/redbull.svg" },
  { name: "Kyivstar", logo: "/logos/kyivstar.svg" },
];

const SPONSOR_TIERS = [
  {
    id: "bronze",
    name: "БРОНЗА",
    tag: "Locals Support",
    price: "від 50 000 ₴ / рік",
    color: "bg-tape",
    rotate: "-rotate-2",
    perks: [
      "Лого на «стіні спонсорів» біля входу (наліпка на бетоні, довговічний вініл)",
      "Згадка в Instagram/TikTok (1 пост + 3 stories на рік)",
      "10 гостьових абонементів на місяць для співробітників партнёра",
      "Лого на сайті проєкту в розділі «Нас підтримують»",
    ],
  },
  {
    id: "silver",
    name: "СРІБЛО",
    tag: "Event Partner",
    price: "від 150 000 ₴ / рік",
    color: "bg-electric",
    rotate: "rotate-1",
    perks: [
      "Все з пакету «Бронза»",
      "Брендування однієї зони парку (наприклад, зона розминки або зона стріта)",
      "Право проводити 2 власні контести/активації на рік на території парку",
      "Лого на банерах при вході та на сітці огородження боула",
      "20 гостьових абонементів на місяць + знижка 15% для клієнтів партнёра",
      "Інтеграція в розсилку та push-повідомлення (700+ активних райдерів)",
    ],
  },
  {
    id: "gold",
    name: "ЗОЛОТО",
    tag: "Core Partner",
    price: "від 400 000 ₴ / рік",
    color: "bg-hotpink",
    rotate: "-rotate-1",
    perks: [
      "Все з пакету «Срібло»",
      "Іменна рампа/елемент парку («Quarter Pipe by [Бренд]») з постійним брендуванням",
      "Продакт-плейсмент: брендований вендинг, зона відпочинку, стійка сервісу дощок",
      "Спільний мерч-дроп (капсульна колаборація 1 раз на рік)",
      "Пріоритетне право на titlе спонсорство головного щорічного контесту",
      "Квартальний звіт з охопленнями (відвідування, соцмережі, медіа)",
    ],
  },
  {
    id: "title",
    name: "ТАЙТЛ-СПОНСОР",
    tag: "Naming Rights",
    price: "за домовленістю",
    color: "bg-acid text-ink",
    rotate: "rotate-2",
    perks: [
      "Назва парку: «[Бренд] Air Park Kyiv» — на вивісці, сайті, мерчі, у ЗМІ",
      "Ексклюзивність категорії (тільки один бренд з ніші на весь термін контракту)",
      "Голос у програмній сітці парку: школа, контести, резидентство райдерів",
      "Постійна присутність у PR-кампанії запуску (прес-конференція, відкриття)",
      "Брендування головного фасаду будівлі та точки при вході",
      "Персональна інтеграція в контент-план (YouTube/TikTok серія про будівництво і життя парку)",
    ],
  },
];

const TRAINER_OFFER = [
  {
    title: "Оренда часу під власні групи",
    text:
      "Прозорий погодинний тариф на боул/вертикаль/стрит-зону нижче ринкового — для тренерів, які набирають власні групи та ведуть приватні заняття.",
  },
  {
    title: "Резидентство школи",
    text:
      "Постійний слот у розкладі, власна сторінка тренера на сайті парку, потрапляння в загальну афішу і розсилку 700+ підписників.",
  },
  {
    title: "Обладнання та сервіс",
    text:
      "Доступ до майстерні для обслуговування дощок/роликів, страхувальне спорядження в оренду, зона для дітей-початківців окремо від профі-зони.",
  },
  {
    title: "Спільний маркетинг",
    text:
      "Парк бере на себе просування груп тренера в соцмережах і на сайті; тренер — контент і методику. Split доходу від абонементів обговорюється індивідуально.",
  },
  {
    title: "Сертифікація та зростання",
    text:
      "Пріоритет у запрошеннях на семінари з приїжджими райдерами/тренерами, можливість стати частиною судейської колегії контестів парку.",
  },
];

// ---------------------------------------------------------------------------
// ДРІБНІ UI-ЕЛЕМЕНТИ (стикери, рвана лінія, halftone-фон)
// ---------------------------------------------------------------------------

function TornEdge({ flip = false, className = "" }) {
  // «рваний папір» між секціями — SVG-зигзаг
  return (
    <svg
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      className={`w-full h-8 md:h-10 ${flip ? "-scale-y-100" : ""} ${className}`}
    >
      <polygon
        points="0,0 40,28 80,6 120,32 160,10 200,26 240,4 280,30 320,8 360,24 400,2 440,28 480,12 520,34 560,6 600,22 640,0 680,30 720,10 760,26 800,4 840,32 880,8 920,24 960,2 1000,28 1040,12 1080,34 1120,6 1160,22 1200,0 1200,40 0,40"
        className="fill-paper"
      />
    </svg>
  );
}

function Sticker({ children, className = "", color = "bg-acid text-ink" }) {
  return (
    <span
      className={`sticker inline-block px-4 py-1.5 border-[3px] border-ink font-mono text-xs md:text-sm font-bold uppercase tracking-wider shadow-[4px_4px_0_0_#121212] ${color} ${className}`}
    >
      {children}
    </span>
  );
}

function HalftoneLayer({ className = "" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 opacity-[0.08] ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(#121212 1.4px, transparent 1.4px)",
        backgroundSize: "10px 10px",
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// NAV
// ---------------------------------------------------------------------------

function NavBar() {
  const links = [
    ["Про проєкт", "#project"],
    ["Будівництво", "#build"],
    ["Партнери", "#partners"],
    ["Спонсорам", "#sponsors"],
    ["Тренерам", "#trainers"],
    ["Райдерам", "#riders"],
    ["Контакти", "#contacts"],
  ];
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b-4 border-ink">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="font-display text-2xl tracking-tight text-ink">
          AIR<span className="text-hotpink">PARK</span>.KYIV
        </a>
        <nav className="hidden lg:flex items-center gap-6 font-mono text-xs uppercase tracking-wide">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="hover:text-hotpink transition-colors">
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#sponsors"
          className="hidden lg:inline-block border-[3px] border-ink bg-acid px-4 py-2 font-mono text-xs font-bold uppercase shadow-[3px_3px_0_0_#121212] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
        >
          Стати партнёром
        </a>
        <button
          className="lg:hidden border-2 border-ink px-3 py-1.5 font-mono text-xs uppercase"
          onClick={() => setOpen((v) => !v)}
        >
          Меню
        </button>
      </div>
      {open && (
        <nav className="lg:hidden flex flex-col gap-1 px-4 pb-4 font-mono text-sm uppercase">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="py-2 border-b border-ink/20">
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

// ---------------------------------------------------------------------------
// HERO
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink text-paper pt-16 pb-24 md:pt-24 md:pb-32">
      <HalftoneLayer className="opacity-[0.06] invert" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <div className="hero-badge mb-8">
          <Sticker color="bg-hotpink text-paper" className="-rotate-3">
            Будується зараз · Kyiv · Відкриття 2027
          </Sticker>
        </div>

        <h1 className="hero-line font-display leading-[0.85] uppercase text-[15vw] md:text-[8.5vw] text-paper">
          Перший
        </h1>
        <h1 className="hero-line font-display leading-[0.85] uppercase text-[15vw] md:text-[8.5vw] text-acid">
          критий
        </h1>
        <h1 className="hero-line font-display leading-[0.85] uppercase text-[15vw] md:text-[8.5vw] text-paper">
          <span className="relative inline-block">
            эір-парк
            <svg className="absolute -bottom-2 left-0 w-full h-4" viewBox="0 0 300 20" preserveAspectRatio="none">
              <path d="M0,10 Q75,0 150,10 T300,10" stroke="#FF2E88" strokeWidth="6" fill="none" />
            </svg>
          </span>
        </h1>
        <h1 className="hero-line font-display leading-[0.85] uppercase text-[15vw] md:text-[8.5vw] text-electric">
          такого масштабу
        </h1>

        <p className="hero-sub mt-8 max-w-xl font-body text-base md:text-lg text-paper/80">
          2 400 м² боула, вертикалі та стріт-секцій під одним дахом. Без сезону, без дощу,
          без «закрито на зиму». Ми будуємо простір, якого в Україні ще не було — і шукаємо
          тих, хто побудує його разом із нами.
        </p>

        <div className="hero-cta mt-10 flex flex-wrap gap-4">
          <a
            href="#sponsors"
            className="border-[3px] border-paper bg-acid text-ink px-6 py-3 font-mono text-sm font-bold uppercase shadow-[4px_4px_0_0_#F4E409] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            Пакети для спонсорів
          </a>
          <a
            href="#build"
            className="border-[3px] border-paper px-6 py-3 font-mono text-sm font-bold uppercase text-paper hover:bg-paper hover:text-ink transition-colors"
          >
            Дивитись стройку →
          </a>
        </div>
      </div>

      <TornEdge className="absolute -bottom-1 left-0" />
    </section>
  );
}

// ---------------------------------------------------------------------------
// STATS / О ПРОЕКТЕ
// ---------------------------------------------------------------------------

function ProjectScale() {
  return (
    <section id="project" className="relative bg-paper py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-14">
          <h2 className="font-display uppercase text-4xl md:text-6xl text-ink leading-none">
            Масштаб <span className="text-hotpink">не для галочки</span>
          </h2>
          <Sticker className="rotate-2">01 / Про проєкт</Sticker>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div
              key={i}
              className={`stat-card relative border-[3px] border-ink p-5 md:p-6 bg-white shadow-[6px_6px_0_0_#121212] ${
                i % 2 ? "rotate-1" : "-rotate-1"
              }`}
            >
              <div className="font-display text-3xl md:text-5xl text-ink">{s.value}</div>
              <div className="font-mono text-[11px] md:text-xs uppercase text-ink/70 mt-2 leading-snug">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          <p className="scale-text md:col-span-2 font-body text-lg md:text-xl text-ink/85 leading-relaxed">
            Сьогодні райдери Києва залежні від погоди і від кількох невеликих майданчиков.
            Ми будуємо ангар на 2 400 м² з бетонним боулом, вертикальною стіною, street-зоною
            та окремою зоною для початківців — простір, розрахований на школу, контести
            та щоденні тренування 365 днів на рік.
          </p>
          <div className="border-[3px] border-ink bg-electric text-paper p-6 shadow-[6px_6px_0_0_#121212] -rotate-1">
            <div className="font-mono text-xs uppercase tracking-wide mb-2">Статус будівництва</div>
            <div className="font-display text-4xl mb-1">62%</div>
            <div className="w-full h-3 bg-ink/30 border-2 border-ink">
              <div className="h-full bg-acid" style={{ width: "62%" }} />
            </div>
            <div className="font-mono text-[11px] mt-2 text-paper/80">Відкриття заплановане на 2027</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// СТРОЙКА (реальные фото/рендеры)
// ---------------------------------------------------------------------------

function BuildGallery() {
  return (
    <section id="build" className="relative bg-ink py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <h2 className="font-display uppercase text-4xl md:text-6xl text-paper leading-none">
            Стройка <span className="text-acid">наживо</span>
          </h2>
          <Sticker color="bg-electric text-paper" className="-rotate-2">
            02 / Реальні фото об'єкта
          </Sticker>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {BUILD_PHOTOS.map((p, i) => (
            <figure
              key={i}
              className={`photo-tile relative border-[3px] border-paper bg-paper/10 aspect-[3/4] overflow-hidden shadow-[5px_5px_0_0_#F4E409] ${
                i % 2 ? "rotate-2" : "-rotate-2"
              }`}
            >
              {/* Заменить src на реальное фото стройки */}
              <img src={p.src} alt={p.cap} className="w-full h-full object-cover" loading="lazy" />
              <span className="absolute top-2 left-2 w-6 h-3 bg-acid/80 rotate-[-8deg]" aria-hidden />
              <figcaption className="absolute bottom-0 left-0 right-0 bg-ink/80 text-paper font-mono text-[10px] px-2 py-1 uppercase">
                {p.cap}
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-8 font-mono text-xs text-paper/60 uppercase">
          * Оновлюємо галерею щотижня — прогрес будівництва у реальному часі.
        </p>
      </div>
      <TornEdge className="absolute -bottom-1 left-0" />
    </section>
  );
}

// ---------------------------------------------------------------------------
// ПАРТНЁРЫ (логотипы, бегущая строка)
// ---------------------------------------------------------------------------

function PartnersMarquee() {
  const track = useRef(null);
  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const width = el.scrollWidth / 2;
      gsap.to(el, {
        x: -width,
        duration: 22,
        ease: "none",
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  const loop = [...PARTNERS, ...PARTNERS];

  return (
    <section id="partners" className="relative bg-paper py-16 md:py-20 border-y-4 border-ink overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8 flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display uppercase text-3xl md:text-5xl text-ink">
          Нам вже <span className="text-electric">довіряють</span>
        </h2>
        <Sticker className="rotate-1">03 / Партнери проєкту</Sticker>
      </div>
      <div className="relative w-full overflow-hidden">
        <div ref={track} className="flex items-center gap-14 w-max">
          {loop.map((p, i) => (
            <div key={i} className="h-14 md:h-16 flex items-center opacity-80 hover:opacity-100 transition-opacity">
              {/* Заменить на реальный логотип партнёра (SVG/PNG, monochrome предпочтительно) */}
              <img src={p.logo} alt={p.name} className="h-full w-auto object-contain grayscale" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ПАКЕТЫ ДЛЯ СПОНСОРОВ
// ---------------------------------------------------------------------------

function SponsorPackages() {
  return (
    <section id="sponsors" className="relative bg-paper py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-14">
          <h2 className="font-display uppercase text-4xl md:text-6xl text-ink leading-none">
            Пакети для <span className="text-hotpink">спонсорів</span>
          </h2>
          <Sticker color="bg-hotpink text-paper" className="-rotate-1">
            04 / Комерційна пропозиція
          </Sticker>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {SPONSOR_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`tier-card relative border-[3px] border-ink bg-white p-7 shadow-[7px_7px_0_0_#121212] ${tier.rotate}`}
            >
              <div className={`absolute -top-4 -left-3 px-3 py-1 border-[3px] border-ink font-mono text-[11px] uppercase font-bold ${tier.color}`}>
                {tier.tag}
              </div>
              <h3 className="font-display text-3xl md:text-4xl text-ink mt-4">{tier.name}</h3>
              <div className="font-mono text-sm text-ink/60 mb-5">{tier.price}</div>
              <ul className="space-y-2.5">
                {tier.perks.map((perk, i) => (
                  <li key={i} className="font-body text-sm text-ink/85 leading-snug flex gap-2">
                    <span className="text-hotpink font-bold">—</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <a
                href={`mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent(
                  "Партнёрство: пакет " + tier.name
                )}`}
                className="mt-6 inline-block border-[3px] border-ink px-5 py-2.5 font-mono text-xs font-bold uppercase shadow-[3px_3px_0_0_#121212] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
              >
                Обговорити пакет →
              </a>
            </div>
          ))}
        </div>

        <p className="mt-10 font-mono text-xs text-ink/50 uppercase max-w-2xl">
          * Всі пакети — база для перемовин. Готові адаптувати наповнення під формат і бюджет
          конкретного бренду, включно з бартером (обладнання, мерч, спорядження).
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ТРЕНЕРАМ
// ---------------------------------------------------------------------------

function TrainersSection() {
  return (
    <section id="trainers" className="relative bg-electric text-paper py-20 md:py-28 overflow-hidden">
      <HalftoneLayer className="invert opacity-[0.07]" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <h2 className="font-display uppercase text-4xl md:text-6xl leading-none">
            Тренерам <span className="text-acid">і школам</span>
          </h2>
          <Sticker color="bg-acid text-ink" className="rotate-2">
            05 / Резидентство
          </Sticker>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {TRAINER_OFFER.map((item, i) => (
            <div
              key={i}
              className={`border-[3px] border-paper p-6 bg-ink/20 backdrop-blur-sm ${i % 2 ? "rotate-1" : "-rotate-1"}`}
            >
              <h3 className="font-display text-2xl mb-2 text-acid">{item.title}</h3>
              <p className="font-body text-sm text-paper/85 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <a
            href={`mailto:${TRAINER_EMAIL}?subject=${encodeURIComponent("Резидентство тренера в Air Park Kyiv")}`}
            className="inline-block border-[3px] border-paper bg-acid text-ink px-6 py-3 font-mono text-sm font-bold uppercase shadow-[4px_4px_0_0_#F4E409] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            Написати як тренер →
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// РАЙДЕРАМ / КЛИЕНТАМ
// ---------------------------------------------------------------------------

function RidersSection() {
  return (
    <section id="riders" className="relative bg-paper py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <h2 className="font-display uppercase text-4xl md:text-6xl text-ink leading-none">
            Райдерам <span className="text-electric">та клієнтам</span>
          </h2>
          <Sticker className="-rotate-2">06 / Раннiй доступ</Sticker>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border-[3px] border-ink p-6 bg-white shadow-[6px_6px_0_0_#121212] rotate-1">
            <div className="font-display text-2xl mb-2">Founders Pass</div>
            <p className="font-body text-sm text-ink/80">
              Абонемент за спецціною для перших 300 райдерів, які підпишуться до відкриття.
            </p>
          </div>
          <div className="border-[3px] border-ink p-6 bg-white shadow-[6px_6px_0_0_#121212] -rotate-1">
            <div className="font-display text-2xl mb-2">Community Chat</div>
            <p className="font-body text-sm text-ink/80">
              Закрита спільнота у Telegram: анонси прогресу будівництва, сесії, контести.
            </p>
          </div>
          <div className="border-[3px] border-ink p-6 bg-white shadow-[6px_6px_0_0_#121212] rotate-1">
            <div className="font-display text-2xl mb-2">Open Day</div>
            <p className="font-body text-sm text-ink/80">
              Перші катання для підписників — за 2 тижні до офіційного відкриття для всіх.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <a
            href={`mailto:${RIDER_EMAIL}?subject=${encodeURIComponent("Хочу в спільноту Air Park Kyiv")}`}
            className="inline-block border-[3px] border-ink px-6 py-3 font-mono text-sm font-bold uppercase hover:bg-ink hover:text-paper transition-colors"
          >
            Приєднатись →
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// КОНТАКТЫ (три разных направления)
// ---------------------------------------------------------------------------

function ContactsSection() {
  const [tab, setTab] = useState("sponsor");

  const configs = {
    sponsor: {
      title: "Для спонсорів і партнёрів",
      email: SPONSOR_EMAIL,
      color: "bg-hotpink",
      note: "Пришлемо PDF-презентацію з пакетами, медіакітом і графіком будівництва.",
    },
    trainer: {
      title: "Для тренерів і шкіл",
      email: TRAINER_EMAIL,
      color: "bg-electric",
      note: "Розкажемо про графік, тарифи оренди та умови резидентства.",
    },
    rider: {
      title: "Для райдерів і клієнтів",
      email: RIDER_EMAIL,
      color: "bg-acid text-ink",
      note: "Додамо в спільноту та повідомимо про дату відкриття першими.",
    },
  };
  const c = configs[tab];

  return (
    <section id="contacts" className="relative bg-ink text-paper py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        <h2 className="font-display uppercase text-4xl md:text-6xl mb-10">
          Пишіть <span className="text-hotpink">за темою</span>
        </h2>

        <div className="flex justify-center gap-3 mb-10 flex-wrap font-mono text-xs uppercase">
          {Object.entries(configs).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 border-[3px] border-paper transition-colors ${
                tab === key ? `${val.color} text-ink` : "text-paper hover:bg-paper/10"
              }`}
            >
              {val.title}
            </button>
          ))}
        </div>

        <div className={`border-[3px] border-paper p-8 md:p-10 inline-block ${tab === "sponsor" ? "-rotate-1" : tab === "trainer" ? "rotate-1" : "-rotate-1"}`}>
          <p className="font-body text-paper/80 mb-5">{c.note}</p>
          <a
            href={`mailto:${c.email}`}
            className="font-display text-2xl md:text-4xl text-acid underline decoration-hotpink decoration-4 underline-offset-4"
          >
            {c.email}
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FOOTER
// ---------------------------------------------------------------------------

function Footer() {
  return (
    <footer className="bg-paper border-t-4 border-ink py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs uppercase text-ink/60">
        <span>© {new Date().getFullYear()} Air Park Kyiv — Perший критий эір-парк такого масштабу в Україні</span>
        <span>Instagram · TikTok · Telegram</span>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// ГЛАВНЫЙ КОМПОНЕНТ + GSAP scroll-анимации
// ---------------------------------------------------------------------------

export default function SkateparkLanding() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero — вступление построчно
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-badge", { y: -20, opacity: 0, duration: 0.5 })
        .from(".hero-line", { y: 60, opacity: 0, duration: 0.7, stagger: 0.08 }, "-=0.2")
        .from(".hero-sub", { y: 20, opacity: 0, duration: 0.6 }, "-=0.3")
        .from(".hero-cta", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4");

      // Общий паттерн: reveal карточек/секций при скролле
      const revealGroups = [
        ".stat-card",
        ".photo-tile",
        ".tier-card",
      ];
      revealGroups.forEach((sel) => {
        gsap.utils.toArray(sel).forEach((el, i) => {
          gsap.from(el, {
            y: 40,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: (i % 4) * 0.06,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          });
        });
      });

      // Заголовки секций
      gsap.utils.toArray("h2").forEach((el) => {
        gsap.from(el, {
          x: -30,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      // Лёгкое покачивание стикеров (ambient)
      gsap.utils.toArray(".sticker").forEach((el, i) => {
        gsap.to(el, {
          rotate: "+=4",
          duration: 2 + (i % 3) * 0.4,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="font-body bg-paper text-ink">
      <NavBar />
      <Hero />
      <ProjectScale />
      <BuildGallery />
      <PartnersMarquee />
      <SponsorPackages />
      <TrainersSection />
      <RidersSection />
      <ContactsSection />
      <Footer />
    </div>
  );
}

/**
 * ============================================================================
 *  TAILWIND CONFIG PATCH — добавить в tailwind.config.js
 * ============================================================================
 *
 * module.exports = {
 *   theme: {
 *     extend: {
 *       colors: {
 *         paper:   "#E7E3D4", // ньюсprint-бумага, тёплый серо-бежевый
 *         ink:     "#121212", // почти чёрный
 *         electric:"#1E4FFF", // электрик-синий
 *         hotpink: "#FF2E88", // кислотный маджента
 *         acid:    "#F4E409", // кислотный жёлтый
 *         tape:    "#FF7A1A", // "оранжевый скотч"-акцент
 *       },
 *       fontFamily: {
 *         display: ["Anton", "sans-serif"],
 *         body: ["'Space Grotesk'", "sans-serif"],
 *         mono: ["'JetBrains Mono'", "monospace"],
 *       },
 *     },
 *   },
 * };
 *
 *  Не забудьте добавить "tape-orange" -> используется как bg-tape-orange
 *  в SPONSOR_TIERS[0].color — либо переименуйте в bg-tape по токену выше.
 * ============================================================================
 */