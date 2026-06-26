

// import { useState, useEffect } from "react";
// import { ChevronDown, ChevronUp } from "lucide-react";

// const Accordion = ({
//   items,
//   defaultOpenIndexDesktop = 0,
//   forceCloseTrigger,
//   controlled = false,
//   openIndex: externalOpenIndex,
//   onToggle,
//   mobileMode = false,
// }) => {
//   const [internalOpenIndex, setInternalOpenIndex] = useState(() =>
//     window.innerWidth >= 1024 ? defaultOpenIndexDesktop : null
//   );

//   const openIndex = controlled ? externalOpenIndex : internalOpenIndex;
//   const setOpenIndex = controlled ? onToggle : setInternalOpenIndex;

//   const [pendingIndex, setPendingIndex] = useState(null);
//   const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);

//   // 👉 направление анимации
//   const [direction, setDirection] = useState(1);

//   /* -------------------- RESIZE -------------------- */
//   useEffect(() => {
//     const handleResize = () => {
//       const desktop = window.innerWidth >= 1024;
//       setIsDesktop(desktop);

//       if (!controlled) {
//         if (desktop && openIndex === null) {
//           setOpenIndex(defaultOpenIndexDesktop);
//         }
//         if (!desktop && openIndex !== null) {
//           setOpenIndex(null);
//         }
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [openIndex, defaultOpenIndexDesktop, controlled, setOpenIndex]);

//   /* -------------------- FORCE CLOSE -------------------- */
//   useEffect(() => {
//     if (!controlled) {
//       setOpenIndex(isDesktop ? defaultOpenIndexDesktop : null);
//       setPendingIndex(null);
//     }
//   }, [forceCloseTrigger, isDesktop, defaultOpenIndexDesktop, controlled, setOpenIndex]);

//   /* -------------------- TOGGLE -------------------- */
//   const toggleAccordion = (index) => {
//     if (!isDesktop && openIndex !== null) {
//       setDirection(index > openIndex ? 1 : -1);
//     }

//     // DESKTOP (как было)
//     if (isDesktop) {
//       if (openIndex === index) {
//         setOpenIndex(null);
//       } else if (openIndex !== null) {
//         setPendingIndex(index);
//         setOpenIndex(null);

//         setTimeout(() => {
//           setOpenIndex(index);
//           setPendingIndex(null);
//         }, 300);
//       } else {
//         setOpenIndex(index);
//       }
//       return;
//     }

//     // MOBILE
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   /* =====================================================
//      =================== DESKTOP =========================
//      ===================================================== */
//   if (isDesktop) {
//     return (
//       <div className="w-full z-100000000">
//         {items.map((item, index) => {
//           const isOpen = openIndex === index;

//           return (
//             <div key={index} className="w-full">
//               <button
//                 className="w-full cursor-pointer flex justify-between items-center py-1 text-left transition-colors"
//                 onClick={() => toggleAccordion(index)}
//               >
//                 <span className="font-futura text-[clamp(40px,5vw,50px)] font-bold text-[#717171]">
//                   {item.title}
//                 </span>
//                 {isOpen ? <ChevronUp /> : <ChevronDown />}
//               </button>

//               <div
//                 className={`transition-all duration-300 overflow-hidden bg-[rgba(57, 57, 57, 0.84)] ${
//                   isOpen ? "min-h-[200px] w-[90%] opacity-100" : "max-h-0  opacity-0"
//                 }`}
//               ><div
//   className="text-[#717171] text-[clamp(15px,2vw,17px)]"
//   style={{
//     background: "rgba(255, 255, 255, 0.12)",
//     backdropFilter: "blur(16px)",
//     WebkitBackdropFilter: "blur(16px)",
//     border: "1px solid rgba(255, 255, 255, 0.2)",
//     borderRadius: "12px",
//     padding: "20px 24px",
//   }}
// >
//   {item.content}
// </div>
               
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   }

//   /* =====================================================
//      ================= MOBILE TABS =======================
//      ===================================================== */
//   return (
//     <div className="w-full">
//       {/* ---------- Active Product Title ---------- */}
//       <div className="relative  mb-3 overflow-hidden ">
//         {items.map((item, index) => {
//           const isActive = openIndex === index;

//           return (
//             <span
//               key={index}
//               className={`
//                 absolute left-0 top-0
//                 font-futura font-bold text-lg
//                 transition-all duration-300 ease-out
//                 ${
//                   isActive
//                     ? "opacity-100 translate-x-0"
//                     : direction === 1
//                       ? "-translate-x-6 opacity-0"
//                       : "translate-x-6 opacity-0"
//                 }
//               `}
//             >
//               {item.title}
//             </span>
//           );
//         })}
//       </div>

//       {/* ---------- Tabs Navigation ----------
   
// {/* ---------- Tabs Navigation ---------- */}
// <div className="mb-4">
//   <div className="grid grid-cols-3 border-b">
//     {items.map((item, index) => {
//       const isActive = openIndex === index;

