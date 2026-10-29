import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

// npm i gsap
// Tailwind: должен быть подключён в проекте. Futura — у тебя уже подключена.

const TRACKS = [
  { n: "01", title: "Розробка та виробництво скейтпарків", tag: "DESIGN / BUILD", len: "∞" },
  { n: "02", title: "Під ключ", tag: "FROM ZERO TO FIRST TRICK", len: "360°" },
  { n: "03", title: "Івенти", tag: "JAMS / CONTESTS / SHOWS", len: "LIVE" },
  { n: "04", title: "DIY", tag: "BUILD IT YOURSELF", len: "RAW" },
  { n: "05", title: "Контакти", tag: "SAY HELLO", len: "→", contact: true },
];

// псевдо-штрихкод (стабильный, без random)
const BARS = Array.from({ length: 42 }, (_, i) => 1 + ((i * 7 + (i % 3) * 5) % 4));

export default function BackCover() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. "занавес" — приход со страницы с бегущей строкой
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(".curtain", { yPercent: 0 }, { yPercent: -100, duration: 1, ease: "power4.inOut" })
        .from(".vinyl", { xPercent: -60, rotate: -200, opacity: 0, duration: 1.6 }, 0.3)
        .from(".giant span", { yPercent: 110, stagger: 0.06, duration: 1 }, 0.5)
        .from(".track", { x: -40, opacity: 0, stagger: 0.1, duration: 0.8 }, 0.9)
        .from(".fade", { opacity: 0, y: 12, stagger: 0.08, duration: 0.7 }, 1.2)
        .from(".bar", { scaleY: 0, transformOrigin: "bottom", stagger: 0.015, duration: 0.5 }, 1.4);

      // 2. пластинка крутится постоянно
      gsap.to(".vinyl-disc", { rotate: 360, duration: 8, repeat: -1, ease: "none" });

      // 3. hover по трекам: сдвиг + ускорение пластинки
      const spin = gsap.getTweensOf(".vinyl-disc")[0];
      document.querySelectorAll(".track").forEach((el) => {
        const line = el.querySelector(".line");
        const title = el.querySelector(".title");
        el.addEventListener("mouseenter", () => {
          gsap.to(title, { x: 18, color: "#e5e5e5", duration: 0.35 });
          gsap.to(line, { scaleX: 1, duration: 0.5, ease: "power3.out" });
          gsap.to(spin, { timeScale: 4, duration: 0.5 });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(title, { x: 0, color: "#8a8a8a", duration: 0.35 });
          gsap.to(line, { scaleX: 0, duration: 0.4 });
          gsap.to(spin, { timeScale: 1, duration: 0.8 });
        });
      });

      // 4. лёгкий параллакс от мыши
      const move = (e) => {
        const x = (e.clientX / innerWidth - 0.5) * 2;
        const y = (e.clientY / innerHeight - 0.5) * 2;
        gsap.to(".vinyl", { x: x * -25, y: y * -15, duration: 1 });
        gsap.to(".giant", { x: x * 15, y: y * 8, duration: 1.2 });
      };
      window.addEventListener("mousemove", move);
      return () => window.removeEventListener("mousemove", move);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={root}
      className="relative min-h-screen overflow-hidden bg-black text-neutral-500"
      style={{ fontFamily: "Futura, 'Futura PT', 'Century Gothic', sans-serif" }}
    >
      {/* занавес перехода */}
      <div className="curtain fixed inset-0 z-50 bg-neutral-900" />

      {/* зерно */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* пластинка, выглядывающая из-за края обложки */}
      <div className="vinyl pointer-events-none absolute -left-[28vmin] top-1/2 h-[90vmin] w-[90vmin] -translate-y-1/2">
        <div className="vinyl-disc h-full w-full rounded-full border border-neutral-800"
          style={{
            background:
              "repeating-radial-gradient(circle, #0a0a0a 0 3px, #141414 3px 4px)",
          }}
        >
          <div className="absolute left-1/2 top-1/2 flex h-[28%] w-[28%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-center text-[1.1vmin] uppercase tracking-[0.3em] text-neutral-500">
            side B<br />33⅓ rpm
          </div>
        </div>
      </div>

      {/* гигантский контурный заголовок */}
      <h1 className="giant pointer-events-none absolute right-[-2vw] top-[4vh] select-none text-right text-[22vw] font-bold uppercase leading-[0.8] tracking-tighter text-transparent"
        style={{ WebkitTextStroke: "1px #262626" }}>
        {"SIDE".split("").map((c, i) => (
          <span key={i} className="inline-block overflow-hidden">{c}</span>
        ))}
        <br />
        {"B".split("").map((c, i) => (
          <span key={i} className="inline-block overflow-hidden">{c}</span>
        ))}
      </h1>

      {/* контент */}
      <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-12 md:px-10">
        <div className="hidden md:col-span-4 md:block" />

        <div className="flex flex-col justify-between md:col-span-8">
          <header className="fade flex items-center justify-between text-[11px] uppercase tracking-[0.35em]">
            <span>Back cover</span>
            <span>Cat. № SK8-001</span>
          </header>

          <div className="my-14">
            <p className="fade mb-6 text-xs uppercase tracking-[0.4em] text-neutral-600">
              Tracklist — Services
            </p>

            <ul>
              {TRACKS.map((t) => (
                <li key={t.n}>
                  <a
                    href={t.contact ? "#contacts" : "#"}
                    className="track group relative flex items-baseline gap-5 py-5"
                  >
                    <span className="w-8 text-xs tabular-nums text-neutral-700">{t.n}</span>
                    <span className="flex-1">
                      <span className="title block text-2xl font-medium uppercase tracking-wide text-[#8a8a8a] md:text-4xl">
                        {t.title}
                      </span>
                      <span className="mt-1 block text-[10px] uppercase tracking-[0.4em] text-neutral-700">
                        {t.tag}
                      </span>
                    </span>
                    <span className="text-sm tabular-nums text-neutral-600">{t.len}</span>
                    <span className="line absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-neutral-500" />
                    <span className="absolute bottom-0 left-0 h-px w-full bg-neutral-900" style={{ zIndex: -1 }} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <footer id="contacts" className="fade grid grid-cols-2 items-end gap-8 text-[11px] uppercase tracking-[0.25em] md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-neutral-700">Credits</p>
              <a href="tel:+380000000000" className="block transition-colors hover:text-neutral-200">+38 000 000 00 00</a>
              <a href="mailto:hello@example.com" className="block transition-colors hover:text-neutral-200">hello@example.com</a>
              <a href="https://instagram.com/" className="block transition-colors hover:text-neutral-200">@instagram</a>
            </div>

            <p className="hidden text-[9px] leading-relaxed tracking-[0.2em] text-neutral-700 md:block">
              Всі права на рампи захищені гравітацією. Катайся голосно.
              <br />Made in Ukraine ℗ 2026
            </p>

            {/* штрихкод */}
            <div className="justify-self-end bg-neutral-300 p-2">
              <div className="flex h-12 items-end gap-[2px]">
                {BARS.map((w, i) => (
                  <span key={i} className="bar block bg-black" style={{ width: w, height: i % 9 === 0 ? "100%" : "88%" }} />
                ))}
              </div>
              <p className="mt-1 text-center text-[8px] tracking-[0.3em] text-black">4 820000 081001</p>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}