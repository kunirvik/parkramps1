import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useLocation, useParams, useNavigate, useSearchParams } from "react-router-dom";
import gsap from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import LoadingScreen from "../LoadingScreen/LodingScreen";
import SocialButtons from "../SocialButtons/SocialButtons";
import { Pagination, Mousewheel, Thumbs } from "swiper/modules";
import FullscreenGallery from "../FullscreenGallery/FullscreenGallery";
import productCatalogRamps from "../data/productCatalogRamps";
import "swiper/css";
import "swiper/css/pagination";
import Accordion from "../Accordion/Accordion";
import  useOpenGallery  from "../hooks/useOpenGallery";
import ContactButton from "../ContactButtons/ContactButton";
import Footer from "../Footer/Footer";
import ProductInfo from "../ProductInfo/ProductInfo";
import { useProductAccordion } from "../hooks/useProductAccordion";
import { useHoverAnimation } from "../hooks/useHoverAnimation";
import { useSlideAnimation } from "../hooks/useSlideAnimation";
import TransitionImage from "../TransitionImage/Transitionimage";
import ProductGallery from "../Productgallery/ProductGallery";
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

export default function RampsProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
 // ─── Gallery ──────────────────────────────────────────────────────────────
  const openGallery = useOpenGallery();

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  // const imageData = location.state?.imageData;
const imageDataRef = useRef(location.state?.imageData ?? null);
const imageData = imageDataRef.current;

  const slideIndexParam = Number(searchParams.get("view")) || 0;

  const isDesktop = () => window.innerWidth >= 1024;

  const shouldShowLoading = useMemo(() => !imageData, [imageData]);

  // ─── State ───────────────────────────────────────────────────────────────
  const [state, setState] = useState(() => ({
    activeProductIndex: Math.max(
      0,
      productCatalogRamps.findIndex((p) => p.id === Number(id))
    ),
    selectedImageIndices: productCatalogRamps.map(() => 0),
    hoveredIndex: null,
    isGalleryOpen: false,
    galleryStartIndex: 0,
    thumbsShown: false,
    purchaseShown: false,
    productionShown: false,
  }));



  const [swiperInstances, setSwiperInstances] = useState({
    main: null,
    thumbs: null,
  });


  const [loadingState, setLoadingState] = useState({
    isLoading: shouldShowLoading,
    isCompleted: false,
  });

  // ─── Refs ────────────────────────────────────────────────────────────────
  const refs = useRef({
    container: null,
    transitionImage: null,
    swiperContainer: null,
    info: null,
    purchaceAccordion: null,
    productionAccordion: null,
    thumbs: null,
    urlUpdateBlocked: false,
    lastInteraction: Date.now(),
 
    mousePos: { x: 0, y: 0 },
  });


  const socialButtonsRef = useRef(null);

  // ─── Мемо ────────────────────────────────────────────────────────────────
  const currentProduct = useMemo(
    () => productCatalogRamps[state.activeProductIndex],
    [state.activeProductIndex]
  );

  

  // ─── Утилиты ─────────────────────────────────────────────────────────────
  const updateUrl = useCallback((productId) => {
    if (refs.current.urlUpdateBlocked) return;
    refs.current.urlUpdateBlocked = true;
    window.history.replaceState(null, "", `/product/ramps/${productId}`);
    setTimeout(() => {
      refs.current.urlUpdateBlocked = false;
    }, 50);
  }, []);



  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const clearImageDataFromHistory = useCallback(() => {
  const currentState = window.history.state || {};

  window.history.replaceState(
    {
      ...currentState,
      usr: {
        ...(currentState.usr || {}),
        imageData: null,
      },
    },
    "",
    window.location.pathname + window.location.search
  );
}, []);


const {
  accordionState,
  setAccordionState,
  handleAccordionToggle,
} = useProductAccordion(openGallery, "ramps", state.activeProductIndex);
const {
  handleMouseEnter: handleMouseEnterBase,
  handleMouseLeave,
  startHoverAnimation,
  stopHoverAnimation,

} = useHoverAnimation(isTouchDevice, setState);