//       return (
//         <button
//           key={index}
//           onClick={() => toggleAccordion(index)}
//           className={`
//             relative cursor-pointer pb-2 px-2
//             font-futura font-bold text-[clamp(20px,3vw,26px)]
//             text-center whitespace-nowrap overflow-hidden text-ellipsis
//             transition-colors
//             ${isActive ? "text-pink-300" : "text-gray-400"}
//           `}
//         >
//           {item.title}
//           {isActive && (
//             <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gray-500" />
//           )}
//         </button>
//       );
//     })}
//   </div>
// </div>
//       {/* ---------- Tab Content ---------- */}
//       <div className="relative  min-h-[120px]  overflow-hidden">
//         {items.map((item, index) => {
//           const isOpen = openIndex === index;

//           return (
//             <div
//               key={index}
//               className={`
//                 absolute inset-0
//                 transition-all duration-300 ease-out
//                 ${
//                   isOpen
//                     ? "opacity-100 translate-x-0"
//                     : direction === 1
//                       ? "-translate-x-8 opacity-0"
//                       : "translate-x-8 opacity-0"
//                 }
//               `}
//             >
//               <div
//   className="text-sm text-[#717171]"
//   style={{
//     background: "rgba(255, 255, 255, 0.12)",
//     backdropFilter: "blur(16px)",
//     WebkitBackdropFilter: "blur(16px)",
//     border: "1px solid rgba(255, 255, 255, 0.2)",
//     borderRadius: "10px",
//     padding: "14px 18px",
//   }}
// >
//   {item.content}
// </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Accordion;

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Accordion = ({
  items,
  defaultOpenIndexDesktop = 0,
  forceCloseTrigger,
  controlled = false,
  openIndex: externalOpenIndex,
  onToggle,
  mobileMode = false,
}) => {
  const [internalOpenIndex, setInternalOpenIndex] = useState(() =>
    window.innerWidth >= 1024 ? defaultOpenIndexDesktop : null
  );

  const openIndex = controlled ? externalOpenIndex : internalOpenIndex;
  const setOpenIndex = controlled ? onToggle : setInternalOpenIndex;

  const [pendingIndex, setPendingIndex] = useState(null);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (!controlled) {
        if (desktop && openIndex === null) setOpenIndex(defaultOpenIndexDesktop);
        if (!desktop && openIndex !== null) setOpenIndex(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [openIndex, defaultOpenIndexDesktop, controlled, setOpenIndex]);

  useEffect(() => {
    if (!controlled) {
      setOpenIndex(isDesktop ? defaultOpenIndexDesktop : null);
      setPendingIndex(null);
    }
  }, [forceCloseTrigger, isDesktop, defaultOpenIndexDesktop, controlled, setOpenIndex]);

  const toggleAccordion = (index) => {
    if (!isDesktop && openIndex !== null) {
      setDirection(index > openIndex ? 1 : -1);
    }
    if (isDesktop) {
      if (openIndex === index) {
        setOpenIndex(null);
      } else if (openIndex !== null) {
        setPendingIndex(index);
        setOpenIndex(null);
        setTimeout(() => {
          setOpenIndex(index);
          setPendingIndex(null);
        }, 300);
      } else {
        setOpenIndex(index);
      }
      return;
    }
    setOpenIndex(openIndex === index ? null : index);
  };

  /* =====================================================
     =================== DESKTOP =========================
     ===================================================== */
  if (isDesktop) {
    return (
      <div className="w-full">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="w-full">
              <button
                className="w-full cursor-pointer flex justify-between items-center py-1 text-left transition-colors"
                onClick={() => toggleAccordion(index)}
              >
                <span className="font-futura text-[clamp(40px,5vw,50px)] font-bold text-[#717171]">
                  {item.title}
                </span>
                {isOpen ? <ChevronUp /> : <ChevronDown />}
              </button>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen ? "min-h-[200px] w-[90%] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div
                  className="text-[#717171] text-[clamp(15px,2vw,17px)]"
                  style={{
                    background: "rgba(255, 255, 255, 0.12)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    padding: "20px 24px",
                  }}
                >
                  {item.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* =====================================================
     ================= MOBILE TABS =======================
     ===================================================== */
  return (
    <div className="w-full">
      {/* Tabs Navigation */}
      <div className="mb-3">
        <div className="grid border-b" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
          {items.map((item, index) => {
            const isActive = openIndex === index;
            return (
              <button
                key={index}
                onClick={() => toggleAccordion(index)}
                className={`
                  relative cursor-pointer pb-2 px-1
                  font-futura font-bold text-center
                  whitespace-nowrap overflow-hidden text-ellipsis
                  transition-all duration-200
                `}
                style={{
                  /* Активный таб заметно крупнее */
                  fontSize: isActive
                    ? "clamp(22px, 3.5vw, 30px)"
                    : "clamp(14px, 2.2vw, 20px)",
                  color: isActive ? "#e8e8e8" : "#717171",
                }}
              >
                {item.title}
                {isActive && (
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gray-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content — убираем min-h и overflow-hidden, чтобы текст был виден полностью */}
      <div className="relative w-full">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              style={{
                /* Используем height вместо absolute, чтобы текст не обрезался */
                display: isOpen ? "block" : "none",
                opacity: isOpen ? 1 : 0,
                transition: "opacity 0.3s ease-out",
              }}
            >
              {item.content && (
                <div
                  className="text-sm text-[#717171]"
                  style={{
                    background: "rgba(255, 255, 255, 0.12)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "10px",
                    padding: "14px 18px",
                  }}
                >
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Accordion;