

import BlogCard from "./BlogCard"
 
export default function BlogFeed({ posts }) {
  if (!posts.length) return null
  return (
    <div className="divide-y divide-white/[0.08]">
      {posts.map((post, index) => (
        <BlogCard key={post.id} post={post} index={index} />
      ))}
    </div>
  )
}
