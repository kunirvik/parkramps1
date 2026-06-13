

const TelegramBot = require("node-telegram-bot-api")
const cloudinary  = require("../cloudinary.config")
const Post        = require("../bot/Post")
const { registerDeleteCommand } = require("../deletePost") 
const bans = require("./user-bans.js")
// ── Helpers ───────────────────────────────────────────────────────────────

function slugify(str = "") {
  return str
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s]/gi, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50) || "post"
}

function detectVideoUrl(text = "") {
  const match = text.match(
    /(https?:\/\/(?:youtu\.be\/|(?:www\.)?youtube\.com\/watch\?v=|rumble\.com\/)[^\s]+)/
  )
  return match ? match[1] : null
}

function extractTags(text = "") {
  return [...text.matchAll(/#(\w+)/g)].map(m => m[1])
}

function getTitle(text = "") {
  return text.split("\n")[0].replace(/#\w+/g, "").trim().slice(0, 100)
}

function getBody(text = "") {
  return text.split("\n").slice(1).join("\n").trim()
}


function makePostId(msg) {
  const originMsgId  = msg.forward_from_message_id || msg.message_id
  const originChatId = msg.forward_from_chat?.id || msg.chat.id
  return `tg-${originChatId}-${originMsgId}`
}

function makeAlbumId(mediaGroupId) {
  return `tg-album-${mediaGroupId}`
}



async function uploadToCloudinary(fileUrl, fileUniqueId, folder = "blog", resourceType = "image") {
  const publicId = `${folder}/${fileUniqueId}`


  try {
    const existing = await cloudinary.api.resource(publicId, { resource_type: resourceType })
    console.log(`☁️  Cloudinary: already exists — ${publicId}`)
    return existing.secure_url
  } catch (_) {
    
  }

  const result = await cloudinary.uploader.upload(fileUrl, {
    folder,
    resource_type: resourceType,
    public_id:     fileUniqueId,   // стабильный ID файла от Telegram
    overwrite:     false,          // не перезаписывать существующий
  })
  console.log(`☁️  Cloudinary: uploaded — ${publicId}`)
  return result.secure_url
}

async function getCloudinaryUrl(bot, photo, isVideo = false) {
  const fileObj      = Array.isArray(photo) ? photo[photo.length - 1] : photo
  const fileLink     = await bot.getFileLink(fileObj.file_id)
  const fileUniqueId = fileObj.file_unique_id
  return uploadToCloudinary(fileLink, fileUniqueId, "blog", isVideo ? "video" : "image")
}



async function savePost(data) {
  const doc = await Post.findOneAndUpdate(
    { id: data.id },
    { $set: data },           // $set — не стирает поля, которых нет в data
    { upsert: true, new: true }
  )
  console.log(`✅ MongoDB saved: ${data.id}`)
  return doc
}


function makeTelegramUrl(msgId) {
  const username = process.env.TELEGRAM_CHANNEL_USERNAME
  if (!username || !msgId) return null
  return `https://t.me/${username}/${msgId}`
}
// ── Обработка одиночного сообщения ────────────────────────────────────────

async function handleMsg(bot, msg) {
  const text  = msg.text || msg.caption || ""
  const title = getTitle(text) || "Без заголовка"

  // Дата оригинального поста (Unix → ISO)
  const rawDate = msg.forward_date || msg.date
  const date    = new Date(rawDate * 1000).toISOString().slice(0, 10)

  // Стабильный уникальный ID
  const id = makePostId(msg)


// ↓ originMsgId нужен для URL (message_id поста в канале)
  const originMsgId = msg.forward_from_message_id || msg.message_id


  const base = {
    id, title, type: "company", date,
    tags:    extractTags(text),
    url:     detectVideoUrl(text),
    content: getBody(text),
    excerpt: title.slice(0, 120),
    source:  "telegram",
     telegramUrl: makeTelegramUrl(originMsgId),
       status: "pending",
  }

  if (msg.photo) {
    try {
      const coverUrl = await getCloudinaryUrl(bot, msg.photo)
      await savePost({ ...base, cover: coverUrl })
    } catch (e) { console.error("❌ Photo error:", e.message) }
    return
  }

  if (msg.video) {
    try {
      const videoUrl = await getCloudinaryUrl(bot, msg.video, true)
      await savePost({ ...base, video: videoUrl })
    } catch (e) { console.error("❌ Video error:", e.message) }
    return
  }

  if (text) await savePost(base)
}



const mediaGroups = {}

function handleMediaGroup(bot, msg) {
  const groupId = msg.media_group_id

  if (!mediaGroups[groupId]) {
    mediaGroups[groupId] = {
      photos:   [],
      caption:  msg.caption || "",
      rawDate:  msg.forward_date || msg.date,
      groupId,
       originMsgId: msg.forward_from_message_id || msg.message_id,
    }
  }

  const group = mediaGroups[groupId]
  if (msg.photo) group.photos.push(msg.photo)

  clearTimeout(group.timer)
  group.timer = setTimeout(async () => {
    await processAlbum(bot, group)
    delete mediaGroups[groupId]
  }, 1500)
}

async function processAlbum(bot, group) {
  try {
    const { photos, caption, rawDate, groupId, originMsgId} = group
    const text  = caption || ""
    const title = getTitle(text) || "Без заголовка"
    const date  = new Date(rawDate * 1000).toISOString().slice(0, 10)
    const id    = makeAlbumId(groupId)   // стабильный ID альбома

    // Загружаем все фото (дедупликация через file_unique_id)
    const cdnUrls = await Promise.all(photos.map(ph => getCloudinaryUrl(bot, ph)))
    const [cover, ...restPhotos] = cdnUrls

    await savePost({
      id, title, type: "company", date,
      tags:    extractTags(text),
      cover,
      photos:  restPhotos,
      url:     detectVideoUrl(text),
      content: getBody(text),
      excerpt: title.slice(0, 120),
      source:  "telegram",
      telegramUrl: makeTelegramUrl(originMsgId),  
    })
  } catch (e) {
    console.error("❌ Album error:", e.message)
  }
}

// ── Bot factory ───────────────────────────────────────────────────────────

function isTelegramAdmin(msg) {
  const adminId = process.env.ADMIN_TELEGRAM_ID
  return adminId && String(msg.from.id) === String(adminId)
} 


function createBot(app) {
  const token      = process.env.TELEGRAM_BOT_TOKEN
  const channelId  = process.env.TELEGRAM_CHANNEL_ID
  const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL

  if (!token) {
    console.warn("⚠️  TELEGRAM_BOT_TOKEN not set, bot disabled")
    return null
  }

  const bot = new TelegramBot(token)
if (webhookUrl) { 
  bot.setWebHook(`${webhookUrl}/webhook`)
  
    .then(() => console.log(`🔗 Webhook set: ${webhookUrl}/webhook`))
    .catch(e  => console.error("❌ Webhook error:", e.message))
} else{
  console .warn("⚠️  TELEGRAM_WEBHOOK_URL not set, using polling")}
  app.post("/webhook", (req, res) => {
    console.log("📥 Webhook:", JSON.stringify(req.body).slice(0, 120))
    bot.processUpdate(req.body)
    res.sendStatus(200)
  })

  bot.onText(/\/ban (.+)/, async (msg, match) => {
  const adminId = process.env.ADMIN_TELEGRAM_ID
  if (String(msg.from.id) !== String(adminId)) return
  try {
    const input = match?.[1]?.trim()
    if (!input) {
      return bot.sendMessage(
        msg.chat.id,
        "Использование: /ban <userId> <reason>"
      )
    }
  const args = match[1].split(' ')
  const userId = args[0]
  const reason = args.slice(1).join(' ') || 'No reason'

  const result = await bans.banUser(userId, { reason, bannedBy: msg.from.id })

 return bot.sendMessage(msg.chat.id, 
    result.ok 
      ? `✅ Banned ${userId}: ${reason}`
      : `❌ Error: ${result.error}`
  )
}
catch (e) {
    return bot.sendMessage(msg.chat.id, `❌ Error: ${e.message}`)
  }
})

// bot.onText(/\/unban (.+)/, async (msg, match) => {
  
//   const adminId = process.env.ADMIN_TELEGRAM_ID
//   if (String(msg.from.id) !== String(adminId)) return

//   const userId = match[1]
//   const result = await bans.revokeBan(userId, msg.from.id)

//   bot.sendMessage(msg.chat.id,
//     result.ok 
//       ? `✅ Unbanned ${userId}`
//       : `❌ Error: ${result.error}`
//   )
// })
bot.onText(/\/unban(?:\s+(.+))?/, async (msg, match) => {
  if (!isTelegramAdmin(msg)) return

  try {
    const userId = match?.[1]?.trim()

    if (!userId) {
      return bot.sendMessage(
        msg.chat.id,
        "Использование: /unban <userId>"
      )
    }

    const result = await bans.revokeBan(userId, String(msg.from.id))

    return bot.sendMessage(
      msg.chat.id,
      result.ok
        ? `✅ Unbanned ${userId}`
        : `❌ Error: ${result.error}`
    )
  } catch (e) {
    return bot.sendMessage(msg.chat.id, `❌ Error: ${e.message}`)
  }
})


bot.onText(/^\/bans$/, async (msg) => {
  if (!isTelegramAdmin(msg)) return

  try {
    const banList = await bans.getAllActiveBans()

    if (!banList.length) {
      return bot.sendMessage(msg.chat.id, "No active bans")
    }

    const text = banList
      .map((b) => {
        const username = b.username ? ` @${b.username}` : ""
        const daysLeft = b.expiresAt
          ? Math.max(
              0,
              Math.ceil((new Date(b.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))
            )
          : null

        const durationText = b.isPermanent
          ? "♾️ Permanent"
          : `⏰ ${daysLeft} days left`

        return `• <code>${b.userId}</code>${username}\n${b.reason}\n${durationText}`
      })
      .join("\n\n")

    // Ограничим длину сообщения
    const safeText = text.length > 3500 ? text.slice(0, 3500) + "\n\n…" : text

    return bot.sendMessage(msg.chat.id, safeText, { parse_mode: "HTML" })
  } catch (e) {
    return bot.sendMessage(msg.chat.id, `❌ Error: ${e.message}`)
  }
})

bot.onText(/^\/admin$/, async (msg) => {
  if (!isTelegramAdmin(msg)) return

  return bot.sendMessage(
    msg.chat.id,
    [
      "Admin commands:",
      "/ban <userId> <reason>",
      "/unban <userId>",
      "/bans",
      "/delete <postId>",
      "/list"
    ].join("\n")
  )
})


  // Новые посты канала
  bot.on("channel_post", async (msg) => {
    if (channelId && String(msg.chat.id) !== String(channelId)) return
    console.log("📨 channel_post:", msg.chat.id, "msg_id:", msg.message_id)
    if (msg.media_group_id) return handleMediaGroup(bot, msg)
    await handleMsg(bot, msg)
  })

  // Пересланные боту в личку (для ручного добавления старых постов)
  bot.on("message", async (msg) => {
    if (!isTelegramAdmin(msg)) return
    
      // if (String(msg.from.id) !== String(process.env.ADMIN_TELEGRAM_ID)) return
      
    if (!msg.forward_from_chat && !msg.forward_origin) return
    console.log("📨 Forwarded msg, origin_id:", msg.forward_from_message_id)
    if (msg.media_group_id) return handleMediaGroup(bot, msg)
    await handleMsg(bot, msg)
  })

  console.log("🤖 Telegram bot (webhook) started")
  registerDeleteCommand(bot)
  return bot
}

module.exports = { createBot }