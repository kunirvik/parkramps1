import { useState } from "react";
import DrawingSpecs from "./DrawingSpecs";

const LINE = "1px solid rgba(255,255,255,0.35)";
const LINE_SOFT = "1px solid rgba(255,255,255,0.18)";

export default function ProductDrawing({ product }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!product) return null;

  const drawingImages = [product.image, ...(product.altImages || [])];
  if (!drawingImages.length && !product.specs?.length) return null;

  return (
    <div className="w-full mb-4 flex flex-col sm:flex-row gap-3">


      {/* Штамп */}
      <div className="w-full sm:w-2/5">
        <DrawingSpecs product={product} />
      </div>
    </div>
  );
}