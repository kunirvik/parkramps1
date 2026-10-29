import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

/* ------------------------------------------------------------------ */
/*  1. КОНТЕНТ — меняй тут                                              */
/*  media: type "image" | "video", src — путь к твоему файлу.            */
/*  Если файла нет, показывается цветная заглушка.                      */
/* ------------------------------------------------------------------ */
const SERVICES = [
  {
    id: "A1",
    title: "Розробка та виробництво скейтпаркiв",
    accent: "#ff4d1c",
    text: "Проєктуємо парк під ваш майданчик і рівень райдерів, потім робимо елементи у власному виробництві: рейли, бокси, рампи, квотерпайпи.",
    points: ["Проєкт та 3D-візуалізація", "Метал, фанера, бетон", "Монтаж і гарантія"],
    media: [
      { type: "video", src: "/media/park-1.mp4" },
      { type: "image", src: "/media/park-2.jpg" },
      { type: "image", src: "/media/park-3.jpg" },
      { type: "video", src: "/media/park-4.mp4" },
    ],
  },
  {
    id: "A2",
    title: "Під ключ",
    accent: "#ffd400",
    text: "Береме на себе весь шлях: від ідеї та погодження до відкриття. Одна команда, один кошторис, чіткі терміни.",
    points: ["Підготовка майданчика", "Покриття та освітлення", "Здача об'єкта"],
    media: [
      { type: "image", src: "/media/key-1.jpg" },
      { type: "video", src: "/media/key-2.mp4" },
      { type: "image", src: "/media/key-3.jpg" },
      { type: "image", src: "/media/key-4.jpg" },
    ],
  },
  {
    id: "A3",
    title: "Івенти",
    accent: "#ff2e93",
    text: "Контести, джами, відкриття парків, шоу-програми. Збираємо райдерів, ставимо тимчасові модулі та організовуємо все від A до Я.",
    points: ["Контести та джами", "Тимчасові модулі", "Звук, ведучі, медіа"],
    media: [
      { type: "video", src: "/media/event-1.mp4" },
      { type: "image", src: "/media/event-2.jpg" },
      { type: "video", src: "/media/event-3.mp4" },
      { type: "image", src: "/media/event-4.jpg" },
    ],
  },
  {
    id: "B1",
    title: "DIY",
    accent: "#27e1ff",
    text: "Будуємо разом із комʼюніті: майданчики своїми руками, воркшопи, матеріали та креслення для тих, хто хоче зробити сам.",
    points: ["Воркшопи", "Креслення елементів", "Допомога з матеріалами"],
    media: [
      { type: "image", src: "/media/diy-1.jpg" },
      { type: "image", src: "/media/diy-2.jpg" },
      { type: "video", src: "/media/diy-3.mp4" },
      { type: "image", src: "/media/diy-4.jpg" },
    ],
  },
  {
    id: "B2",
    title: "Контакти",
    accent: "#b6ff3b",
    text: "Розкажіть про майданчик, місто та бюджет. Відповімо з першими ідеями та орієнтиром по вартості.",
    links: [
      { label: "+380 00 000 00 00", href: "tel:+380000000000" },
      { label: "hello@yourname.com", href: "mailto:hello@yourname.com" },
      { label: "@instagram", href: "https://instagram.com/" },
    ],
    media: [
      { type: "image", src: "/media/contact-1.jpg" },
      { type: "video", src: "/media/contact-2.mp4" },
      { type: "image", src: "/media/contact-3.jpg" },
      { type: "image", src: "/media/contact-4.jpg" },
    ],
  },
];

const BRAND = "YOUR NAME";
const FUTURA = { fontFamily: "Futura, 'Futura PT', 'Jost', sans-serif" };
const RUNNING_TEXT = "ПОСЛУГИ ✺ SKATEPARKS ✺ DIY ✺ ПОСЛУГИ ✺ SKATEPARKS ✺ DIY ✺ ";

