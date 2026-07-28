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