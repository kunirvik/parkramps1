
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useLocation, useParams, useNavigate, useSearchParams } from "react-router-dom";
import gsap from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import LoadingScreen from "../LoadingScreen/LodingScreen";
import SocialButtons from "../SocialButtons/SocialButtons";
import { Pagination, Mousewheel, Thumbs } from "swiper/modules";
import FullscreenGallery from "../FullscreenGallery/FullscreenGallery";
import productCatalogSets from "../data/productCatalogSets";
import "swiper/css";
import "swiper/css/pagination"; 
// import { ChevronDown, ChevronUp } from "lucide-react";
import Accordion from "../Accordion/Accordion";
import ContactButton from "../ContactButtons/ContactButton";
import Footer from "../Footer/Footer"


// Константы
const ANIMATION_CONFIG = {
  DURATION: 0.6,
  EASE: "power2.out",
  HALF_DURATION: 0.3
};

const SWIPER_CONFIG = {
  SPEED: ANIMATION_CONFIG.DURATION * 1000,
  THRESHOLD: 20,
  RESISTANCE_RATIO: 0.85
};

const LOADING_SCREEN_DURATION = 1500;

export default function SetsProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, category } = useParams();
  const [searchParams] = useSearchParams();
const isTouchDevice = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
  // Извлекаем данные из location state
  const imageData = location.state?.imageData;
  const slideIndexParam = Number(searchParams.get('view')) || 0;
const isDesktop = () => window.innerWidth >= 1024; // или другой порог
  // Определяем, нужен ли loading screen
  const shouldShowLoading = useMemo(() => !imageData, [imageData]);

  // Основные состояния - объединены в один объект для лучшей производительности
  const [state, setState] = useState(() => ({
    activeProductIndex: Math.max(0, productCatalogSets.findIndex(p => p.id === Number(id))),
    selectedImageIndices: productCatalogSets.map(() => 0),
    hoveredIndex: null,
    isGalleryOpen: false,
    galleryStartIndex: 0,
    thumbsShown: false
  }));

  const [accordionKey, setAccordionKey] = useState(0);

