export default function DrawingSpecs({ product }) {
  if (!product?.specs?.length) return null;

  return (
    <div
      className="w-full rounded-lg overflow-hidden"
      style={{
        background: "rgba(30,30,30,0.45)",
        backdropFilter: "blur(14px)",
        border: "0.5px solid rgba(255,255,255,0.14)",
      }}
    >
      {/* Название детали */}
      <div
        className="grid grid-cols-[1fr_auto]"
        style={{ borderBottom: "0.5px solid rgba(255,255,255,0.14)" }}
      >
        <div
          className="px-3 py-2.5"
          style={{ borderRight: "0.5px solid rgba(255,255,255,0.14)" }}
        >
          <div className="text-[9px] uppercase tracking-wider text-white/40 leading-none mb-1">
            Назва
          </div>
          <div className="text-sm sm:text-base font-medium text-white/90 leading-tight uppercase">
            {product.name}
          </div>
        </div>
        <div className="px-3 py-2.5 flex flex-col items-center justify-center min-w-[64px]">
          <div className="text-[9px] uppercase text-white/40 leading-none mb-1">
            Рік
          </div>
          <div className="text-sm text-white/90 font-medium">{product.year}</div>
        </div>
      </div>

      {/* Сетка характеристик */}
      <div className="grid grid-cols-2 sm:grid-cols-3">
        {product.specs.map((spec, i) => (
          <div
            key={i}
            className="px-3 py-2.5"
            style={{
              borderBottom: "0.5px solid rgba(255,255,255,0.1)",
              borderRight: "0.5px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-white/40 leading-none mb-1">
              {spec.label}
            </div>
            <div className="text-xs sm:text-sm font-medium text-white/90 font-mono leading-tight">
              {spec.value}
            </div>
          </div>
        ))}
      </div>

      {/* Нижняя подпись */}
      <div className="px-3 py-2 flex items-center justify-between">
        <span className="text-[9px] sm:text-[10px] text-white/35 font-mono">
          {product.drawingNumber || "SAMUTIA"}
        </span>
        <span className="text-[9px] sm:text-[10px] text-white/25 uppercase tracking-wider">
          engineering
        </span>
      </div>
    </div>
  );
}