/* ------------------------------------------------------------------ */
/*  2. БЕГУЩАЯ ЛЕНТА С ФОТО/ВИДЕО                                       */
/* ------------------------------------------------------------------ */
function Tile({ media, accent }) {
  return (
    <div
      className="relative aspect-[16/10] h-24 shrink-0 overflow-hidden md:h-32"
      style={{ background: `linear-gradient(135deg, ${accent}, #0c0c0c 90%)` }}
    >
      {media.type === "video" ? (
        <video
          src={media.src}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      ) : (
        <img
          src={media.src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}
    </div>
  );
}

function Strip({ service, reverse }) {
  const track = useRef(null);
  const loop = [...service.media, ...service.media, ...service.media, ...service.media];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      track.current,
      { xPercent: reverse ? -50 : 0 },
      { xPercent: reverse ? 0 : -50, duration: 32, ease: "none", repeat: -1 }
    );
    return () => tween.kill();
  }, [service.id, reverse]);

  return (
    <div ref={track} className="flex w-max gap-3 pl-3">
      {loop.map((m, i) => (
        <Tile key={`${service.id}-${i}`} media={m} accent={service.accent} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  3. ШТРИХКОД (декор задней обложки)                                  */
/* ------------------------------------------------------------------ */
const BARS = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 1, 3, 2, 1, 4, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 4];
function Barcode() {
  return (
    <div className="flex h-12 items-stretch gap-[2px] bg-neutral-300 px-2 py-1.5">
      {BARS.map((w, i) => (
        <span key={i} className="bg-black" style={{ width: w * 1.5 }} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  4. СТРАНИЦА                                                         */
/* ------------------------------------------------------------------ */
export default function ServicesBackCover() {
  const root = useRef(null);
  const topStrip = useRef(null);
  const botStrip = useRef(null);
  const win = useRef(null);
  const [active, setActive] = useState(null);
  const lastActive = useRef(0);
  if (active !== null) lastActive.current = active;
  const svc = SERVICES[lastActive.current];

  /* --- вход со страницы с бегущей строкой + первая раскладка --- */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(topStrip.current, { yPercent: -101 });
      gsap.set(botStrip.current, { yPercent: 101 });
      gsap.set(win.current, { autoAlpha: 0 });

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(".intro", { display: "none" });
        return;
      }

      // та же бегущая строка продолжает движение
      gsap.to(".intro-text", { xPercent: -50, duration: 6, ease: "none", repeat: -1 });
      gsap.set(".row-in", { yPercent: 110 });
      gsap.set(".meta", { autoAlpha: 0 });

      gsap
        .timeline({ delay: 0.35 })
        .to(".intro-band", { height: "100vh", duration: 0.8, ease: "power4.inOut" })
        .to(".intro-text", { autoAlpha: 0, duration: 0.2 }, "<0.4")
        .to(".intro", { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "power3.inOut" })
        .set(".intro", { display: "none" })
        .to(".row-in", { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.09 }, "-=0.35")
        .to(".meta", { autoAlpha: 1, duration: 0.6, stagger: 0.1 }, "-=0.5");

      // медленно вращающийся винил на фоне
      gsap.to(".disc", { rotation: 360, duration: 60, ease: "none", repeat: -1 });
    }, root);
    return () => ctx.revert();
  }, []);

  /* --- ленты сверху/снизу --- */
  useEffect(() => {
    const on = active !== null;
    gsap.to(topStrip.current, { yPercent: on ? 0 : -101, duration: 0.6, ease: "power3.out", overwrite: "auto" });
    gsap.to(botStrip.current, { yPercent: on ? 0 : 101, duration: 0.6, ease: "power3.out", overwrite: "auto" });
  }, [active !== null]);

  /* --- окошко с описанием --- */
  useEffect(() => {
    if (active === null) {
      gsap.to(win.current, { autoAlpha: 0, y: 12, duration: 0.25, overwrite: "auto" });
    } else {
      gsap.fromTo(
        win.current,
        { autoAlpha: 0, y: 28, rotate: 1.5 },
        { autoAlpha: 1, y: 0, rotate: 0, duration: 0.45, ease: "power3.out", overwrite: "auto" }
      );
    }
  }, [active]);

  return (
    <main
      ref={root}
      style={FUTURA}
      onMouseLeave={() => setActive(null)}
      className="relative min-h-screen overflow-hidden bg-black px-6 py-36 text-neutral-400 md:px-14 md:py-48"
    >
      {/* винил на фоне */}
      <div
        className="disc pointer-events-none absolute -right-[18vmin] top-1/2 h-[90vmin] w-[90vmin] -translate-y-1/2 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, #000 0 6%, #1b1b1b 6.5% 7%, transparent 7.5%), repeating-radial-gradient(circle, #0b0b0b 0 3px, #161616 3px 4px)",
        }}
      />

      {/* шапка обложки */}
      <header className="meta relative z-10 mb-10 flex items-end justify-between gap-6 md:mb-14">
        <div>
          <p className="text-2xl font-bold text-neutral-200 md:text-3xl">{BRAND}</p>
          <p className="mt-1 text-sm">Послуги · сторона A / B</p>
        </div>
        <p className="text-sm">33⅓ об/хв</p>
      </header>

      {/* треклист = услуги */}
      <ul className="relative z-10">
        {SERVICES.map((s, i) => {
          const isActive = active === i;
          const dim = active !== null && !isActive;
          return (
            <li key={s.id} className="overflow-hidden">
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(isActive ? null : i)}
                className="row-in group flex w-full items-baseline gap-4 py-1 text-left outline-none md:gap-8"
              >
                <span
                  className="w-8 shrink-0 text-sm font-medium transition-colors duration-300 md:w-12 md:text-lg"
                  style={{ color: isActive ? s.accent : "#525252" }}
                >
                  {s.id}
                </span>
                <span
                  className={`font-bold leading-[1.05] tracking-tight transition-colors duration-300 text-[clamp(1.9rem,5.6vw,5.2rem)] ${
                    isActive ? "text-white" : dim ? "text-neutral-700" : "text-neutral-500"
                  }`}
                >
                  {s.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* низ обложки */}
      <footer className="meta relative z-10 mt-12 flex items-end justify-between gap-6 text-xs md:mt-16">
        <p className="max-w-[16rem] leading-relaxed">
          Записано на майданчиках України. Усі права на ролики та рампи захищені.
        </p>
        <Barcode />
      </footer>

      {/* верхняя и нижняя ленты */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 overflow-hidden">
        <div ref={topStrip} className="py-3">
          <Strip service={svc} />
        </div>
      </div>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 overflow-hidden">
        <div ref={botStrip} className="py-3">
          <Strip service={svc} reverse />
        </div>
      </div>

      {/* окошко с объяснением */}
      <div className="pointer-events-none fixed inset-x-4 bottom-36 z-30 md:inset-x-auto md:bottom-auto md:right-14 md:top-1/2 md:w-[22rem] md:-translate-y-1/2">
        <div
          ref={win}
          className="pointer-events-auto border border-neutral-800 bg-neutral-950/95 shadow-2xl backdrop-blur"
        >
          <div className="h-1.5 w-full" style={{ background: svc.accent }} />
          <div className="p-5 md:p-6">
            <p className="mb-2 text-xl font-bold text-white md:text-2xl">{svc.title}</p>
            <p className="text-sm leading-relaxed text-neutral-400">{svc.text}</p>

            {svc.points && (
              <ul className="mt-4 space-y-1.5 text-sm text-neutral-300">
                {svc.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0" style={{ background: svc.accent }} />
                    {p}
                  </li>
                ))}
              </ul>
            )}

            {svc.links && (
              <ul className="mt-4 space-y-2">
                {svc.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="text-lg font-bold text-white underline decoration-2 underline-offset-4 transition-colors hover:text-neutral-300"
                      style={{ textDecorationColor: svc.accent }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* оверлей перехода: продолжение бегущей строки с прошлой страницы */}
      <div className="intro fixed inset-0 z-50 flex items-center bg-transparent" style={{ clipPath: "inset(0 0 0% 0)" }}>
        <div className="intro-band flex h-16 w-full items-center overflow-hidden bg-[#ff4d1c]">
          <div className="intro-text flex w-max whitespace-nowrap text-3xl font-bold text-black">
            <span>{RUNNING_TEXT.repeat(4)}</span>
            <span>{RUNNING_TEXT.repeat(4)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}