const resetAccordion = () => {
  // изменение ключа форсит сброс Accordion в закрытое состояние
  setAccordionKey(prev => prev + 1);
};


  // Состояния Swiper
  const [swiperInstances, setSwiperInstances] = useState({
    main: null,
    thumbs: null
  });

  // Состояния анимации
  const [animationState, setAnimationState] = useState({
    complete: !imageData,
    inProgress: false,
    slideChanging: false
  });

  // Состояния загрузки
  const [loadingState, setLoadingState] = useState({
    isLoading: shouldShowLoading,
    isCompleted: false
  });

  // Refs - объединены в один объект
  const refs = useRef({
    container: null,
    transitionImage: null,
    swiperContainer: null,
    info: null,
    thumbs: null,
    urlUpdateBlocked: false,
    lastInteraction: Date.now(),
    hoverInterval: null,
    hoveredIndex: null,
    pendingHover: null,
    mousePos: { x: 0, y: 0 }
  });

  // Мемоизированные значения
  const currentProduct = useMemo(() => 
    productCatalogSets[state.activeProductIndex], 
    [state.activeProductIndex]
  );

  // const currentImagesFullscreen = useMemo(() => 
  //   currentProduct ? currentProduct.sample : [], 
  //   [currentProduct]
  // );

  const allImages = useMemo(() => 
    productCatalogSets.flatMap((p) => p.sample || []), 
    []
  );

  // Утилиты - мемоизированы с useCallback
  const updateUrl = useCallback((productId, viewIndex = 0) => {
    if (refs.current.urlUpdateBlocked) return;
    
    refs.current.urlUpdateBlocked = true;
    const newUrl = `/product/sets/${productId}?view=${viewIndex}`;
    window.history.replaceState(null, '', newUrl);
    
    setTimeout(() => {
      refs.current.urlUpdateBlocked = false;
    }, 50);
  }, []);

  const updateAnimationState = useCallback((updates) => {
    setAnimationState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Обработка завершения loading screen
  const handleLoadingComplete = useCallback(() => {
    setLoadingState(prev => ({ ...prev, isCompleted: true }));
    
    setTimeout(() => {
      setLoadingState(prev => ({ ...prev, isLoading: false }));
      
      // Анимируем появление контента
      if (refs.current.container && refs.current.info) {
        gsap.fromTo(refs.current.container, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: ANIMATION_CONFIG.DURATION,
            ease: ANIMATION_CONFIG.EASE 
          }
        );
        
        gsap.fromTo(refs.current.info,
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: ANIMATION_CONFIG.DURATION,
            ease: ANIMATION_CONFIG.EASE,
            delay: 0.2
          }
        );
      }
    }, 200);
  }, []);

  // Анимации
  const animateInfo = useCallback((direction = 'in') => {
    if (!refs.current.info) return Promise.resolve();
    
    const isIn = direction === 'in';
    const targetOpacity = isIn ? 1 : 0;
    const targetY = isIn ? 0 : 20;
    const duration = isIn ? ANIMATION_CONFIG.DURATION : ANIMATION_CONFIG.HALF_DURATION;

    return new Promise(resolve => {
      gsap.to(refs.current.info, {
        opacity: targetOpacity,
        y: targetY,
        duration,
        ease: ANIMATION_CONFIG.EASE,
        onComplete: resolve
      });
    });
  }, []);

  // Обработчики мыши - оптимизированы
  const handleMouseMove = useCallback((e) => {
    refs.current.mousePos = { x: e.clientX, y: e.clientY };
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches && e.touches[0]) {
      refs.current.mousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, [])


  const getIntervalDuration = (totalImages) => {
  if (totalImages <= 1) return null;
  
  // 3 картинки → 1500 мс, 15 картинок → 500 мс
  const minImages = 3;
  const maxImages = 15;
  const minInterval = 200;
  const maxInterval = 1500;

  // Линейная интерполяция
  if (totalImages <= minImages) return maxInterval;
  if (totalImages >= maxImages) return minInterval;

  const ratio = (totalImages - minImages) / (maxImages - minImages);
  return maxInterval - ratio * (maxInterval - minInterval);
};
 
  // Hover логика - оптимизирована
  const startHoverInterval = useCallback((index, product) => {
    if (isTouchDevice) return; // 🚫 отключаем на телефонах 
    

    clearInterval(refs.current.hoverInterval);

    const totalImages = 1 + (product?.altImages?.length || 0);
    if (totalImages <= 1) return;

     const intervalDuration = getIntervalDuration(totalImages);

    refs.current.hoverInterval = setInterval(() => {
      setState(prev => {
        const newIndices = [...prev.selectedImageIndices];
        const cur = newIndices[index] ?? 0;
        newIndices[index] = (cur + 1) % totalImages;
        return { ...prev, selectedImageIndices: newIndices };
      });
    }, intervalDuration );
  }, []);

  const isPointerOverSwiper = useCallback(() => {
    if (!refs.current.swiperContainer) return false;
    const { x, y } = refs.current.mousePos;
    const el = document.elementFromPoint(x, y);
    return !!el && refs.current.swiperContainer.contains(el);
  }, []);
 const openGallery = useCallback(() => {
    // Пересчитываем индекс каждый раз при открытии галереи
    const productStartIndex = productCatalogSets
      .slice(0, state.activeProductIndex)
      .reduce((acc, p) => acc + (p.sample?.length || 0), 0);

    const startIndex = currentProduct.sample?.length ? productStartIndex : 0;

    updateState({
      galleryStartIndex: startIndex,
      isGalleryOpen: true
    });
  }, [state.activeProductIndex, currentProduct, updateState]);
 


    const closeGallery = useCallback(() => {
  updateState({ isGalleryOpen: false });
}, []);

  // Отдельная функция для показа инфо и миниатюр
const showInfoAndThumbs = useCallback(() => {
  const animations = [];

  if (refs.current.info) {
    animations.push(gsap.fromTo(refs.current.info,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: ANIMATION_CONFIG.DURATION, ease: ANIMATION_CONFIG.EASE }
    ));
  }

  if (refs.current.thumbs) {
    animations.push(gsap.fromTo(refs.current.thumbs,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: ANIMATION_CONFIG.DURATION, ease: ANIMATION_CONFIG.EASE }
    ));
  }

  return Promise.all(animations.map(anim => new Promise(resolve => anim.eventCallback("onComplete", resolve))));
}, []);
 

  // Анимация перехода - оптимизирована
  const startTransitionAnimation = useCallback(() => {
    if (!refs.current.transitionImage || !refs.current.swiperContainer || 
        !imageData || animationState.inProgress) {
      updateAnimationState({ complete: true });
      return;
    }

    updateAnimationState({ inProgress: true });

    const { top, left, width, height } = imageData.rect;
    const transitionEl = refs.current.transitionImage;
    const swiperEl = refs.current.swiperContainer;
    const firstSlideImage = swiperEl.querySelector('.swiper-slide-active img');

    if (!firstSlideImage) {
      console.warn("Активное изображение слайда не найдено");
      updateAnimationState({ complete: true, inProgress: false });
      return;
    }

    const finalRect = firstSlideImage.getBoundingClientRect();
    
    if (finalRect.width === 0 || finalRect.height === 0) {
      setTimeout(() => {
        updateAnimationState({ inProgress: false });
        startTransitionAnimation();
      }, 100);
      return;
    }

    // Скрываем swiper
    gsap.set(swiperEl, { visibility: 'hidden', opacity: 0 });

    // Устанавливаем начальное состояние
    gsap.set(transitionEl, {
      position: "absolute",
      top: top - window.scrollY,
      left: left - window.scrollX,
      width, height,
      zIndex: 1000,
      opacity: 1,
      visibility: 'visible',
      objectFit: "contain",
      borderRadius: imageData.borderRadius || '0px',
      pointerEvents: 'none'
    });

    // Анимируем переход
    gsap.to(transitionEl, {
      top: finalRect.top - window.scrollY,
      left: finalRect.left - window.scrollX,
      width: finalRect.width,
      height: finalRect.height,
      borderRadius: '12px',
      duration: ANIMATION_CONFIG.DURATION,
      ease: ANIMATION_CONFIG.EASE,
  // В startTransitionAnimation:
onComplete: async () => {
  gsap.set(swiperEl, { visibility: 'visible', opacity: 1 });
  gsap.set(transitionEl, { visibility: 'hidden', opacity: 0 });

  updateAnimationState({ complete: true });

  // Показываем инфо и миниатюры вместе только один раз
  if (!state.thumbsShown) {
    await showInfoAndThumbs();
    updateState({ thumbsShown: true });
  }

  updateAnimationState({ inProgress: false });
}

    });
  }, [imageData, animationState.inProgress, updateAnimationState, animateInfo]);

  // Обработчики Swiper - оптимизированы
  const handleSwiperInit = useCallback((swiper) => {
    setSwiperInstances(prev => ({ ...prev, main: swiper }));
     if (!imageData) {
    // Если зашли напрямую, делаем анимацию здесь
    if (!state.thumbsShown) {
      gsap.set(refs.current.info, { opacity: 0, y: 20 });
      gsap.set(refs.current.thumbs, { opacity: 0, y: 20 });
      showInfoAndThumbs().then(() => updateState({ thumbsShown: true }));
    }
    return;
  }

  requestAnimationFrame(startTransitionAnimation);
}, [imageData, startTransitionAnimation, state.thumbsShown, showInfoAndThumbs]);

  const handleSlideChange = useCallback(async (swiper) => {
    const newIndex = swiper.activeIndex;
    if (newIndex === state.activeProductIndex || animationState.inProgress) return;

    const oldIndex = state.activeProductIndex;
    updateAnimationState({ slideChanging: true, inProgress: true });

    await animateInfo('out');


    resetAccordion();

    // Обновляем состояние одним вызовом
    setState(prev => {
      const newIndices = [...prev.selectedImageIndices];
      newIndices[newIndex] = 0;
      return {
        ...prev,
        activeProductIndex: newIndex,
        selectedImageIndices: newIndices
      };
    });

    updateUrl(productCatalogSets[newIndex].id, 0);
    if (swiperInstances.thumbs) {
      swiperInstances.thumbs.slideTo(newIndex);
    }

    
    updateAnimationState({ slideChanging: false, inProgress: false });
    await animateInfo('in');
    clearInterval(refs.current.hoverInterval);
    refs.current.hoverInterval = null;

    setTimeout(async () => {
      setState(prev => {
        const newIndices = [...prev.selectedImageIndices];
        newIndices[oldIndex] = 0;
        return { ...prev, selectedImageIndices: newIndices };
      });
  // 🚫 на мобильных ничего не делаем
  if (isTouchDevice) return;

      const pending = refs.current.pendingHover;
      if ((pending && pending.index === newIndex) || 
          refs.current.hoveredIndex === newIndex || 
          isPointerOverSwiper()) {
        const product = productCatalogSets[newIndex];
        startHoverInterval(newIndex, product);
        refs.current.pendingHover = null;
      }
    }, SWIPER_CONFIG.SPEED);
  }, [state.activeProductIndex, animationState.inProgress, swiperInstances.thumbs, 
      updateUrl, animateInfo, updateAnimationState, isPointerOverSwiper, startHoverInterval]);

  const handleThumbnailClick = useCallback((index) => {
    if (animationState.inProgress || index === state.activeProductIndex || !swiperInstances.main) 
      return;
    
    swiperInstances.main.slideTo(index);
  }, [animationState.inProgress, state.activeProductIndex, swiperInstances.main]);

  
