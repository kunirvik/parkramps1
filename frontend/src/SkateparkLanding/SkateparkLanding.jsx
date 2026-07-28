import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Mail, Instagram, Youtube, Send, X as CloseIcon } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/**
 * ZLIT — лендинг крытого эир-скейтпарка в Киеве.
 * Стиль: thrasher-zine × X Games broadcast.
 *
 * Установка:
 *   npm install gsap lucide-react
 *
 * Шрифты (добавьте в public/index.html <head>):
 *   https://fonts.googleapis.com/css2?family=Oswald:wght@500;700;900
 *     &family=Teko:wght@500;600;700&family=Inter:wght@400;500;600
 *     &family=JetBrains+Mono:wght@400;500;700&display=swap
 *
 * ЗАМЕНИТЕ:
 *  - BUILDER_LOGO / PARTNER_LOGO — два лого в шапке
 *  - GALLERY — фото со стройки (сейчас плейсхолдеры)
 *  - CONFIRMED_PARTNERS — логотипы подтверждённых партнёров
 *  - SPECS / TIERS / ROADMAP — реальные данные
 */

// ---------- Данные (замените на реальные) ----------

const BUILDER_LOGO = "BUILD CO."; // кто строит
const PARTNER_LOGO = "ZLIT CREW"; // для кого строят / бренд-инициатор

const SPECS = [
  { label: "Площа комплексу", value: 4700, unit: "м²", decimals: 0 },
  { label: "Висота стелі", value: 14, unit: "м", decimals: 0 },
  { label: "Глибина bowl", value: 3.6, unit: "м", decimals: 1 },
  { label: "Вертикальна стіна", value: 4.2, unit: "м", decimals: 1 },
  { label: "Пропускна здатність", value: 450, unit: "райдерів/день", decimals: 0 },
  { label: "Зон катання", value: 6, unit: "дисциплін", decimals: 0 },
];

const GALLERY = [
  { id: 1, caption: "ФУНДАМЕНТ · 03.2026" },
  { id: 2, caption: "КАРКАС ПІВНІЧНОЇ СТІНИ" },
  { id: 3, caption: "МОНТАЖ ФЕРМ ПОКРІВЛІ" },
  { id: 4, caption: "BOWL, ЧОРНОВА ГЕОМЕТРІЯ" },
  { id: 5, caption: "VERT WALL, ОПАЛУБКА" },
  { id: 6, caption: "ЗАГАЛЬНИЙ ВИГЛЯД, ДРОН" },
];

const CONFIRMED_PARTNERS = ["VANS", "RED BULL", "NOVA POSHTA", "KYIVSTAR", "MONSTER"]; // плейсхолдер

const TIERS = [
  {
    code: "T-01",
    name: "Title Partner",
    desc: "Ваш бренд у назві парку та на головній рампі. Ексклюзивність у категорії. Пріоритет у медіа та на подіях.",
    highlight: true,
  },
  {
    code: "T-02",
    name: "Structural Partner",
    desc: "Брендування окремої зони — bowl, vert або street. Лого на екіпіруванні тренерів, участь у відкритті.",
    highlight: false,
  },
  {
    code: "T-03",
    name: "Community Partner",
    desc: "Лого на сайті, мерчі та в соцмережах. Підтримка контестів і подій для райдерів і місцевої спільноти.",
    highlight: false,
  },
];

const ROADMAP = [
  { step: "01", title: "Проєктування та інженерні розрахунки", period: "2025 Q3 — Q4", status: "done" },
  { step: "02", title: "Будівництво каркасу та покрівлі", period: "2026 Q1 — Q2", status: "active" },
  { step: "03", title: "Монтаж рамп, покриття, освітлення", period: "2026 Q3 — Q4", status: "upcoming" },
  { step: "04", title: "Тестові заїзди, сертифікація, відкриття", period: "2027 Q2", status: "upcoming" },
];

// ---------- Формы модалок по аудиториям ----------