const {
  animationState,
  animationInProgressRef,
  updateAnimationState,
  animateInfo,
  showInfoAndThumbs,
  startTransitionAnimation,
} = useSlideAnimation({
  imageData,
  refs,
  thumbsShown: state.thumbsShown,
  updateState,
   onTransitionComplete: clearImageDataFromHistory,
}); 
  // ─── Loading ──────────────────────────────────────────────────────────────
  const handleLoadingComplete = useCallback(() => {
    setLoadingState((prev) => ({ ...prev, isCompleted: true }));
    setTimeout(() => {
      setLoadingState((prev) => ({ ...prev, isLoading: false }));

      requestAnimationFrame(() => {
        const targets = [
          refs.current.container,
          refs.current.info,
          refs.current.purchaceAccordion,
          refs.current.productionAccordion,
        ].filter(Boolean);

        gsap.set(targets, { opacity: 0, y: 20 });

        targets.forEach((el, i) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: ANIMATION_CONFIG.DURATION,
            ease: ANIMATION_CONFIG.EASE,
            delay: i * 0.1,
          });
        });
      });
    }, 200);
  }, []);


  // ─── Mouse / Touch ────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    refs.current.mousePos = { x: e.clientX, y: e.clientY };
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches?.[0]) {
      refs.current.mousePos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }, []);



  const isPointerOverSwiper = useCallback(() => {
    if (!refs.current.swiperContainer) return false;
    const { x, y } = refs.current.mousePos;
    const el = document.elementFromPoint(x, y);
    return !!el && refs.current.swiperContainer.contains(el);
  }, []);


