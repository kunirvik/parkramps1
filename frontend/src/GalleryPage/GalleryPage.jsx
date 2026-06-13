

import { useMemo }          from "react";
import { useLocation }      from "react-router-dom";
import FilmGallery          from "../FilmGallery";
 
import productCatalogSets       from "../data/productCatalogSets";
import productCatalogRamps      from "../data/productCatalogRamps";
import productCatalogSkateparks from "../data/productCatalogSkateparks";
 
export const productSlides = [
  ...productCatalogSets.flatMap((p) =>
    (p.sample || []).map((s) => ({ ...s, cat: s.type === "video" ? "video" : "sets" }))
  ),
  ...productCatalogRamps.flatMap((p) =>
    (p.sample || []).map((s) => ({ ...s, cat: s.type === "video" ? "video" : "ramps" }))
  ),
  ...productCatalogSkateparks.flatMap((p) =>
    (p.sample || []).map((s) => ({ ...s, cat: s.type === "video" ? "video" : "skateparks" }))
  ),
];
 
export default function GalleryPage() {
  const location   = useLocation();
  const startIndex = location.state?.startIndex ?? 0;
 
  const safeIndex = useMemo(
    () =>
      Number.isFinite(startIndex) && startIndex >= 0 && startIndex < productSlides.length
        ? startIndex
        : 0,
    [startIndex]
  );
 
  return <FilmGallery slides={productSlides} startIndex={safeIndex} />;
}
