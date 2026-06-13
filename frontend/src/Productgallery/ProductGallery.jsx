import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

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
  swiperConfig,
}) {
  return (
    
    <div
      ref={(el) => (refs.swiperContainer = el)}
      className="w-full lg:w-[75%] lg:h-[100%] mt-10 lg:mt-0 lg:content-center   "
    
      style={{
        visibility:
          !imageData || animationState.complete ? "visible" : "hidden",
        opacity: !imageData || animationState.complete ? 1 : 0,
      }}
    >
      <div className="w-full flex flex-row items-center justify-between gap-2">
        <div className="w-[100%]">




          <Swiper
            className="custom-swiper h-[250px] sm:h-[300px] md:h-[350px]"
            modules={[Pagination, Mousewheel, Thumbs]}
            pagination={{
              clickable: true,
              el: ".custom-swiper-pagination",
            }}
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
                        : product.altImages[
                            state.selectedImageIndices[index] - 1
                          ]
                    }
                    alt={product.name}
                    className="max-h-full w-auto object-contain"
                    draggable="false"
                    onMouseEnter={() => onMouseEnter(index, product)}
                    onMouseLeave={() => onMouseLeave(index)}
                    onTouchStart={() => onTouchStart(index, product)}
                    onTouchEnd={() => onTouchEnd(index)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* </div> */}
        </div>
      {/* </div> */}
</div>
      <div
        ref={(el) => (refs.thumbs = el)}
        className="w-full mt-5 lg:mt-20"
        style={{ opacity: state.thumbsShown ? 1 : 0 }}
      > <div className="relative border-4 border-black p-2">



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
                    ? "opacity-100 scale-105 border-black"
                    : "grayscale border-transparent opacity-60 hover:opacity-100"
                }`}
                alt={product.name}
                draggable="false"
              />  
            </SwiperSlide>
          ))}
        </Swiper></div>
</div>
      </div>
    // </div>
  );
}