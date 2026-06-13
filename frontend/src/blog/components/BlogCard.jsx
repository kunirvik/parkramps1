
import { Link, useLocation } from "react-router-dom"
import { memo } from "react"

function getYoutubeID(url = "") {
  const m = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

function formatDate(raw) {
  if (!raw) return ""
  const d = new Date(raw)
  if (isNaN(d)) return raw
  const today = new Date()
  const diff = Math.floor((today - d) / 86400000)
  if (diff === 0) return "Today"
  if (diff === 1) return "Yesterday"
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// ── Main row card (розовая тема с оптимизацией) ───────────────────────────

const BlogCard = memo(({ post, index = 0 }) => {
  const location = useLocation()
  const youtubeId = post.url ? getYoutubeID(post.url) : null
  const thumb = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : post.cover || null
  const dateLabel = formatDate(post.date)
  const isRecent = dateLabel === "Today" || dateLabel === "Yesterday"

  return (
    <article
      className="flex flex-col md:flex-row gap-0 border-b border-white/[0.08] hover:bg-white/[0.02] transition-colors duration-100 group"
      style={{
        opacity: 0,
        animation: "pbRowIn 0.3s ease forwards",
        animationDelay: `${Math.min(index * 40, 300)}ms`,
      }}
    >
      <Link
        to={`/blog/post/${post.id}`}
        state={{ background: location }}
        className="flex flex-col md:flex-row gap-0 w-full"
      >
        {/* ── Thumbnail ── */}
        <div className="flex-shrink-0 relative overflow-hidden bg-[#1a1a1a] w-full md:w-[200px] h-[200px] md:h-[134px]">
          {thumb ? (
            <img
              src={thumb}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
              <span className="text-white/10 text-3xl">{post.type === "video" ? "▶" : "✦"}</span>
            </div>
          )}

          {/* Play badge */}
          {youtubeId && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/25 transition-colors">
              <div className="w-9 h-9 bg-[#ff1493] flex items-center justify-center shadow">
                <span className="text-white text-sm ml-0.5">▶</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0 px-4 py-3 flex flex-col justify-between">
          <div>
            {/* Date */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 font-futura ${
                  isRecent ? "bg-[#ff1493] text-white" : "bg-white/[0.08] text-white/40"
                }`}
              >
                {dateLabel}
              </span>

              {/* Updated badge */}
              {(() => {
                if (!post.updatedAt) return null
                const created = new Date(post.date)
                const updated = new Date(post.updatedAt)
                const diffDays = (updated - created) / 86400000
                if (diffDays < 1) return null
                const updLabel = updated.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                return (
                  <span className="text-[11px] font-bold px-1.5 py-0.5 bg-[#22c55e]/20 text-[#22c55e] font-futura">
                    ↑ {updLabel}
                  </span>
                )
              })()}
            </div>

            {/* Title - оптимизированный размер */}
            <h2 className="font-futura font-black text-white/90 text-base md:text-lg leading-tight group-hover:text-[#ff1493] transition-colors duration-100 mb-1.5">
              {post.title}
            </h2>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-white/50 text-[13px] leading-snug line-clamp-2 font-futura mb-2">
                {post.excerpt}
              </p>
            )}
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
              {post.tags.map(t => (
                <span
                  key={t}
                  className="text-[11px] font-futura text-[#ff1493] bg-[#ff1493]/10 px-2 py-0.5 hover:bg-[#ff1493]/20 transition-colors cursor-pointer"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  )
})

BlogCard.displayName = "BlogCard"

// ── Hero card (first/featured post) ───────────────────────────────────────

export const HeroCard = memo(({ post }) => {
  const location = useLocation()
  const youtubeId = post.url ? getYoutubeID(post.url) : null
  const thumb = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    : post.cover || null
  const dateLabel = formatDate(post.date)

  return (
    <article className="border-b-2 border-white/[0.08] group">
      <Link to={`/blog/post/${post.id}`} state={{ background: location }} className="flex flex-col md:flex-row gap-0">
        {/* Thumbnail */}
        <div className="flex-shrink-0 relative overflow-hidden bg-[#1a1a1a] w-full md:w-[340px] h-[240px] md:h-[220px]">
          {thumb ? (
            <img
              src={thumb}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              loading="eager"
              decoding="async"
            />
          ) : (
            <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center text-white/10 text-4xl">
              ✦
            </div>
          )}
          {youtubeId && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="w-12 h-12 bg-[#ff1493] flex items-center justify-center shadow-lg">
                <span className="text-white text-lg ml-1">▶</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 px-5 py-4 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {post.source && post.source !== "telegram" && (
                <span className="text-[11px] font-bold text-white/40 uppercase tracking-wide font-futura">
                  {post.source}
                </span>
              )}
              <span className="text-[11px] font-bold bg-[#ff1493] text-white px-1.5 py-0.5 font-futura">
                {dateLabel}
              </span>
              <span className="text-[10px] font-bold bg-white text-[#ff1493] px-2 py-0.5 uppercase tracking-wide font-futura">
                Featured
              </span>
            </div>

            {/* Hero title */}
            <h2 className="font-futura font-black text-white/95 text-xl md:text-2xl leading-tight group-hover:text-[#ff1493] transition-colors mb-2">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-white/50 text-[13px] leading-snug line-clamp-3 font-futura">
                {post.excerpt}
              </p>
            )}
          </div>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.map(t => (
                <span
                  key={t}
                  className="text-[11px] font-futura text-[#ff1493] bg-[#ff1493]/10 px-2 py-0.5 hover:bg-[#ff1493]/20 transition-colors cursor-pointer"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  )
})

HeroCard.displayName = "HeroCard"

export default BlogCard
