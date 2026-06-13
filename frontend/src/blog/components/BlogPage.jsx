
import { useEffect, useState, useRef, useCallback, createContext, useContext, lazy, Suspense } from "react"
import { HeroCard } from "./BlogCard"
import SocialButtons from "../../SocialButtons/SocialButtons"

// Lazy load для оптимизации
const BlogFeed = lazy(() => import("./BlogFeed"))
const LoadingScreen = lazy(() => import("../../LoadingScreen/LodingScreen"))

const PAGE_SIZE = 15
const TAGS = ["all", "live", "construction", "parkramps", "bmx", "skate"]

export const PostsContext = createContext([])
export function usePostsContext() {
  return useContext(PostsContext)
}

// ── Small sidebar post link (memoized) ────────────────────────────────────

function SidebarPostLink({ post, rank }) {
  function getYoutubeID(url = "") {
    const m = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/)
    return m ? m[1] : null
  }
  const youtubeId = post.url ? getYoutubeID(post.url) : null
  const thumb = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
    : post.cover || null

  return (
    <a
      href={`/blog/post/${post.id}`}
      className="flex gap-2.5 py-2.5 border-b border-white/[0.08] last:border-0 group hover:bg-white/[0.02] -mx-3 px-3 transition-colors"
    >
      <div className="flex-shrink-0 w-16 h-11 bg-[#1a1a1a] overflow-hidden">
        {thumb ? (
          <img
            src={thumb}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10 text-lg">✦</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-futura font-bold text-white/80 leading-tight group-hover:text-[#ff1493] transition-colors line-clamp-2">
          {post.title}
        </p>
        <p className="text-[10px] text-white/30 font-futura mt-0.5">{post.date}</p>
      </div>
    </a>
  )
}

// ── Tag pill ──────────────────────────────────────────────────────────────

function TagPill({ tag, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-[12px] font-futura font-semibold border transition-colors cursor-pointer ${
        active
          ? "bg-[#ff1493] text-white border-[#ff1493]"
          : "bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:bg-white/[0.05]"
      }`}
    >
      {tag === "all" ? "All" : tag}
    </button>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────

export default function BlogPage() {
  const API_URL = import.meta.env.VITE_API_URL

  const [posts, setPosts] = useState([])
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTag, setActiveTag] = useState("all")
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [isFadingOut, setIsFadingOut] = useState(false)

  const loaderRef = useRef(null)

  const filtered = posts
    .filter(p => activeTag === "all" || p.tags?.includes(activeTag))
    .filter(p => !search || p.title?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.date)
      const bTime = new Date(b.updatedAt || b.date)
      return bTime - aTime
    })

  const hero = filtered[0] || null
  const feedPosts = filtered.slice(1, visible)
  const hasMore = visible < filtered.length
  const latestPosts = posts.slice(0, 8)

  useEffect(() => {
    fetch(`${API_URL}/api/blog`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(data => {
        setPosts(data)
        // Начинаем fade out загрузочного экрана
        setTimeout(() => setIsFadingOut(true), 100)
        setTimeout(() => setLoading(false), 500)
      })
      .catch(() => {
        setError("Could not load blog")
        setLoading(false)
      })
  }, [API_URL])

  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [activeTag, search])

  const handleObserver = useCallback(
    entries => {
      if (entries[0].isIntersecting && hasMore) setVisible(v => v + PAGE_SIZE)
    },
    [hasMore]
  )

  useEffect(() => {
    const obs = new IntersectionObserver(handleObserver, { threshold: 0.1 })
    if (loaderRef.current) obs.observe(loaderRef.current)
    return () => obs.disconnect()
  }, [handleObserver])

  function submitSearch(e) {
    e.preventDefault()
    setSearch(searchInput)
  }

  // ── Loading Screen ────────────────────────────────────────────────────

  if (loading) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
        <LoadingScreen isFadingOut={isFadingOut} />
      </Suspense>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-red-500 font-futura">{error}</p>
      </div>
    )
  }

  return (
    <PostsContext.Provider value={filtered}>
      <style>{`
        @keyframes pbRowIn {
          from { opacity:0; transform:translateY(6px); }
          to   { opacity:1; transform:translateY(0); }
        }

        * { box-sizing: border-box; }
        
        /* Dark scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #ff1493; }
        
        /* Hide scrollbar for mobile horizontal scroll */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-[#0a0a0a]">
        <SocialButtons />

        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <div className="bg-[#1a1a1a] border-b-2 border-[#ff1493]">
          <div className="max-w-[1200px] mx-auto px-4 h-12 md:h-14 flex items-center gap-3 md:gap-4 flex-wrap md:flex-nowrap">
            <h1 className="font-futura font-black text-white text-base md:text-lg uppercase tracking-wider flex-shrink-0">
              News
            </h1>

            {/* Tag filters */}
            <div className="flex gap-2 overflow-x-auto flex-1 pb-1 md:pb-0 no-scrollbar">
              <div className="flex gap-2 flex-nowrap md:flex-wrap">
                {TAGS.map(tag => (
                  <TagPill key={tag} tag={tag} active={activeTag === tag} onClick={() => setActiveTag(tag)} />
                ))}
              </div>
            </div>

            {/* Search */}
            <form onSubmit={submitSearch} className="flex-shrink-0 w-full md:w-auto mt-2 md:mt-0">
              <div className="flex border border-white/20 overflow-hidden h-8">
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search..."
                  className="px-3 py-1 text-[12px] font-futura bg-transparent text-white placeholder:text-white/30 outline-none flex-1 min-w-0"
                />
                <button
                  type="submit"
                  className="px-3 bg-[#ff1493] text-white font-futura font-bold text-[11px] uppercase tracking-wide hover:bg-[#ff69b4] transition-colors flex-shrink-0"
                >
                  Go
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── Page body ────────────────────────────────────────────────── */}
        <div className="max-w-[1200px] bg-[#0a0a0a] mx-auto px-4 pt-4 pb-12">
          <div className="flex flex-col lg:flex-row gap-4 items-start">
            {/* ══ MAIN FEED ═════════════════════════════════════════════ */}
            <div className="flex-1 min-w-0 w-full">
              {/* Active filter indicator */}
              {(activeTag !== "all" || search) && (
                <div className="flex items-center gap-2 mb-3 bg-white/[0.03] border border-white/[0.08] px-3 py-2">
                  <span className="text-[12px] font-futura text-white/60">
                    {search ? `Results for "${search}"` : `Category: ${activeTag}`}
                    {" "}· {filtered.length} post{filtered.length !== 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={() => {
                      setActiveTag("all")
                      setSearch("")
                      setSearchInput("")
                    }}
                    className="ml-auto text-[11px] text-[#ff1493] font-futura font-bold hover:underline cursor-pointer"
                  >
                    Clear ✕
                  </button>
                </div>
              )}

              {/* Hero post */}
              {hero && (
                <div className="bg-[#111] border border-white/[0.08] mb-1 shadow-sm">
                  <HeroCard post={hero} />
                </div>
              )}

              {/* Feed */}
              <div className="bg-[#111] border border-white/[0.08] shadow-sm">
                <Suspense fallback={<div className="p-4 text-white/40 text-center">Loading...</div>}>
                  <BlogFeed posts={feedPosts} />
                </Suspense>
              </div>

              {/* Infinite scroll sentinel */}
              <div ref={loaderRef} className="h-10 flex items-center justify-center mt-4">
                {hasMore && (
                  <div className="flex items-center gap-3">
                    <div className="h-px w-12 bg-white/20" />
                    <span className="font-futura text-white/40 text-xs animate-pulse">Loading more…</span>
                    <div className="h-px w-12 bg-white/20" />
                  </div>
                )}
              </div>
            </div>

            {/* ══ SIDEBAR (hidden on mobile) ════════════════════════════ */}
            <aside className="w-full lg:w-[260px] flex-shrink-0 hidden lg:flex flex-col gap-3 lg:sticky lg:top-4">
              {/* Latest posts */}
              <div className="bg-[#111] border border-white/[0.08] shadow-sm">
                <div className="bg-[#1a1a1a] px-3 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#ff1493]" />
                  <span className="font-futura font-black text-white text-[11px] uppercase tracking-widest">
                    Latest Posts
                  </span>
                </div>
                <div className="px-3 py-1">
                  {latestPosts.map((p, i) => (
                    <SidebarPostLink key={p.id} post={p} rank={i + 1} />
                  ))}
                </div>
              </div>

              {/* Tag cloud */}
              <div className="bg-[#111] border border-white/[0.08] shadow-sm">
                <div className="bg-[#1a1a1a] px-3 py-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#ff1493]" />
                  <span className="font-futura font-black text-white text-[11px] uppercase tracking-widest">
                    Categories
                  </span>
                </div>
                <div className="p-3 flex flex-wrap gap-1.5">
                  {TAGS.filter(t => t !== "all").map(tag => (
                    <TagPill
                      key={tag}
                      tag={tag}
                      active={activeTag === tag}
                      onClick={() => setActiveTag(activeTag === tag ? "all" : tag)}
                    />
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-[#111] border border-white/[0.08] shadow-sm px-4 py-3">
                <p className="font-futura text-[12px] text-white/40">
                  <span className="font-bold text-white text-base">{posts.length}</span> total posts
                </p>
                {activeTag !== "all" && (
                  <p className="font-futura text-[12px] text-white/40 mt-1">
                    <span className="font-bold text-[#ff1493]">{filtered.length}</span> in #{activeTag}
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </PostsContext.Provider>
  )
}