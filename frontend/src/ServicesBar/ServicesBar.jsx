// import { motion, AnimatePresence } from "framer-motion"; 

// const services = [

//   {
//     label: "#розробка та виробництво скейтпаркiв",
//     comment: "// від матеріалу до готової фігури",
//     meta: [
//       { key: "матеріал", value: "фанера / метал" },
//       { key: "строк", value: "погоджується окремо" },
//     ],
//   },
//   {
//     label: "#під ключ",
//     comment: "// повний цикл",
//     active: true,
//     meta: [
//       { key: "вхід", value: "запит або референс" },
//       { key: "вихід", value: "готовий скейтпарк" },
//     ],
//   },
//   {
//     label: "#івенти",
//     comment: "// оренда конструкцій",
//     meta: [
//       { key: "формат", value: "демо / контест / фест" },
//       { key: "монтаж", value: "включено" },
//     ],
//   },
//   {
//     label: "#diy",
//     comment: "// збери сам",
//     meta: [
//       { key: "комплект", value: "розмічений матеріал" },
//       { key: "складність", value: "просто за кресленням" },
//     ],
//   },
// ];

// const SingleLabel = ({ text }) => (
//   // <div className="w-full bg-black border-b border-[#1a1a1a] px-6 py-2 flex items-center font-futura font-light z-50">
//   //   <span className="w-2 h-2 rounded-full bg-[#2a2a2a] mr-3 flex-shrink-0" />

//   //   <span className="text-[17px] tracking-wide px-3 py-1 text-[#555]">
//   //     {text}
//   //   </span>
//   // </div>
//     <div className="flex items-center font-futura font-light">
//     <span className="w-2 h-2 rounded-full bg-[#2a2a2a] mr-3 flex-shrink-0" />
//     <span className="text-[17px] tracking-wide text-[#555] truncate">{text}</span>
//   </div> 
// );
// const AnimatedLabel = ({ text }) => (
//   // <div className="w-full bg-black border-b border-[#1a1a1a] px-6 py-2 flex items-center font-futura font-light z-50 overflow-hidden">
//   //   <span className="w-2 h-2 rounded-full bg-[#2a2a2a] mr-3 flex-shrink-0" />
//   //   <div className="relative h-6 flex-1 overflow-hidden">
//   //     <AnimatePresence mode="wait">
//   //       <motion.span
//   //         key={text}
//   //         initial={{ y: 12, opacity: 0 }}
//   //         animate={{ y: 0, opacity: 1 }}
//   //         exit={{ y: -12, opacity: 0 }}
//   //         transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
//   //         className="absolute left-0 top-1 text-[17px] tracking-wide text-[#555] whitespace-nowrap"
//   //       >
//   //         {text}
//   //       </motion.span>
//   //     </AnimatePresence>
//   //   </div>
//   // </div>
//   <div className="flex items-center font-futura font-light overflow-hidden">
//     <span className="w-2 h-2 rounded-full bg-[#2a2a2a] mr-3 flex-shrink-0" />
//     <div className="relative h-6 flex-1 overflow-hidden">
//       <AnimatePresence mode="wait">
//         <motion.span
//           key={text}
//           initial={{ y: 12, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           exit={{ y: -12, opacity: 0 }}
//           transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
//           // className="absolute left-0 top-1 text-[17px] tracking-wide text-[#555] whitespace-nowrap"
//           className="text-[17px] tracking-wide text-[#555] truncate"
//         >
//           {text}
//         </motion.span>
//       </AnimatePresence>
//     </div>
//   </div>
// ); 
// export default function ServicesBar({ page, category }) {
//   // const category = page?.split("/")[2];
     
//       const  productCategory = page?.split("/")[2];
// // const categoryOther = page?.split("/")[1];
//  const section = page?.split("/")[1];
// const otherSingleLabels = {
 
//     // gallery: "галерея",
//     blog: "блог",
//   }; 

  
//   const singleLabels = {
//     skateparks: "скейтпарки",
//     ramps: "рампи",
//     sets: "фігури",
  
//   };


//   if (section === "gallery") {
//     return <AnimatedLabel text={category || "галерея"} />;
//   }
//   // if (singleLabels[category] || otherSingleLabels[categoryOther]) {
//   //   return <SingleLabel text={singleLabels[category] || otherSingleLabels[categoryOther]} />;
//   // }
//   if (singleLabels[productCategory] || otherSingleLabels[section]) {
//     return <SingleLabel text={singleLabels[productCategory] || otherSingleLabels[section]} />;
//   } 

