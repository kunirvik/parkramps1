
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen/LodingScreen";
import SocialButtons from "../SocialButtons/SocialButtons";
import { gsap } from "gsap";
import Footer from "../Footer/Footer";
const products = [
 
   {
    id: 3,
    // name: "фигуры и комплекты фигур которые вы сможете собрать своими руками, материал полностью размечен и подготовлен, так что вы сможете собрать фигуру без проблем по заранее подготовленному чертежу и обкатать её уже в считаные часы",
    category: "sets",
       name: "фiгури",
    image: "/images/sets/box360/160yolobox1.png",
    hoverImage: ["/images/skateparks/park3.png", "/images/skateparks/park2.png"],
    description: "A bold design statement."
  },


  {
    id: 2,
      category: "ramps",  
      image: "/images/ramps/minir180h60w200d40alt.png",
    name: "рампи",
    hoverImage:  ["/images/skateparks/park3.png", "/images/skateparks/park2.png"],
    description: "An iconic pop-art sofa."
  }, 
  
   {
    id: 1,
     category: "skateparks",
    name: "скейтпарки",
    image:"/images/skateparks/spot/spot1.png",
    hoverImage:  ["/images/skateparks/spot/spot1.webp", "/images/skateparks/park2.png"],
    description: "An iconic pop-art sofa."
  },  



];
const STATUS_META = [
  { key: "вхід", value: "запит або референс" },
  { key: "вихід", value: "готовий скейтпарк" },
];
const STATUS_COMMENT = "// повний цикл"; 



export default function Catalogue() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, productId: null });
  const productsRef = useRef(new Map());
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const tooltipRef = useRef(null);
  const [tooltipLocked, setTooltipLocked] = useState(false);



const [isMobile, setIsMobile] = useState(
  typeof window !== "undefined" && window.innerWidth <= 768
);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);



  const handleExit = () => {
    console.log("handleExit вызван!");
    setIsFadingOut(true);
    setTimeout(() => {
      navigate("/photopage");
    }, 500);
  };

// В Catalogue.jsx, перед навигацией
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;

  });
};


const handleMouseMove = (e, productId) => {
    if (tooltipLocked) return; 
  const tooltipWidth = 300
  const tooltipHeight = tooltipRef.current?.offsetHeight || 0;
  const padding = 20;
  

  let x = e.clientX + padding;
  let y = e.clientY;

  // Проверка выхода за правый край
  if (x + tooltipWidth > window.innerWidth) {
    x = e.clientX - tooltipWidth - padding;
  }

  // Проверка выхода за нижний край
  if (y + tooltipHeight > window.innerHeight) {
    y = window.innerHeight - tooltipHeight - padding;
  }

  setTooltip({
    show: true,
    x,
    y,
    productId
  });
};


  const handleMouseLeave = () => {
    if (tooltipLocked) return;
    setTooltip({ ...tooltip, show: false });
  };

const handleClick = async (product, e) => {
   setTooltipLocked(true);
  if (isMobile) {

  e.currentTarget.classList.add("hide-tooltip");
}
  
setTooltip({ show: false, x: 0, y: 0, productId: null });


  const imgElement = e.currentTarget.querySelector('img');
  const imgRect = imgElement.getBoundingClientRect();

  const imageData = {
    id: product.id,
    src: product.image,
    rect: {
      top: imgRect.top,
      left: imgRect.left,
      width: imgRect.width,
      height: imgRect.height,
    },
  };

  try {
    await preloadImage(product.image);
  } catch (error) {
    console.warn("Не удалось предзагрузить изображение:", error);
  }

  setSelectedProduct(product.id);

  setTimeout(() => {
    switch (product.category) {
      case "sets":
        navigate(`/product/sets/1`, { state: { imageData } });
        break;
      case "ramps":
        navigate(`/product/ramps/1`, { state: { imageData } });
        break;
      case "skateparks":
        navigate(`/product/skateparks/1`, { state: { imageData } });
        break;
      // case "diy":
      //   navigate(`/projectpage`, { state: { imageData } });
      //   break;
      // default:
      //   console.warn("Неизвестная категория:", product.category);
    }
  }, 400);
};



useEffect(() => {
  if (tooltip.show && tooltipRef.current) {
    gsap.fromTo(
      tooltipRef.current,
      {
        opacity: 0,
        scaleX: 0.7,
        scaleY: 0.5,
        transformOrigin: "top left",
      },
      {
        opacity: 0.95,
        scaleX: 1,
        scaleY: 1,
        duration: 1, // медленнее
        ease: "power3.out",
      }
    );
  }
}, [tooltip.show]);



  useEffect(() => {
    // Запускаем анимацию исчезновения перед снятием лоадинга
    const timer = setTimeout(() => setIsFadingOut(true), 1500);
    const removeLoadingScreen = setTimeout(() => setIsLoading(false), 2300);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(removeLoadingScreen);
    };
  }, []); 

