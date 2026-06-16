// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Mousewheel, Thumbs } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";

// export default function ProductGallery({
//   products,
//   state,
//   swiperInstances,
//   setSwiperInstances,
//   refs,
//   imageData,
//   animationState,
//   onSwiperInit,
//   onSlideChange,
//   onThumbnailClick,
//   onMouseEnter,
//   onMouseLeave,
//   onTouchStart,
//   onTouchEnd,
//   stopHoverAnimation,
//   swiperConfig,
// }) {
//   return (
    
//     <div
//       ref={(el) => (refs.swiperContainer = el)}
//       className="w-full lg:w-[75%] lg:h-[100%] mt-10 lg:mt-0 lg:content-center   "
    
//       style={{
//         visibility:
//           !imageData || animationState.complete ? "visible" : "hidden",
//         opacity: !imageData || animationState.complete ? 1 : 0,
//       }}
//     >
//       <div className="w-full flex flex-row items-center justify-between gap-2">
//         <div className="w-[100%]">




//           <Swiper
//             className="custom-swiper h-[250px] sm:h-[300px] md:h-[350px]"
//             modules={[Pagination, Mousewheel, Thumbs]}
//             pagination={{
//               clickable: true,
//               el: ".custom-swiper-pagination",
//             }}
//             mousewheel={true}
//             direction="horizontal"
//             centeredSlides={true}
//             thumbs={{ swiper: swiperInstances.thumbs }}
//             spaceBetween={20}
//             initialSlide={state.activeProductIndex}
//             speed={swiperConfig.SPEED}
//             threshold={swiperConfig.THRESHOLD}
//             resistance={true}
//             resistanceRatio={swiperConfig.RESISTANCE_RATIO}
//             onInit={onSwiperInit}
//             onSlideChange={onSlideChange}
//             preventClicks={false}
//             preventClicksPropagation={false}
//             touchStartPreventDefault={false}
//             onSlideChangeTransitionStart={() => {
//               stopHoverAnimation();
//             }}
//           >
//             {products.map((product, index) => (
//               <SwiperSlide
//                 key={product.id}
//                 style={{
//                   height: "100%",
//                   transform: `scale(${product.scale || 1})`,
//                 }}
//               >
//                 <div className="w-full h-full flex items-center justify-center">
//                   <img
//                     src={
//                       state.selectedImageIndices[index] === 0
//                         ? product.image
//                         : product.altImages[
//                             state.selectedImageIndices[index] - 1
//                           ]
//                     }
//                     alt={product.name}
//                     className="max-h-full w-auto object-contain"
//                     draggable="false"
//                     onMouseEnter={() => onMouseEnter(index, product)}
//                     onMouseLeave={() => onMouseLeave(index)}
//                     onTouchStart={() => onTouchStart(index, product)}
//                     onTouchEnd={() => onTouchEnd(index)}
//                   />
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//           {/* </div> */}
//         </div>
//       {/* </div> */}
// </div>
//       <div
//         ref={(el) => (refs.thumbs = el)}
//         className="w-full mt-5 lg:mt-20"
//         style={{ opacity: state.thumbsShown ? 1 : 0 }}
//       > <div className="relative border-4 border-black p-2">



//         <Swiper
//           modules={[Thumbs]}
//           direction="horizontal"
//           onSwiper={(swiper) =>
//             setSwiperInstances((prev) => ({ ...prev, thumbs: swiper }))
//           }
//           slidesPerView="auto"
//           spaceBetween={10}
//           watchSlidesProgress={true}
//           slideToClickedSlide={true}
//           initialSlide={state.activeProductIndex}
//           speed={swiperConfig.SPEED}
//           preventClicks={false}
//           preventClicksPropagation={false}
//           observer={true}
//           observeParents={true}
//           resistance={false}
//           resistanceRatio={0}
//         >
//           {products.map((product, index) => (
//             <SwiperSlide
//               key={product.id}
//               className="!w-[120px] sm:!w-[140px] lg:!w-[200px]"
//             >
             



