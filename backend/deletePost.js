

const Post = require("./bot/Post")
const cloudinary = require("./cloudinary.config")
const { invalidatePostCache } = require("./bot/blog-cache")

function getCloudinaryDeleteInfo(url) {
  if (!url) return null

  const match = url.match(/\/(?:image|video)\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z0-9]+)?$/i)
  if (!match) return null

  return {
    publicId: match[1],
    resourceType: url.includes("/video/") ? "video" : "image",
  }
}

async function deletePostById(id) {
  const post = await Post.findOne({ id })
  if (!post) {
    return { ok: false, reason: "not found" }
  }

  const assets = [
    post.cover,
    post.video,
    ...(post.photos || []),
    ...(post.videos || []),
  ].filter(Boolean)

  await Promise.allSettled(
    assets.map(async (url) => {
      const info = getCloudinaryDeleteInfo(url)
      if (!info) return

      await cloudinary.uploader.destroy(info.publicId, {
        resource_type: info.resourceType,
      })

      console.log(`🗑️ Cloudinary deleted: ${info.publicId}`)
    })
  )

  await Post.deleteOne({ id })
  await invalidatePostCache(id)

  console.log(`🗑️ MongoDB deleted: ${id}`)
  return { ok: true, id }
}

function registerDeleteCommand(bot) {
  const adminId = process.env.ADMIN_TELEGRAM_ID

  bot.onText(/\/delete (.+)/, async (msg, match) => {
    if (adminId && String(msg.from.id) !== String(adminId)) return

    const id = match[1].trim()
    const result = await deletePostById(id)

    if (!result.ok) {
      bot.sendMessage(msg.chat.id, `❌ Пост не найден: ${id}`)
    } else {
      bot.sendMessage(msg.chat.id, `✅ Удалён: ${id}`)
    }
  })

  bot.onText(/\/list/, async (msg) => {
    if (adminId && String(msg.from.id) !== String(adminId)) return

    const posts = await Post.find({}).sort({ createdAt: -1 }).limit(20).lean()
    if (!posts.length) {
      return bot.sendMessage(msg.chat.id, "Постов нет")
    }

    const text = posts
      .map(p => `• ${p.date}  <code>${p.id}</code>\n  ${p.title}`)
      .join("\n\n")

    bot.sendMessage(msg.chat.id, text, { parse_mode: "HTML" })
  })

  console.log("🤖 Bot commands /delete and /list registered")
}

module.exports = { deletePostById, registerDeleteCommand }