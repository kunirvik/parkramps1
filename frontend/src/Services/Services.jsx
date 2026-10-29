import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Страница услуг в виде задней обложки альбома.
 * Требования: react, gsap, tailwindcss. Шрифт Futura подключён у вас глобально.
 *
 * Медиа: положите файлы в /public/media и впишите пути в TRACKS.
 * Если src не указан или файл не найден, показывается чертёжная сетка-заглушка.
 */

const TRACKS = [
  {
    title: "Розробка та виробництво скейтпарків",
    tag: "проєкт",
    text: "Проектуємо парк під вашу ділянку і людей, які будуть на ньому кататись. Виготовляємо елементи самі: від рельєфу до рейлів.",
    media: { type: "image", src: "/media/build.jpg" },
  },
  {
    title: "Під ключ",
    tag: "від нуля",
    text: "Одна команда веде все: проєкт, основа, монтаж, фініш. Ви приходите на відкриття, а не на будмайданчик.",
    media: { type: "video", src: "/media/turnkey.mp4" },
  },
  {
    title: "Івенти",
    tag: "наживо",
    text: "Контести, джами, покази, майстер-класи. Ставимо трасу, світло і правила, щоб день пройшов без зупинок.",
    media: { type: "image", src: "/media/events.jpg" },
  },
  {
    title: "DIY",
    tag: "своїми руками",
    text: "Допомагаємо зібрати спот самостійно: креслення, матеріали, поради по бетону і дереву, виїзд на консультацію.",
    media: { type: "image", src: "/media/diy.jpg" },
  },
  {
    title: "Контакти",
    tag: "на зв’язок",
    text: "Напишіть, що у вас є: ділянка, ідея або просто бажання. Відповімо і підкажемо, з чого почати.",
    media: { type: "image", src: "/media/contact.jpg" },
  },
];

const CONTACTS = [
  { label: "пошта", value: "hello@yourpark.ua", href: "mailto:hello@yourpark.ua" },
  { label: "телефон", value: "+380 00 000 00 00", href: "tel:+380000000000" },
  { label: "instagram", value: "@yourpark", href: "https://instagram.com/yourpark" },
];

const font = { fontFamily: 'Futura, "Futura PT", "Century Gothic", sans-serif' };

/* Штрихкод: детерминированный, чтобы не прыгал между рендерами */
function Barcode() {
  const bars = useMemo(() => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: 46 }, () => ({
      w: 1 + Math.round(rnd() * 3),
      gap: 1 + Math.round(rnd() * 2),
    }));
  }, []);
  return (
    <div className="flex h-12 items-stretch" aria-hidden="true">
      {bars.map((b, i) => (
        <span
          key={i}
          className="bg-neutral-500"
          style={{ width: b.w, marginRight: b.gap }}
        />
      ))}
    </div>
  );
}

