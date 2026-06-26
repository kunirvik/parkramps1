export function buildGallerySlides(key, products, extraCategories) {
  // 1) если это виртуальная категория
  const extra = extraCategories.find(c => c.name === key);
  if (extra) return extra.slides;

  // 2) иначе ищем продукт
  const product = products.find(p => p.name === key);
  if (!product) return [];

  return product.sample || [];
}