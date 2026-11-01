import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import SkateparkModel from '../SkateparkModel';

/*
  Задня обкладинка платівки = сторінка послуг.
  Side A — послуги (треклист), Side B — контакти.

  Props:
    origin  — { x, y } точка, з якої розкривається сторінка (клік по біжучому рядку)
    onClose — викликається після анімації закриття

  Файли, які треба покласти в /public:
    /models/skatepark.glb
    /media/dev.jpg, /media/turnkey.jpg, /media/events.mp4, /media/diy.jpg
    /media/covers/1.jpg ... 15.jpg  (для фону "івенти")
*/

const BRAND = 'Назва студії';

const SERVICES = [
  {
    id: 'dev',
    side: 'A1',
    title: 'Розробка та виробництво скейтпарків',
    caption: 'Креслення і 3D-модель',
    text: 'Проєктуємо траси, рампи та бетонні форми під ділянку й рівень райдерів. Креслення, 3D-модель, виробництво конструкцій у власному цеху.',
    media: { type: 'image', src: '/media/dev.jpg' },
    bg: 'blueprint',
  },
  {
    id: 'turnkey',
    side: 'A2',
    title: 'Під ключ',
    caption: 'Від ідеї до відкриття',
    text: 'Проєкт, виробництво, монтаж, запуск. Один підрядник на весь процес, без передач між командами.',
    media: { type: 'image', src: '/media/turnkey.jpg' },
    bg: 'steps',
  },
  {
    id: 'events',
    side: 'A3',
    title: 'Івенти',
    caption: 'Контести, джеми, фестивалі',
    text: 'Організовуємо контести, джем-сесії та фестивалі: майданчик, модульні рампи, судді, звук, афіша.',
    media: { type: 'video', src: '/media/events.mp4' },
    bg: 'covers',
  },
  {
    id: 'diy',
    side: 'A4',
    title: 'DIY',
    caption: 'Будуємо з ком’юніті',
    text: 'Допомагаємо будувати локальні спот-и власними руками: бетон, фанера, метал. Креслення, матеріали, поради по кроках.',
    media: { type: 'image', src: '/media/diy.jpg' },
    bg: 'diy',
  },
  {
    id: 'contacts',
    side: 'B1',
    title: 'Контакти',
    caption: 'Напишіть нам',
    text: 'Розкажіть про ділянку, бюджет і терміни, і ми повернемось з пропозицією.',
    media: { type: 'image', src: '/media/contacts.jpg' },
    bg: 'idle',
    links: [
      { label: 'Instagram', href: 'https://instagram.com/' },
      { label: 'Telegram', href: 'https://t.me/' },
      { label: 'hello@example.com', href: 'mailto:hello@example.com' },
    ],
  },
];

const COVERS = Array.from({ length: 15 }, (_, i) => `/media/covers/${i + 1}.jpg`);
const PREVIEW_W = 260;

/* ---------- Фони ---------- */

function IdleBg() {
  // канавки вінілу
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          'repeating-radial-gradient(circle at 85% 110%, transparent 0 7px, rgba(255,255,255,0.035) 7px 8px)',
      }}
    />
  );
}

function BlueprintBg() {
  const L = (props) => (
    <path className="bp-line" pathLength="1" style={{ strokeDasharray: 1 }} fill="none" {...props} />
  );
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" stroke="#5c5c5c" strokeWidth="1.2">
      {/* сітка */}
      {Array.from({ length: 13 }, (_, i) => (
        <L key={`v${i}`} d={`M${i * 100} 0V800`} strokeOpacity="0.25" />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <L key={`h${i}`} d={`M0 ${i * 100}H1200`} strokeOpacity="0.25" />
      ))}
      {/* план: бовл */}
      <L d="M180 520C180 400 330 360 470 390C610 420 700 500 640 600C580 700 330 700 230 640C195 620 180 580 180 520Z" strokeWidth="2" />
      <L d="M230 520C230 440 340 410 450 435C560 460 620 510 585 575C550 640 360 645 290 600C250 575 230 550 230 520Z" strokeOpacity="0.6" />
      {/* профіль квотер-пайпа */}
      <L d="M760 650H1100" />
      <L d="M760 650C860 650 920 600 940 440" strokeWidth="2" />
      <L d="M940 440H1100" />
      <L d="M1100 440V650" />
      {/* розміри */}
      <L d="M760 690H1100M760 680V700M1100 680V700" strokeOpacity="0.7" />
      <L d="M1140 440V650M1130 440H1150M1130 650H1150" strokeOpacity="0.7" />
      <L d="M180 740H640M180 730V750M640 730V750" strokeOpacity="0.7" />
      <text x="880" y="715" fill="#5c5c5c" stroke="none" fontSize="14">R 3500</text>
      <text x="1155" y="550" fill="#5c5c5c" stroke="none" fontSize="14">H 1800</text>
      <text x="360" y="765" fill="#5c5c5c" stroke="none" fontSize="14">L 14 000</text>
    </svg>
  );
}