/* Заглушка: план парка в виде сетки */
function Placeholder({ n }) {
  return (
    <div
      className="relative h-full w-full bg-neutral-950"
      style={{
        backgroundImage:
          "linear-gradient(#3a3a3a 1px, transparent 1px), linear-gradient(90deg, #3a3a3a 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <span className="absolute bottom-2 left-3 text-5xl text-neutral-600">
        {String(n).padStart(2, "0")}
      </span>
    </div>
  );
}

function Media({ media, n }) {
  const [failed, setFailed] = useState(!media?.src);
  if (failed) return <Placeholder n={n} />;
  if (media.type === "video") {
    return (
      <video
        src={media.src}
        autoPlay
        muted
        loop
        playsInline
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <img
      src={media.src}
      alt=""
      onError={() => setFailed(true)}
      className="h-full w-full object-cover grayscale"
    />
  );
}

export default function BackCover() {
  const root = useRef(null);
  const ticker = useRef(null);
  const card = useRef(null);
  const moveX = useRef(null);
  const moveY = useRef(null);
  const [active, setActive] = useState(null);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  /* Вход: бегущая строка предыдущей страницы продолжается сверху,
     затем строки треклиста выезжают из-под линии */
  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) return;

      gsap.set(ticker.current, { xPercent: 0 });
      gsap.to(ticker.current, {
        xPercent: -50,
        duration: 28,
        ease: "none",
        repeat: -1,
      });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from("[data-line]", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1,
        stagger: 0.06,
      })
        .from(
          "[data-row-inner]",
          { yPercent: 110, duration: 0.9, stagger: 0.09 },
          0.2
        )
        .from("[data-meta]", { opacity: 0, duration: 0.8, stagger: 0.05 }, 0.7);
    }, root);
    return () => ctx.revert();
  }, []);

  /* Карточка у курсора */
  useEffect(() => {
    if (coarse) return;
    gsap.set(card.current, { xPercent: 0, yPercent: 0, x: 0, y: 0 });
    moveX.current = gsap.quickTo(card.current, "x", { duration: 0.45, ease: "power3" });
    moveY.current = gsap.quickTo(card.current, "y", { duration: 0.45, ease: "power3" });

    const onMove = (e) => {
      const w = card.current.offsetWidth;
      const h = card.current.offsetHeight;
      let x = e.clientX + 28;
      let y = e.clientY - h / 2;
      if (x + w > window.innerWidth - 16) x = e.clientX - w - 28;
      y = Math.max(16, Math.min(y, window.innerHeight - h - 16));
      moveX.current(x);
      moveY.current(y);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [coarse]);

  useEffect(() => {
    if (coarse || !card.current) return;
    if (active === null) {
      gsap.to(card.current, { autoAlpha: 0, scale: 0.92, duration: 0.2, ease: "power2.in" });
    } else {
      gsap.to(card.current, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(1.6)" });
      gsap.fromTo(
        "[data-card-media]",
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "power3.out" }
      );
    }
  }, [active, coarse]);

  const t = active !== null ? TRACKS[active] : null;

  return (
    <main
      ref={root}
      style={font}
      className="relative min-h-screen overflow-hidden bg-black text-neutral-400 selection:bg-neutral-300 selection:text-black"
    >
      {/* Продолжение бегущей строки */}
      <div className="border-b border-neutral-800 py-2 text-sm text-neutral-600" aria-hidden="true">
        <div ref={ticker} className="flex w-max whitespace-nowrap">
          {[0, 1].map((k) => (
            <span key={k} className="pr-8">
              {Array.from({ length: 8 }, () => "скейтпарки під ключ  /  ").join("")}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-10 md:grid-cols-[1fr_2.2fr] md:gap-16 md:pt-16">
        {/* Левая колонка: как «служебная» сторона обложки */}
        <aside className="flex flex-col justify-between gap-12 md:min-h-[70vh]">
          <div>
            <h1 className="text-3xl font-medium leading-tight text-neutral-300 md:text-4xl">
              Сторона Б
            </h1>
            <p className="mt-3 max-w-[22ch] text-sm leading-relaxed text-neutral-500">
              Те, хто катається, знають: найцікавіше завжди на звороті.
            </p>
          </div>

          <div className="hidden md:block">
            <ul className="space-y-1 text-sm">
              {CONTACTS.map((c) => (
                <li key={c.label} className="flex gap-3">
                  <span className="w-20 text-neutral-600">{c.label}</span>
                  <a
                    href={c.href}
                    className="text-neutral-400 underline decoration-neutral-700 underline-offset-4 transition-colors hover:text-neutral-100 focus-visible:text-neutral-100 focus-visible:outline-none"
                  >
                    {c.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Треклист */}
        <section aria-label="Послуги">
          <ol onMouseLeave={() => setActive(null)}>
            {TRACKS.map((tr, i) => {
              const isActive = active === i;
              const dim = active !== null && !isActive;
              return (
                <li key={tr.title}>
                  <div data-line className="h-px w-full bg-neutral-800" />
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    onClick={() => coarse && setActive(isActive ? null : i)}
                    aria-expanded={isActive}
                    className="group block w-full py-5 text-left focus-visible:outline-none"
                  >
                    <span className="block overflow-hidden">
                      <span
                        data-row-inner
                        className={`flex items-baseline gap-4 transition-colors duration-300 md:gap-6 ${
                          isActive
                            ? "text-neutral-100"
                            : dim
                            ? "text-neutral-700"
                            : "text-neutral-400"
                        }`}
                      >
                        <span className="w-8 shrink-0 text-sm tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-2xl font-medium leading-tight md:text-4xl">
                          {tr.title}
                        </span>
                        <span
                          data-meta
                          className="ml-auto hidden shrink-0 text-sm sm:block"
                        >
                          {tr.tag}
                        </span>
                      </span>
                    </span>

                    {/* Мобильный вариант: раскрытие внутри строки */}
                    {coarse && (
                      <span
                        className={`grid transition-all duration-500 ${
                          isActive ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <span className="overflow-hidden">
                          <span className="block aspect-[4/3] w-full overflow-hidden">
                            {isActive && <Media media={tr.media} n={i + 1} />}
                          </span>
                          <span className="mt-3 block text-sm leading-relaxed text-neutral-400">
                            {tr.text}
                          </span>
                        </span>
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
            <li>
              <div data-line className="h-px w-full bg-neutral-800" />
            </li>
          </ol>

          {/* Контакты для мобильных */}
          <ul className="mt-10 space-y-1 text-sm md:hidden">
            {CONTACTS.map((c) => (
              <li key={c.label} className="flex gap-3">
                <span className="w-20 text-neutral-600">{c.label}</span>
                <a href={c.href} className="text-neutral-400 underline decoration-neutral-700 underline-offset-4">
                  {c.value}
                </a>
              </li>
            ))}
          </ul>

          {/* Выходные данные, как на обороте пластинки */}
          <div className="mt-14 flex items-end justify-between gap-6">
            <p className="max-w-[34ch] text-xs leading-relaxed text-neutral-600">
              Записано на бетоні, дереві й металі. Жодна дошка не постраждала під час виробництва.
            </p>
            <Barcode />
          </div>
        </section>
      </div>

      {/* Карточка, що йде за курсором (десктоп) */}
      {!coarse && (
        <div
          ref={card}
          aria-hidden="true"
          className="pointer-events-none invisible fixed left-0 top-0 z-50 w-[320px] opacity-0"
          style={{ ...font, transform: "scale(0.92)" }}
        >
          <div className="border border-neutral-700 bg-black p-2">
            <div data-card-media className="aspect-[4/3] w-full overflow-hidden">
              {t && <Media key={active} media={t.media} n={active + 1} />}
            </div>
            <p className="px-1 pb-2 pt-3 text-sm leading-relaxed text-neutral-300">
              {t?.text}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}