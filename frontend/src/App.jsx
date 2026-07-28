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
 