function CoversBg() {
  return (
    <div className="absolute inset-0 grid grid-cols-5 grid-rows-3 gap-3 p-6">
      {COVERS.map((src, i) => (
        <div
          key={src}
          data-tile
          className="overflow-hidden bg-neutral-900 ring-1 ring-neutral-800"
          style={{ transform: `rotate(${((i * 37) % 7) - 3}deg)` }}
        >
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover grayscale"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </div>
      ))}
    </div>
  );
}

const outline = { WebkitTextStroke: '1px #3a3a3a', color: 'transparent' };

function StepsBg() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2 px-8 leading-none" style={outline}>
      {['Проєкт', 'Виробництво', 'Монтаж', 'Запуск'].map((w) => (
        <div key={w} className="text-[clamp(3rem,11vw,10rem)] font-bold">
          {w}
        </div>
      ))}
    </div>
  );
}

function DiyBg() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{ background: 'repeating-linear-gradient(135deg, transparent 0 28px, rgba(255,255,255,0.04) 28px 56px)' }}
      />
      <div className="absolute -bottom-10 -left-4 text-[28vw] font-bold leading-none" style={outline}>
        DIY
      </div>
    </div>
  );
}

const BACKGROUNDS = {
  idle: IdleBg,
  blueprint: BlueprintBg,
  covers: CoversBg,
  steps: StepsBg,
  diy: DiyBg,
};

/* ---------- Сторінка ---------- */