const handleMouseEnter = useCallback((index, product) => {
  if (isTouchDevice) return; // 🚫 на телефоне не запускаем
  if (!animationState.complete || animationState.inProgress) return;

  updateState({ hoveredIndex: index });
  clearInterval(refs.current.hoverInterval);

  const totalImages = 1 + (product?.altImages?.length || 0);
  if (totalImages <= 1) return;

  const intervalDuration = getIntervalDuration(totalImages); // динамический расчёт

  refs.current.hoverInterval = setInterval(() => {
    setState(prev => {
      const newIndices = [...prev.selectedImageIndices];
      const cur = newIndices[index] ?? 0;
      newIndices[index] = (cur + 1) % totalImages;
      return { ...prev, selectedImageIndices: newIndices };
    });
  }, intervalDuration);
}, [animationState.complete, animationState.inProgress, getIntervalDuration]);

const handleMouseLeave = useCallback(() => {
  updateState({ hoveredIndex: null });
  clearInterval(refs.current.hoverInterval);
  refs.current.hoverInterval = null;
}, []);

  
  const handleTouchStart = useCallback(() => {
  if (!isDesktop()) return; // на телефоне просто ничего не делаем
}, []);

const handleTouchEnd = useCallback(() => {
  if (!isDesktop()) return;
  clearInterval(refs.current.hoverInterval);
}, []);

 

  // Effects - оптимизированы
  useEffect(() => {
    if (!shouldShowLoading) return;

    const timer = setTimeout(() => {
      handleLoadingComplete();
    }, LOADING_SCREEN_DURATION);

    return () => clearTimeout(timer);
  }, [shouldShowLoading, handleLoadingComplete]);