//               <img
//                 src={product.image}
//                 onClick={() => onThumbnailClick(index)}
//                 className={`cursor-pointer transition-all duration-300 rounded-lg px-3 w-full h-20 sm:h-24 lg:h-28 object-contain ${
//                   index === state.activeProductIndex
//                     ? "opacity-100 scale-105 border-black"
//                     : "grayscale border-transparent opacity-60 hover:opacity-100"
//                 }`}
//                 alt={product.name}
//                 draggable="false"
//               />  
//             </SwiperSlide>
//           ))}
//         </Swiper></div>
// </div>
//       </div>
//     // </div>
//   );
// }

// import { useRef, useState, useCallback } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Mousewheel, Thumbs } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";

// // Filmstrip — "склеенная" лента кадров текущего продукта
// function Filmstrip({ product, currentFrameIndex, onFrameSelect }) {
//   const allImages = product
//     ? [product.image, ...(product.altImages || [])]
//     : [];
//   const trackRef = useRef(null);
//   const isDragging = useRef(false);
//   const dragStartX = useRef(0);
//   const dragScrollLeft = useRef(0);

//   const handleMouseDown = (e) => {
//     isDragging.current = true;
//     dragStartX.current = e.clientX;
//     dragScrollLeft.current = trackRef.current.scrollLeft;
//     trackRef.current.style.cursor = "grabbing";
//   };
//   const handleMouseMove = (e) => {
//     if (!isDragging.current) return;
//     const dx = e.clientX - dragStartX.current;
//     trackRef.current.scrollLeft = dragScrollLeft.current - dx;
//   };
//   const handleMouseUp = () => {
//     isDragging.current = false;
//     if (trackRef.current) trackRef.current.style.cursor = "grab";
//   };

//   if (allImages.length <= 1) return null;

//   return (
//     <div className="w-full mt-3 select-none">
//       {/* Прогресс-бар */}
//       <div className="w-full h-[2px] bg-gray-200 rounded mb-2 overflow-hidden">
//         <div
//           className="h-full bg-black rounded transition-all duration-200"
//           style={{ width: `${((currentFrameIndex + 1) / allImages.length) * 100}%` }}
//         />
//       </div>

//       {/* Filmstrip-лента */}
//       <div
//         ref={trackRef}
//         className="flex gap-0 overflow-hidden cursor-grab select-none"
//         style={{ scrollbarWidth: "none" }}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onMouseLeave={handleMouseUp}
//       >
//         {allImages.map((src, i) => (
//           <div
//             key={i}
//             onClick={() => onFrameSelect(i)}
//             className="relative flex-shrink-0 overflow-hidden"
//             style={{
//               width: 64,
//               height: 48,
//               borderRight: "2px solid white",
//             }}
//           >
//             <img
//               src={src}
//               alt=""
//               draggable="false"
//               className="w-full h-full object-cover transition-opacity duration-150"
//               style={{ opacity: i === currentFrameIndex ? 1 : 0.55 }}
//             />
//             {/* Активный кадр */}
//             {i === currentFrameIndex && (
//               <>
//                 <div
//                   className="absolute inset-0 border-2 border-white pointer-events-none"
//                 />
//                 <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
//               </>
//             )}
//           </div>
//         ))}
//       </div>

//       <p className="text-[11px] text-gray-400 mt-1 text-right">
//         {currentFrameIndex + 1} / {allImages.length}
//       </p>
//     </div>
//   );
// }

// export default function ProductGallery({
//   products,
//   state,
//   swiperInstances,
//   setSwiperInstances,
//   refs,
//   imageData,
//   animationState,
//   onSwiperInit,
//   onSlideChange,
//   onThumbnailClick,
//   onMouseEnter,
//   onMouseLeave,
//   onTouchStart,
//   onTouchEnd,
//   stopHoverAnimation,
//   scrubToFrame,   // ← новый проп из useHoverAnimation
//   swiperConfig,
// }) {
//   const [hintSeen, setHintSeen] = useState(false);
//   const [showHint, setShowHint] = useState(false);
//   const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
//   const stageRef = useRef(null);

//   const currentProduct = products[state.activeProductIndex];
//   const allImages = currentProduct
//     ? [currentProduct.image, ...(currentProduct.altImages || [])]
//     : [];
//   const currentFrameIndex = state.selectedImageIndices[state.activeProductIndex] ?? 0;

