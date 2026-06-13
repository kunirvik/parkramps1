
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState, useCallback, memo } from "react"
import { usePostsContext } from "./BlogPage"
import TelegramComments from "../components/TelegramComments"

// ─── Helpers ──────────────────────────────────────────────────────────────

function getYoutubeID(url = "") {
  const m = url?.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

function getRumbleID(url = "") {
  const m = url?.match(/rumble\.com\/(?:embed\/)?(v[a-z0-9]+)/i)
  return m ? m[1] : null
}

function detectType(url) {
  if (!url) return null
  if (getYoutubeID(url)) return "youtube"
  if (getRumbleID(url)) return "rumble"
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) return "mp4"
  if (/\.(jpe?g|png|gif|webp|avif|svg)(\?|$)/i.test(url)) return "image"
  return null
}

function buildMediaList(post) {
  const items = []
  const push = (url, forcedType) => {
    const type = forcedType ?? detectType(url)
    if (type) items.push({ url, type })
  }

  if (post.cover) push(post.cover, "image")
  post.photos?.forEach(u => push(u, "image"))
  if (post.video) push(post.video, "mp4")
  if (post.url) push(post.url)
  post.videos?.forEach(u => push(u))

  return items
}

function mediaThumb(item) {
  if (item.type === "image") return item.url
  if (item.type === "youtube") {
    const id = getYoutubeID(item.url)
    return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null
  }
  return null
}

function isVideo(type) {
  return ["youtube", "rumble", "mp4"].includes(type)
}

function mediaLabel(item) {
  if (item.type === "youtube") return "YouTube"
  if (item.type === "rumble") return "Rumble"
  if (item.type === "mp4") return "Video"
  if (item.type === "image") return "Photo"
  return "Media"
}

// ─── Media Embed Component (memoized) ─────────────────────────────────────

const MediaEmbed = memo(({ item }) => {
  if (!item) return null

  if (item.type === "image") {
    return (
      <img
        src={item.url}
        alt=""
        className="w-full h-full object-contain"
        loading="lazy"
      />
    )
  }

  if (item.type === "mp4") {
    return (
      <video key={item.url} controls className="w-full h-full object-contain">
        <source src={item.url} type="video/mp4" />
      </video>
    )
  }

  if (item.type === "youtube") {
    return (
      <iframe
        key={item.url}
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${getYoutubeID(item.url)}`}
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }

  if (item.type === "rumble") {
    return (
      <iframe
        key={item.url}
        className="w-full h-full"
        src={`https://rumble.com/embed/${getRumbleID(item.url)}/`}
        title="Rumble video"
        frameBorder="0"
        allowFullScreen
      />
    )
  }

  return null
})

// ─── Related Card Component (memoized) ────────────────────────────────────

