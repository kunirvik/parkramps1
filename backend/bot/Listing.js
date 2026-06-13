
const mongoose = require("mongoose")

const ListingSchema = new mongoose.Schema(
  {
    // ─ ОСНОВНЫЕ ПОЛЯ ────────────────────────────────────────────────────────

    id: {
      type: String,
      required: true,
      unique: true, // unique уже создаёт индекс, отдельный index: true не нужен
      trim: true,
    },

    title: {
      type: String,
      required: true,
      maxlength: 200,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      maxlength: 2000,
      trim: true,
    },

    price: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      default: "other",
      enum: ["mtb", "bmx", "skate", "parts", "clothing", "other"],
    },

    // ─ МЕДИА ────────────────────────────────────────────────────────────────

    photos: [
      {
        originalName: { type: String, default: "" },
        filename: { type: String, default: "" }, // unique_name_compressed.webp
        fileSize: { type: Number, default: 0 },  // в байтах
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // ─ КОНТАКТЫ ─────────────────────────────────────────────────────────────

    contactUsername: {
      type: String,
      default: "",
      trim: true,
    },

    contactPhone: {
      type: String,
      default: "",
      trim: true,
    },

    telegramId: {
      type: String,
      required: true,
      trim: true,
    },

    telegramUsername: {
      type: String,
      default: "",
      trim: true,
    },

    // ─ СТАТУС И МОДЕРАЦИЯ ──────────────────────────────────────────────────

    status: {
      type: String,
      default: "pending",
      enum: ["pending", "published", "rejected", "expired"],
    },

    rejectReason: {
      type: String,
      default: "",
      trim: true,
    },

    // ─ ДЕДЛАЙНЫ ────────────────────────────────────────────────────────────

    publishedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    // ─ АНТИ-ДУБЛИ ──────────────────────────────────────────────────────────

    listingHash: {
      type: String,
      default: null,
      trim: true,
    },

    // ─ ПРОСМОТРЫ ───────────────────────────────────────────────────────────

    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Оставляем для совместимости с текущим API.
    // Но в будущем лучше вынести просмотры в отдельную коллекцию/Redis.
    viewedBy: [
      {
        userId: { type: String, required: true },
        viewedAt: { type: Date, default: Date.now },
      },
    ],

    lastViewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    collection: "listings",
  }
)

// ═══════════════════════════════════════════════════════════════════════════════
// ИНДЕКСЫ
// ═══════════════════════════════════════════════════════════════════════════════

// Основные запросы
ListingSchema.index({ status: 1 })
ListingSchema.index({ telegramId: 1, status: 1 })
ListingSchema.index({ category: 1, status: 1 })

// Сортировки
ListingSchema.index({ viewCount: -1 })
ListingSchema.index({ createdAt: -1 })
ListingSchema.index({ publishedAt: -1 })

// Проверка дублей за последние 24 часа
ListingSchema.index({ telegramId: 1, listingHash: 1, createdAt: -1 })

// Поиск истекающих / опубликованных
ListingSchema.index({ expiresAt: 1, status: 1 })

// TTL INDEX
// MongoDB удалит документ через 1 час после expiresAt.
// Отдельный expiresAt index в поле не нужен.
ListingSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 3600,
    sparse: true,
  }
)

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

ListingSchema.pre("save", function (next) {
  if (this.title) this.title = this.title.trim()
  if (this.description) this.description = this.description.trim()
  if (this.price) this.price = this.price.trim()
  if (this.contactUsername) this.contactUsername = this.contactUsername.trim()
  if (this.contactPhone) this.contactPhone = this.contactPhone.trim()
  if (this.telegramId) this.telegramId = this.telegramId.trim()
  if (this.telegramUsername) this.telegramUsername = this.telegramUsername.trim()
  if (this.rejectReason) this.rejectReason = this.rejectReason.trim()
  if (this.listingHash) this.listingHash = this.listingHash.trim()

  next()
})

ListingSchema.post("deleteOne", { document: true, query: false }, async function () {
  console.log(`[Listing] Document deleted: ${this.id}`)
})

// ═══════════════════════════════════════════════════════════════════════════════
// METHODS
// ═══════════════════════════════════════════════════════════════════════════════

ListingSchema.methods.isExpired = function () {
  if (!this.expiresAt) return false
  return new Date() > this.expiresAt
}

ListingSchema.methods.getAgeInDays = function () {
  if (!this.createdAt) return 0
  const ageMs = Date.now() - this.createdAt.getTime()
  return Math.max(0, Math.floor(ageMs / (1000 * 60 * 60 * 24)))
}

ListingSchema.methods.getDaysUntilExpiry = function () {
  if (!this.expiresAt) return null

  const diffMs = this.expiresAt.getTime() - Date.now()
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
}

ListingSchema.methods.toJSON = function () {
  const obj = this.toObject()

  obj.isExpired = this.isExpired()
  obj.daysUntilExpiry = this.getDaysUntilExpiry()
  obj.ageInDays = this.getAgeInDays()

  delete obj.__v

  return obj
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATIC METHODS
// ═══════════════════════════════════════════════════════════════════════════════

ListingSchema.statics.findByUser = function (telegramId, status = null) {
  const query = { telegramId }

  if (status) {
    query.status = status
  }

  return this.find(query).sort({ createdAt: -1 })
}

ListingSchema.statics.findPublished = function () {
  return this.find({
    status: "published",
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } },
    ],
  }).sort({ createdAt: -1 })
}

ListingSchema.statics.findExpired = function () {
  const now = new Date()

  return this.find({
    status: "published",
    expiresAt: {
      $lt: now,
      $ne: null,
    },
  })
}

ListingSchema.statics.findTopByViews = function (limit = 10) {
  return this.find({
    status: "published",
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } },
    ],
  })
    .sort({ viewCount: -1 })
    .limit(limit)
}

ListingSchema.statics.findByCategory = function (category) {
  return this.find({
    category,
    status: "published",
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } },
    ],
  }).sort({ createdAt: -1 })
}

ListingSchema.statics.findDuplicate = function (telegramId, listingHash) {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  return this.findOne({
    telegramId,
    listingHash,
    createdAt: { $gt: oneDayAgo },
  })
}

ListingSchema.statics.getCategoryStats = function () {
  return this.aggregate([
    {
      $match: {
        status: "published",
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: null },
          { expiresAt: { $gt: new Date() } },
        ],
      },
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalViews: { $sum: "$viewCount" },
      },
    },
    { $sort: { count: -1 } },
  ])
}

ListingSchema.statics.updateStatus = function (ids, newStatus) {
  return this.updateMany(
    { id: { $in: ids } },
    { $set: { status: newStatus } }
  )
}

module.exports = mongoose.model("Listing", ListingSchema)