//   // Scrub по позиции мыши внутри главного фото
//   const handleStageScrub = useCallback((e) => {
//     if (!stageRef.current || allImages.length <= 1) return;
//     const rect = stageRef.current.getBoundingClientRect();
//     const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
//     const frameIdx = Math.floor(frac * allImages.length);
//     scrubToFrame(state.activeProductIndex, frameIdx, allImages.length);
//     setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
//   }, [allImages.length, scrubToFrame, state.activeProductIndex]);

//   const handleStageEnter = useCallback((e) => {
//     if (!hintSeen) {
//       setShowHint(true);
//       setHintSeen(true);
//       setTimeout(() => setShowHint(false), 2000);
//     }
//     onMouseEnter(state.activeProductIndex, currentProduct);
//   }, [hintSeen, onMouseEnter, state.activeProductIndex, currentProduct]);

//   const handleStageLeave = useCallback(() => {
//     setShowHint(false);
//     onMouseLeave(state.activeProductIndex);
//   }, [onMouseLeave, state.activeProductIndex]);

//   const handleFrameSelect = useCallback((i) => {
//     stopHoverAnimation();
//     scrubToFrame(state.activeProductIndex, i, allImages.length);
//   }, [stopHoverAnimation, scrubToFrame, state.activeProductIndex, allImages.length]);

//   return (
//     <div
//       ref={(el) => (refs.swiperContainer = el)}
//       className="w-full lg:w-[75%] lg:h-[100%] mt-10 lg:mt-0 lg:content-center"
//       style={{
//         visibility: !imageData || animationState.complete ? "visible" : "hidden",
//         opacity: !imageData || animationState.complete ? 1 : 0,
//       }}
//     >
//       <div className="w-full flex flex-col">

//         {/* Главный Swiper */}
//         <div
//           ref={stageRef}
//           className="relative w-full"
//           onMouseMove={handleStageScrub}
//           onMouseEnter={handleStageEnter}
//           onMouseLeave={handleStageLeave}
//         >
//           <Swiper
//             className="custom-swiper h-[250px] sm:h-[300px] md:h-[350px]"
//             modules={[Pagination, Mousewheel, Thumbs]}
//             pagination={{ clickable: true, el: ".custom-swiper-pagination" }}
//             mousewheel={true}
//             direction="horizontal"
//             centeredSlides={true}
//             thumbs={{ swiper: swiperInstances.thumbs }}
//             spaceBetween={20}
//             initialSlide={state.activeProductIndex}
//             speed={swiperConfig.SPEED}
//             threshold={swiperConfig.THRESHOLD}
//             resistance={true}
//             resistanceRatio={swiperConfig.RESISTANCE_RATIO}
//             onInit={onSwiperInit}
//             onSlideChange={onSlideChange}
//             preventClicks={false}
//             preventClicksPropagation={false}
//             touchStartPreventDefault={false}
//             onSlideChangeTransitionStart={stopHoverAnimation}
//           >
//             {products.map((product, index) => (
//               <SwiperSlide
//                 key={product.id}
//                 style={{ height: "100%", transform: `scale(${product.scale || 1})` }}
//               >
//                 <div className="w-full h-full flex items-center justify-center">
//                   <img
//                     src={
//                       state.selectedImageIndices[index] === 0
//                         ? product.image
//                         : product.altImages[state.selectedImageIndices[index] - 1]
//                     }
//                     alt={product.name}
//                     className="max-h-full w-auto object-contain"
//                     draggable="false"
//                     onTouchStart={() => onTouchStart(index, product)}
//                     onTouchEnd={() => onTouchEnd(index)}
//                   />
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>

//           {/* Кастомный курсор-индикатор */}
//           {allImages.length > 1 && (
//             <div
//               className="absolute pointer-events-none z-10 transition-opacity duration-200"
//               style={{
//                 left: cursorPos.x,
//                 top: cursorPos.y,
//                 transform: "translate(-50%, -50%)",
//                 opacity: state.hoveredIndex === state.activeProductIndex ? 1 : 0,
//               }}
//             >
//               <div className="w-8 h-8 rounded-full border border-white/80 flex items-center justify-center bg-black/20">
//                 <svg width="14" height="10" viewBox="0 0 14 10" fill="white">
//                   <path d="M0 5h14M9 1l4 4-4 4M5 1L1 5l4 4" stroke="white" strokeWidth="1.2" fill="none"/>
//                 </svg>
//               </div>
//             </div>
//           )}