useEffect(() => {
  if (!isTouchDevice) {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  } else {
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    return () => window.removeEventListener('touchstart', handleTouchMove);
  }
}, [handleMouseMove, handleTouchMove, isTouchDevice]);
  useEffect(() => {
    if (!swiperInstances.main || animationState.inProgress) return;

    setState(prev => {
      const newIndices = [...prev.selectedImageIndices];
      newIndices[state.activeProductIndex] = slideIndexParam;
      return { ...prev, selectedImageIndices: newIndices };
    });
  }, [slideIndexParam, swiperInstances.main, animationState.inProgress, state.activeProductIndex]);

  // Стили и блокировка скролла - оптимизированы
  useEffect(() => {
    const styleElement = document.createElement("style");
    document.head.appendChild(styleElement);

    const applyStyles = (isDesktop) => {
      styleElement.innerHTML = `
        html, body { 
          overflow: ${isDesktop ? "auto" : "auto"} !important; 
          height: 100% !important;
          width: 100% !important;
        }
        .swiper-wrapper { 
          transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94) !important; 
        }
        .swiper-slide { 
          transition: transform ${ANIMATION_CONFIG.DURATION}s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                      opacity ${ANIMATION_CONFIG.DURATION}s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important; 
        }
        .swiper-no-transition .swiper-wrapper { transition: none !important; }
        .swiper-slide-thumb-active {
          opacity: 1 !important;
          transform: scale(1.05) !important;
          border: 2px solid black !important;
          border-radius: 0.5rem !important;
        }
        .transition-image-container {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          overflow: hidden !important;
          pointer-events: none !important;
        }
      `;
    };

    const handleResize = () => applyStyles(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.head.removeChild(styleElement);
      clearInterval(refs.current.hoverInterval);
    };
  }, []);

  useEffect(() => {
    const swiper = swiperInstances.main;
    if (!swiper || animationState.inProgress) return;

    const newIndex = swiper.activeIndex;
    if (newIndex !== state.activeProductIndex) {
      updateState({ activeProductIndex: newIndex });
      updateUrl(productCatalogSets[newIndex].id, state.selectedImageIndices[newIndex]);

      if (swiperInstances.thumbs) {
        swiperInstances.thumbs.slideTo(newIndex);
      }
    }
  }, [swiperInstances.main?.activeIndex, animationState.inProgress, state.activeProductIndex, state.selectedImageIndices]);

  // Early returns
  if (!currentProduct) {
    return <div className="text-center mt-10 p-4">Продукт не найден</div>;
  }

  if (loadingState.isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
        <>
      <div className="flex flex-col min-h-screen">
        <div className="z-50 flex-shrink-0">
          <SocialButtons
            buttonLabel="shop"
            onButtonClick={() => navigate("/catalogue")}
            buttonAnimationProps={{ whileTap: { scale: 0.85, opacity: 0.6 } }}
          />
        </div>

        <div
          ref={el => refs.current.container = el}
          className="w-full flex-grow mt-[70px] mx-auto px-4"
          style={{
            opacity: shouldShowLoading && !loadingState.isCompleted ? 0 : 1,
          }}
        >
                 {/* <div className=" block lg:hidden w-[100%]   top-20 z-20">
  <p className="text-[#bdbdbd]  text-[17px] font-futura font-medium tracking-wide">
 Твій парк — твоя історія. Ми просто допомагаємо зробити її реальною.
 
  </p>
</div>
                      <div className="w-full  hidden sm:block  flex items-start  mb-4">
       
      {/* Левая часть — Back */}
      {/* <button
        onClick={() => navigate(-1)}
        className=" cursor-pointer font-futura text-[#717171] font-medium text-[17px] hover:text-pink-800 transition-colors"
      >
        ← Back
      </button>
<div className="hidden lg:block w-[50%] absolute right-[1%] top-20 z-20">
  <p className="text-[#bdbdbd] text-right text-[20px] font-futura font-medium tracking-wide">
   Твій парк — твоя історія. Ми просто допомагаємо зробити її реальною.
   Будуємо скейтпарки під будь-яку ідею: від дворових локацій до великих проєктів. 
   Працюємо з металом, бетоном і фанерою. 
    
  </p>
</div>

    </div>  */}

  

<div className="w-full lg:h-[50%] flex flex-col lg:flex-row lg:content-center relative">
 {/* ІНФОРМАЦІЙНА ПАНЕЛЬ ЛІВОРУЧ (на десктопі) */}
  <div
    ref={el => refs.current.info = el}
    className="w-full lg:w-[25%] lg:h-[55%] flex flex-col justify  lg:mt-10 lg:pr-8"
    style={{
      opacity:
        animationState.slideChanging || (!animationState.complete && imageData)
          ? 0
          : 1,
      transform:
        animationState.slideChanging || (!animationState.complete && imageData)
          ? "translateY(20px)"
          : "translateY(0)",
      pointerEvents: animationState.slideChanging ? "none" : "auto",
    }}
  >
    {/* <div className="lg:block">
      <h1 className="text-3xl font-futura text-[#717171] font-bold mb-3">
        {currentProduct.name}
      </h1>
    </div>
    <p className="text-1xl font-futura text-[#717171] font-medium mb-3">
      {currentProduct.description3}
    </p> */}
    <Accordion
      key={accordionKey} 
      items={[
        {title: currentProduct.name, content: currentProduct.description2 },
        { title: "замовити", content: (<>{currentProduct.description} <ContactButton/></>) },
      ]}
      defaultOpenIndex={1}
      forceCloseTrigger={state.activeProductIndex}
    />
    <button
      onClick={() => openGallery(state.activeProductIndex)}
      className="w-full text-left flex cursor-pointer justify-between items-center py-3 border-b border-gray-200 text-gray-900 hover:text-blue-600 transition-colors"
    >
      <span className="font-futura text-[#717171] font-bold text-[50px]">
        вироби
      </span>
      <span className="font-futura text-[#717171] text-lg">→</span>
    </button>
  </div> {/* Переходное изображение */}
  {!animationState.complete && imageData && (
    <div className="transition-image-container">
      <img
        ref={el => refs.current.transitionImage = el}
        src={currentProduct.image}
        alt={currentProduct.name}
        className="object-contain"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          visibility: "visible",
          pointerEvents: "none",
        }}
      />
    </div>
  )}

  

  {/* SWIPER ГАЛЕРЕЯ ПРАВОРУЧ (на десктопі) */}
  <div
    ref={el => refs.current.swiperContainer = el}
    className="w-full lg:w-[75%] lg:h-[100%] mt-0 lg:mt-20 lg:content-center"
    style={{
      visibility: !imageData || animationState.complete ? "visible" : "hidden",
      opacity: !imageData || animationState.complete ? 1 : 0,
    }}
  >
    <div className="w-full flex flex-row items-start justify-between gap-2">
      <div className="w-[100%]">
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
          speed={SWIPER_CONFIG.SPEED}
          threshold={SWIPER_CONFIG.THRESHOLD}
          resistance={true}
          resistanceRatio={SWIPER_CONFIG.RESISTANCE_RATIO}
          onInit={handleSwiperInit}
          onSlideChange={handleSlideChange}
          preventClicks={false}
          preventClicksPropagation={false}
          touchStartPreventDefault={false}
          onSlideChangeTransitionStart={() => {
            clearInterval(refs.current.hoverInterval);
            refs.current.hoverInterval = null;
          }}
        >
          {productCatalogSets.map((product, index) => (
            <SwiperSlide key={product.id} style={{ height: "100%" }}>
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
                  onMouseEnter={() => handleMouseEnter(index, product)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  onTouchStart={() => handleTouchStart(index, product)}
                  onTouchEnd={() => handleTouchEnd(index)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="custom-swiper-pagination mt-4 sm:mt-4 flex justify-center text-[#ff00fb]" />
      </div>
    </div>    
    
    
   
  </div>
          </div>  
        </div>     <div
          ref={el => refs.current.thumbs = el}
         className="w-[100vw]"
          style={{
            opacity: state.thumbsShown ? 1 : 0,
          }}
        >   <div className="">
          <Swiper
            modules={[Thumbs]}
            direction="horizontal"
            onSwiper={(swiper) =>  { 
              setSwiperInstances((prev) => ({ ...prev, thumbs: swiper })); }}
            breakpoints={{
              320: { slidesPerView: 4, spaceBetween: 8 },
              480: { slidesPerView: 8 },
              640: { slidesPerView: 8 },
              768: { slidesPerView: 8 },
              1024: { slidesPerView: 8 },
              1280: { slidesPerView: 8 },
            }} 
    
            slidesPerView="auto"
            spaceBetween={10}
            watchSlidesProgress={true}
            slideToClickedSlide={true}
            initialSlide={state.activeProductIndex}
            speed={SWIPER_CONFIG.SPEED}
            preventClicks={false}
            preventClicksPropagation={false}
            observer={true}
            observeParents={true}
            resistance={false}
            resistanceRatio={0}
          
          >
            {productCatalogSets.map((product, index) => (
              <SwiperSlide key={product.id} className="  ">
                <img
                  src={product.image}
                  onClick={() => handleThumbnailClick(index)}
                  className={`cursor-pointer transition-all duration-300 rounded-lg border-2 px-3  ${
                    index === state.activeProductIndex
                      ? "opacity-100 scale-105 border-black"
                      : "grayscale border-transparent opacity-60 hover:opacity-100"
                  }`}
                  alt={product.name}
                  draggable="false"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div></div>

  
  <Footer></Footer>


        {/* Fullscreen gallery */}
        <FullscreenGallery
          images={allImages}
          startIndex={state.galleryStartIndex}
          isOpen={state.isGalleryOpen}
          onClose={closeGallery}
        />

       

      </div>
    </>
  );
}


