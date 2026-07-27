import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Mail, Instagram, Youtube, Send } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/**
 * ZLIT — лендинг для крытого эир-скейтпарка в Киеве.
 *
 * Установка:
 *   npm install gsap lucide-react
 *
 * Шрифты (добавьте в index.html <head> или в globals.css через @import):
 *   https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;800;900
 *     &family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap
 *
 * Everything below uses Tailwind arbitrary values, so no tailwind.config
 * changes are required — but see README.md for a cleaner token setup.
 */

// ---------- Данные (замените на реальные) ----------

const SPECS = [
  { label: "Площа комплексу", value: 4700, unit: "м²", decimals: 0 },
  { label: "Висота стелі", value: 14, unit: "м", decimals: 0 },
  { label: "Глибина bowl", value: 3.6, unit: "м", decimals: 1 },
  { label: "Вертикальна стіна", value: 4.2, unit: "м", decimals: 1 },
  { label: "Пропускна здатність", value: 450, unit: "райдерів/день", decimals: 0 },
  { label: "Зон катання", value: 6, unit: "дисциплін", decimals: 0 },
];

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

// ---------- Допоміжні компоненти ----------

function HazardMarquee() {
  const text = "СПОНСОРСТВО — ТРЕНЕРИ — ПАРТНЕРСТВО — МЕДІА — РАЙДЕРИ — ОБ'ЄКТ У СТРОЙЦІ — ";
  return (
    <div className="relative overflow-hidden border-y border-[#35383e] bg-[#121316] py-3">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #ff3b1f 0px, #ff3b1f 22px, #121316 22px, #121316 44px)",
          maskImage: "linear-gradient(#000,#000)",
        }}
      />
      <div className="marquee-track relative flex w-max whitespace-nowrap">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="px-4 font-['JetBrains_Mono'] text-sm font-medium tracking-[0.25em] text-[#121316] mix-blend-normal"
          >
            <span className="bg-[#e9e6df] px-3 py-1">{text.repeat(4)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function RampBlueprint({ pathRef, className }) {
  // Стилизованный чертёж поперечного сечения bowl + vert-стены.
  return (
    <svg
      viewBox="0 0 600 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#35383e" strokeWidth="1" strokeDasharray="2 4" opacity="0.5">
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
        stroke="url(#zlitGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="zlitGradient" x1="0" y1="0" x2="600" y2="0">
          <stop offset="0%" stopColor="#6e5bff" />
          <stop offset="100%" stopColor="#00e5ff" />
        </linearGradient>
      </defs>
      <text x="24" y="270" fill="#9a9ea6" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1">
        SECTION A—A · VERT + BOWL · SCALE 1:120
      </text>
    </svg>
  );
}

function StatNumber({ value, decimals }) {
  return (
    <span
      className="stat-number font-['JetBrains_Mono'] text-4xl font-medium text-[#e9e6df] md:text-5xl"
      data-value={value}
      data-decimals={decimals}
    >
      0
    </span>
  );
}

function DiagonalDivider({ flip = false }) {
  return (
    <div
      className={`diagonal-cut h-16 w-full bg-[#121316] md:h-24 ${flip ? "scale-y-[-1]" : ""}`}
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    >
      <div
        className="h-full w-full"
        style={{
          background: "linear-gradient(100deg, transparent 48%, #35383e 49%, #35383e 51%, transparent 52%)",
        }}
      />
    </div>
  );
}

// ---------- Основной компонент ----------

export default function ZlitLanding() {
  const heroPathRef = useRef(null);
  const roadmapRef = useRef(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (!prefersReduced) {
        // Чертёж рампы в hero — "прорисовывается"
        const path = heroPathRef.current;
        if (path) {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut", delay: 0.3 });
        }

        // Диагональные speed-линии
        gsap.from(".speed-line", {
          xPercent: -120,
          opacity: 0,
          duration: 1,
          stagger: 0.07,
          ease: "power3.out",
          delay: 0.2,
        });

        // Текст hero
        gsap.from(".hero-reveal", {
          y: 36,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.6,
        });

        // Бегущая строка
        gsap.to(".marquee-track", {
          xPercent: -50,
          repeat: -1,
          duration: 22,
          ease: "linear",
        });
      } else {
        gsap.set([".speed-line", ".hero-reveal"], { opacity: 1, x: 0, y: 0 });
      }

      // Появление секций при скролле
      gsap.utils.toArray(".reveal-up").forEach((el) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      // Диагональные разделители
      gsap.utils.toArray(".diagonal-cut").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 1,
            ease: "power3.inOut",
            scrollTrigger: { trigger: el, start: "top 92%" },
          }
        );
      });

      // Счётчики спецификаций
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

      // Прогресс-линия roadmap
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
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#121316] font-['Manrope'] text-[#e9e6df] antialiased">
      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#35383e]/60 bg-[#121316]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <span className="font-['Unbounded'] text-lg font-extrabold tracking-tight">
            ЗЛІТ<span className="text-[#00e5ff]">.</span>
          </span>
          <nav className="hidden gap-8 font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#9a9ea6] md:flex">
            <a href="#specs" className="transition hover:text-[#e9e6df]">Об'єкт</a>
            <a href="#sponsors" className="transition hover:text-[#e9e6df]">Спонсорам</a>
            <a href="#roadmap" className="transition hover:text-[#e9e6df]">Хід будівництва</a>
            <a href="#contact" className="transition hover:text-[#e9e6df]">Контакти</a>
          </nav>
          <a
            href="#sponsors"
            className="rounded-none border border-[#ff3b1f] px-4 py-2 font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#ff3b1f] transition hover:bg-[#ff3b1f] hover:text-[#121316]"
          >
            Стати партнером
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden pt-40 pb-24 md:pt-48">
        {/* speed lines */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="speed-line absolute h-px bg-gradient-to-r from-transparent via-[#6e5bff] to-transparent"
              style={{ top: `${10 + i * 15}%`, width: "140%", left: "-20%", transform: `rotate(-6deg)` }}
            />
          ))}
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="hero-reveal mb-6 font-['JetBrains_Mono'] text-xs uppercase tracking-[0.3em] text-[#00e5ff]">
              Kyiv · Indoor Air Park · Est. 2027
            </p>
            <h1 className="hero-reveal font-['Unbounded'] text-6xl font-black uppercase leading-[0.95] tracking-tight md:text-8xl">
              Злiт
            </h1>
            <p className="hero-reveal mt-6 max-w-md text-lg text-[#9a9ea6] md:text-xl">
              Перший в Україні критий скейтпарк такого масштабу. Без сезонів, без
              погоди, без обмежень — лише швидкість, повітря і бетон.
            </p>
            <div className="hero-reveal mt-10 flex flex-wrap gap-4">
              <a
                href="#sponsors"
                className="inline-flex items-center gap-2 bg-[#ff3b1f] px-6 py-3 font-['JetBrains_Mono'] text-sm font-medium uppercase tracking-wider text-[#121316] transition hover:bg-[#e9e6df]"
              >
                Стати спонсором <ArrowUpRight size={16} />
              </a>
              <a
                href="#specs"
                className="inline-flex items-center gap-2 border border-[#35383e] px-6 py-3 font-['JetBrains_Mono'] text-sm font-medium uppercase tracking-wider text-[#e9e6df] transition hover:border-[#e9e6df]"
              >
                Специфікація об'єкта
              </a>
            </div>
          </div>

          <div className="hero-reveal relative">
            <RampBlueprint pathRef={heroPathRef} className="w-full" />
          </div>
        </div>
      </section>

      <HazardMarquee />

      {/* VISION */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="reveal-up grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.4fr]">
          <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.3em] text-[#00e5ff]">
            Чому це важливо
          </p>
          <div>
            <h2 className="font-['Unbounded'] text-3xl font-bold leading-tight md:text-5xl">
              В Україні немає критого парку такого масштабу.
              <span className="text-[#9a9ea6]"> Ми будуємо перший.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-[#9a9ea6]">
              Сьогодні райдери залежні від погоди й сезону, тренери — від
              випадкових локацій, а спорт — від ентузіазму, а не інфраструктури.
              ЗЛІТ — це цілорічний об'єкт олімпійського рівня: bowl, vert,
              street-зона та мегарампа під одним дахом у Києві.
            </p>
          </div>
        </div>
      </section>

      {/* SPECS */}
      <section id="specs" className="border-y border-[#35383e]/60 bg-[#0e0f12] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="reveal-up mb-14 flex items-end justify-between">
            <h2 className="font-['Unbounded'] text-2xl font-bold uppercase md:text-3xl">
              Специфікація об'єкта
            </h2>
            <span className="hidden font-['JetBrains_Mono'] text-xs text-[#9a9ea6] md:block">
              DWG-ZLIT-001 / REV.03
            </span>
          </div>
          <div className="reveal-up grid grid-cols-2 gap-px overflow-hidden border border-[#35383e]/60 bg-[#35383e]/60 md:grid-cols-3">
            {SPECS.map((s) => (
              <div key={s.label} className="bg-[#0e0f12] p-6 md:p-8">
                <StatNumber value={s.value} decimals={s.decimals} />
                <span className="ml-2 font-['JetBrains_Mono'] text-sm text-[#9a9ea6]">{s.unit}</span>
                <p className="mt-2 text-sm text-[#9a9ea6]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DiagonalDivider />

      {/* SPONSORS */}
      <section id="sponsors" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <p className="reveal-up font-['JetBrains_Mono'] text-xs uppercase tracking-[0.3em] text-[#00e5ff]">
          Партнерство
        </p>
        <h2 className="reveal-up mt-4 max-w-2xl font-['Unbounded'] text-3xl font-bold leading-tight md:text-5xl">
          Три способи бути частиною першого зльоту
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.code}
              className={`reveal-up flex flex-col justify-between border p-8 transition ${
                t.highlight
                  ? "border-[#00e5ff]/60 bg-gradient-to-b from-[#1c1e22] to-[#121316]"
                  : "border-[#35383e]/60 bg-[#1c1e22]"
              }`}
            >
              <div>
                <span className="font-['JetBrains_Mono'] text-xs text-[#9a9ea6]">{t.code}</span>
                <h3 className="mt-3 font-['Unbounded'] text-xl font-bold">{t.name}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[#9a9ea6]">{t.desc}</p>
              </div>
              <a
                href="#contact"
                className="mt-8 inline-flex items-center gap-1 font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#00e5ff]"
              >
                Обговорити пакет <ArrowUpRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* TRAINERS / PARTNERS */}
      <section className="border-y border-[#35383e]/60 bg-[#0e0f12] py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
          <div className="reveal-up">
            <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.3em] text-[#6e5bff]">
              Тренерам і федераціям
            </p>
            <h2 className="mt-4 font-['Unbounded'] text-3xl font-bold leading-tight md:text-4xl">
              Об'єкт олімпійського рівня потребує команди олімпійського рівня
            </h2>
            <p className="mt-6 text-[#9a9ea6]">
              Ми відкриті до співпраці з тренерськими штабами, федераціями
              скейтбордингу та брендами екіпіровки — від методичних програм
              до сумісних заходів і зборів.
            </p>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 border border-[#35383e] px-6 py-3 font-['JetBrains_Mono'] text-sm uppercase tracking-wider transition hover:border-[#e9e6df]"
            >
              Долучитися як тренер / партнер <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="reveal-up grid grid-cols-2 gap-px overflow-hidden border border-[#35383e]/60 bg-[#35383e]/60 font-['JetBrains_Mono'] text-sm">
            {["Bowl", "Vert", "Street Plaza", "Mini-ramp", "Foam Pit", "Mega Ramp"].map((zone) => (
              <div key={zone} className="bg-[#0e0f12] px-5 py-6 text-[#9a9ea6]">
                {zone}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIDERS WAITLIST */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="reveal-up mx-auto max-w-xl text-center">
          <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.3em] text-[#00e5ff]">
            Для райдерів
          </p>
          <h2 className="mt-4 font-['Unbounded'] text-3xl font-bold md:text-4xl">
            Стань першим на старті
          </h2>
          <p className="mt-4 text-[#9a9ea6]">
            Ранній доступ до передпродажу абонементів і запрошення на
            тестові заїзди — до офіційного відкриття.
          </p>
          {submitted ? (
            <p className="mt-8 font-['JetBrains_Mono'] text-sm text-[#00e5ff]">
              Дякуємо. Ми напишемо, щойно відкриється реєстрація.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 border border-[#35383e] bg-[#1c1e22] px-4 py-3 font-['JetBrains_Mono'] text-sm outline-none placeholder:text-[#5a5d63] focus:border-[#00e5ff]"
              />
              <button
                type="submit"
                className="bg-[#e9e6df] px-6 py-3 font-['JetBrains_Mono'] text-sm font-medium uppercase tracking-wider text-[#121316] transition hover:bg-[#00e5ff]"
              >
                Отримати доступ
              </button>
            </form>
          )}
        </div>
      </section>

      <DiagonalDivider flip />

      {/* ROADMAP */}
      <section id="roadmap" ref={roadmapRef} className="bg-[#0e0f12] py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal-up font-['Unbounded'] text-2xl font-bold uppercase md:text-3xl">
            Хід будівництва
          </h2>
          <div className="relative mt-14">
            <div className="absolute left-[27px] top-0 h-full w-px bg-[#35383e]" />
            <div className="roadmap-progress absolute left-[27px] top-0 h-full w-px bg-gradient-to-b from-[#6e5bff] to-[#00e5ff]" />
            <div className="flex flex-col gap-12">
              {ROADMAP.map((r) => (
                <div key={r.step} className="reveal-up relative flex gap-8 pl-14">
                  <span
                    className={`absolute left-0 flex h-14 w-14 items-center justify-center border font-['JetBrains_Mono'] text-xs ${
                      r.status === "done"
                        ? "border-[#00e5ff] text-[#00e5ff]"
                        : r.status === "active"
                        ? "border-[#ff3b1f] text-[#ff3b1f]"
                        : "border-[#35383e] text-[#5a5d63]"
                    }`}
                  >
                    {r.step}
                  </span>
                  <div>
                    <p className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#9a9ea6]">
                      {r.period}
                    </p>
                    <h3 className="mt-1 font-['Unbounded'] text-lg font-bold md:text-xl">{r.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT / FOOTER */}
      <section id="contact" className="relative overflow-hidden bg-[#121316] pt-24">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #ff3b1f 0px, #ff3b1f 22px, transparent 22px, transparent 44px)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pb-16">
          <div className="reveal-up max-w-2xl">
            <h2 className="font-['Unbounded'] text-4xl font-black uppercase leading-[0.95] md:text-6xl">
              Долучайся
              <br /> до зльоту
            </h2>
            <p className="mt-6 text-[#9a9ea6]">
              Спонсорство, тренерська співпраця, медіа-запити чи просто
              питання про проєкт — пишіть, розкажемо детально.
            </p>
            <a
              href="mailto:hello@zlit.kyiv.ua"
              className="mt-8 inline-flex items-center gap-2 border-b border-[#e9e6df] pb-1 font-['JetBrains_Mono'] text-lg"
            >
              <Mail size={18} /> hello@zlit.kyiv.ua
            </a>
          </div>

          <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-[#35383e]/60 pt-8 md:flex-row md:items-center">
            <span className="font-['Unbounded'] text-lg font-extrabold">
              ЗЛІТ<span className="text-[#00e5ff]">.</span>
            </span>
            <div className="flex gap-5 text-[#9a9ea6]">
              <a href="#" aria-label="Instagram" className="transition hover:text-[#e9e6df]">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="YouTube" className="transition hover:text-[#e9e6df]">
                <Youtube size={18} />
              </a>
              <a href="#" aria-label="Telegram" className="transition hover:text-[#e9e6df]">
                <Send size={18} />
              </a>
            </div>
            <span className="font-['JetBrains_Mono'] text-xs text-[#5a5d63]">
              Kyiv, Ukraine © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}