//           {/* Ненавязчивая подсказка — появляется один раз */}
//           <div
//             className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-300"
//             style={{
//               opacity: showHint ? 1 : 0,
//               transform: `translateX(-50%) translateY(${showHint ? 0 : 8}px)`,
//             }}
//           >
//             <span className="text-[11px] text-white bg-black/50 px-3 py-1 rounded-full whitespace-nowrap">
//               двигайте мышью для просмотра
//             </span>
//           </div>
//         </div>

//         {/* Filmstrip текущего продукта */}
//         <Filmstrip
//           product={currentProduct}
//           currentFrameIndex={currentFrameIndex}
//           onFrameSelect={handleFrameSelect}
//         />

//         {/* Thumbs продуктов (навигация между продуктами) */}
//         <div
//           ref={(el) => (refs.thumbs = el)}
//           className="w-full mt-5 lg:mt-8"
//           style={{ opacity: state.thumbsShown ? 1 : 0 }}
//         >
//           <Swiper
//             modules={[Thumbs]}
//             direction="horizontal"
//             onSwiper={(swiper) =>
//               setSwiperInstances((prev) => ({ ...prev, thumbs: swiper }))
//             }
//             slidesPerView="auto"
//             spaceBetween={10}
//             watchSlidesProgress={true}
//             slideToClickedSlide={true}
//             initialSlide={state.activeProductIndex}
//             speed={swiperConfig.SPEED}
//             preventClicks={false}
//             preventClicksPropagation={false}
//             observer={true}
//             observeParents={true}
//             resistance={false}
//             resistanceRatio={0}
//           >
//             {products.map((product, index) => (
//               <SwiperSlide
//                 key={product.id}
//                 className="!w-[120px] sm:!w-[140px] lg:!w-[200px]"
//               >
//                 <img
//                   src={product.image}
//                   onClick={() => onThumbnailClick(index)}
//                   className={`cursor-pointer transition-all duration-300 rounded-lg px-3 w-full h-20 sm:h-24 lg:h-28 object-contain ${
//                     index === state.activeProductIndex
//                       ? "opacity-100 scale-105"
//                       : "grayscale opacity-60 hover:opacity-100"
//                   }`}
//                   alt={product.name}
//                   draggable="false"
//                 />
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>

//       </div>
//     </div>
//   );
// }

