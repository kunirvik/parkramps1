// const LINE = "1px solid rgba(255,255,255,0.35)";
// const LINE_SOFT = "1px solid rgba(255,255,255,0.18)";

// export default function DrawingSpecs({ product }) {
//   if (!product?.specs?.length) return null;

//   return (
//     <div
//       className="w-full"
//       style={{
//         background: "rgba(255, 255, 255, 0.12)",
//         border: LINE,
//         borderRadius: 0,
//       }}
//     >
//       {/* Верхний блок: назва / номер / масштаб */}
//       <div className="grid grid-cols-[1fr_auto_auto]" style={{ borderBottom: LINE }}>
//         {/* <div className="px-3 py-2.5" style={{ borderRight: LINE_SOFT }}>
//           <div className="text-[9px] uppercase tracking-widest text-white/40 leading-none mb-1 font-mono">
//             Найменування
//           </div>
//           <div className="text-sm sm:text-base font-semibold text-white uppercase tracking-wide leading-tight font-mono">
//             {product.name}
//           </div>
//         </div> */}

//         {/* <div
//           className="px-3 py-2.5 flex flex-col items-center justify-center"
//           style={{ borderRight: LINE_SOFT, minWidth: 64 }}
//         >
//           <div className="text-[9px] uppercase text-white/40 leading-none mb-1 font-mono">
//             Масштаб
//           </div>
//           <div className="text-sm text-white font-mono font-medium">
//             {product.scale ? `1:${(1 / product.scale).toFixed(2).replace(/\.?0+$/, "")}` : "1:1"}
//           </div>
//         </div> */}

//         {/* <div className="px-3 py-2.5 flex flex-col items-center justify-center" style={{ minWidth: 56 }}>
//           <div className="text-[9px] uppercase text-white/40 leading-none mb-1 font-mono">
//             Рік
//           </div>
//           <div className="text-sm text-white font-mono font-medium">{product.year}</div>
//         </div> */}
//       </div>

//       {/* Сетка характеристик — жёсткие ячейки */}
//       {/* <div className="grid grid-cols-1 sm:grid-cols-3"> */}
      
// <div
//   className="grid"
//   style={{
//     gridTemplateColumns: `repeat(auto-fit,minmax(clamp(50px,10vw,70px),1fr))`,
//   }}
// >

//         {product.specs.map((spec, i) => {
//           const cols = 3; // sm breakpoint columns
//           const isLastInRowSm = (i + 1) % cols === 0;
//           return (
//             <div
//               key={i}
       
