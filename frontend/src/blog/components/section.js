// ─── Рубрики журнала ────────────────────────────────────────────────────────
// Единый источник правды для рубрик: используется и на публичном сайте
// (BlogPage, BlogCard, BlogPostModal), и в админке (AdminPage).
//
// section.id            — хранится в Post.section в базе
// section.label         — видимое название рубрики
// section.icon          — эмодзи-иконка для нав/пиллов
// section.color         — акцентный цвет рубрики (hex)
// section.description   — короткое описание, что сюда входит
// section.ctaDefault     — CTA-блок по умолчанию для постов этой рубрики
//                          (можно переопределить per-post полем post.cta)

export const SECTIONS = [
  {
    id: "construction",
    label: "Стройка",
    icon: "🏗️",
    color: "#ff1493",
    description: "Репортажи с объектов — от закладки фундамента до открытия",
    ctaDefault: {
      title: "Строите скейтпарк?",
      text: "Проектируем и строим скейтпарки, памп-треки и BMX-рампы под ключ — от концепта до сдачи объекта.",
      buttonLabel: "Оставить заявку",
      buttonUrl: "/contact",
    },
  },
  {
    id: "riders",
    label: "Райдеры",
    icon: "🛹",
    color: "#22c55e",
    description: "Интервью и профили спортсменов",
    ctaDefault: {
      title: "Хотите тренироваться на профессиональной рампе?",
      text: "Строим парки, на которых катаются райдеры из этой рубрики.",
      buttonLabel: "Посмотреть проекты",
      buttonUrl: "/projects",
    },
  },
  {
    id: "guides",
    label: "Гайды",
    icon: "📐",
    color: "#3b82f6",
    description: "Как выбрать рампу, материалы, нормы и стандарты",
    ctaDefault: {
      title: "Нужна консультация по проекту?",
      text: "Поможем рассчитать площадку, подобрать элементы и материалы под бюджет.",
      buttonLabel: "Получить консультацию",
      buttonUrl: "/contact",
    },
  },
  {
    id: "events",
    label: "Ивенты",
    icon: "🏆",
    color: "#f59e0b",
    description: "Соревнования, джемы и открытия парков",
    ctaDefault: null,
  },
  {
    id: "industry",
    label: "Индустрия",
    icon: "📰",
    color: "#a855f7",
    description: "Новости мира BMX и скейта в Украине",
    ctaDefault: null,
  },
]

export const SECTION_MAP = Object.fromEntries(SECTIONS.map(s => [s.id, s]))

export function getSection(id) {
  return SECTION_MAP[id] || null
}

// Резервный CTA, если у рубрики нет своего и пост не задал CTA вручную
export const FALLBACK_CTA = {
  title: "Строите скейтпарк?",
  text: "Проектируем и строим скейтпарки, памп-треки и BMX-рампы под ключ по всей Украине.",
  buttonLabel: "Оставить заявку",
  buttonUrl: "/contact",
}

// Возвращает финальный CTA для поста: post.cta > рубрика.ctaDefault > FALLBACK_CTA
// post.cta === false явно отключает CTA для конкретного поста
export function resolveCta(post) {
  if (post?.cta === false) return null
  if (post?.cta && typeof post.cta === "object" && post.cta.title) return post.cta
  const section = getSection(post?.section)
  if (section?.ctaDefault) return section.ctaDefault
  if (section) return null // рубрика намеренно без CTA (ивенты/индустрия)
  return FALLBACK_CTA
}