import { useRef, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const SCRUB_THRESHOLD = 10;

function Filmstrip({ product, currentFrameIndex, onFrameSelect }) {
  const allImages = product
    ? [product.image, ...(product.altImages || [])]
    : [];
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  if (allImages.length <= 1) return null;

  const onMouseDown = (e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragScrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = "grabbing";
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    trackRef.current.scrollLeft =
      dragScrollLeft.current - (e.clientX - dragStartX.current);
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };

  return (
    <div className="w-full mt-3 select-none">
      <div className="w-full h-[2px] bg-gray-200 rounded mb-2 overflow-hidden">
        <div
          className="h-full bg-black rounded transition-all duration-200"
          style={{
            width: `${Math.round(((currentFrameIndex + 1) / allImages.length) * 100)}%`,
          }}
        />
      </div>

      <div
        ref={trackRef}
        className="flex overflow-x-auto cursor-grab"
        style={{ scrollbarWidth: "none", gap: 0 }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {allImages.map((src, i) => (
          <div
            key={i}
            onClick={() => onFrameSelect(i)}
            className="relative flex-shrink-0 overflow-hidden"
            style={{
              width: 64,
              height: 48,
              borderRight: "2px solid white",
            }}
          >
            <img
              src={src}
              alt=""
              draggable="false"
              className="w-full h-full object-cover"
              style={{ opacity: i === currentFrameIndex ? 1 : 0.5 }}
            />
            {i === currentFrameIndex && (
              <div className="absolute inset-0 border-2 border-white pointer-events-none" />
            )}
            {i !== currentFrameIndex && (
              <div className="absolute inset-0 bg-black/25 pointer-events-none" />
            )}
          </div>
        ))}
      </div>

      <p className="text-[11px] text-gray-400 mt-1 text-right">
        {currentFrameIndex + 1} / {allImages.length}
      </p>
    </div>
  );
}

export default function ProductGallery({
  products,
  state,
  swiperInstances,
  setSwiperInstances,
  refs,
  imageData,
  animationState,
  onSwiperInit,
  onSlideChange,
  onThumbnailClick,
  onMouseEnter,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  stopHoverAnimation,
  scrubToFrame,
  startPlayAnimation, // ← новый проп
  getMode,            // ← новый проп
  swiperConfig,
}) {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [hintSeen, setHintSeen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const stageRef = useRef(null);

  const currentProduct = products[state.activeProductIndex];
  const allImages = currentProduct
    ? [currentProduct.image, ...(currentProduct.altImages || [])]
    : [];
  const currentFrameIndex =
    state.selectedImageIndices[state.activeProductIndex] ?? 0;

  const mode = getMode(currentProduct); // "scrub" | "play"
  const hasMultiple = allImages.length > 1;

  const handleStageMouseMove = useCallback(
    (e) => {
      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      if (mode === "scrub" && hasMultiple) {
        const frac = Math.max(
          0,
          Math.min(1, (e.clientX - rect.left) / rect.width)
        );
        scrubToFrame(
          state.activeProductIndex,
          Math.floor(frac * allImages.length),
          allImages.length
        );
      }
    },
    [mode, hasMultiple, scrubToFrame, state.activeProductIndex, allImages.length]
  );

  const handleStageEnter = useCallback(() => {
    setIsHovering(true);
    onMouseEnter(state.activeProductIndex, currentProduct);
    if (!hintSeen && hasMultiple) {
      setShowHint(true);
      setHintSeen(true);
      setTimeout(() => setShowHint(false), 2000);
    }
  }, [hintSeen, hasMultiple, onMouseEnter, state.activeProductIndex, currentProduct]);

  const handleStageLeave = useCallback(() => {
    setIsHovering(false);
    setShowHint(false);
    onMouseLeave(state.activeProductIndex);
    if (mode === "play") {
      stopHoverAnimation();
      setIsPlaying(false);
    }
  }, [mode, onMouseLeave, stopHoverAnimation, state.activeProductIndex]);

  // Клик — только для play-режима
  const handleStageClick = useCallback(() => {
    if (mode !== "play" || !hasMultiple) return;
    if (isPlaying) {
      stopHoverAnimation();
      setIsPlaying(false);
    } else {
      startPlayAnimation(state.activeProductIndex, currentProduct);
      setIsPlaying(true);
    }
  }, [
    mode,
    hasMultiple,
    isPlaying,
    stopHoverAnimation,
    startPlayAnimation,
    state.activeProductIndex,
    currentProduct,
  ]);

  const handleFrameSelect = useCallback(
    (i) => {
      stopHoverAnimation();
      setIsPlaying(false);
      scrubToFrame(state.activeProductIndex, i, allImages.length);
    },
    [stopHoverAnimation, scrubToFrame, state.activeProductIndex, allImages.length]
  );

  // Иконка курсора по режиму
  const cursorIcon =
    mode === "scrub"
      ? "⟺"     // или Tabler ti-arrows-horizontal
      : isPlaying
      ? "⏸"
      : "▶";

  const hintText =
    mode === "scrub"
      ? "двигайте мышью для просмотра"
      : "кликните для запуска";

  return (
    <div
      ref={(el) => (refs.swiperContainer = el)}
      className="w-full lg:w-[75%] lg:h-[100%] mt-10 lg:mt-0 lg:content-center"
      style={{
        visibility: !imageData || animationState.complete ? "visible" : "hidden",
        opacity: !imageData || animationState.complete ? 1 : 0,
      }}
    >
      <div className="w-full flex flex-col">

        {/* Главная область с фото */}
        <div
          ref={stageRef}
          className="relative w-full"
          style={{ cursor: hasMultiple ? "none" : "default" }}
          onMouseMove={handleStageMouseMove}
          onMouseEnter={handleStageEnter}
          onMouseLeave={handleStageLeave}
          onClick={handleStageClick}
        >
          <Swiper
            className="custom-swiper h-[250px] sm:h-[300px] md:h-[350px]"
            modules={[Pagination, Mousewheel, Thumbs]}
            pagination={{ clickable: true, el: ".custom-swiper-pagination" }}
            mousewheel={true}
            direction="horizontal"
            centeredSlides={true}
            thumbs={{ swiper: swiperInstances.thumbs }}
            spaceBetween={20}
            initialSlide={state.activeProductIndex}
            speed={swiperConfig.SPEED}
            threshold={swiperConfig.THRESHOLD}
            resistance={true}
            resistanceRatio={swiperConfig.RESISTANCE_RATIO}
            onInit={onSwiperInit}
            onSlideChange={onSlideChange}
            preventClicks={false}
            preventClicksPropagation={false}
            touchStartPreventDefault={false}
            onSlideChangeTransitionStart={() => {
              stopHoverAnimation();
              setIsPlaying(false);
            }}
          >
            {products.map((product, index) => (
              <SwiperSlide
                key={product.id}
                style={{
                  height: "100%",
                  transform: `scale(${product.scale || 1})`,
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={
                      state.selectedImageIndices[index] === 0
                        ? product.image
                        : product.altImages[state.selectedImageIndices[index] - 1]
                    }
                    alt={product.name}
                    className="max-h-full w-auto object-contain"
                    draggable="false"
                    onTouchStart={() => onTouchStart(index, product)}
                    onTouchEnd={() => onTouchEnd(index)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Кастомный курсор */}
          {hasMultiple && isHovering && (
            <div
              className="absolute pointer-events-none z-20 select-none"
              style={{
                left: cursorPos.x,
                top: cursorPos.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center">
                {mode === "scrub" ? (
                  <i className="ti ti-arrows-horizontal text-white text-base" aria-hidden="true" />
                ) : isPlaying ? (
                  <i className="ti ti-player-pause text-white text-base" aria-hidden="true" />
                ) : (
                  <i className="ti ti-player-play text-white text-base" aria-hidden="true" />
                )}
              </div>
            </div>
          )}

          {/* Подсказка — один раз */}
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-300"
            style={{
              opacity: showHint ? 1 : 0,
              transform: `translateX(-50%) translateY(${showHint ? 0 : 6}px)`,
            }}
          >
            <span className="text-[11px] text-white bg-black/50 px-3 py-1 rounded-full whitespace-nowrap">
              {hintText}
            </span>
          </div>
        </div>

        {/* Filmstrip */}
        <Filmstrip
          product={currentProduct}
          currentFrameIndex={currentFrameIndex}
          onFrameSelect={handleFrameSelect}
        />

        {/* Thumbs продуктов */}
        <div
          ref={(el) => (refs.thumbs = el)}
          className="w-full mt-5 lg:mt-8"
          style={{ opacity: state.thumbsShown ? 1 : 0 }}
        >
          <Swiper
            modules={[Thumbs]}
            direction="horizontal"
            onSwiper={(swiper) =>
              setSwiperInstances((prev) => ({ ...prev, thumbs: swiper }))
            }
            slidesPerView="auto"
            spaceBetween={10}
            watchSlidesProgress={true}
            slideToClickedSlide={true}
            initialSlide={state.activeProductIndex}
            speed={swiperConfig.SPEED}
            preventClicks={false}
            preventClicksPropagation={false}
            observer={true}
            observeParents={true}
            resistance={false}
            resistanceRatio={0}
          >
            {products.map((product, index) => (
              <SwiperSlide
                key={product.id}
                className="!w-[120px] sm:!w-[140px] lg:!w-[200px]"
              >
                <img
                  src={product.image}
                  onClick={() => onThumbnailClick(index)}
                  className={`cursor-pointer transition-all duration-300 rounded-lg px-3 w-full h-20 sm:h-24 lg:h-28 object-contain ${
                    index === state.activeProductIndex
                      ? "opacity-100 scale-105"
                      : "grayscale opacity-60 hover:opacity-100"
                  }`}
                  alt={product.name}
                  draggable="false"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}