const MODAL_CONFIG = {
  sponsor: {
    title: "Спонсорський запит",
    tag: "SPONSOR / PARTNER INQUIRY",
    fields: [
      { name: "company", label: "Компанія", type: "text", required: true },
      { name: "contact", label: "Контактна особа", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      {
        name: "tier",
        label: "Цікавий пакет",
        type: "select",
        options: ["Title Partner", "Structural Partner", "Community Partner", "Ще не визначились"],
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
        options: ["Тренер", "Федерація", "Бренд екіпіровки", "Інше"],
      },
      { name: "experience", label: "Досвід / деталі", type: "textarea" },
      { name: "email", label: "Email", type: "email", required: true },
    ],
  },
  rider: {
    title: "Реєстрація райдера",
    tag: "EARLY ACCESS WAITLIST",
    fields: [
      { name: "name", label: "Ім'я", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      {
        name: "discipline",
        label: "Дисципліна",
        type: "select",
        options: ["Street", "Bowl", "Vert", "Mini-ramp", "Все з перерахованого"],
      },
    ],
  },
};

// ---------- Допоміжні компоненти ----------

function GrungeStyles() {
  // Глобальные текстуры/паттерны, инжектим один раз.
  return (
    <style>{`
      .halftone {
        background-image: radial-gradient(circle, #000 1px, transparent 1.4px);
        background-size: 6px 6px;
      }
      .halftone-red {
        background-image: radial-gradient(circle, #e2001a 1px, transparent 1.4px);
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
        border: 3px dashed #e2001a;
        color: #e2001a;
        mix-blend-mode: multiply;
      }
    `}</style>
  );
}

function HazardMarquee() {
  const text = "СПОНСОРСТВО — ТРЕНЕРИ — ПАРТНЕРСТВО — МЕДІА — РАЙДЕРИ — ОБ'ЄКТ У СТРОЙЦІ — ";
  return (
    <div className="relative overflow-hidden border-y-4 border-black bg-black py-3">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #e2001a 0px, #e2001a 22px, #000 22px, #000 44px)",
        }}
      />
      <div className="marquee-track relative flex w-max whitespace-nowrap">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="px-4 font-['JetBrains_Mono'] text-sm font-bold uppercase tracking-[0.2em] text-black"
          >
            <span className="bg-[#f2ede4] px-3 py-1">{text.repeat(4)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function RampBlueprint({ pathRef, className }) {
  return (
    <svg viewBox="0 0 600 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#3a3a3a" strokeWidth="1" strokeDasharray="2 4" opacity="0.5">
        <line x1="0" y1="50" x2="600" y2="50" />
        <line x1="0" y1="150" x2="600" y2="150" />
        <line x1="0" y1="250" x2="600" y2="250" />
        <line x1="100" y1="0" x2="100" y2="300" />
        <line x1="300" y1="0" x2="300" y2="300" />
        <line x1="500" y1="0" x2="500" y2="300" />
      </g>
      <path
        ref={pathRef}
        d="M 20 250 L 140 250 C 200 250 200 130 260 130 C 300 130 300 60 300 20 M 300 130 C 340 130 340 250 400 250 L 580 250"
        stroke="#e2001a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="24" y="270" fill="#8a8a8a" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1">
        SECTION A—A · VERT + BOWL · SCALE 1:120
      </text>
    </svg>
  );
}

function StatNumber({ value, decimals }) {
  return (
    <span
      className="stat-number font-['Teko'] text-6xl font-semibold leading-none text-[#f2ede4] md:text-7xl"
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

        <p className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-[0.2em] text-[#e2001a]">
          {config.tag}
        </p>
        <h3 className="mt-2 font-['Oswald'] text-3xl font-bold uppercase leading-none">
          {config.title}
        </h3>

        {sent ? (
          <p className="mt-8 font-['JetBrains_Mono'] text-sm">
            Прийнято. Ми зв'яжемось найближчим часом.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {config.fields.map((f) => (
              <label key={f.name} className="flex flex-col gap-1">
                <span className="font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-widest text-black/70">
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
              className="mt-2 bg-black px-6 py-3 font-['JetBrains_Mono'] text-sm font-bold uppercase tracking-widest text-[#f2ede4] transition hover:bg-[#e2001a]"
            >
              Надіслати
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ---------- Основной компонент ----------

export default function ZlitLanding() {
  const heroPathRef = useRef(null);
  const roadmapRef = useRef(null);
  const [activeModal, setActiveModal] = useState(null); // null | 'sponsor' | 'trainer' | 'rider'

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

        gsap.to(".marquee-track", { xPercent: -50, repeat: -1, duration: 22, ease: "linear" });
      } else {
        gsap.set([".speed-line", ".hero-reveal"], { opacity: 1, x: 0, y: 0 });
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

      gsap.utils.toArray(".stat-number").forEach((el) => {
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

      // лёгкий "дрожащий" hover на карточках галереи и тиров задаётся классами Tailwind,
      // GSAP тут не нужен — оставляем CSS transition для производительности.
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#f2ede4] font-['Inter'] text-black antialiased">
      <GrungeStyles />

      {/* NAV — два лого через "×" */}
      <header className="fixed inset-x-0 top-0 z-50 border-b-4 border-black bg-[#f2ede4]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="border-2 border-black px-3 py-1.5">
              <span className="font-['Oswald'] text-sm font-bold uppercase tracking-wide">
                {BUILDER_LOGO}
              </span>
            </div>
            <span className="font-['Oswald'] text-xl font-black text-[#e2001a]">×</span>
            <div className="border-2 border-black bg-black px-3 py-1.5">
              <span className="font-['Oswald'] text-sm font-bold uppercase tracking-wide text-[#f2ede4]">
                {PARTNER_LOGO}
              </span>
            </div>
          </div>

          <nav className="hidden gap-6 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest md:flex">
            <a href="#specs" className="transition hover:text-[#e2001a]">Об'єкт</a>
            <a href="#gallery" className="transition hover:text-[#e2001a]">Стройка</a>
            <a href="#sponsors" className="transition hover:text-[#e2001a]">Спонсорам</a>
            <a href="#roadmap" className="transition hover:text-[#e2001a]">Хід робіт</a>
          </nav>

          <button
            onClick={() => setActiveModal("sponsor")}
            className="border-2 border-black bg-[#e2001a] px-4 py-2 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest text-[#f2ede4] transition hover:bg-black"
          >
            Партнерство
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36">
        <div className="halftone pointer-events-none absolute inset-0 opacity-[0.06]" />
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
            <span className="stamp hero-reveal inline-block rotate-[-6deg] border-3 px-3 py-1 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest">
              Under Construction
            </span>
            <h1
              className="hero-reveal mt-6 font-['Oswald'] text-7xl font-black uppercase leading-[0.85] tracking-tight md:text-9xl"
              style={{ textShadow: "5px 5px 0 #e2001a" }}
            >
              Zlit
            </h1>
            <p className="hero-reveal mt-4 max-w-md font-['JetBrains_Mono'] text-sm uppercase tracking-wide text-black/70">
              Kyiv · Indoor Air Park · Est. 2027
            </p>
            <p className="hero-reveal mt-6 max-w-md text-lg font-medium text-black/80 md:text-xl">
              Перший в Україні критий скейтпарк такого масштабу. Без сезонів,
              без погоди, без обмежень — лише швидкість, повітря і бетон.
            </p>
            <div className="hero-reveal mt-9 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveModal("sponsor")}
                className="inline-flex items-center gap-2 border-2 border-black bg-black px-6 py-3 font-['JetBrains_Mono'] text-sm font-bold uppercase tracking-wider text-[#f2ede4] transition hover:bg-[#e2001a]"
              >
                Стати спонсором <ArrowUpRight size={16} />
              </button>
              <a
                href="#specs"
                className="inline-flex items-center gap-2 border-2 border-black px-6 py-3 font-['JetBrains_Mono'] text-sm font-bold uppercase tracking-wider transition hover:bg-black hover:text-[#f2ede4]"
              >
                Специфікація
              </a>
            </div>
          </div>

          <div className="hero-reveal relative border-4 border-black bg-black p-4">
            <RampBlueprint pathRef={heroPathRef} className="w-full" />
          </div>
        </div>
      </section>

      <HazardMarquee />

      {/* VISION — вырезка из зина */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="reveal-up grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.4fr]">
          <p className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-[0.25em] text-[#e2001a]">
            Чому це важливо
          </p>
          <div className="border-l-4 border-black pl-6">
            <h2 className="font-['Oswald'] text-4xl font-bold uppercase leading-[0.95] md:text-6xl">
              В Україні немає критого парку такого масштабу.
              <span className="text-black/50"> Ми будуємо перший.</span>
            </h2>
            <p className="mt-6 max-w-2xl font-medium text-black/70">
              Сьогодні райдери залежні від погоди й сезону, тренери — від
              випадкових локацій, а спорт — від ентузіазму, а не інфраструктури.
              ЗЛІТ — це цілорічний об'єкт олімпійського рівня: bowl, vert,
              street-зона та мегарампа під одним дахом у Києві.
            </p>
          </div>
        </div>
      </section>

      {/* SPECS — scoreboard */}
      <section id="specs" className="relative bg-black py-20 text-[#f2ede4]">
        <div className="halftone-red pointer-events-none absolute inset-0 opacity-[0.08]" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="reveal-up mb-12 flex items-end justify-between border-b-2 border-[#e2001a] pb-4">
            <h2 className="font-['Oswald'] text-2xl font-bold uppercase md:text-4xl">Специфікація об'єкта</h2>
            <span className="hidden font-['JetBrains_Mono'] text-xs text-white/50 md:block">
              DWG-ZLIT-001 / REV.03
            </span>
          </div>
          <div className="reveal-up grid grid-cols-2 gap-px overflow-hidden border-2 border-white/10 bg-white/10 md:grid-cols-3">
            {SPECS.map((s) => (
              <div key={s.label} className="bg-black p-6 md:p-8">
                <StatNumber value={s.value} decimals={s.decimals} />
                <span className="ml-2 font-['JetBrains_Mono'] text-sm text-white/50">{s.unit}</span>
                <p className="mt-2 text-sm font-medium uppercase tracking-wide text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TornDivider />

      {/* GALLERY — фото со стройки, "приклеены скотчем" */}
      <section id="gallery" className="mx-auto max-w-7xl px-6 py-20">
        <p className="reveal-up font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-[0.25em] text-[#e2001a]">
          Стройка наживо
        </p>
        <h2 className="reveal-up mt-3 font-['Oswald'] text-3xl font-bold uppercase md:text-5xl">
          Прогрес об'єкта
        </h2>
        <p className="reveal-up mt-3 max-w-xl text-black/60">
          Замініть плейсхолдери нижче на реальні фото/рендери зі стройки —
          компонент &lt;Gallery /&gt; підтримує будь-яку кількість карток.
        </p>

        <div className="reveal-up mt-12 grid grid-cols-2 gap-8 md:grid-cols-3">
          {GALLERY.map((g, i) => (
            <figure
              key={g.id}
              className="relative border-2 border-black bg-black/5 p-2 shadow-[4px_4px_0_#000]"
              style={{ transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }}
            >
              <div className="tape absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-1 border border-black/20" />
              {/* Замените div ниже на <img src="..." className="aspect-[4/3] w-full object-cover" /> */}
              <div className="halftone flex aspect-[4/3] w-full items-center justify-center bg-[#d9d3c7]">
                <span className="font-['JetBrains_Mono'] text-[10px] font-bold uppercase tracking-widest text-black/40">
                  ФОТО {g.id}
                </span>
              </div>
              <figcaption className="mt-2 text-center font-['JetBrains_Mono'] text-[11px] font-bold uppercase tracking-wide text-black/70">
                {g.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CONFIRMED PARTNERS — trust bar */}
      <section className="border-y-2 border-black bg-[#e9e3d6] py-10">
        <div className="mx-auto max-w-7xl px-6">
          <p className="reveal-up mb-6 text-center font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-[0.25em] text-black/50">
            Вже з нами
          </p>
          <div className="reveal-up flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {CONFIRMED_PARTNERS.map((p) => (
              // Замените span на <img src="..." className="h-8 w-auto grayscale opacity-70" />
              <span
                key={p}
                className="font-['Oswald'] text-lg font-bold uppercase tracking-wide text-black/40"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section id="sponsors" className="mx-auto max-w-7xl px-6 py-20">
        <p className="reveal-up font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-[0.25em] text-[#e2001a]">
          Партнерство
        </p>
        <h2 className="reveal-up mt-3 max-w-2xl font-['Oswald'] text-4xl font-bold uppercase leading-none md:text-6xl">
          Три способи бути частиною першого зльоту
        </h2>

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
                  className={`font-['JetBrains_Mono'] text-xs font-bold ${
                    t.highlight ? "text-[#e2001a]" : "text-black/50"
                  }`}
                >
                  {t.code}
                </span>
                <h3 className="mt-2 font-['Oswald'] text-2xl font-bold uppercase">{t.name}</h3>
                <p className={`mt-4 text-sm leading-relaxed ${t.highlight ? "text-white/70" : "text-black/70"}`}>
                  {t.desc}
                </p>
              </div>
              <button
                onClick={() => setActiveModal("sponsor")}
                className={`mt-7 inline-flex items-center gap-1 self-start font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest ${
                  t.highlight ? "text-[#e2001a]" : "text-black"
                }`}
              >
                Обговорити пакет <ArrowUpRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TRAINERS */}
      <section className="border-y-2 border-black bg-black py-20 text-[#f2ede4]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2">
          <div className="reveal-up">
            <p className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-[0.25em] text-[#e2001a]">
              Тренерам і федераціям
            </p>
            <h2 className="mt-3 font-['Oswald'] text-3xl font-bold uppercase leading-none md:text-5xl">
              Об'єкт олімпійського рівня потребує команди олімпійського рівня
            </h2>
            <p className="mt-5 text-white/70">
              Ми відкриті до співпраці з тренерськими штабами, федераціями
              скейтбордингу та брендами екіпіровки — від методичних програм
              до сумісних заходів і зборів.
            </p>
            <button
              onClick={() => setActiveModal("trainer")}
              className="mt-7 inline-flex items-center gap-2 border-2 border-[#f2ede4] px-6 py-3 font-['JetBrains_Mono'] text-sm font-bold uppercase tracking-wider transition hover:bg-[#e2001a] hover:border-[#e2001a]"
            >
              Долучитися як тренер / партнер <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="reveal-up grid grid-cols-2 gap-px overflow-hidden border-2 border-white/10 bg-white/10 font-['JetBrains_Mono'] text-sm">
            {["Bowl", "Vert", "Street Plaza", "Mini-ramp", "Foam Pit", "Mega Ramp"].map((zone) => (
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
          <span className="stamp inline-block rotate-3 border-3 px-3 py-1 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest">
            Riders Only
          </span>
          <h2 className="mt-5 font-['Oswald'] text-4xl font-bold uppercase md:text-5xl">
            Стань першим на старті
          </h2>
          <p className="mt-4 text-black/70">
            Ранній доступ до передпродажу абонементів і запрошення на
            тестові заїзди — до офіційного відкриття.
          </p>
          <button
            onClick={() => setActiveModal("rider")}
            className="mt-8 inline-flex items-center gap-2 bg-black px-7 py-3 font-['JetBrains_Mono'] text-sm font-bold uppercase tracking-wider text-[#f2ede4] transition hover:bg-[#e2001a]"
          >
            Отримати ранній доступ <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" ref={roadmapRef} className="border-t-2 border-black bg-[#e9e3d6] py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal-up font-['Oswald'] text-2xl font-bold uppercase md:text-4xl">
            Хід будівництва
          </h2>
          <div className="relative mt-12">
            <div className="absolute left-[27px] top-0 h-full w-1 bg-black/15" />
            <div className="roadmap-progress absolute left-[27px] top-0 h-full w-1 bg-[#e2001a]" />
            <div className="flex flex-col gap-10">
              {ROADMAP.map((r) => (
                <div key={r.step} className="reveal-up relative flex gap-7 pl-14">
                  <span
                    className={`absolute left-0 flex h-14 w-14 items-center justify-center border-2 font-['Teko'] text-xl font-semibold ${
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
                    <p className="font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest text-black/50">
                      {r.period}
                    </p>
                    <h3 className="mt-1 font-['Oswald'] text-xl font-bold uppercase md:text-2xl">
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
              "repeating-linear-gradient(135deg, #e2001a 0px, #e2001a 22px, transparent 22px, transparent 44px)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pb-16">
          <div className="reveal-up max-w-2xl">
            <h2
              className="font-['Oswald'] text-5xl font-black uppercase leading-[0.85] md:text-7xl"
              style={{ textShadow: "4px 4px 0 #e2001a" }}
            >
              Долучайся
              <br /> до зльоту
            </h2>
            <p className="mt-6 text-white/60">
              Спонсорство, тренерська співпраця, медіа-запити чи просто
              питання про проєкт — оберіть свою роль, форма займе хвилину.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveModal("sponsor")}
                className="border-2 border-[#f2ede4] px-5 py-2.5 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest transition hover:bg-[#e2001a] hover:border-[#e2001a]"
              >
                Спонсорам
              </button>
              <button
                onClick={() => setActiveModal("trainer")}
                className="border-2 border-[#f2ede4] px-5 py-2.5 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest transition hover:bg-[#e2001a] hover:border-[#e2001a]"
              >
                Тренерам
              </button>
              <button
                onClick={() => setActiveModal("rider")}
                className="border-2 border-[#f2ede4] px-5 py-2.5 font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-widest transition hover:bg-[#e2001a] hover:border-[#e2001a]"
              >
                Райдерам
              </button>
            </div>
            <a
              href="mailto:hello@zlit.kyiv.ua"
              className="mt-8 inline-flex items-center gap-2 border-b-2 border-[#f2ede4] pb-1 font-['JetBrains_Mono'] text-lg"
            >
              <Mail size={18} /> hello@zlit.kyiv.ua
            </a>
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t-2 border-white/15 pt-8 md:flex-row md:items-center">
            <span className="font-['Oswald'] text-lg font-black uppercase">ZLIT</span>
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
            <span className="font-['JetBrains_Mono'] text-xs text-white/40">
              Kyiv, Ukraine © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </section>

      {activeModal && <Modal type={activeModal} onClose={() => setActiveModal(null)} />}
    </div>
  );
}

// import React, { useEffect, useRef } from "react";
 
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
 
// const PROJECT = {
//   name: "АНГАР",
//   sub: "AIR SKATEPARK KYIV",
//   city: "Киев",
// };
 
// const STATS = [
//   { n: "3 200", u: "м²", l: "крытой площади" },
//   { n: "№1", u: "", l: "по размеру в Украине" },
//   { n: "9", u: "м", l: "высота вертикальной стены" },
//   { n: "365", u: "дн", l: "катаемся круглый год" },
// ];
 
// const GALLERY = [
//   {
//     src: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=900&q=80",
//     alt: "Райдер в прыжке",
//     label: "ФОТО СО СТРОЙКИ №1",
//     rot: "torn-r1",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=900&q=80",
//     alt: "Рампа скейтпарка",
//     label: "РЕНДЕР ЧАШИ",
//     rot: "torn-r2",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=900&q=80",
//     alt: "Скейт-рампа изнутри",
//     label: "ФОТО СО СТРОЙКИ №2",
//     rot: "torn-r3",
//   },
//   {
//     src: "https://images.unsplash.com/photo-1531282984929-eb95c94d29a1?auto=format&fit=crop&w=900&q=80",
//     alt: "Стройка ангара",
//     label: "СТРОЙКА: КАРКАС",
//     rot: "torn-r2",
//   },
// ];
 
// const PARTNER_LOGOS = [
//   "ЛОГО ПАРТНЁРА",
//   "ЛОГО СПОНСОРА",
//   "ЛОГО БРЕНДА",
//   "ЛОГО ПАРТНЁРА",
//   "ЛОГО СПОНСОРА",
//   "ЛОГО БРЕНДА",
// ];
 
// const SPONSOR_TIERS = [
//   {
//     tag: "STREET",
//     color: "yellow",
//     price: "от [СУММА] / год",
//     pitch: "Точка входа для брендов, которым важно быть в поле зрения комьюнити.",
//     perks: [
//       "Логотип на сайте и в соцсетях в разделе партнёров",
//       "2 упоминания в постах/сторис в квартал",
//       "Брендинг на 1 зоне парка (стойка, стена скейт-чек)",
//       "Место на общем стенде на открытии",
//     ],
//   },
//   {
//     tag: "VERT",
//     color: "blue",
//     price: "от [СУММА] / год",
//     pitch: "Присутствие в самом парке — там, где райдеры проводят часы, а не секунды.",
//     perks: [
//       "Всё из уровня STREET",
//       "Брендированная зона (зона отдыха, скейт-чек, вендинг-корнер)",
//       "Продукт-плейсмент: тестирование деки/экипировки райдерами парка",
//       "4 интеграции в контент (видео триков, сторис, рилс) с отметкой бренда",
//       "Участие в 2 ивентах парка как co-host",
//     ],
//   },
//   {
//     tag: "AIR",
//     color: "pink",
//     price: "от [СУММА] / год",
//     pitch: "Статус титульного партнёра одной из зон — узнаваемость на уровне сцены.",
//     perks: [
//       "Всё из уровня VERT",
//       "Нейминг зоны/секции парка (например «Vert-стена от [Бренд]»)",
//       "Брендинг на форме тренерского состава",
//       "Эксклюзив в своей товарной категории (никаких конкурентов рядом)",
//       "Съёмка контент-дня с топ-райдерами парка для бренда",
//       "VIP-доступ на все соревнования и ивенты (гостевая ложа)",
//     ],
//   },
//   {
//     tag: "LEGEND",
//     color: "orange",
//     price: "по запросу",
//     pitch: "Титульное партнёрство всего проекта — «[Бренд] Air Skatepark».",
//     perks: [
//       "Всё из уровня AIR",
//       "Нейминг всего парка и приоритет в названии на всех носителях",
//       "Совместная PR-стратегия и участие в открытии как ключевой спикер",
//       "Собственный ежегодный турнир под брендом партнёра",
//       "Первое право продления контракта и голос в развитии парка",
//     ],
//   },
// ];
 
// const COACH_OFFER = [
//   {
//     t: "Доля с занятий",
//     d: "Прозрачный процент с каждого группового и индивидуального занятия — без аренды часа из своего кармана.",
//   },
//   {
//     t: "Оборудование топ-уровня",
//     d: "Foam pit, airbag, resi-рампа, разминочная зона — то, чего нет в большинстве парков страны.",
//   },
//   {
//     t: "Готовый поток учеников",
//     d: "Парк приводит клиентов через маркетинг и сайт — тебе не нужно самому искать группы.",
//   },
//   {
//     t: "Личный бренд тренера",
//     d: "Отдельная карточка тренера на сайте, промо в соцсетях парка, съёмка для портфолио.",
//   },
//   {
//     t: "Приоритет по слотам",
//     d: "Фиксированные часы под личный тренинг и подготовку райдеров к соревнованиям.",
//   },
//   {
//     t: "Сообщество и рост",
//     d: "Совместные сборы, судейство на турнирах парка, путь к статусу главного тренера направления.",
//   },
// ];
 
// const RIDER_PLANS = [
//   {
//     t: "Разовый сеанс",
//     p: "[ЦЕНА] / визит",
//     d: "2 часа катка, прокат защиты включён — для первого раза и гостей.",
//   },
//   {
//     t: "Абонемент",
//     p: "[ЦЕНА] / мес",
//     d: "Безлимит в будни + приоритет записи на секции по выходным.",
//   },
//   {
//     t: "Скейт-школа",
//     p: "[ЦЕНА] / курс",
//     d: "Группы для детей и взрослых с 0 — от первого олли до первого дропа в чашу.",
//   },
//   {
//     t: "Райдер-карта",
//     p: "по приглашению",
//     d: "Для спонсируемых и соревнующихся райдеров: свободный доступ + участие в контенте парка.",
//   },
// ];
 
// const CONTACTS = [
//   {
//     who: "Спонсорам и партнёрам",
//     color: "pink",
//     text: "Готовим индивидуальный пакет под ваш бренд и категорию.",
//     email: "partners@angar.ua",
//     cta: "Обсудить партнёрство",
//   },
//   {
//     who: "Тренерам",
//     color: "blue",
//     text: "Набираем тренерский состав по вертикали, стрит-секции и для детской школы.",
//     email: "coaches@angar.ua",
//     cta: "Стать тренером",
//   },
//   {
//     who: "Райдерам и клиентам",
//     color: "yellow",
//     text: "Вопросы про абонементы, школу и открытие — сюда.",
//     email: "hello@angar.ua",
//     cta: "Написать нам",
//   },
// ];
 
// // ---------------------------------------------------------------------------
// // УТИЛИТЫ
// // ---------------------------------------------------------------------------
 
// function useReveal() {
//   const ref = useRef(null);
//   useEffect(() => {
//     const els = document.querySelectorAll(".reveal");
//     const io = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((e) => {
//           if (e.isIntersecting) {
//             e.target.classList.add("reveal-in");
//             io.unobserve(e.target);
//           }
//         });
//       },
//       { threshold: 0.15 }
//     );
//     els.forEach((el) => io.observe(el));
//     return () => io.disconnect();
//   }, []);
//   return ref;
// }
 
// const ROT = ["r-2", "r1", "r-1", "r2", "r-3", "r3"];
 
// function Sticker({ children, color = "yellow", rot = "r-1", className = "" }) {
//   return (
//     <span className={`sticker bg-${color} ${rot} ${className}`}>{children}</span>
//   );
// }
 
// function RansomTitle({ text, size = "lg" }) {
//   const words = text.split(" ");
//   const colors = ["yellow", "pink", "blue", "orange"];
//   return (
//     <span className={`ransom ransom-${size}`}>
//       {words.map((w, i) => (
//         <span
//           key={i}
//           className={`ransom-word bg-${colors[i % colors.length]} ${ROT[i % ROT.length]}`}
//         >
//           {w}
//         </span>
//       ))}
//     </span>
//   );
// }
 
// function PhotoSlot({ src, alt, label, rot }) {
//   return (
//     <div className={`photo-slot ${rot}`}>
//       <img
//         src={src}
//         alt={alt}
//         onError={(e) => {
//           e.currentTarget.src =
//             "https://placehold.co/900x700/121212/F1ECDD?text=" +
//             encodeURIComponent(label);
//         }}
//       />
//       <span className="photo-tag">{label}</span>
//     </div>
//   );
// }
 
// // ---------------------------------------------------------------------------
// // СЕКЦИИ
// // ---------------------------------------------------------------------------
 
// function Header() {
//   const links = [
//     ["О проекте", "#about"],
//     ["Стройка", "#build"],
//     ["Спонсорам", "#sponsors"],
//     ["Тренерам", "#coaches"],
//     ["Райдерам", "#riders"],
//     ["Контакты", "#contacts"],
//   ];
//   return (
//     <header className="site-header">
//       <div className="flex items-center justify-between px-4 md:px-8 py-3">
//         <a href="#hero" className="logo-mark">
//           {PROJECT.name}
//         </a>
//         <nav className="hidden md:flex items-center gap-5">
//           {links.map(([t, href]) => (
//             <a key={href} href={href} className="nav-link">
//               {t}
//             </a>
//           ))}
//         </nav>
//         <a href="#contacts" className="btn-tape">
//           Написать
//         </a>
//       </div>
//     </header>
//   );
// }
 
// function Ticker() {
//   const items = [
//     "ПЕРВЫЙ КРЫТЫЙ ЭЙР-СКЕЙТПАРК ТАКОГО МАСШТАБА В УКРАИНЕ",
//     "СТРОИМ В КИЕВЕ",
//     "3200 М² ПОД КРЫШЕЙ",
//     "ИЩЕМ ПАРТНЁРОВ И ТРЕНЕРОВ",
//     "ОТКРЫТИЕ СКОРО",
//   ];
//   const line = items.join("  ★  ") + "  ★  ";
//   return (
//     <div className="ticker">
//       <div className="ticker-track">
//         <span>{line}</span>
//         <span aria-hidden="true">{line}</span>
//       </div>
//     </div>
//   );
// }
 
// function Hero() {
//   return (
//     <section id="hero" className="hero">
//       <div className="halftone-layer" aria-hidden="true" />
//       <div className="px-4 md:px-8 pt-10 pb-16 max-w-6xl mx-auto">
//         <div className="flex flex-wrap items-center gap-2 mb-6">
//           <Sticker color="pink" rot="r-2">{PROJECT.city.toUpperCase()}, {new Date().getFullYear()}</Sticker>
//           <Sticker color="blue" rot="r1">ИНДОР</Sticker>
//           <Sticker color="orange" rot="r-1">СБОР ПАРТНЁРОВ ОТКРЫТ</Sticker>
//         </div>
 
//         <h1 className="hero-title">
//           <RansomTitle text="ПЕРВЫЙ КРЫТЫЙ" size="xl" />
//           <br />
//           <RansomTitle text="ЭЙР-СКЕЙТПАРК" size="xl" />
//           <br />
//           <span className="hero-outline">ТАКОГО МАСШТАБА</span>
//         </h1>
 
//         <p className="hero-copy reveal">
//           {PROJECT.name} — новый крытый скейтпарк в {PROJECT.city}: вертикальные стены,
//           боул, foam pit и street-зона под одной крышей. Такого объёма и набора
//           секций в Украине ещё не строили. Мы ищем спонсоров, тренеров и партнёров,
//           чтобы открыться в полную силу.
//         </p>
 
//         <div className="flex flex-wrap gap-3 mt-6">
//           <a href="#sponsors" className="btn-primary bg-pink">Пакеты для спонсоров</a>
//           <a href="#coaches" className="btn-primary bg-blue">Стать тренером</a>
//           <a href="#build" className="btn-primary bg-yellow">Смотреть стройку</a>
//         </div>
//       </div>
 
//       <div className="stats-strip">
//         {STATS.map((s, i) => (
//           <div key={i} className="stat-cell reveal" style={{ transitionDelay: `${i * 80}ms` }}>
//             <div className="stat-n">{s.n}<span className="stat-u">{s.u}</span></div>
//             <div className="stat-l">{s.l}</div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
 
// function TapeLabel({ children, color = "yellow" }) {
//   return <div className={`tape-label bg-${color}`}>{children}</div>;
// }
 
// function About() {
//   return (
//     <section id="about" className="section bg-ink">
//       <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
//         <TapeLabel color="blue">О ПРОЕКТЕ</TapeLabel>
//         <h2 className="section-title text-paper mt-4">
//           Почему «первый такого размера» — это не маркетинг, а факт
//         </h2>
//         <div className="grid md:grid-cols-2 gap-8 mt-8">
//           <p className="body-copy text-paper reveal">
//             Большинство скейтпарков в Украине — это либо уличные площадки, зависящие
//             от погоды, либо небольшие индор-залы с одной-двумя секциями. {PROJECT.name} —
//             это крытый объект в формате настоящего эйр-хауса: вертикальная стена,
//             боул, стрит-зона и зона разгона для больших трюков под одной крышей,
//             круглый год, независимо от сезона.
//           </p>
//           <p className="body-copy text-paper reveal">
//             Для города это новая точка на карте райдинг-культуры: место для тренировок
//             сборной, соревнований, детской школы и коммьюнити-ивентов. Для партнёров —
//             редкая возможность войти в проект на этапе строительства и закрепить за
//             собой статус, который потом не купить.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }
 
// function Build() {
//   return (
//     <section id="build" className="section bg-paper">
//       <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
//         <TapeLabel color="orange">СТРОЙКА</TapeLabel>
//         <h2 className="section-title mt-4">Что уже происходит на объекте</h2>
//         <p className="body-copy mt-2 max-w-2xl">
//           Ниже — фактические фото и рендеры зон парка (сейчас на макете стоковые
//           изображения с меткой «заменить» — вставляем реальные кадры по мере съёмки).
//         </p>
//         <div className="gallery-grid mt-10">
//           {GALLERY.map((g, i) => (
//             <PhotoSlot key={i} {...g} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
 
// function Partners() {
//   return (
//     <section className="section bg-ink">
//       <div className="max-w-6xl mx-auto px-4 md:px-8 py-14">
//         <TapeLabel color="pink">ПОДТВЕРЖДЁННЫЕ ПАРТНЁРЫ</TapeLabel>
//         <div className="logo-row mt-8">
//           {PARTNER_LOGOS.map((l, i) => (
//             <div key={i} className="logo-chip reveal" style={{ transitionDelay: `${i * 60}ms` }}>
//               {l}
//             </div>
//           ))}
//         </div>
//         <p className="text-paper mt-6 text-sm opacity-70">
//           Раздел показывает бренды, уже подтвердившие участие — замени плейсхолдеры
//           на реальные логотипы по мере подписания соглашений.
//         </p>
//       </div>
//     </section>
//   );
// }
 
// function Sponsors() {
//   return (
//     <section id="sponsors" className="section bg-paper">
//       <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
//         <TapeLabel color="pink">СПОНСОРАМ И ПАРТНЁРАМ</TapeLabel>
//         <h2 className="section-title mt-4">Пакеты партнёрства</h2>
//         <p className="body-copy mt-2 max-w-2xl">
//           Четыре уровня входа — от присутствия в соцсетях до нейминга всего парка.
//           Суммы и точное наполнение уточняются под категорию бренда и срок контракта.
//         </p>
 
//         <div className="tiers-grid mt-10">
//           {SPONSOR_TIERS.map((tier, i) => (
//             <div key={tier.tag} className={`tier-card reveal ${ROT[i % ROT.length]}`} style={{ transitionDelay: `${i * 90}ms` }}>
//               <div className={`tier-head bg-${tier.color}`}>
//                 <span className="tier-tag">{tier.tag}</span>
//                 <span className="tier-price">{tier.price}</span>
//               </div>
//               <p className="tier-pitch">{tier.pitch}</p>
//               <ul className="tier-list">
//                 {tier.perks.map((p, j) => (
//                   <li key={j}>{p}</li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
 
//         <div className="callout mt-10 reveal">
//           <p>
//             Все пакеты можно комбинировать: например, product-placement уровня VERT
//             вместе с эксклюзивом по категории уровня AIR. Отправьте бриф вашего
//             бренда — соберём предложение под задачу.
//           </p>
//           <a href="#contacts" className="btn-primary bg-ink text-paper mt-4 inline-block">
//             Запросить полное КП
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }
 
// function Coaches() {
//   return (
//     <section id="coaches" className="section bg-ink">
//       <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
//         <TapeLabel color="blue">ТРЕНЕРАМ</TapeLabel>
//         <h2 className="section-title text-paper mt-4">Что получает тренер в {PROJECT.name}</h2>
//         <p className="body-copy text-paper mt-2 max-w-2xl">
//           Мы строим парк как базу для тренерского состава, а не просто зал в аренду.
//         </p>
//         <div className="coach-grid mt-10">
//           {COACH_OFFER.map((c, i) => (
//             <div key={i} className="coach-card reveal" style={{ transitionDelay: `${i * 70}ms` }}>
//               <div className="coach-num">{String(i + 1).padStart(2, "0")}</div>
//               <div>
//                 <h3>{c.t}</h3>
//                 <p>{c.d}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//         <a href="#contacts" className="btn-primary bg-blue mt-10 inline-block">
//           Откликнуться тренером
//         </a>
//       </div>
//     </section>
//   );
// }
 
// function Riders() {
//   return (
//     <section id="riders" className="section bg-paper">
//       <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
//         <TapeLabel color="yellow">РАЙДЕРАМ И КЛИЕНТАМ</TapeLabel>
//         <h2 className="section-title mt-4">Форматы для катка</h2>
//         <div className="plans-grid mt-10">
//           {RIDER_PLANS.map((p, i) => (
//             <div key={i} className={`plan-card reveal ${ROT[i % ROT.length]}`} style={{ transitionDelay: `${i * 70}ms` }}>
//               <h3>{p.t}</h3>
//               <div className="plan-price">{p.p}</div>
//               <p>{p.d}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
 
// function Contacts() {
//   return (
//     <section id="contacts" className="section bg-ink">
//       <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
//         <TapeLabel color="orange">КОНТАКТЫ</TapeLabel>
//         <h2 className="section-title text-paper mt-4">Кому вы пишете?</h2>
//         <div className="contacts-grid mt-10">
//           {CONTACTS.map((c, i) => (
//             <div key={i} className={`contact-card reveal ${ROT[i % ROT.length]}`} style={{ transitionDelay: `${i * 80}ms` }}>
//               <span className={`sticker bg-${c.color} mb-3`}>{c.who}</span>
//               <p>{c.text}</p>
//               <a href={`mailto:${c.email}`} className="contact-email">{c.email}</a>
//               <a href={`mailto:${c.email}`} className={`btn-primary bg-${c.color} mt-4 inline-block`}>
//                 {c.cta}
//               </a>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
 
// function Footer() {
//   return (
//     <footer className="footer">
//       <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 flex flex-wrap items-center justify-between gap-4">
//         <span className="logo-mark small">{PROJECT.name}</span>
//         <span className="text-paper text-sm opacity-70">
//           {PROJECT.sub} · {PROJECT.city} · строится сейчас
//         </span>
//       </div>
//     </footer>
//   );
// }
 
// // ---------------------------------------------------------------------------
// // ГЛАВНЫЙ КОМПОНЕНТ
// // ---------------------------------------------------------------------------
 
// export default function SkateparkLanding() {
//   useReveal();
//   return (
//     <div className="angar-root">
//       <GlobalStyle />
//       <Header />
//       <Ticker />
//       <Hero />
//       <About />
//       <Build />
//       <Partners />
//       <Sponsors />
//       <Coaches />
//       <Riders />
//       <Contacts />
//       <Footer />
//     </div>
//   );
// }
 
// // ---------------------------------------------------------------------------
// // СТИЛИ — палитра, шрифты, "вырезанная бумага"
// // ---------------------------------------------------------------------------
 
// function GlobalStyle() {
//   return (
//     <style>{`
//       @import url('https://fonts.googleapis.com/css2?family=Anton&family=JetBrains+Mono:wght@500;700&family=Work+Sans:wght@400;500;700;800&display=swap');
 
//       .angar-root {
//         --ink: #121212;
//         --paper: #F1ECDD;
//         --pink: #FF2E88;
//         --blue: #1E4FFF;
//         --yellow: #FFD400;
//         --orange: #FF5A1F;
//         --green: #B4FF39;
//         font-family: 'Work Sans', sans-serif;
//         background: var(--ink);
//         color: var(--ink);
//         overflow-x: hidden;
//       }
 
//       .angar-root .bg-ink{ background: var(--ink); }
//       .angar-root .bg-paper{ background: var(--paper); }
//       .angar-root .bg-pink{ background: var(--pink); }
//       .angar-root .bg-blue{ background: var(--blue); }
//       .angar-root .bg-yellow{ background: var(--yellow); }
//       .angar-root .bg-orange{ background: var(--orange); }
//       .angar-root .bg-green{ background: var(--green); }
//       .angar-root .text-paper{ color: var(--paper); }
 
//       /* header */
//       .site-header{
//         position: sticky; top:0; z-index: 40;
//         background: var(--ink);
//         border-bottom: 3px solid var(--paper);
//       }
//       .logo-mark{
//         font-family: 'Anton', sans-serif;
//         letter-spacing: 0.03em;
//         font-size: 1.5rem;
//         color: var(--paper);
//         text-decoration:none;
//       }
//       .logo-mark.small{ font-size: 1.1rem; }
//       .nav-link{
//         font-family:'JetBrains Mono', monospace;
//         font-size: 0.75rem;
//         letter-spacing: 0.06em;
//         text-transform: uppercase;
//         color: var(--paper);
//         text-decoration:none;
//         opacity:.75;
//       }
//       .nav-link:hover{ opacity:1; color: var(--yellow); }
//       .btn-tape{
//         font-family:'JetBrains Mono', monospace;
//         font-size:.7rem;
//         text-transform:uppercase;
//         letter-spacing:.05em;
//         background: var(--yellow);
//         color: var(--ink);
//         padding: .5rem .9rem;
//         text-decoration:none;
//         transform: rotate(-2deg);
//         display:inline-block;
//         box-shadow: 3px 3px 0 var(--paper);
//       }
 
//       /* ticker */
//       .ticker{
//         background: var(--pink);
//         border-bottom: 3px solid var(--ink);
//         overflow:hidden;
//         white-space:nowrap;
//       }
//       .ticker-track{
//         display:inline-flex;
//         animation: marquee 22s linear infinite;
//         font-family:'JetBrains Mono', monospace;
//         font-weight:700;
//         font-size:.75rem;
//         letter-spacing:.08em;
//         color: var(--ink);
//         padding: .5rem 0;
//       }
//       @keyframes marquee{
//         from{ transform: translateX(0); }
//         to{ transform: translateX(-50%); }
//       }
 
//       /* hero */
//       .hero{ position:relative; background: var(--ink); }
//       .halftone-layer{
//         position:absolute; inset:0; pointer-events:none; opacity:.15;
//         background-image: radial-gradient(var(--paper) 1px, transparent 1.4px);
//         background-size: 10px 10px;
//       }
//       .sticker{
//         display:inline-block;
//         font-family:'JetBrains Mono', monospace;
//         font-size:.68rem;
//         letter-spacing:.05em;
//         text-transform:uppercase;
//         color: var(--ink);
//         padding:.3rem .6rem;
//         box-shadow: 2px 2px 0 rgba(0,0,0,.5);
//       }
//       .r-3{ transform: rotate(-3deg);} .r-2{ transform: rotate(-2deg);} .r-1{ transform: rotate(-1deg);}
//       .r1{ transform: rotate(1deg);} .r2{ transform: rotate(2deg);} .r3{ transform: rotate(3deg);}
 
//       .hero-title{ position:relative; z-index:1; margin-top: 1rem; line-height: 1; }
//       .ransom{ display:inline; }
//       .ransom-word{
//         font-family:'Anton', sans-serif;
//         color: var(--ink);
//         padding: 0 .35em;
//         margin: 0 .12em .18em 0;
//         display:inline-block;
//         box-shadow: 4px 4px 0 rgba(0,0,0,.55);
//         text-transform:uppercase;
//       }
//       .ransom-xl .ransom-word{ font-size: clamp(1.8rem, 6vw, 4.2rem); }
//       .hero-outline{
//         font-family:'Anton', sans-serif;
//         text-transform:uppercase;
//         font-size: clamp(1.8rem, 6vw, 4.2rem);
//         color: transparent;
//         -webkit-text-stroke: 2px var(--paper);
//       }
//       .hero-copy{
//         max-width: 46rem; margin-top: 1.5rem;
//         color: var(--paper); font-size: 1.05rem; line-height:1.6;
//       }
//       .btn-primary{
//         font-family:'JetBrains Mono', monospace;
//         text-transform:uppercase;
//         font-size:.78rem; letter-spacing:.04em;
//         color: var(--ink);
//         padding:.75rem 1.1rem;
//         text-decoration:none;
//         box-shadow: 4px 4px 0 var(--paper);
//         border: 2px solid var(--ink);
//       }
//       .btn-primary:hover{ transform: translate(2px,2px); box-shadow: 2px 2px 0 var(--paper); }
 
//       .stats-strip{
//         display:grid; grid-template-columns: repeat(2,1fr);
//         border-top: 3px solid var(--paper);
//         margin-top: 3rem;
//       }
//       @media(min-width:768px){ .stats-strip{ grid-template-columns: repeat(4,1fr); } }
//       .stat-cell{
//         padding: 1.4rem 1rem;
//         border-right: 1px dashed rgba(241,236,221,.35);
//         border-bottom: 1px dashed rgba(241,236,221,.35);
//       }
//       .stat-n{ font-family:'Anton', sans-serif; font-size:2.2rem; color: var(--yellow); }
//       .stat-u{ font-size:1rem; margin-left:.2rem; color: var(--paper); }
//       .stat-l{ font-family:'JetBrains Mono', monospace; font-size:.68rem; text-transform:uppercase; color: var(--paper); opacity:.75; margin-top:.2rem; }
 
//       /* section shared */
//       .section{ position:relative; }
//       .section-title{
//         font-family:'Anton', sans-serif;
//         text-transform:uppercase;
//         font-size: clamp(1.5rem, 3.6vw, 2.6rem);
//         line-height:1.05;
//       }
//       .body-copy{ font-size:1rem; line-height:1.65; }
//       .tape-label{
//         display:inline-block;
//         font-family:'JetBrains Mono', monospace;
//         font-size:.7rem; letter-spacing:.08em; text-transform:uppercase;
//         color: var(--ink);
//         padding:.35rem .7rem;
//         transform: rotate(-2deg);
//         box-shadow: 3px 3px 0 rgba(0,0,0,.35);
//       }
 
//       /* gallery */
//       .gallery-grid{
//         display:grid; grid-template-columns: 1fr; gap: 2.2rem;
//       }
//       @media(min-width:640px){ .gallery-grid{ grid-template-columns: 1fr 1fr; } }
//       .photo-slot{
//         position:relative; background: var(--paper);
//         padding: 10px 10px 34px 10px;
//         box-shadow: 6px 6px 0 rgba(0,0,0,.75);
//         border: 2px solid var(--ink);
//       }
//       .photo-slot img{ width:100%; height: 220px; object-fit:cover; display:block; filter: grayscale(.1) contrast(1.05); }
//       .torn-r1{ transform: rotate(-2deg); } .torn-r2{ transform: rotate(1.5deg); } .torn-r3{ transform: rotate(-1deg); }
//       .photo-tag{
//         position:absolute; bottom:8px; left:10px; right:10px;
//         font-family:'JetBrains Mono', monospace; font-size:.62rem; text-transform:uppercase;
//         letter-spacing:.05em; color: var(--ink); opacity:.75;
//       }
 
//       /* partner logos */
//       .logo-row{ display:flex; flex-wrap:wrap; gap: 1rem; }
//       .logo-chip{
//         background: var(--paper);
//         color: var(--ink);
//         font-family:'JetBrains Mono', monospace;
//         font-size:.72rem; text-transform:uppercase; letter-spacing:.04em;
//         padding: 1.1rem 1.4rem;
//         border: 2px dashed var(--ink);
//       }
 
//       /* sponsor tiers */
//       .tiers-grid{ display:grid; grid-template-columns:1fr; gap:1.8rem; }
//       @media(min-width:768px){ .tiers-grid{ grid-template-columns: repeat(2,1fr); } }
//       @media(min-width:1100px){ .tiers-grid{ grid-template-columns: repeat(4,1fr); } }
//       .tier-card{
//         background: var(--paper);
//         border: 2px solid var(--ink);
//         box-shadow: 6px 6px 0 rgba(0,0,0,.85);
//         display:flex; flex-direction:column;
//       }
//       .tier-head{
//         padding: .9rem 1rem;
//         display:flex; align-items:baseline; justify-content:space-between;
//         border-bottom: 2px solid var(--ink);
//       }
//       .tier-tag{ font-family:'Anton', sans-serif; font-size:1.3rem; text-transform:uppercase; }
//       .tier-price{ font-family:'JetBrains Mono', monospace; font-size:.65rem; text-transform:uppercase; }
//       .tier-pitch{ padding: .9rem 1rem 0 1rem; font-size:.88rem; line-height:1.5; }
//       .tier-list{ padding: .8rem 1.1rem 1.2rem 1.3rem; font-size:.84rem; line-height:1.55; list-style: disc; flex:1; }
//       .tier-list li{ margin-bottom:.35rem; }
 
//       .callout{
//         background: var(--ink); color: var(--paper);
//         padding: 1.6rem; border: 2px solid var(--ink);
//         max-width: 40rem;
//       }
 
//       /* coaches */
//       .coach-grid{ display:grid; grid-template-columns:1fr; gap:1.6rem; }
//       @media(min-width:768px){ .coach-grid{ grid-template-columns: 1fr 1fr; } }
//       .coach-card{ display:flex; gap:1rem; align-items:flex-start; }
//       .coach-num{ font-family:'Anton', sans-serif; font-size:2rem; color: var(--blue); }
//       .coach-card h3{ font-family:'Anton', sans-serif; text-transform:uppercase; color: var(--paper); font-size:1.05rem; }
//       .coach-card p{ color: var(--paper); opacity:.85; font-size:.9rem; margin-top:.2rem; line-height:1.5; }
 
//       /* riders */
//       .plans-grid{ display:grid; grid-template-columns:1fr; gap:1.6rem; }
//       @media(min-width:640px){ .plans-grid{ grid-template-columns: repeat(2,1fr);} }
//       @media(min-width:1024px){ .plans-grid{ grid-template-columns: repeat(4,1fr);} }
//       .plan-card{
//         background: var(--ink); color: var(--paper);
//         border: 2px solid var(--ink);
//         box-shadow: 5px 5px 0 rgba(0,0,0,.5);
//         padding: 1.2rem;
//       }
//       .plan-card h3{ font-family:'Anton', sans-serif; text-transform:uppercase; font-size:1.05rem; }
//       .plan-price{ font-family:'JetBrains Mono', monospace; color: var(--yellow); margin: .4rem 0; font-size:.85rem; }
//       .plan-card p{ font-size:.85rem; opacity:.85; line-height:1.5; }
 
//       /* contacts */
//       .contacts-grid{ display:grid; grid-template-columns:1fr; gap:1.6rem; }
//       @media(min-width:768px){ .contacts-grid{ grid-template-columns: repeat(3,1fr); } }
//       .contact-card{
//         background: var(--paper);
//         border: 2px solid var(--ink);
//         box-shadow: 6px 6px 0 rgba(0,0,0,.85);
//         padding: 1.4rem;
//       }
//       .contact-card p{ font-size:.88rem; line-height:1.5; margin-top:.6rem; }
//       .contact-email{ display:block; margin-top:.7rem; font-family:'JetBrains Mono', monospace; font-size:.8rem; text-decoration: underline; color: var(--ink); }
 
//       .footer{ background: var(--ink); border-top: 3px solid var(--paper); }
 
//       /* reveal */
//       .reveal{ opacity:0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; }
//       .reveal-in{ opacity:1; transform: translateY(0); }
 
//       @media (prefers-reduced-motion: reduce){
//         .reveal{ opacity:1; transform:none; transition:none; }
//         .ticker-track{ animation:none; }
//       }
//     `}</style>
//   );
// }
 