const handleMouseEnter = useCallback(
  (index, product) => {
    if (!animationState.complete || animationState.inProgress) return;
    handleMouseEnterBase(index, product, true);
  },
  [animationState.complete, animationState.inProgress, handleMouseEnterBase]
);


  const handleTouchStart = useCallback(() => {
    if (!isDesktop()) return;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDesktop()) return;
   
    stopHoverAnimation();
  }, []);

 




  // ─── Swiper init ──────────────────────────────────────────────────────────
  const handleSwiperInit = useCallback(
    (swiper) => {
      setSwiperInstances((prev) => ({ ...prev, main: swiper }));

      if (!imageData) {
        if (!state.thumbsShown) {
          gsap.set(refs.current.purchaceAccordion, { opacity: 0, y: 20 });
          gsap.set(refs.current.info, { opacity: 0, y: 20 });
          gsap.set(refs.current.thumbs, { opacity: 0, y: 20 });
          showInfoAndThumbs().then(() =>
            updateState({
              thumbsShown: true,
              purchaseShown: true,
              productionShown: true,
            })
          );
        }
        return;
      }

      requestAnimationFrame(startTransitionAnimation);
    },
    [
      imageData,
      startTransitionAnimation,
      state.thumbsShown,
      showInfoAndThumbs,
      updateState,
    ]
  );

  // ─── Slide change ─────────────────────────────────────────────────────────
  const handleSlideChange = useCallback(
    async (swiper) => {
      socialButtonsRef.current?.close();
      const newIndex = swiper.activeIndex;
      if (newIndex === state.activeProductIndex || animationInProgressRef.current) return;

      const oldIndex = state.activeProductIndex;
      animationInProgressRef.current = true;
      updateAnimationState({ slideChanging: true, inProgress: true });

      const isMobile = window.innerWidth < 1024;

      if (isMobile) {
        setAccordionState({ purchase: null, product: null, virobi: null });
      } else {
        setAccordionState((prev) => ({
          purchase: null,
          product: 0,
          virobi: prev.virobi,
        }));
      }

      await animateInfo("out");

      setState((prev) => {
        const newIndices = [...prev.selectedImageIndices];
        newIndices[newIndex] = 0;
        return {
          ...prev,
          activeProductIndex: newIndex,
          selectedImageIndices: newIndices,
        };
      });

      updateUrl(productCatalogRamps[newIndex].id);

      if (swiperInstances.thumbs) {
        swiperInstances.thumbs.slideTo(newIndex);
      }

      animationInProgressRef.current = false;
      updateAnimationState({ slideChanging: false, inProgress: false });

      if (isMobile) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        setAccordionState({ purchase: null, product: 0, virobi: null });
      }

      await animateInfo("in");

      stopHoverAnimation();


      setTimeout(() => {
  setState((prev) => {
    const newIndices = [...prev.selectedImageIndices];
    newIndices[oldIndex] = 0;
    return { ...prev, selectedImageIndices: newIndices };
  });

  if (isTouchDevice) return;

  if (isPointerOverSwiper()) {
    const product = productCatalogRamps[newIndex];
    startHoverAnimation(newIndex, product);
  }
}, SWIPER_CONFIG.SPEED);

    },
    [
      state.activeProductIndex,
      swiperInstances.thumbs,
      updateUrl,
      animateInfo,
      updateAnimationState,
      isPointerOverSwiper,
      // startHoverInterval,
       startHoverAnimation,
  stopHoverAnimation,
      isTouchDevice,

    ]
  );

  // ─── Thumbnail click ──────────────────────────────────────────────────────
  const handleThumbnailClick = useCallback(
    (index) => {
      socialButtonsRef.current?.close();
      if (
        animationInProgressRef.current ||
        index === state.activeProductIndex ||
        !swiperInstances.main
      )
        return;
      swiperInstances.main.slideTo(index);
    },
    [state.activeProductIndex, swiperInstances.main]
  );

 

  // ─── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!shouldShowLoading) return;
    const timer = setTimeout(handleLoadingComplete, LOADING_SCREEN_DURATION);
    return () => clearTimeout(timer);
  }, [shouldShowLoading, handleLoadingComplete]);

  useEffect(() => {
    if (!isTouchDevice) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      return () => window.removeEventListener("mousemove", handleMouseMove);
    } else {
      window.addEventListener("touchstart", handleTouchMove, { passive: true });
      return () => window.removeEventListener("touchstart", handleTouchMove);
    }
  }, [handleMouseMove, handleTouchMove, isTouchDevice]);

  useEffect(() => {
    if (!swiperInstances.main || animationInProgressRef.current) return;
    setState((prev) => {
      const newIndices = [...prev.selectedImageIndices];
      newIndices[state.activeProductIndex] = slideIndexParam;
      return { ...prev, selectedImageIndices: newIndices };
    });
  }, [slideIndexParam, swiperInstances.main, state.activeProductIndex]);

  useEffect(() => {
    const styleElement = document.createElement("style");
    document.head.appendChild(styleElement);

    const applyStyles = (desktop) => {
      styleElement.innerHTML = `
        html, body { 
          overflow: auto !important; 
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
      // clearInterval(refs.current.hoverInterval);
      stopHoverAnimation();
    };
  }, [stopHoverAnimation]);

  useEffect(() => {
    const swiper = swiperInstances.main;
    if (!swiper || animationInProgressRef.current) return;

    const newIndex = swiper.activeIndex;
    if (newIndex !== state.activeProductIndex) {
      updateState({ activeProductIndex: newIndex });
      updateUrl(productCatalogRamps[newIndex].id);

      if (swiperInstances.thumbs) {
        swiperInstances.thumbs.slideTo(newIndex);
      }
    }
  }, [
    swiperInstances.main?.activeIndex,
    state.activeProductIndex,
    updateState,
    updateUrl,
    swiperInstances.thumbs,
  ]);

  // ─── Early returns ────────────────────────────────────────────────────────
  if (!currentProduct) {
    return <div className="text-center mt-10 p-4">Продукт не найден</div>;
  }

  if (loadingState.isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <div className="flex flex-col bg-center h-screen overflow-hidden
    bg-no-repeat bg-[url('https://res.cloudinary.com/dbx6muxub/image/upload/v1780563482/project-brightness-50_fbitrl.png')]  ">
        <div className="z-50 flex-shrink-0">
          <SocialButtons
            ref={socialButtonsRef}
            buttonLabel="shop"
            onButtonClick={() => navigate("/catalogue")}
            buttonAnimationProps={{ whileTap: { scale: 0.85, opacity: 0.6 } }}
          />
        </div>

        <div 
          ref={(el) => (refs.current.container = el)}
          className="w-full flex-grow mt-[70px] lg:mt-[50px] px-4 "
          style={{
            opacity:
              shouldShowLoading && !loadingState.isCompleted ? 0 : 1,
          }}
        >
          <div className="w-full hidden sm:block flex items-start mb-4" />

          <div className="w-full h-[50%] flex flex-col lg:flex-row relative">
         
<ProductInfo
  product={currentProduct}
  state={state}
  accordionState={accordionState}
  onAccordionToggle={handleAccordionToggle}
  refs={refs.current}
  animationState={animationState}
  imageData={imageData}
/>
       
{!animationState.complete && imageData && (
  <TransitionImage
    src={currentProduct.image}
    alt={currentProduct.name}
    imageRef={(el) => (refs.current.transitionImage = el)}
  />
)}
<ProductGallery
  products={productCatalogRamps}
  state={state}
  swiperInstances={swiperInstances}
  setSwiperInstances={setSwiperInstances}
  refs={refs.current}
  imageData={imageData}
  animationState={animationState}
  onSwiperInit={handleSwiperInit}
  onSlideChange={handleSlideChange}
  onThumbnailClick={handleThumbnailClick}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
  stopHoverAnimation={stopHoverAnimation}
  swiperConfig={SWIPER_CONFIG}
/>
  

          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