const RelatedCard = memo(({ post }) => {
  const navigate = useNavigate()
  const thumb = post.cover || (post.url && getYoutubeID(post.url)
    ? `https://img.youtube.com/vi/${getYoutubeID(post.url)}/mqdefault.jpg`
    : null)

  return (
    <button
      onClick={() => navigate(`/blog/post/${post.id}`)}
      className="group relative overflow-hidden bg-[#1a1a1a] border border-white/[0.08] hover:border-[#ff1493]/50 transition-all cursor-pointer text-left"
      style={{ aspectRatio: "16/9" }}
    >
      {thumb && (
        <img
          src={thumb}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <p className="font-futura font-bold text-white text-[11px] leading-tight line-clamp-2 group-hover:text-[#ff1493] transition-colors">
          {post.title}
        </p>
      </div>
    </button>
  )
})

// ─── Post Navigation Component ────────────────────────────────────────────

const PostNav = memo(({ post, direction }) => {
  const navigate = useNavigate()
  const isPrev = direction === "prev"
  
  return (
    <button
      onClick={() => navigate(`/blog/post/${post.id}`)}
      className="flex-1 p-3 bg-[#1a1a1a] border border-white/[0.08] hover:border-[#ff1493]/50 transition-all cursor-pointer group"
    >
      <div className={`flex items-center gap-2 ${isPrev ? "" : "flex-row-reverse"}`}>
        <span className="text-[#ff1493] text-xl font-bold group-hover:scale-110 transition-transform">
          {isPrev ? "‹" : "›"}
        </span>
        <div className={`flex-1 min-w-0 ${isPrev ? "text-left" : "text-right"}`}>
          <span className="text-[10px] font-futura uppercase tracking-wide text-white/30 block">
            {isPrev ? "Previous" : "Next"}
          </span>
          <p className="font-futura font-bold text-white/80 text-[12px] leading-tight line-clamp-1 group-hover:text-[#ff1493] transition-colors">
            {post.title}
          </p>
        </div>
      </div>
    </button>
  )
})

// ─── Main Modal Component ─────────────────────────────────────────────────

export default function BlogPostModal() {
  const { id } = useParams()
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL

  const [post, setPost] = useState(null)
  const [show, setShow] = useState(false)
  const [activeMedia, setActive] = useState(0)

  const allPosts = usePostsContext()

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "auto" }
  }, [])

  // Fade-in
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 10)
    return () => clearTimeout(timer)
  }, [])

  // Load post
  useEffect(() => {
    fetch(`${API_URL}/api/blog/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject("Not found"))
      .then(data => setPost(data))
      .catch(() => navigate("/blog"))
  }, [id, API_URL, navigate])

  // Close handler
  const close = useCallback(() => {
    setShow(false)
    setTimeout(() => navigate(-1), 200)
  }, [navigate])

  // Keyboard navigation
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft" && activeMedia > 0) setActive(activeMedia - 1)
      if (e.key === "ArrowRight" && activeMedia < mediaList.length - 1) setActive(activeMedia + 1)
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [close, activeMedia])

  if (!post) return null

  const mediaList = buildMediaList(post)
  const currentIndex = allPosts.findIndex(p => p.id === post.id)
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  const related = allPosts.filter(p =>
    p.id !== post.id && p.tags?.some(t => post.tags?.includes(t))
  )
  const morePosts = related.length ? related.slice(0, 4) : allPosts.slice(0, 4).filter(p => p.id !== post.id)

  const isUpdated = post.updatedAt && new Date(post.updatedAt) - new Date(post.date) > 86400000

  return (
    <>
      <style>{`
        .post-body {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
          font-family: 'Futura', sans-serif;
        }
        .post-body h1, .post-body h2, .post-body h3 {
          color: rgba(255, 255, 255, 0.95);
          font-weight: 900;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .post-body p { margin-bottom: 1em; }
        .post-body a {
          color: #ff1493;
          text-decoration: none;
          border-bottom: 1px solid #ff1493;
        }
        .post-body a:hover {
          color: #ff69b4;
          border-bottom-color: #ff69b4;
        }
        .post-body img {
          max-width: 100%;
          border-radius: 4px;
          margin: 1.5em 0;
        }
        .post-body ul, .post-body ol {
          margin-left: 1.5em;
          margin-bottom: 1em;
        }
        .post-body code {
          background: rgba(255, 20, 147, 0.1);
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-size: 0.9em;
        }
        .post-body blockquote {
          border-left: 3px solid #ff1493;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: rgba(255, 255, 255, 0.5);
        }
        
        /* Custom scrollbar */
        .right-scroll::-webkit-scrollbar { width: 8px; }
        .right-scroll::-webkit-scrollbar-track { background: #0a0a0a; }
        .right-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .right-scroll::-webkit-scrollbar-thumb:hover { background: #444; }
        
        .thumb-strip::-webkit-scrollbar { height: 6px; }
        .thumb-strip::-webkit-scrollbar-track { background: #0a0a0a; }
        .thumb-strip::-webkit-scrollbar-thumb { background: #ff1493; border-radius: 3px; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 bg-black z-[9998] transition-opacity duration-200 ${
          show ? "opacity-95" : "opacity-0"
        }`}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-4 transition-all duration-200 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="relative w-full h-full md:max-w-[95vw] md:max-h-[95vh] md:h-auto bg-[#0a0a0a] border-0 md:border md:border-white/[0.1] shadow-2xl flex flex-col overflow-hidden">
          
          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="flex-shrink-0 bg-[#1a1a1a] border-b border-white/[0.08]">
            <div className="h-12 md:h-14 px-3 md:px-4 flex items-center justify-between gap-3">
              {/* Close button */}
              <button
                onClick={close}
                className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-[#ff1493] hover:text-[#ff1493] text-white/40 transition-all cursor-pointer text-lg font-bold flex-shrink-0"
              >
                ✕
              </button>

              {/* Title (hidden on mobile) */}
              <div className="hidden md:block flex-1 min-w-0 px-3">
                <span className="font-futura font-black text-white/60 text-xs uppercase tracking-[0.2em] block truncate">
                  {post.title}
                </span>
              </div>

              {/* Prev / Next */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {prevPost && (
                  <button
                    onClick={() => navigate(`/blog/post/${prevPost.id}`)}
                    title={prevPost.title}
                    className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-[#ff1493] hover:text-[#ff1493] text-white/30 transition-all cursor-pointer font-bold text-lg"
                  >
                    ‹
                  </button>
                )}
                {nextPost && (
                  <button
                    onClick={() => navigate(`/blog/post/${nextPost.id}`)}
                    title={nextPost.title}
                    className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-[#ff1493] hover:text-[#ff1493] text-white/30 transition-all cursor-pointer font-bold text-lg"
                  >
                    ›
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Body ───────────────────────────────────────────────────── */}
          <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
            {/* Desktop: side-by-side, Mobile: stacked */}
            <div className="flex flex-col md:flex-row h-full">
              
              {/* ══ MEDIA PANEL ═══════════════════════════════════════════ */}
              <div className="flex flex-col bg-black md:border-r md:border-white/[0.07] w-full md:w-[58%]">
                
                {/* Active player */}
                <div className="flex-shrink-0 md:flex-1 md:min-h-0 flex items-center justify-center bg-black overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  {mediaList.length > 0 ? (
                    <MediaEmbed item={mediaList[activeMedia] ?? mediaList[0]} />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-white/10 py-12">
                      <span className="text-5xl">✦</span>
                      <span className="font-futura text-xs uppercase tracking-widest">No media</span>
                    </div>
                  )}
                </div>

                {/* Thumbnail strip (only when multiple) */}
                {mediaList.length > 1 && (
                  <div className="flex-shrink-0 bg-[#0a0a0a] border-t-2 border-[#ff1493]">
                    <div className="flex items-center gap-2 px-3 pt-2 pb-1">
                      <span className="font-futura font-black text-[#ff1493] text-[10px] uppercase tracking-[0.18em]">
                        {mediaList.length} {isVideo(mediaList[0]?.type) ? "Videos" : "Media"}
                      </span>
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-white/20 font-futura text-[10px]">
                        {activeMedia + 1} / {mediaList.length}
                      </span>
                    </div>
                    <div className="thumb-strip flex gap-2 px-3 pb-3 overflow-x-auto">
                      {mediaList.map((item, i) => {
                        const thumb = mediaThumb(item)
                        const isAct = i === activeMedia
                        const isVid = isVideo(item.type)
                        return (
                          <button
                            key={i}
                            onClick={() => setActive(i)}
                            style={{ width: 120, aspectRatio: "16/9", flexShrink: 0 }}
                            className={`relative overflow-hidden cursor-pointer transition-all duration-150 ${
                              isAct ? "ring-2 ring-[#ff1493]" : "opacity-45 hover:opacity-90"
                            }`}
                          >
                            {thumb ? (
                              <img
                                src={thumb}
                                alt=""
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center text-white/20 text-xl">
                                ▶
                              </div>
                            )}
                            <div className={`absolute inset-0 ${isAct ? "bg-black/10" : "bg-black/40"}`} />
                            {isVid && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                  className={`flex items-center justify-center transition-all ${
                                    isAct ? "w-8 h-8 bg-[#ff1493]" : "w-6 h-6 bg-[#ff1493]/70"
                                  }`}
                                >
                                  <span className="text-white font-black text-[9px] ml-px">▶</span>
                                </div>
                              </div>
                            )}
                            <div className={`absolute bottom-0 left-0 right-0 px-1.5 py-0.5 ${isAct ? "bg-[#ff1493]" : "bg-black/70"}`}>
                              <span className="font-futura font-black text-white text-[8px] uppercase tracking-wide">
                                {isAct ? "▶ Playing" : `#${i + 1} ${mediaLabel(item)}`}
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* ══ TEXT PANEL ════════════════════════════════════════════ */}
              <div className="right-scroll flex flex-col flex-1 min-w-0 overflow-y-auto">
                <div className="p-4 md:p-5 flex flex-col gap-4 md:gap-5">
                  
                  {/* ── Article header ── */}
                  <div className="pb-3 md:pb-4 border-b border-white/10">
                    {/* Tags + UPDATED badge */}
                    <div className="flex flex-wrap gap-1.5 mb-3 items-center">
                      {post.tags?.map(t => (
                        <span
                          key={t}
                          className="bg-[#ff1493] text-white text-[9px] font-black uppercase tracking-[0.18em] px-2 py-1 font-futura"
                        >
                          {t}
                        </span>
                      ))}
                      {isUpdated && (
                        <span className="flex items-center gap-1 bg-[#22c55e] text-white text-[9px] font-black uppercase tracking-[0.18em] px-2 py-1 animate-pulse font-futura">
                          ↑ Updated
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h1 className="font-futura font-black text-white text-xl md:text-2xl xl:text-3xl uppercase leading-[1.04] tracking-tight mb-3">
                      {post.title}
                    </h1>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-white/50 font-futura text-sm leading-relaxed border-l-2 border-[#ff1493] pl-3 mb-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[10px] font-futura uppercase tracking-wide text-white/30">
                      <time>{post.date}</time>
                      {mediaList.length > 1 && (
                        <>
                          <span className="w-0.5 h-0.5 bg-white/20 rounded-full" />
                          <span>{mediaList.length} media</span>
                        </>
                      )}
                      {isUpdated && post.updatedAt && (
                        <>
                          <span className="w-0.5 h-0.5 bg-white/20 rounded-full" />
                          <span className="text-[#22c55e]">
                            updated {new Date(post.updatedAt).toLocaleDateString("en-US")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ── Body ── */}
                  <div className="flex-1">
                    {isUpdated && (
                      <div className="mb-3 flex items-center gap-2 bg-[#22c55e]/10 border border-[#22c55e]/30 px-3 py-2">
                        <span className="text-[#22c55e] text-[10px] font-black uppercase tracking-widest font-futura">
                          ↑ Post updated — new content below
                        </span>
                      </div>
                    )}
                    {post.content ? (
                      <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
                    ) : (
                      <p className="text-white/15 font-futura italic text-sm">— No body text —</p>
                    )}
                  </div>

                  {/* ── Related posts ── */}
                  {morePosts.length > 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 bg-[#ff1493]" />
                        <span className="font-futura font-black text-[10px] uppercase tracking-[0.2em] text-white/40">
                          {related.length ? "Related" : "More Posts"}
                        </span>
                        <div className="flex-1 h-px bg-white/[0.06]" />
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {morePosts.slice(0, 4).map(p => (
                          <RelatedCard key={p.id} post={p} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Telegram Comments ── */}
                  {post.telegramUrl && <TelegramComments telegramUrl={post.telegramUrl} />}

                  {/* ── Prev / Next ── */}
                  {(prevPost || nextPost) && (
                    <div className="flex gap-2 pt-2">
                      {prevPost && <PostNav post={prevPost} direction="prev" />}
                      {nextPost && <PostNav post={nextPost} direction="next" />}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}