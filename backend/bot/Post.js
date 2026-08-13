// const mongoose = require("mongoose")

// const PostSchema = new mongoose.Schema({
//   id:      { type: String, required: true, unique: true },
//   type:    { type: String, default: "company" },
//   title:   { type: String, required: true },
//   date:    { type: String, required: true },
//   tags:    [String],
//   cover:   String,
//   photos:  [String],
//   url:     String,
//   videos:  [String],
//   video:   String,
//   excerpt: String,
//   content: String,
//   source:  { type: String, default: "telegram" },
//   telegramUrl: String,
// status: { type: String, default: "pending", enum: ["pending", "published"] },  
// }, { timestamps: true })

// module.exports = mongoose.model("Post", PostSchema)
const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
  id:      { type: String, required: true, unique: true },
  type:    { type: String, default: "company" },
  title:   { type: String, required: true },
  date:    { type: String, required: true },
  tags:    [String],
  cover:   String,
  photos:  [String],
  url:     String,
  videos:  [String],
  video:   String,
  excerpt: String,
  content: String,
  source:  { type: String, default: "telegram" },
  telegramUrl: String,
  status: { type: String, default: "pending", enum: ["pending", "published"] },

  // ── Рубрика (журнальная секция) ──────────────────────────────────────
  // Значения соответствуют id из frontend/config/sections.js
  // (construction, riders, guides, events, industry). Не enum-ится жёстко,
  // чтобы можно было добавлять рубрики на фронте без миграции схемы.
  section: { type: String, default: "construction" },

  // ── Автор материала (опционально) ────────────────────────────────────
  author: String,

  // ── CTA под постом ────────────────────────────────────────────────────
  // undefined/отсутствует — использовать CTA рубрики по умолчанию
  // false                — CTA скрыт для этого поста
  // { title, text, buttonLabel, buttonUrl } — свой CTA
  cta: { type: mongoose.Schema.Types.Mixed, default: undefined },

}, { timestamps: true })

module.exports = mongoose.model("Post", PostSchema)