//   return (
//     <div className="w-full bg-black border-b border-[#1a1a1a]  text-[#555] px-6 py-2 flex items-center font-futura font-light z-50">
//       {/* <span className="w-2 h-2 rounded-full bg-[#2a2a2a]  text-[#555] mr-3 flex-shrink-0" /> */}

//       {services.map((service, index) => (
//         <div key={service.label} className="flex items-center">
//           <div className="relative group">
        
              
         
// <span
//               className="text-[17px] tracking-wide px-3 py-1 text-[#555]"
//            >
//   {service.label}
// </span>

           
//           </div>

        
//         </div>
//       ))}
//     </div>
//   );
// } 

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const services = [
  { label: "▸ розробка та виробництво скейтпаркiв" },
  { label: "▸ під ключ", active: true },
  { label: "▸ івенти" },
  { label: "▸ diy" },
];

const SingleLabel = ({ text }) => (
  <div className="flex items-center font-futura font-light">
    <span className="w-2 h-2 rounded-full bg-[#2a2a2a] mr-3 flex-shrink-0" />
    <span className="text-[17px] tracking-wide text-[#555] truncate">{text}</span>
  </div>
);

const AnimatedLabel = ({ text }) => (
  <div className="flex items-center font-futura font-light overflow-hidden">
    <span className="w-2 h-2 rounded-full bg-[#2a2a2a] mr-3 flex-shrink-0" />
    <div className="relative h-6 flex-1 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-[17px] tracking-wide text-[#555] truncate"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </div>
  </div>
);

function MarqueeLabels({ items, speed = 60 /* px per second */ }) {
  const wrapRef = useRef(null);
  const setRef = useRef(null);
  const [repeat, setRepeat] = useState(2);
  const [setWidth, setSetWidth] = useState(0);

  // измеряем ширину контейнера и одного набора элементов,
  // считаем сколько копий нужно, чтобы гарантированно не было "дыр"
  useEffect(() => {
    const measure = () => {
      const wrapWidth = wrapRef.current?.offsetWidth || 0;
      const oneSetWidth = setRef.current?.scrollWidth || 0;
      if (oneSetWidth > 0) {
        setSetWidth(oneSetWidth);
        // копий должно хватать, чтобы покрыть минимум 2 экрана подряд
        const needed = Math.ceil((wrapWidth * 2) / oneSetWidth) + 1;
        setRepeat(Math.max(2, needed));
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (setRef.current) ro.observe(setRef.current);
    return () => ro.disconnect();
  }, [items]);

  const duration = setWidth > 0 ? setWidth / speed : 20;

  // единица повтора — то, что реально измеряем (repeat = repeat, а анимируем ровно на 1 setWidth)
  const renderSets = Array.from({ length: repeat });

  return (
    <div ref={wrapRef} className="marquee-wrap group relative w-full overflow-hidden">
      <div
        className="marquee-track flex items-center whitespace-nowrap"
        style={{
          animationDuration: `${duration}s`,
          // сдвигаем ровно на ширину одного набора — без округлений типа 50%
          "--marquee-distance": `-${setWidth}px`,
        }}
      >
        {renderSets.map((_, setIndex) => (
          <div
            key={setIndex}
            ref={setIndex === 0 ? setRef : null}
            className="flex items-center gap-10 pr-10 flex-shrink-0"
          >
            {items.map((service, i) => (
              <span
                key={`${setIndex}-${i}`}
                className="text-[17px] tracking-wide text-[#555] flex-shrink-0"
              >
                {service.label}
              </span>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        .marquee-track {
          animation-name: marquee-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .marquee-wrap:hover .marquee-track {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(var(--marquee-distance)); }
        }
      `}</style>
    </div>
  );
}

export default function ServicesBar({ page, category }) {
  const productCategory = page?.split("/")[2];
  const section = page?.split("/")[1];

  const otherSingleLabels = { blog: "блог" };
  const singleLabels = {
    skateparks: "скейтпарки",
    ramps: "рампи",
    sets: "фігури",
  };

  if (section === "gallery") {
    return <AnimatedLabel text={category || "галерея"} />;
  }
  if (singleLabels[productCategory] || otherSingleLabels[section]) {
    return <SingleLabel text={singleLabels[productCategory] || otherSingleLabels[section]} />;
  }

  return (
    <div className="w-full bg-black border-b border-[#1a1a1a] text-[#555] px-6 py-2 font-futura font-light z-50">
      <MarqueeLabels items={services} />
    </div>
  );
}