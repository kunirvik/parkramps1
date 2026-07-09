import { useState } from "react";
import DrawingSpecs from "./DrawingSpecs";

export default function ProductDrawing({ product }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!product) return null;

  const drawingImages = [product.image, ...(product.altImages || [])];
  if (!drawingImages.length && !product.specs?.length) return null;

  return (
    <div className="w-full mb-4 flex flex-col sm:flex-row gap-3">
      {/* Чертёж */}
      {drawingImages.length > 0 && (
        <div
          className="w-full sm:w-3/5 rounded-lg overflow-hidden flex flex-col"
          style={{
            background: "rgba(30,30,30,0.45)",
            backdropFilter: "blur(14px)",
            border: "0.5px solid rgba(255,255,255,0.14)",
          }}
        >
          <div className="w-full h-[220px] sm:h-[280px] flex items-center justify-center p-3">
            <img
              src={drawingImages[activeIndex]}
              alt={`Креслення ${product.name}`}
              className="max-h-full max-w-full object-contain"
              draggable="false"
              style={{
                filter: "grayscale(0.15) contrast(1.05)",
              }}
            />
          </div>

          {/* Мини-навигация по видам чертежа */}
          {drawingImages.length > 1 && (
            <div
              className="flex gap-1.5 px-3 py-2 overflow-x-auto"
              style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)" }}
            >
              {drawingImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="flex-shrink-0 rounded-md overflow-hidden"
                  style={{
                    width: 44,
                    height: 44,
                    border:
                      i === activeIndex
                        ? "1.5px solid rgba(255,255,255,0.8)"
                        : "0.5px solid rgba(255,255,255,0.15)",
                    opacity: i === activeIndex ? 1 : 0.5,
                    transition: "opacity 0.2s, border-color 0.2s",
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-contain bg-white/5"
                    draggable="false"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Штамп с характеристиками */}
      <div className="w-full sm:w-2/5">
        <DrawingSpecs product={product} />
      </div>
    </div>
  );
}