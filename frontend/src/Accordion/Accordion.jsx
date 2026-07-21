

// import { useState, useEffect, useRef } from "react";
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


//   const contentRefs = useRef({});
//   const [overflowMap, setOverflowMap] = useState({});
//   const [expandedMap, setExpandedMap] = useState({}); 
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



//  useEffect(() => {
//     if (isDesktop || openIndex === null) return;
//     const el = contentRefs.current[openIndex];
//     if (el) {
//       const fullHeight = el.scrollHeight;
//       setOverflowMap((prev) => ({ ...prev, [openIndex]: fullHeight > MOBILE_CLAMP }));
//     }
//   }, [openIndex, isDesktop, items]); 

//    useEffect(() => {
//     setExpandedMap({});
//   }, [openIndex]); 


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
//  <div className="relative overflow-hidden">
//         {items.map((item, index) => {
//           if (openIndex !== index) return null; // рендерим только активный таб — это и даёт "отъезд" страницы

//           const isOverflowing = overflowMap[index];
//           const isExpanded = expandedMap[index];

//           return (
//             <div
//               key={index}
//               className={`
//                 transition-all duration-300 ease-out
//                 opacity-100 translate-x-0
//               `}
//             >
//               <div
//                 ref={(el) => (contentRefs.current[index] = el)}
//                 className="text-sm text-[#717171]"
//                 style={{
//                   background: "rgba(255, 255, 255, 0.12)",
//                   backdropFilter: "blur(16px)",
//                   WebkitBackdropFilter: "blur(16px)",
//                   border: "1px solid rgba(255, 255, 255, 0.2)",
//                   borderRadius: "10px",
//                   padding: "14px 18px",
//                   maxHeight: isOverflowing && !isExpanded ? `${MOBILE_CLAMP}px` : "2000px",
//                   overflow: "hidden",
//                   transition: "max-height 300ms ease",
//                   position: "relative",
//                 }}
//               >
//                 {item.content}

//                 {/* градиент-затемнение снизу, когда текст обрезан */}
//                 {isOverflowing && !isExpanded && (
//                   <div
//                     className="absolute bottom-0 left-0 w-full h-8 pointer-events-none"
//                     style={{
//                       background:
//                         "linear-gradient(to bottom, transparent, rgba(20,20,20,0.9))",
//                       borderBottomLeftRadius: "10px",
//                       borderBottomRightRadius: "10px",
//                     }}
//                   />
//                 )}
//               </div>

//               {isOverflowing && (
//                 <button
//                   onClick={() =>
//                     setExpandedMap((prev) => ({ ...prev, [index]: !prev[index] }))
//                   }
//                   className="w-full flex justify-center py-2 cursor-pointer"
//                 >
//                   {isExpanded ? <ChevronUp /> : <ChevronDown />}
//                 </button>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Accordion;
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useIsDesktop } from "../hooks/useIsDesktop";
const OVERFLOW_TOLERANCE = 20; // px — если текст выше клампа не более чем на это значение, кнопку не показываем

// Клемп зависит от высоты вьюпорта, а не от фиксированных пикселей
const getDesktopClamp = () =>
  Math.round(Math.min(360, Math.max(180, window.innerHeight * 0.28)));

const getMobileClamp = () =>
  Math.round(Math.min(160, Math.max(80, window.innerHeight * 0.16)));