export default function BackCover({ origin, onClose }) {
  const rootRef = useRef(null);
  const previewRef = useRef(null);
  const mediaRef = useRef(null);
  const originRef = useRef(null);

  const [active, setActive] = useState(null); // id останньої послуги
  const [hover, setHover] = useState(false); // курсор над списком

  const current = SERVICES.find((s) => s.id === active);
  const panel = current ?? {
    side: '',
    text: 'Скейтпарки: від креслення до відкриття. Наведіть курсор на послугу.',
  };

  /* вхід: розкриття кола з точки кліку по біжучому рядку */
  useLayoutEffect(() => {
    const o = origin ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    originRef.current = o;
    const r = Math.hypot(window.innerWidth, window.innerHeight);

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(
          rootRef.current,
          { clipPath: `circle(0px at ${o.x}px ${o.y}px)` },
          { clipPath: `circle(${r}px at ${o.x}px ${o.y}px)`, duration: 1.1, ease: 'power3.inOut' }
        )
        .from('[data-row]', { yPercent: 110, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, '-=0.5')
        .from('[data-fade]', { opacity: 0, duration: 0.8 }, '-=0.5');
    }, rootRef);
    return () => ctx.revert();
  }, [origin]);

  const close = () => {
    const o = originRef.current;
    gsap.to(rootRef.current, {
      clipPath: `circle(0px at ${o.x}px ${o.y}px)`,
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: onClose,
    });
  };

  /* прев'ю слідує за курсором */
  useEffect(() => {
    const el = previewRef.current;
    gsap.set(el, { x: -999, y: -999, opacity: 0 });
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' });

    const move = (e) => {
      const flip = e.clientX + 28 + PREVIEW_W > window.innerWidth;
      xTo(flip ? e.clientX - PREVIEW_W - 28 : e.clientX + 28);
      yTo(Math.min(e.clientY + 20, window.innerHeight - 380));
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    gsap.to(previewRef.current, { opacity: hover ? 1 : 0, duration: 0.25, overwrite: 'auto' });
  }, [hover]);

  /* зміна послуги: фон + прев'ю */
  useEffect(() => {
    const root = rootRef.current;
    const key = current?.bg ?? 'idle';

    gsap.to(root.querySelectorAll('[data-bg]'), {
      opacity: (_, el) => (el.dataset.bg === key ? 1 : 0),
      duration: 0.6,
      overwrite: true,
    });

    if (key === 'blueprint') {
      gsap.fromTo(
        root.querySelectorAll('.bp-line'),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.6, stagger: 0.05, ease: 'power2.out' }
      );
    }
    if (key === 'covers') {
      gsap.fromTo(
        root.querySelectorAll('[data-tile]'),
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 0.55, duration: 0.5, stagger: { each: 0.03, from: 'random' } }
      );
    }
    if (current && mediaRef.current) {
      gsap.fromTo(
        mediaRef.current,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9000] overflow-y-auto bg-black text-neutral-400"
      style={{ fontFamily: 'Futura, "Futura PT", sans-serif' }}
    >
      {/* фони */}
      <div className="pointer-events-none fixed inset-0">
        {Object.entries(BACKGROUNDS).map(([key, Bg]) => (
          <div key={key} data-bg={key} className="absolute inset-0" style={{ opacity: key === 'idle' ? 1 : 0 }}>
            <Bg />
          </div>
        ))}
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-[1500px] grid-cols-1 gap-10 px-6 py-8 md:grid-cols-[1.6fr_1fr] md:px-12">
        {/* ліва частина: треклист */}
        <div className="flex flex-col justify-between">
          <header data-fade className="flex items-center justify-between text-sm">
            <button onClick={close} className="text-neutral-500 transition-colors hover:text-neutral-100 focus-visible:text-neutral-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-neutral-500">
              ← назад
            </button>
            <span>{BRAND}</span>
          </header>

          <ul className="my-12 flex flex-col" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            {SERVICES.map((s, i) => (
              <li key={s.id}>
                {i === 4 && <div data-fade className="mb-2 mt-6 text-sm text-neutral-600">Side B</div>}
                {i === 0 && <div data-fade className="mb-2 text-sm text-neutral-600">Side A</div>}
                <button
                  onMouseEnter={() => setActive(s.id)}
                  onFocus={() => setActive(s.id)}
                  onClick={() => setActive(s.id)}
                  className={`flex w-full items-baseline gap-5 border-t border-neutral-900 py-3 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-neutral-500 ${
                    active === s.id ? 'text-neutral-100' : 'text-neutral-500'
                  }`}
                >
                  <span className="w-8 shrink-0 text-sm text-neutral-600">{s.side}</span>
                  <span className="overflow-hidden">
                    <span data-row className="block text-[clamp(1.5rem,3.4vw,3.2rem)] font-medium leading-[1.1]">
                      {s.title}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* опис активної послуги */}
          <div data-fade className="min-h-[7rem] max-w-md text-base leading-relaxed">
            <p key={active} className="text-neutral-300">{panel.text}</p>
            {current?.links && (
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {current.links.map((l) => (
                  <a key={l.href} href={l.href} className="text-neutral-100 underline underline-offset-4 hover:text-neutral-400">
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* права частина: модель + дрібний друк */}
        <aside className="flex flex-col justify-between">
          <div className="h-[46vh] min-h-[320px] w-full">
            <Canvas camera={{ position: [0, 1.4, 4.2], fov: 35 }} dpr={[1, 2]}>
              <Suspense fallback={null}>
                <SkateparkModel url="/models/skatepark.glb" />
              </Suspense>
            </Canvas>
          </div>

          <div data-fade className="flex items-end justify-between gap-6 text-xs text-neutral-600">
            <div className="space-y-1">
              <p>Cat. no. SKT-001</p>
              <p>Розробка · виробництво · івенти</p>
              <p>© {new Date().getFullYear()} {BRAND}</p>
            </div>
            <div
              aria-hidden
              className="h-12 w-28 shrink-0"
              style={{
                background:
                  'repeating-linear-gradient(90deg,#737373 0 2px,transparent 2px 5px,#737373 5px 6px,transparent 6px 10px)',
              }}
            />
          </div>
        </aside>
      </div>

      {/* прев'ю біля курсору */}
      <div
        ref={previewRef}
        className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
        style={{ width: PREVIEW_W }}
      >
        {current && (
          <div key={current.id}>
            <div ref={mediaRef} className="aspect-[4/5] w-full overflow-hidden bg-neutral-900 ring-1 ring-neutral-700">
              {current.media.type === 'video' ? (
                <video src={current.media.src} autoPlay muted loop playsInline className="h-full w-full object-cover" />
              ) : (
                <img src={current.media.src} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <p className="mt-2 text-xs text-neutral-300">{current.caption}</p>
          </div>
        )}
      </div>
    </div>
  );
}


// import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
// import gsap from "gsap";

// /**
//  * Страница услуг в виде задней обложки альбома.
//  * Требования: react, gsap, tailwindcss. Шрифт Futura подключён у вас глобально.
//  *
//  * Медиа: положите файлы в /public/media и впишите пути в TRACKS.
//  * Если src не указан или файл не найден, показывается чертёжная сетка-заглушка.
//  */

// const TRACKS = [
//   {
//     title: "Розробка та виробництво скейтпарків",
//     tag: "проєкт",
//     text: "Проектуємо парк під вашу ділянку і людей, які будуть на ньому кататись. Виготовляємо елементи самі: від рельєфу до рейлів.",
//     media: { type: "image", src: "/media/build.jpg" },
//   },
//   {
//     title: "Під ключ",
//     tag: "від нуля",
//     text: "Одна команда веде все: проєкт, основа, монтаж, фініш. Ви приходите на відкриття, а не на будмайданчик.",
//     media: { type: "video", src: "/media/turnkey.mp4" },
//   },
//   {
//     title: "Івенти",
//     tag: "наживо",
//     text: "Контести, джами, покази, майстер-класи. Ставимо трасу, світло і правила, щоб день пройшов без зупинок.",
//     media: { type: "image", src: "/media/events.jpg" },
//   },
//   {
//     title: "DIY",
//     tag: "своїми руками",
//     text: "Допомагаємо зібрати спот самостійно: креслення, матеріали, поради по бетону і дереву, виїзд на консультацію.",
//     media: { type: "image", src: "/media/diy.jpg" },
//   },
//   {
//     title: "Контакти",
//     tag: "на зв’язок",
//     text: "Напишіть, що у вас є: ділянка, ідея або просто бажання. Відповімо і підкажемо, з чого почати.",
//     media: { type: "image", src: "/media/contact.jpg" },
//   },
// ];

// const CONTACTS = [
//   { label: "пошта", value: "hello@yourpark.ua", href: "mailto:hello@yourpark.ua" },
//   { label: "телефон", value: "+380 00 000 00 00", href: "tel:+380000000000" },
//   { label: "instagram", value: "@yourpark", href: "https://instagram.com/yourpark" },
// ];

// const font = { fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' };

// /* Штрихкод: детерминированный, чтобы не прыгал между рендерами */
// function Barcode() {
//   const bars = useMemo(() => {
//     let seed = 7;
//     const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
//     return Array.from({ length: 46 }, () => ({
//       w: 1 + Math.round(rnd() * 3),
//       gap: 1 + Math.round(rnd() * 2),
//     }));
//   }, []);
//   return (
//     <div className="flex h-12 items-stretch" aria-hidden="true">
//       {bars.map((b, i) => (
//         <span
//           key={i}
//           className="bg-neutral-500"
//           style={{ width: b.w, marginRight: b.gap }}
//         />
//       ))}
//     </div>
//   );
// }

// /* Заглушка: план парка в виде сетки */
// function Placeholder({ n }) {
//   return (
//     <div
//       className="relative h-full w-full bg-neutral-950"
//       style={{
//         backgroundImage:
//           "linear-gradient(#3a3a3a 1px, transparent 1px), linear-gradient(90deg, #3a3a3a 1px, transparent 1px)",
//         backgroundSize: "20px 20px",
//       }}
//     >
//       <span className="absolute bottom-2 left-3 text-5xl text-neutral-600">
//         {String(n).padStart(2, "0")}
//       </span>
//     </div>
//   );
// }

// function Media({ media, n }) {
//   const [failed, setFailed] = useState(!media?.src);
//   if (failed) return <Placeholder n={n} />;
//   if (media.type === "video") {
//     return (
//       <video
//         src={media.src}
//         autoPlay
//         muted
//         loop
//         playsInline
//         onError={() => setFailed(true)}
//         className="h-full w-full object-cover"
//       />
//     );
//   }
//   return (
//     <img
//       src={media.src}
//       alt=""
//       onError={() => setFailed(true)}
//       className="h-full w-full object-cover grayscale"
//     />
//   );
// }

// export default function BackCover() {
//   const root = useRef(null);
//   const ticker = useRef(null);
//   const card = useRef(null);
//   const moveX = useRef(null);
//   const moveY = useRef(null);
//   const [active, setActive] = useState(null);
//   const [coarse, setCoarse] = useState(false);

//   useEffect(() => {
//     setCoarse(window.matchMedia("(pointer: coarse)").matches);
//   }, []);

//   /* Вход: бегущая строка предыдущей страницы продолжается сверху,
//      затем строки треклиста выезжают из-под линии */
//   useLayoutEffect(() => {
//     const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//     const ctx = gsap.context(() => {
//       if (reduce) return;

//       gsap.set(ticker.current, { xPercent: 0 });
//       gsap.to(ticker.current, {
//         xPercent: -50,
//         duration: 28,
//         ease: "none",
//         repeat: -1,
//       });

//       const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
//       tl.from("[data-line]", {
//         scaleX: 0,
//         transformOrigin: "left center",
//         duration: 1,
//         stagger: 0.06,
//       })
//         .from(
//           "[data-row-inner]",
//           { yPercent: 110, duration: 0.9, stagger: 0.09 },
//           0.2
//         )
//         .from("[data-meta]", { opacity: 0, duration: 0.8, stagger: 0.05 }, 0.7);
//     }, root);
//     return () => ctx.revert();
//   }, []);

//   /* Карточка у курсора */
//   useEffect(() => {
//     if (coarse) return;
//     gsap.set(card.current, { xPercent: 0, yPercent: 0, x: 0, y: 0 });
//     moveX.current = gsap.quickTo(card.current, "x", { duration: 0.45, ease: "power3" });
//     moveY.current = gsap.quickTo(card.current, "y", { duration: 0.45, ease: "power3" });

//     const onMove = (e) => {
//       const w = card.current.offsetWidth;
//       const h = card.current.offsetHeight;
//       let x = e.clientX + 28;
//       let y = e.clientY - h / 2;
//       if (x + w > window.innerWidth - 16) x = e.clientX - w - 28;
//       y = Math.max(16, Math.min(y, window.innerHeight - h - 16));
//       moveX.current(x);
//       moveY.current(y);
//     };
//     window.addEventListener("pointermove", onMove);
//     return () => window.removeEventListener("pointermove", onMove);
//   }, [coarse]);

//   useEffect(() => {
//     if (coarse || !card.current) return;
//     if (active === null) {
//       gsap.to(card.current, { autoAlpha: 0, scale: 0.92, duration: 0.2, ease: "power2.in" });
//     } else {
//       gsap.to(card.current, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(1.6)" });
//       gsap.fromTo(
//         "[data-card-media]",
//         { clipPath: "inset(0 100% 0 0)" },
//         { clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "power3.out" }
//       );
//     }
//   }, [active, coarse]);

//   const t = active !== null ? TRACKS[active] : null;

//   return (
//     <main
//       ref={root}
//       style={font}
//       className="relative min-h-screen overflow-hidden bg-black text-neutral-400 selection:bg-neutral-300 selection:text-black"
//     >
//       {/* Продолжение бегущей строки */}
//       <div className="border-b border-neutral-800 py-2 text-sm text-neutral-600" aria-hidden="true">
//         <div ref={ticker} className="flex w-max whitespace-nowrap">
//           {[0, 1].map((k) => (
//             <span key={k} className="pr-8">
//               {Array.from({ length: 8 }, () => "скейтпарки під ключ  /  ").join("")}
//             </span>
//           ))}
//         </div>
//       </div>

//       <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-10 md:grid-cols-[1fr_2.2fr] md:gap-16 md:pt-16">
//         {/* Левая колонка: как «служебная» сторона обложки */}
//         <aside className="flex flex-col justify-between gap-12 md:min-h-[70vh]">
//           <div>
//             <h1 className="text-3xl font-medium leading-tight text-neutral-300 md:text-4xl">
//               Сторона Б
//             </h1>
//             <p className="mt-3 max-w-[22ch] text-sm leading-relaxed text-neutral-500">
//               Те, хто катається, знають: найцікавіше завжди на звороті.
//             </p>
//           </div>

//           <div className="hidden md:block">
//             <ul className="space-y-1 text-sm">
//               {CONTACTS.map((c) => (
//                 <li key={c.label} className="flex gap-3">
//                   <span className="w-20 text-neutral-600">{c.label}</span>
//                   <a
//                     href={c.href}
//                     className="text-neutral-400 underline decoration-neutral-700 underline-offset-4 transition-colors hover:text-neutral-100 focus-visible:text-neutral-100 focus-visible:outline-none"
//                   >
//                     {c.value}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </aside>

//         {/* Треклист */}
//         <section aria-label="Послуги">
//           <ol onMouseLeave={() => setActive(null)}>
//             {TRACKS.map((tr, i) => {
//               const isActive = active === i;
//               const dim = active !== null && !isActive;
//               return (
//                 <li key={tr.title}>
//                   <div data-line className="h-px w-full bg-neutral-800" />
//                   <button
//                     type="button"
//                     onMouseEnter={() => setActive(i)}
//                     onFocus={() => setActive(i)}
//                     onBlur={() => setActive(null)}
//                     onClick={() => coarse && setActive(isActive ? null : i)}
//                     aria-expanded={isActive}
//                     className="group block w-full py-5 text-left focus-visible:outline-none"
//                   >
//                     <span className="block overflow-hidden">
//                       <span
//                         data-row-inner
//                         className={`flex items-baseline gap-4 transition-colors duration-300 md:gap-6 ${
//                           isActive
//                             ? "text-neutral-100"
//                             : dim
//                             ? "text-neutral-700"
//                             : "text-neutral-400"
//                         }`}
//                       >
//                         <span className="w-8 shrink-0 text-sm tabular-nums">
//                           {String(i + 1).padStart(2, "0")}
//                         </span>
//                         <span className="text-2xl font-medium leading-tight md:text-4xl">
//                           {tr.title}
//                         </span>
//                         <span
//                           data-meta
//                           className="ml-auto hidden shrink-0 text-sm sm:block"
//                         >
//                           {tr.tag}
//                         </span>
//                       </span>
//                     </span>

//                     {/* Мобильный вариант: раскрытие внутри строки */}
//                     {coarse && (
//                       <span
//                         className={`grid transition-all duration-500 ${
//                           isActive ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
//                         }`}
//                       >
//                         <span className="overflow-hidden">
//                           <span className="block aspect-[4/3] w-full overflow-hidden">
//                             {isActive && <Media media={tr.media} n={i + 1} />}
//                           </span>
//                           <span className="mt-3 block text-sm leading-relaxed text-neutral-400">
//                             {tr.text}
//                           </span>
//                         </span>
//                       </span>
//                     )}
//                   </button>
//                 </li>
//               );
//             })}
//             <li>
//               <div data-line className="h-px w-full bg-neutral-800" />
//             </li>
//           </ol>

//           {/* Контакты для мобильных */}
//           <ul className="mt-10 space-y-1 text-sm md:hidden">
//             {CONTACTS.map((c) => (
//               <li key={c.label} className="flex gap-3">
//                 <span className="w-20 text-neutral-600">{c.label}</span>
//                 <a href={c.href} className="text-neutral-400 underline decoration-neutral-700 underline-offset-4">
//                   {c.value}
//                 </a>
//               </li>
//             ))}
//           </ul>

//           {/* Выходные данные, как на обороте пластинки */}
//           <div className="mt-14 flex items-end justify-between gap-6">
//             <p className="max-w-[34ch] text-xs leading-relaxed text-neutral-600">
//               Записано на бетоні, дереві й металі. Жодна дошка не постраждала під час виробництва.
//             </p>
//             <Barcode />
//           </div>
//         </section>
//       </div>

//       {/* Карточка, що йде за курсором (десктоп) */}
//       {!coarse && (
//         <div
//           ref={card}
//           aria-hidden="true"
//           className="pointer-events-none invisible fixed left-0 top-0 z-50 w-[320px] opacity-0"
//           style={{ ...font, transform: "scale(0.92)" }}
//         >
//           <div className="border border-neutral-700 bg-black p-2">
//             <div data-card-media className="aspect-[4/3] w-full overflow-hidden">
//               {t && <Media key={active} media={t.media} n={active + 1} />}
//             </div>
//             <p className="px-1 pb-2 pt-3 text-sm leading-relaxed text-neutral-300">
//               {t?.text}
//             </p>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }


// import { useEffect, useRef, useState } from "react";
// import gsap from "gsap";


// const services = [
//   {
//     id: "01",
//     title: "DESIGN / PRODUCTION",
//     subtitle: "Розробка та виробництво скейтпарків",
//     description:
//       "Від першого ескізу до створення простору для катання.000",
//     tag: "ENGINEERING · DESIGN · BUILD",
//     image: "/images/blueprint.webp",
//     background: "#171914",
//   },
//   {
//     id: "02",
//     title: "TURNKEY",
//     subtitle: "Скейтпарки під ключ",
//     description:
//       "Повний цикл реалізації — від ідеї до готового скейтпарку.",
//     tag: "CONCEPT TO REALITY",
//     image: "/images/skatepark.webp",
//     background: "#20211e",
//   },
//   {
//     id: "03",
//     title: "EVENTS",
//     subtitle: "Івенти та скейт-культура",
//     description:
//       "Події, які об'єднують райдерів, простори та ком'юніті.",
//     tag: "PEOPLE · CULTURE · ACTION",
//     image: "/images/events.webp",
//     background: "#211e1c",
//   },
//   {
//     id: "04",
//     title: "DIY",
//     subtitle: "Зроби сам",
//     description:
//       "Будівництво, експерименти та культура створення власноруч.",
//     tag: "DO IT YOURSELF",
//     image: "/images/diy.webp",
//     background: "#191e20",
//   },
// ];

// export default function ServicesPage() {
//   const root = useRef(null);
//   const preview = useRef(null);
//   const [active, setActive] = useState(0);

//   const service = services[active];

//  useEffect(() => {
//   const ctx = gsap.context(() => {
//     const tl = gsap.timeline({ delay: 0.15 });

//     tl.from(".album-top", {
//       opacity: 0,
//       y: -10,
//       duration: 0.5,
//     })
//       .from(".album-heading", {
//         opacity: 0,
//         y: 35,
//         duration: 0.7,
//         ease: "power3.out",
//       }, "-=0.2")
//       .from(".service-row", {
//         opacity: 0,
//         x: -20,
//         stagger: 0.1,
//         duration: 0.55,
//       }, "-=0.3")
//       .from(".album-bottom", {
//         opacity: 0,
//         duration: 0.5,
//       }, "-=0.1");
//   }, root);

//   return () => ctx.revert();
// }, []);

// useEffect(() => {
//   if (!root.current || !preview.current) return;

//   const ctx = gsap.context(() => {
//     gsap.fromTo(
//       preview.current,
//       { opacity: 0, scale: 0.94, rotate: -3 },
//       {
//         opacity: 1,
//         scale: 1,
//         rotate: 0,
//         duration: 0.45,
//         ease: "power3.out",
//       }
//     );

//     gsap.to(root.current, {
//       backgroundColor: service.background,
//       duration: 0.7,
//       ease: "power2.inOut",
//     });
//   }, root);

//   return () => ctx.revert();
// }, [active]); 

//   function movePreview(event) {
//     if (window.matchMedia("(hover: none)").matches) return;

//     gsap.to(preview.current, {
//       x: event.clientX + 24,
//       y: event.clientY - 100,
//       duration: 0.5,
//       ease: "power3.out",
//       overwrite: "auto",
//     });
//   }

//   return (
//     <main
//       ref={root}
//       className="relative min-h-screen overflow-hidden
//         bg-[#171914] px-5 py-6 text-[#efeee8]
//         md:px-12 md:py-9"
//     >
//       {/* HEADER */}
//       <header className="album-top relative z-10 flex
//         justify-between gap-3 text-[9px] uppercase
//         tracking-[0.16em] md:text-[11px]">
//         <span>SIDE B / SERVICES</span>
//         <span className="hidden sm:block">
//           INDEPENDENT SKATE CULTURE
//         </span>
//         <span>001—004</span>
//       </header>

//       {/* TITLE */}
//       <section className="relative z-10 mt-[11vh]">
//         <div className="album-heading mb-9 flex
//           items-end justify-between gap-4 md:mb-12">
//           <div>
//             <p className="mb-4 text-[10px] uppercase
//               tracking-[0.22em] text-[#c7ff45]">
//               A CATALOGUE OF THINGS WE DO
//             </p>

//             <h1 className="text-[clamp(3.5rem,11vw,9rem)]
//               leading-[0.76] tracking-[-0.085em]">
//               SIDE
//               <br />
//               <span className="text-[#c7ff45]">B.</span>
//             </h1>
//           </div>

//           <div className="hidden max-w-[170px] text-right
//             text-[10px] leading-5 tracking-wider md:block">
//             SKATEPARKS
//             <br />
//             DESIGN & PRODUCTION
//             <br />
//             EVENTS / DIY
//           </div>
//         </div>

//         {/* TRACKLIST */}
//         <div className="max-w-5xl border-t border-white/30">
//           {services.map((item, index) => (
//             <button
//               key={item.id}
//               type="button"
//               onMouseEnter={() => setActive(index)}
//               onMouseMove={movePreview}
//               onFocus={() => setActive(index)}
//               onClick={() => setActive(index)}
//               className="service-row group flex w-full
//                 items-center gap-4 border-b border-white/30
//                 py-5 text-left md:gap-8 md:py-6"
//             >
//               <span className="w-6 shrink-0 text-[11px]
//                 text-[#c7ff45]">
//                 {item.id}
//               </span>

//               <span className="min-w-0 flex-1">
//                 <span className="block text-[clamp(1.2rem,4vw,3rem)]
//                   leading-none tracking-[-0.055em]
//                   transition-transform duration-300
//                   group-hover:translate-x-2">
//                   {item.title}
//                 </span>

//                 <span className="mt-2 block text-[10px]
//                   leading-4 text-white/55 md:text-xs">
//                   {item.subtitle}
//                 </span>
//               </span>

//               <span className="shrink-0 text-lg
//                 transition-transform duration-300
//                 group-hover:-translate-y-1
//                 group-hover:translate-x-1">
//                 ↗
//               </span>
//             </button>
//           ))}
//         </div>

//         {/* ACTIVE SERVICE */}
//         <div className="mt-8 grid grid-cols-1 gap-6
//           md:grid-cols-2 md:gap-12">
//           <div>
//             <p className="text-[10px] tracking-[0.18em]
//               text-[#c7ff45]">
//               NOW PLAYING / {service.id}
//             </p>

//             <h2 className="mt-4 text-2xl
//               tracking-[-0.055em] md:text-4xl">
//               {service.title}
//             </h2>

//             <p className="mt-3 max-w-md text-sm
//               leading-6 text-white/65">
//               {service.description}
//             </p>
//           </div>

//           <div className="flex items-end md:justify-end">
//             <a
//               href="/contact"
//               className="inline-flex border border-white/40
//                 px-5 py-4 text-[10px] uppercase
//                 tracking-[0.16em] transition-colors
//                 hover:border-[#c7ff45] hover:bg-[#c7ff45]
//                 hover:text-black"
//             >
//               LET'S BUILD SOMETHING ↗
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* CURSOR PREVIEW */}
//       <div
//         ref={preview}
//         aria-hidden="true"
//         className="pointer-events-none fixed left-0 top-0
//           z-20 hidden w-[220px] opacity-0 md:block
//           lg:w-[280px]"
//       >
//         <div className="relative overflow-hidden
//           border border-white/20 bg-black">
//           <img
//             key={service.image}
//             src={service.image}
//             alt=""
//             className="aspect-[4/5] w-full object-cover
//               grayscale transition duration-500"
//             onError={(event) => {
//               event.currentTarget.style.visibility = "hidden";
//             }}
//           />

//           <div className="absolute inset-x-0 bottom-0
//             bg-black/70 p-3 text-[9px] tracking-widest">
//             {service.tag}
//           </div>
//         </div>
//       </div>

//       {/* FOOTER */}
//       <footer className="album-bottom relative z-10 mt-16
//         flex flex-wrap justify-between gap-3
//         border-t border-white/30 pt-4
//         text-[9px] uppercase tracking-[0.15em]">
//         <span>DESIGNED TO BE BUILT</span>
//         <span>INDEPENDENT BY NATURE</span>
//         <span>SIDE B — END</span>
//       </footer>
//     </main>
//   );
// }
