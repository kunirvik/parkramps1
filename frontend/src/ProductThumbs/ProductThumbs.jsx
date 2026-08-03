// import { Swiper, SwiperSlide } from "swiper/react";
// import { Thumbs } from "swiper/modules";

// export default function ProductThumbs({
//   products,
//   state,
//   setSwiperInstances,
//   onThumbnailClick,
//   swiperConfig,
//   thumbsRef,
//   visible = true,
//   className = "",
// }) {
//   return (
//     <div ref={thumbsRef} className={`w-full ${className}`}>
//       <Swiper
//         modules={[Thumbs]}
//         direction="horizontal"
//         onSwiper={(swiper) => setSwiperInstances((prev) => ({ ...prev, thumbs: swiper }))}
//         slidesPerView="auto"
//         spaceBetween={10}
//         watchSlidesProgress={true}
//         slideToClickedSlide={true}
//         initialSlide={state.activeProductIndex}
//         speed={swiperConfig.SPEED}
//         preventClicks={false}
//         preventClicksPropagation={false}
//         observer={true}
//         observeParents={true}
//         resistance={false}
//         resistanceRatio={0}
//       >
//         {products.map((product, index) => (
//           <SwiperSlide key={product.id} className="!w-[120px] sm:!w-[140px] lg:!w-[200px]">
//             <img
//               src={product.image}
//               onClick={() => onThumbnailClick(index)}
//               className={`cursor-pointer transition-all duration-300 rounded-lg px-3 w-full h-20 sm:h-24 lg:h-28 object-contain ${
//                 index === state.activeProductIndex
//                   ? "opacity-100 scale-105"
//                   : "grayscale opacity-60 hover:opacity-100"
//               }`}
//               alt={product.name}
//               draggable="false"
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// }

import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";

export default function ProductThumbs({
  products,
  state,
  setSwiperInstances,
  onThumbnailClick,
  swiperConfig,
  thumbsRef,
  visible = true,
  className = "",
}) {
  return (
    <div
      ref={thumbsRef}
      className={`w-full ${className}`}
      // ВАЖНО: начальный inline-стиль синхронизирован с тем,
      // что первым делом выставляет GSAP (opacity:0, y:20).
      // Это устраняет FOUC — до того, как JS выполнит gsap.set,
      // браузер уже отрендерит блок скрытым, а не видимым.
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(20px)",
        pointerEvents: visible ? "auto" : "none",
        willChange: "opacity, transform",
      }}
    >
      <Swiper
        modules={[Thumbs]}
        direction="horizontal"
        onSwiper={(swiper) => setSwiperInstances((prev) => ({ ...prev, thumbs: swiper }))}
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
          <SwiperSlide key={product.id} className="!w-[120px] sm:!w-[140px] lg:!w-[200px]">
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
  );
}