const Accordion = ({
  items,
  defaultOpenIndexDesktop = 0,
  forceCloseTrigger,
  controlled = false,
  openIndex: externalOpenIndex,
  onToggle,
  mobileMode = false,
  isDesktop: isDesktopProp,
}) => {
  const [internalOpenIndex, setInternalOpenIndex] = useState(() =>
    window.innerWidth >= 1024 ? defaultOpenIndexDesktop : null
  );

  const openIndex = controlled ? externalOpenIndex : internalOpenIndex;
  const setOpenIndex = controlled ? onToggle : setInternalOpenIndex;

  const [pendingIndex, setPendingIndex] = useState(null);
  // const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
   const internalIsDesktop = useIsDesktop(); // тот же хук, как фолбэк если проп не передан
  const isDesktop = isDesktopProp ?? internalIsDesktop;
  const [clampSize, setClampSize] = useState(() =>
    window.innerWidth >= 1024 ? getDesktopClamp() : getMobileClamp()
  );
  const [direction, setDirection] = useState(1);
  const isFirstMount = useRef(true);

  // ref для реально отображаемого контента (используется только для клика "показати повністю" — высота там не нужна)
  const contentRefs = useRef({});
  // ref для скрытого измерителя — меряет ВСЕ items всегда, вне зависимости от того что открыто
  const measureRefs = useRef({});

  const [overflowMap, setOverflowMap] = useState({});
  const [expandedMap, setExpandedMap] = useState({});
  const [measuredMap, setMeasuredMap] = useState({});

  // плавная смена контента при смене forceCloseTrigger (смена товара)
  const [contentVisible, setContentVisible] = useState(true);
  // на время скрытого пересчёта (смена товара) отключаем CSS-transition
  // высоты, чтобы схлопывание/разворот происходили МГНОВЕННО, пока контент
  // невидим — иначе видно, как анимация "доезжает" уже после раскрытия
  const [suppressHeightTransition, setSuppressHeightTransition] = useState(false);

  /* -------------------- RESIZE -------------------- */
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      // setIsDesktop(desktop);
      setClampSize(desktop ? getDesktopClamp() : getMobileClamp());

      if (!controlled) {
        if (desktop && openIndex === null) {
          setOpenIndex(defaultOpenIndexDesktop);
        }
        if (!desktop && openIndex !== null) {
          setOpenIndex(null);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [openIndex, defaultOpenIndexDesktop, controlled, setOpenIndex]);

  /* -------------------- СМЕНА ПРОДУКТА (forceCloseTrigger) -------------------- */
  // СИНХРОННАЯ часть: через useLayoutEffect — ДО отрисовки браузером.
  // Если делать это в обычном useEffect, браузер успевает нарисовать один
  // кадр с новым (уже сменившимся) текстом при СТАРОМ expandedMap — отсюда
  // виден рывок "полный текст → потом обрезался".
  useLayoutEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return; // при монтировании ничего скрывать не нужно
    }
    setContentVisible(false);
    setExpandedMap({});
    setSuppressHeightTransition(true); // высота будет меняться мгновенно, без анимации, пока скрыто
  }, [forceCloseTrigger]);

  // Асинхронная часть: возврат видимости и переоткрытие — с задержкой, под fade
  useEffect(() => {
    if (isFirstMount.current) return;

    const timeout = setTimeout(() => {
      if (!controlled) {
        // setOpenIndex(isDesktop ? defaultOpenIndexDesktop : null);
      }
      setPendingIndex(null);
      // measuredMap НЕ сбрасываем — скрытый измеритель держит его актуальным всегда
      setContentVisible(true);

      // возвращаем transition ПОСЛЕ того, как контент уже раскрылся с финальной
      // высотой — следующий клик "показати повністю"/"показати більше" снова
      // должен анимироваться плавно
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setSuppressHeightTransition(false));
      });
    }, 220);

    return () => clearTimeout(timeout);
  }, [forceCloseTrigger]);

  /* -------------------- ИЗМЕРЕНИЕ (всегда, для всех items) -------------------- */
  useLayoutEffect(() => {
    items.forEach((item, index) => {
      const el = measureRefs.current[index];
      if (el) {
        const fullHeight = el.scrollHeight;
        setOverflowMap((prev) => ({
          ...prev,
          [index]: fullHeight > clampSize + OVERFLOW_TOLERANCE,
        }));
        setMeasuredMap((prev) => ({ ...prev, [index]: true }));
      }
    });
  }, [items, clampSize]);

  /* -------------------- RESET ПРИ СМЕНЕ ТАБА -------------------- */
  useEffect(() => {
    setExpandedMap({});
  }, [openIndex]);

  /* -------------------- TOGGLE -------------------- */
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

  // Скрытый измеритель — рендерит контент всех items невидимо, чтобы всегда знать реальную высоту
  const HiddenMeasurer = (
    <div
      style={{ position: "relative", height: 0, overflow: "hidden" }}
      aria-hidden="true"
    >
      {items.map((item, index) => (
        <div
          key={index}
          ref={(el) => (measureRefs.current[index] = el)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            visibility: "hidden",
            padding: isDesktop ? "20px 24px" : "14px 18px",
          }}
          className={isDesktop ? "text-[clamp(15px,2vw,17px)]" : "text-sm"}
        >
          {item.content}
        </div>
      ))}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="w-full z-100000000">
        {HiddenMeasurer}
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const isOverflowing = overflowMap[index];
          const isExpanded = expandedMap[index];
          const isMeasured = measuredMap[index];

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
                className={`transition-all duration-300 overflow-hidden bg-[rgba(57, 57, 57, 0.84)] ${
                  isOpen ? "min-h-[200px] w-[90%] opacity-100" : "max-h-0  opacity-0"
                }`}
              >
                <div
                  ref={(el) => (contentRefs.current[index] = el)}
                  className="text-[#717171] text-[clamp(15px,2vw,17px)]"
                  style={{
                    background: "rgba(255, 255, 255, 0.12)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    padding: "20px 24px",
                    maxHeight: !isMeasured
                      ? `${clampSize}px`
                      : isOverflowing && !isExpanded
                        ? `${clampSize}px`
                        : "3000px",
                    overflow: "hidden",
                    transition: suppressHeightTransition
                      ? "none"
                      : "max-height 300ms ease",
                    position: "relative",
                    opacity: contentVisible ? 1 : 0,
                  }}
                >
                  {item.content}

                  {(!isMeasured || (isOverflowing && !isExpanded)) && (
                    <div
                      className="absolute bottom-0 left-0 w-full h-10 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent, rgba(20,20,20,0.9))",
                        borderBottomLeftRadius: "12px",
                        borderBottomRightRadius: "12px",
                      }}
                    />
                  )}
                </div>

                {isOverflowing && !isExpanded && (
                  <button
                    onClick={() =>
                      setExpandedMap((prev) => ({ ...prev, [index]: true }))
                    }
                    className="w-full flex items-center justify-center gap-1 py-2 cursor-pointer text-xs text-[#a0a0a0]"
                  >
                    <span>Показати повністю</span>
                    <ChevronDown size={16} />
                  </button>
                )}
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
      {HiddenMeasurer}

      {/* ---------- Active Product Title ---------- */}
      <div className="relative mb-3 overflow-hidden">
        {items.map((item, index) => {
          const isActive = openIndex === index;

          return (
            <span
              key={index}
              className={`
                absolute left-0 top-0
                font-futura font-bold text-lg
                transition-all duration-300 ease-out
                ${
                  isActive
                    ? "opacity-100 translate-x-0"
                    : direction === 1
                      ? "-translate-x-6 opacity-0"
                      : "translate-x-6 opacity-0"
                }
              `}
            >
              {item.title}
            </span>
          );
        })}
      </div>

      {/* ---------- Tabs Navigation ---------- */}
      <div className="mb-4">
        <div className="grid grid-cols-3 border-b">
          {items.map((item, index) => {
            const isActive = openIndex === index;

            return (
              <button
                key={index}
                onClick={() => toggleAccordion(index)}
                className={`
                  relative cursor-pointer pb-2 px-2
                  font-futura font-bold text-[clamp(20px,3vw,26px)]
                  text-center whitespace-nowrap overflow-hidden text-ellipsis
                  transition-colors
                  ${isActive ? "text-pink-300" : "text-gray-400"}
                `}
              >
                {item.title}
                {isActive && (
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gray-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------- Tab Content ---------- */}
      {/* minHeight резервирует место даже когда openIndex временно null
          (см. handleSlideChange в SetsProductDetail — там на 50ms всё закрывается),
          иначе блок схлопывается в 0 и весь лейаут ниже "прыгает" вверх-вниз */}
      <div
        className="relative overflow-hidden"
        style={{ minHeight: openIndex === null ? `${clampSize}px` : undefined }}
      >
        {items.map((item, index) => {
          if (openIndex !== index) return null;

          const isOverflowing = overflowMap[index];
          const isExpanded = expandedMap[index];
          const isMeasured = measuredMap[index];

          return (
            <div
              key={index}
              className="transition-opacity duration-200 ease-out"
              style={{ opacity: contentVisible ? 1 : 0 }}
            >
              <div
                ref={(el) => (contentRefs.current[index] = el)}
                className="text-sm text-[#717171]"
                style={{
                  background: "rgba(255, 255, 255, 0.12)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "10px",
                  padding: "14px 18px",
                  minHeight: `${clampSize}px`,
                  maxHeight: !isMeasured
                    ? `${clampSize}px`
                    : isOverflowing && !isExpanded
                      ? `${clampSize}px`
                      : "2000px",
                  overflow: "hidden",
                  transition: suppressHeightTransition
                    ? "none"
                    : "max-height 300ms ease",
                  position: "relative",
                }}
              >
                {item.content}

                {(!isMeasured || (isOverflowing && !isExpanded)) && (
                  <div
                    className="absolute bottom-0 left-0 w-full h-8 pointer-events-none"
                    style={{
                      background: "linear-gradient(to bottom, transparent, rgba(20,20,20,0.9))",
                      borderBottomLeftRadius: "10px",
                      borderBottomRightRadius: "10px",
                    }}
                  />
                )}
              </div>

              {isOverflowing && (
                <button
                  onClick={() =>
                    setExpandedMap((prev) => ({ ...prev, [index]: !prev[index] }))
                  }
                  className="w-full flex items-center justify-center gap-1 py-2 cursor-pointer text-xs text-[#a0a0a0]"
                >
                  <span>{isExpanded ? "Згорнути" : "Показати більше"}</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transition: "transform 300ms ease",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Accordion;
// import { useState, useEffect, useLayoutEffect, useRef } from "react";
// import { ChevronDown, ChevronUp } from "lucide-react";

// const MOBILE_CLAMP = 100;      // px — высота, до которой схлопывается текст
// const OVERFLOW_TOLERANCE = 20; // px — если текст выше клампа не более чем на это значение, кнопку не показываем
// const DESKTOP_CLAMP = 200;      // 👈 новый лимит для десктопа

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
//   const [direction, setDirection] = useState(1);
//   const isFirstMount = useRef(true);
//   const contentRefs = useRef({});
//   const [overflowMap, setOverflowMap] = useState({});
//   const [expandedMap, setExpandedMap] = useState({});
//   const [measuredMap, setMeasuredMap] = useState({});

//   // 👉 плавная смена контента при смене forceCloseTrigger (смена товара)
//   const [contentVisible, setContentVisible] = useState(true);

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

  


// useEffect(() => {
//   if (isFirstMount.current) {
//     isFirstMount.current = false;
//     return; // при монтировании ничего скрывать не нужно
//   }

//   setContentVisible(false);

//   const timeout = setTimeout(() => {
//     if (!controlled) {
//       setOpenIndex(isDesktop ? defaultOpenIndexDesktop : null);
//     }
//     setPendingIndex(null);
//     setExpandedMap({});
//     setMeasuredMap({});
//     setContentVisible(true);
//   }, 180);

//   return () => clearTimeout(timeout);
// }, [forceCloseTrigger]);



//   useLayoutEffect(() => {
//   if (openIndex === null) return;
//   const el = contentRefs.current[openIndex];
//   if (el) {
//     const fullHeight = el.scrollHeight;
//     const clamp = isDesktop ? DESKTOP_CLAMP : MOBILE_CLAMP;
//     setOverflowMap((prev) => ({
//       ...prev,
//       [openIndex]: fullHeight > clamp + OVERFLOW_TOLERANCE,
      
//     }));
//     setMeasuredMap((prev) => ({ ...prev, [openIndex]: true }));
//   }
// }, [openIndex, isDesktop, items, contentVisible]);



//   /* -------------------- RESET ПРИ СМЕНЕ ТАБА -------------------- */
//   useEffect(() => {
//     setExpandedMap({});
//     // setMeasuredMap({});
//   }, [openIndex]);

//   /* -------------------- TOGGLE -------------------- */
//   const toggleAccordion = (index) => {
//     if (!isDesktop && openIndex !== null) {
//       setDirection(index > openIndex ? 1 : -1);
//     }

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

//     setOpenIndex(openIndex === index ? null : index);
//   };


//   if (isDesktop) {
//   return (
//     <div className="w-full z-100000000">
//       {items.map((item, index) => {
//         const isOpen = openIndex === index;
//         const isOverflowing = overflowMap[index];
//         const isExpanded = expandedMap[index];
//         const isMeasured = measuredMap[index];

//         return (
//           <div key={index} className="w-full">
//             <button
//               className="w-full cursor-pointer flex justify-between items-center py-1 text-left transition-colors"
//               onClick={() => toggleAccordion(index)}
//             >
//               <span className="font-futura text-[clamp(40px,5vw,50px)] font-bold text-[#717171]">
//                 {item.title}
//               </span>
//               {isOpen ? <ChevronUp /> : <ChevronDown />}
//             </button>

//             <div
//               className={`transition-all duration-300 overflow-hidden bg-[rgba(57, 57, 57, 0.84)] ${
//                 isOpen ? "min-h-[200px] w-[90%] opacity-100" : "max-h-0  opacity-0"
//               }`}
//             >
//               <div
//                 ref={(el) => (contentRefs.current[index] = el)}
//                 className="text-[#717171] text-[clamp(15px,2vw,17px)]"
//                 style={{
//                   background: "rgba(255, 255, 255, 0.12)",
//                   backdropFilter: "blur(16px)",
//                   WebkitBackdropFilter: "blur(16px)",
//                   border: "1px solid rgba(255, 255, 255, 0.2)",
//                   borderRadius: "12px",
//                   padding: "20px 24px",
//                   maxHeight: !isMeasured
//                     ? `${DESKTOP_CLAMP}px`
//                     : isOverflowing && !isExpanded
//                       ? `${DESKTOP_CLAMP}px`
//                       : "3000px",
//                   overflow: "hidden",
//                   transition: "max-height 300ms ease",
//                   position: "relative",
//                 }}
//               >
//                 {item.content}

//                 {(!isMeasured || (isOverflowing && !isExpanded)) && (
//                   <div
//                     className="absolute bottom-0 left-0 w-full h-10 pointer-events-none"
//                     style={{
//                       background:
//                         "linear-gradient(to bottom, transparent, rgba(20,20,20,0.9))",
//                       borderBottomLeftRadius: "12px",
//                       borderBottomRightRadius: "12px",
//                     }}
//                   />
//                 )}
//               </div>

//               {isOverflowing && !isExpanded && (
//                 <button
//                   onClick={() =>{
//                     console.log("hit", index);
//                     setExpandedMap((prev) => ({ ...prev, [index]: true }))}
//                   }
//                   className="w-full flex items-center justify-center gap-1 py-2 cursor-pointer text-xs text-[#a0a0a0]"
//                 >
//                   <span>Показати повністю</span>
//                   <ChevronDown size={16} />
//                 </button>
//               )}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

//   /* =====================================================
//      ================= MOBILE TABS =======================
//      ===================================================== */
//   return (
//     <div className="w-full">
//       {/* ---------- Active Product Title ---------- */}
//       <div className="relative mb-3 overflow-hidden">
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

//       {/* ---------- Tabs Navigation ---------- */}
//       <div className="mb-4">
//         <div className="grid grid-cols-3 border-b">
//           {items.map((item, index) => {
//             const isActive = openIndex === index;

//             return (
//               <button
//                 key={index}
//                 onClick={() => toggleAccordion(index)}
//                 className={`
//                   relative cursor-pointer pb-2 px-2
//                   font-futura font-bold text-[clamp(20px,3vw,26px)]
//                   text-center whitespace-nowrap overflow-hidden text-ellipsis
//                   transition-colors
//                   ${isActive ? "text-pink-300" : "text-gray-400"}
//                 `}
//               >
//                 {item.title}
//                 {isActive && (
//                   <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gray-500" />
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* ---------- Tab Content ---------- */}
//       <div className="relative overflow-hidden">
//         {items.map((item, index) => {
//           if (openIndex !== index) return null;

//           const isOverflowing = overflowMap[index];
//           const isExpanded = expandedMap[index];
//           const isMeasured = measuredMap[index];

//           return (
//             <div
//               key={index}
//               className="transition-opacity duration-200 ease-out"
//               style={{ opacity: contentVisible ? 1 : 0 }}
//             >
//               <div
//                 ref={(el) => (contentRefs.current[index] = el)}
//                 className="text-sm text-[#717171]"
//                 style={{
//                   background: "rgba(255, 255, 255, 0.12)",
//                   backdropFilter: "blur(16px)",
//                   WebkitBackdropFilter: "blur(16px)",
//                   border: "1px solid rgba(255, 255, 255, 0.2)",
//                   borderRadius: "10px",
//                   padding: "14px 18px",
//                   minHeight: `${MOBILE_CLAMP}px`,
//                   maxHeight: !isMeasured
//                     ? `${MOBILE_CLAMP}px`
//                     : isOverflowing && !isExpanded
//                       ? `${MOBILE_CLAMP}px`
//                       : "2000px",
//                   overflow: "hidden",
//                   transition: "max-height 300ms ease",
//                   position: "relative",
//                 }}
//               >
//                 {item.content}

//                 {(!isMeasured || (isOverflowing && !isExpanded)) && (
//                   <div
//                     className="absolute bottom-0 left-0 w-full h-8 pointer-events-none"
//                     style={{
//                       background: "linear-gradient(to bottom, transparent, rgba(20,20,20,0.9))",
//                       borderBottomLeftRadius: "10px",
//                       borderBottomRightRadius: "10px",
//                     }}
//                   />
//                 )}
//               </div>

//               {isOverflowing && (
//                 <button
//                   onClick={() =>
//                     setExpandedMap((prev) => ({ ...prev, [index]: !prev[index] }))
//                   }
//                   className="w-full flex items-center justify-center gap-1 py-2 cursor-pointer text-xs text-[#a0a0a0]"
//                 >
//                   <span>{isExpanded ? "Згорнути" : "Показати більше"}</span>
//                   <ChevronDown
//                     size={16}
//                     style={{
//                       transition: "transform 300ms ease",
//                       transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
//                     }}
//                   />
//                 </button>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Accordion;