return (
  <>  {isLoading && <LoadingScreen isFadingOut={isFadingOut} />}
  <div className="absolute inset-0 bg-[rgba(0, 0, 0, 0.55)] bg-[url('https://res.cloudinary.com/dbx6muxub/image/upload/v1780427037/project_nkkaef.png')]"></div>
  
   <style>{`
        .status-bar {
         font-family: 'FuturaPT';
        font-weight: light;
         font-style: normal;
          font-size: 17px;
          letter-spacing: 0.04em;
          color: #333;
          border-top: 1px solid #161616;
          padding: 6px 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          background: #000;
          user-select: none;
        }
        .status-bar__comment { color: #3a6b3a; }
        .status-bar__key { color: #555; }
        .status-bar__arrow { color: #2a2a2a; margin: 0 4px; }
        .status-bar__value { color: #777; }
        .status-bar__dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #3a6b3a;
          flex-shrink: 0;
        }
        .status-bar__sep { color: #222; margin: 0 8px; }
      `}</style>

    <div className="bg-black flex flex-col min-h-screen relative">

      {/* SocialButtons всегда вверху */}
      <div className="z-50  flex-shrink-0">
        <SocialButtons
          buttonLabel="gallery"
          onButtonClick={handleExit}
          buttonAnimationProps={{ whileTap: { scale: 0.85, opacity: 0.6 } }}
        />
       
      </div>
 
 <div className="overflow-hidden flex-col items-center justify-center  "   style={{
  marginTop: "clamp(60px, 3vw, 60px)"}}>  
  <div className="grid grid-cols-1 md:grid-cols-2   bg-[rgba(0, 0, 0, 0.77)]   bg-cover
    bg-center
    bg-no-repeat bg-[url('https://res.cloudinary.com/dbx6muxub/image/upload/v1780563482/project-brightness-50_fbitrl.png')] w-full h-full  "
        style={{
    maxHeight: "100%",
    overflow: "auto",
    // paddingTop: "clamp(50px, 3vw, 50px)", // отступ сверху
   
    gap: "clamp(10px, 3vw, 20px)", // min 10px, растет до 40px с экраном
    // padding: "clamp(20px, 1vw, 20px)", // тоже динамически для отступов
  }}>
   


    {products.map((product, index) => ( 
    //   <div className="relative bg-black p-2">
    // <div className="absolute inset-2 border-2 border-dashed border-white pointer-events-none"></div>
     <div
    key={product.id}
    ref={(el) => el && productsRef.current.set(product.id, el)}
    className={`
      cursor-pointer flex justify-center items-center p-2 sm:p-4
      relative overflow-hidden transition-all duration-400 ease-in-out
   ${products.length === 3 && index === 2
        ? "md:col-span-2 md:justify-self-center"
        : ""}       

      ${selectedProduct !== null
        ? selectedProduct === product.id
          ? "scale-100"
          : "scale-0 pointer-events-none"
        : "scale-100"}
    `}
    style={{
      height: isMobile
        ? "clamp(10px, 25vh, 2000px)"
        : "clamp(200px, 40vh, 6000px)"
    }}
  >    {/* dashed frame */} {/* INNER CLEAN AREA */}
 
        <div onClick={(e) => handleClick(product, e)} 
        className={`flex flex-col items-center w-full h-full relative   ${index === 2 ? "md:scale-180" : ""}  ${index === 1 ? "md:scale-90" : ""}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transition-all duration-300"
            onMouseMove={!isMobile ? (e) => handleMouseMove(e, product.id) : undefined}
            onMouseLeave={!isMobile ? handleMouseLeave : undefined} 
          /></div>
   {/* mobileTooltipProductId === product.id &&      */}
      {isMobile && (
            <div className="mobile-tooltip absolute left-1/2 -translate-x-1/2 
               text-white text-base sm:text-lg font-futura bg-black font-bold
              px-2 py-2  animate-fadeIn 
               z-20">
              {product.name}
            </div>
          )}
        </div>
      // </div>
    ))}
  </div>

       {/* Статус-строка "під ключ" */}
         <div className="status-bar">
           <span className="status-bar__dot" />
        <span className="status-bar__comment">{STATUS_COMMENT}</span>
          {STATUS_META.map((m, i) => (
            <span key={m.key} className="flex items-center">
              {i > 0 && <span className="status-bar__sep">·</span>}
              <span className="status-bar__key">{m.key}</span>
              <span className="status-bar__arrow">→</span>
              <span className="status-bar__value">{m.value}</span>
            </span>
          ))}
        </div>
 </div>


<Footer></Footer>
      
    </div> 

    {/* Tooltip */}
    {tooltip.show && (
      <div
        ref={tooltipRef}
        style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        className="absolute border-b border-[#1a1a1a] transform -translate-y-1/2 font-futura z-10 
                   bg-black text-[#919191] px-4 sm:px-6 py-2 shadow-lg pointer-events-none 
                   text-sm sm:text-base max-w-[300px] sm:max-w-[400px] 
                   whitespace-normal break-words"

      >
        {/* <h2 className="font-futura font-medium" style={{ fontSize: "clamp(25px, 5vw, 25px)" }}>
          {products.find(p => p.id === tooltip.productId)?.category}
        </h2> */}
         <h2 className="font-futura font-medium" style={{ fontSize: "clamp(30px, 2vw, 25px)" }}>
        {products.find(p => p.id === tooltip.productId)?.name}</h2>
      </div>
    )}


   
  </>
);
} 