//               style={{ padding: "clamp(8px,1vw,14px)",
//                 borderBottom: LINE_SOFT,
//                 // borderRight: isLastInRowSm ? "none" : LINE_SOFT,
//                 borderRight: LINE_SOFT,
//               }}
//             >
//               <div style={{
//   fontSize: "clamp(8px,.7vw,10px)",
//   letterSpacing: ".15em",
// }} className=" uppercase tracking-widest text-white/40 leading-none mb-1 font-mono">
//                 {spec.label}
//               </div>
//               <div style={{
//   fontSize: "clamp(11px,1vw,15px)",
// }} className=" font-medium text-white font-mono leading-tight">
//                 {spec.value}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Нижняя строка — номер креслення */}
//       {/* <div className="px-3 py-2 flex items-center justify-between" style={{ borderTop: LINE }}>
//         <span className="text-[9px] sm:text-[10px] text-white/50 font-mono tracking-wide">
//           {product.drawingNumber || "SAMUTIA"}
//         </span>
//         <span className="text-[9px] sm:text-[10px] text-white/30 uppercase tracking-widest font-mono">
//           engineering
//         </span>
//       </div> */}
//     </div>
//   );
// }
export default function DrawingSpecs({ product }) {
  if (!product?.specs?.length) return null;

  const getSpec = (...names) =>
    product.specs.find((spec) =>
      names.some((name) =>
        spec.label?.toLowerCase().includes(name.toLowerCase())
      )
    )?.value;

  const width = getSpec("ширина", "ширина", "width");
  const height = getSpec("высота", "height");
  const depth = getSpec("глубина", "depth");

  return (
    <div className="w-full">
      <div
        className="relative w-full"
        style={{
          minHeight: "clamp(260px, 30vw, 420px)",
        }}
      >
        {/* =====================================================
            SVG — размерные линии
        ====================================================== */}

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* ================= WIDTH ================= */}

          {/* выносные линии */}
          <line
            x1="18"
            y1="78"
            x2="18"
            y2="90"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="0.25"
          />

          <line
            x1="82"
            y1="78"
            x2="82"
            y2="90"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="0.25"
          />

          {/* размерная линия */}
          <line
            x1="18"
            y1="88"
            x2="82"
            y2="88"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="0.3"
          />

          {/* стрелка слева */}
          <line
            x1="18"
            y1="88"
            x2="21"
            y2="86.5"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="0.3"
          />

          <line
            x1="18"
            y1="88"
            x2="21"
            y2="89.5"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="0.3"
          />

          {/* стрелка справа */}
          <line
            x1="82"
            y1="88"
            x2="79"
            y2="86.5"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="0.3"
          />

          <line
            x1="82"
            y1="88"
            x2="79"
            y2="89.5"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="0.3"
          />

          {/* ================= HEIGHT ================= */}

          {/* выносные линии */}
          <line
            x1="82"
            y1="18"
            x2="92"
            y2="18"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="0.25"
          />

          <line
            x1="82"
            y1="78"
            x2="92"
            y2="78"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="0.25"
          />

          {/* размерная линия */}
          <line
            x1="90"
            y1="18"
            x2="90"
            y2="78"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="0.3"
          />

          {/* стрелка сверху */}
          <line
            x1="90"
            y1="18"
            x2="88.5"
            y2="21"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="0.3"
          />

          <line
            x1="90"
            y1="18"
            x2="91.5"
            y2="21"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="0.3"
          />

          {/* стрелка снизу */}
          <line
            x1="90"
            y1="78"
            x2="88.5"
            y2="75"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="0.3"
          />

          <line
            x1="90"
            y1="78"
            x2="91.5"
            y2="75"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="0.3"
          />
        </svg>

        {/* =====================================================
            ЦЕНТРАЛЬНАЯ ОБЛАСТЬ ТОВАРА
        ====================================================== */}

        <div
          className="absolute"
          style={{
            left: "18%",
            right: "18%",
            top: "10%",
            bottom: "22%",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
            draggable="false"
          />
        </div>

        {/* =====================================================
            WIDTH
        ====================================================== */}

        {width && (
          <div
            className="absolute text-white font-mono whitespace-nowrap"
            style={{
              left: "50%",
              bottom: "3%",
              transform: "translateX(-50%)",
              fontSize: "clamp(9px, 0.8vw, 12px)",
              letterSpacing: "0.08em",
            }}
          >
            {width}
          </div>
        )}

        {/* =====================================================
            HEIGHT
        ====================================================== */}

        {height && (
          <div
            className="absolute text-white font-mono whitespace-nowrap"
            style={{
              right: "-1%",
              top: "48%",
              transform: "translateY(-50%) rotate(-90deg)",
              transformOrigin: "center",
              fontSize: "clamp(9px, 0.8vw, 12px)",
              letterSpacing: "0.08em",
            }}
          >
            {height}
          </div>
        )}

        {/* =====================================================
            DEPTH
        ====================================================== */}

        {depth && (
          <div
            className="absolute text-white/70 font-mono"
            style={{
              left: "8%",
              top: "8%",
              fontSize: "clamp(9px, 0.8vw, 12px)",
              letterSpacing: "0.08em",
            }}
          >
            ↗ {depth}
          </div>
        )}
      </div>
    </div>
  );
}