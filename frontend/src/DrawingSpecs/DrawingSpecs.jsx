const LINE = "1px solid rgba(255,255,255,0.35)";
const LINE_SOFT = "1px solid rgba(255,255,255,0.18)";

export default function DrawingSpecs({ product }) {
  if (!product?.specs?.length) return null;

  return (
    <div
      className="w-full"
      style={{
        background: "rgba(255, 255, 255, 0.12)",
        border: LINE,
        borderRadius: 0,
      }}
    >
      {/* Верхний блок: назва / номер / масштаб */}
      <div className="grid grid-cols-[1fr_auto_auto]" style={{ borderBottom: LINE }}>
        {/* <div className="px-3 py-2.5" style={{ borderRight: LINE_SOFT }}>
          <div className="text-[9px] uppercase tracking-widest text-white/40 leading-none mb-1 font-mono">
            Найменування
          </div>
          <div className="text-sm sm:text-base font-semibold text-white uppercase tracking-wide leading-tight font-mono">
            {product.name}
          </div>
        </div> */}

        {/* <div
          className="px-3 py-2.5 flex flex-col items-center justify-center"
          style={{ borderRight: LINE_SOFT, minWidth: 64 }}
        >
          <div className="text-[9px] uppercase text-white/40 leading-none mb-1 font-mono">
            Масштаб
          </div>
          <div className="text-sm text-white font-mono font-medium">
            {product.scale ? `1:${(1 / product.scale).toFixed(2).replace(/\.?0+$/, "")}` : "1:1"}
          </div>
        </div> */}

        {/* <div className="px-3 py-2.5 flex flex-col items-center justify-center" style={{ minWidth: 56 }}>
          <div className="text-[9px] uppercase text-white/40 leading-none mb-1 font-mono">
            Рік
          </div>
          <div className="text-sm text-white font-mono font-medium">{product.year}</div>
        </div> */}
      </div>

      {/* Сетка характеристик — жёсткие ячейки */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3"> */}
      
<div
  className="grid"
  style={{
    gridTemplateColumns: `repeat(auto-fit,minmax(clamp(50px,10vw,70px),1fr))`,
  }}
>

        {product.specs.map((spec, i) => {
          const cols = 3; // sm breakpoint columns
          const isLastInRowSm = (i + 1) % cols === 0;
          return (
            <div
              key={i}
       
              style={{ padding: "clamp(8px,1vw,14px)",
                borderBottom: LINE_SOFT,
                borderRight: isLastInRowSm ? "none" : LINE_SOFT,
              }}
            >
              <div style={{
  fontSize: "clamp(8px,.7vw,10px)",
  letterSpacing: ".15em",
}} className=" uppercase tracking-widest text-white/40 leading-none mb-1 font-mono">
                {spec.label}
              </div>
              <div style={{
  fontSize: "clamp(11px,1vw,15px)",
}} className=" font-medium text-white font-mono leading-tight">
                {spec.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Нижняя строка — номер креслення */}
      {/* <div className="px-3 py-2 flex items-center justify-between" style={{ borderTop: LINE }}>
        <span className="text-[9px] sm:text-[10px] text-white/50 font-mono tracking-wide">
          {product.drawingNumber || "SAMUTIA"}
        </span>
        <span className="text-[9px] sm:text-[10px] text-white/30 uppercase tracking-widest font-mono">
          engineering
        </span>
      </div> */}
    </div>
  );
}