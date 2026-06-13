

const Listing = require("./Listing")
const { notifyExpired } = require("./Marketplacebot")
const { redis } = require("../redis")

async function expireListings() {
  console.log("⏰ [cron] checking expired listings...")
  
  try {
    // ✅ БОЛЕЕ ЭФФЕКТИВНЫЙ ПОИСК
    const now = new Date()
    
    const expired = await Listing.find({
      status: "published",
      expiresAt: { 
        $lt: now,      // Меньше текущего времени
        $ne: null      // Не null
      }
    })
    
    if (!expired.length) {
      console.log("⏰ [cron] nothing to expire")
      return
    }

    // Обновить статус
    const expiredIds = expired.map(l => l.id)
    
    await Listing.updateMany(
      { id: { $in: expiredIds } },
      { $set: { status: "expired", expiresAt: null } }
    )
    
    // Уведомить пользователей
    await Promise.allSettled(
      expired.map(l => notifyExpired(l))
    )
    
    // ✅ ИНВАЛИДИРОВАТЬ КЕШ
    await redis.invalidateListingsCache()
    
    console.log(`✅ [cron] expired ${expired.length} listings`)
    
  } catch (e) {
    console.error("❌ [cron] error:", e.message)
  }
}

function startListingsCron() {
  console.log("⏰ Listings cron started (every 24h)")
  
  // Первый запуск через 5 сек
  setTimeout(expireListings, 5_000)
  
  // Потом каждые 24 часа (или чаще для точности)
  setInterval(expireListings, 24 * 60 * 60 * 1000)
}

module.exports = { startListingsCron }