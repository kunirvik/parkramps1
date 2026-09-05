// import Accordion from "../Accordion/Accordion";
// import ContactButton from "../ContactButtons/ContactButton";
// import ProductDrawing from "../ProductDrawing";
// import { useIsDesktop } from "../hooks/useIsDesktop";
// export default function ProductInfo({
//   products,
//   product,
//   state,
//   accordionState,
//   onAccordionToggle,
//   refs,
//   animationState,
//   imageData,
// }) {
//   const isDesktop = useIsDesktop();
//    const currentProduct = products[state.activeProductIndex];
//   return (
//     // <div className="flex lg:flex-col bg-rgb(35, 35, 35)  w-full">
//     <div className="flex lg:flex-col bg-rgb(35, 35, 35) w-full order-2 lg:order-1">

//       {/* DESKTOP */}
//       <div className="hidden lg:block  w-full">
//         <div
//           ref={(el) => (refs.info = el)}
//           className="w-full  flex flex-col"
//           style={{
//             opacity:
//               animationState.slideChanging ||
//               (!animationState.complete && imageData)
//                 ? 0
//                 : 1,
//             transform:
//               animationState.slideChanging ||
//               (!animationState.complete && imageData)
//                 ? "translateY(20px)"
//                 : "translateY(0)",
//             pointerEvents: animationState.slideChanging
//               ? "none"
//               : "auto",
//           }}
//         > 
//           <Accordion
//           isDesktop={isDesktop}
//           // key={`product-${state.activeProductIndex}`}
//             items={[
//               {
//                 title: product.name,
//                 content: product.description2,
//               }
//             ]}
//             controlled={true}
//             openIndex={accordionState.product}
//             onToggle={onAccordionToggle("product")}
//              forceCloseTrigger={state.activeProductIndex}
//           />
         
//         </div>

//         <div
//           className="w-full  bg-rgb(10,10,10)"
//           ref={(el) => (refs.purchaceAccordion = el)}
//           style={{ opacity: state.purchaseShown ? 1 : 0 }}
//         >
//           <Accordion
//           isDesktop={isDesktop}
//           // key={`purchase-${state.activeProductIndex}`}
//             items={[
//               {
//                 title: "замовити",
//                 content: (
//                   <>
//                     {product.description}
//                     <ContactButton />
//                   </>
//                 ),
//               },
//             ]}
//             controlled={true}
//             openIndex={accordionState.purchase}
//             onToggle={onAccordionToggle("purchase")}
//              forceCloseTrigger={state.activeProductIndex}
//           />
//         </div>

//         <div
//           className="w-full  bg-rgb(10,10,10)"
//           ref={(el) => (refs.productionAccordion = el)}
//           style={{ opacity: state.productionShown ? 1 : 0 }}
//         >
//           <Accordion
//           isDesktop={isDesktop}
//           // key={`virobi-${state.activeProductIndex}`}
//             items={[{ title: "вироби" }]}
//             controlled={true}
//             openIndex={accordionState.virobi}
//             onToggle={onAccordionToggle("virobi")}
//              forceCloseTrigger={state.activeProductIndex}
//           />
//         </div>
//       </div>

   
//       {/* MOBILE */}
// <div
//   className="block lg:hidden w-full"
//   style={{
//     opacity:
//       animationState.slideChanging ||
//       (!animationState.complete && imageData)
//         ? 0
//         : 1,
//     transform:
//       animationState.slideChanging ||
//       (!animationState.complete && imageData)
//         ? "translateY(20px)"
//         : "translateY(0)",
//     transition: "opacity 0.3s ease, transform 0.3s ease",
//     pointerEvents: animationState.slideChanging ? "none" : "auto",
//   }}
// >
//   <Accordion
//   isDesktop={isDesktop}
//     // key={state.activeProductIndex}
//     items={[
//       {
//         title: "замовити",
//         content: (
//           <>
//             {product.description}
//             <ContactButton />
//           </>
//         ),
//       },
//       {
//         title: product.name,
//         // content: (<><ProductDrawing product={currentProduct}/>, {product.description2}</> ),
//         content: product.description2,
//       },
//       { title: "вироби", content: null },
//     ]}
//     mobileMode={true}
//     controlled={true}
//     openIndex={
//       accordionState.purchase === 0
//         ? 0
//         : accordionState.product === 0
//         ? 1
//         : accordionState.virobi === 0
//         ? 2
//         : null
//     }
//     onToggle={(index) => {
//       if (index === 0) onAccordionToggle("purchase")(0);
//       else if (index === 1) onAccordionToggle("product")(0);
//       else if (index === 2) onAccordionToggle("virobi")(0);
//     }}
//      forceCloseTrigger={state.activeProductIndex}
//   />
// </div>
//     </div>
//   );
// }
import Accordion from "../Accordion/Accordion";
import ContactButton from "../ContactButtons/ContactButton";
import ProductDrawing from "../ProductDrawing";
import { useIsDesktop } from "../hooks/useIsDesktop";

// тот же трюк, что в FilmGallery — берём кадр на 0-й секунде видео с Cloudinary
function getSampleVideoThumbnail(videoUrl) {
  if (!videoUrl || !videoUrl.includes("/video/upload/")) return null;
  return videoUrl
    .replace("/video/upload/", "/video/upload/so_0/")
    .replace(/\.mp4$/, ".jpg");
}

// Сетка превью фото/видео изделий ("вироби") внутри мобильной вкладки аккордеона.
// Тап по конкретной плитке — открывает общую галерею сразу на этом фото,
// тап по кнопке ниже — открывает галерею с начала подборки этого товара.
function ProductWorksPreview({ product, onOpenAt, onOpenAll }) {
  const items = product?.sample || [];

  if (!items.length) {
    return (
      <div className="text-sm text-[#a0a0a0] py-4 text-center">
        Поки що немає фото виробів
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-1.5">
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onOpenAt(i)}
            className="relative aspect-square overflow-hidden rounded-md bg-neutral-800"
          >
            <img
              src={item.type === "video" ? getSampleVideoThumbnail(item.src) : item.src}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {item.type === "video" && (
              <span
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.25)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onOpenAll}
        className="w-full mt-3 py-2 rounded-md text-xs font-futura font-bold tracking-wide
                   text-[#a0a0a0] border border-white/15"
      >
        Переглянути в галереї
      </button>
    </div>
  );
}

export default function ProductInfo({
  products,
  product,
  state,
  accordionState,
  onAccordionToggle,
  onMobileTabSelect,
  openGallery,
  productType = "sets",
  refs,
  animationState,
  imageData,
}) {
  const isDesktop = useIsDesktop();
   const currentProduct = products[state.activeProductIndex];
  return (
    // <div className="flex lg:flex-col bg-rgb(35, 35, 35)  w-full">
    <div className="flex lg:flex-col bg-rgb(35, 35, 35) w-full order-2 lg:order-1">

      {/* DESKTOP */}
      <div className="hidden lg:block  w-full">
        <div
          ref={(el) => (refs.info = el)}
          className="w-full  flex flex-col"
          style={{
            opacity:
              animationState.slideChanging ||
              (!animationState.complete && imageData)
                ? 0
                : 1,
            transform:
              animationState.slideChanging ||
              (!animationState.complete && imageData)
                ? "translateY(20px)"
                : "translateY(0)",
            pointerEvents: animationState.slideChanging
              ? "none"
              : "auto",
          }}
        > 
          <Accordion
          isDesktop={isDesktop}
          // key={`product-${state.activeProductIndex}`}
            items={[
              {
                title: product.name,
                content: product.description2,
              }
            ]}
            controlled={true}
            openIndex={accordionState.product}
            onToggle={onAccordionToggle("product")}
             forceCloseTrigger={state.activeProductIndex}
          />
         
        </div>

        <div
          className="w-full  bg-rgb(10,10,10)"
          ref={(el) => (refs.purchaceAccordion = el)}
          style={{
            opacity:
              animationState.slideChanging ||
              (!animationState.complete && imageData) ||
              !state.purchaseShown
                ? 0
                : 1,
            transform:
              animationState.slideChanging ||
              (!animationState.complete && imageData)
                ? "translateY(20px)"
                : "translateY(0)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            pointerEvents: animationState.slideChanging ? "none" : "auto",
          }}
        >
          <Accordion
          isDesktop={isDesktop}
          // key={`purchase-${state.activeProductIndex}`}
            items={[
              {
                title: "замовити",
                content: (
                  <>
                    {product.description}
                    <ContactButton />
                  </>
                ),
              },
            ]}
            controlled={true}
            openIndex={accordionState.purchase}
            onToggle={onAccordionToggle("purchase")}
             forceCloseTrigger={state.activeProductIndex}
          />
        </div>

        <div
          className="w-full  bg-rgb(10,10,10)"
          ref={(el) => (refs.productionAccordion = el)}
          style={{
            opacity:
              animationState.slideChanging ||
              (!animationState.complete && imageData) ||
              !state.productionShown
                ? 0
                : 1,
            transform:
              animationState.slideChanging ||
              (!animationState.complete && imageData)
                ? "translateY(20px)"
                : "translateY(0)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            pointerEvents: animationState.slideChanging ? "none" : "auto",
          }}
        >
          <Accordion
          isDesktop={isDesktop}
          // key={`virobi-${state.activeProductIndex}`}
            items={[{ title: "вироби" }]}
            controlled={true}
            openIndex={accordionState.virobi}
            onToggle={onAccordionToggle("virobi")}
             forceCloseTrigger={state.activeProductIndex}
          />
        </div>
      </div>

   
      {/* MOBILE */}
<div
  className="block lg:hidden w-full"
  style={{
    opacity:
      animationState.slideChanging ||
      (!animationState.complete && imageData)
        ? 0
        : 1,
    transform:
      animationState.slideChanging ||
      (!animationState.complete && imageData)
        ? "translateY(20px)"
        : "translateY(0)",
    transition: "opacity 0.3s ease, transform 0.3s ease",
    pointerEvents: animationState.slideChanging ? "none" : "auto",
  }}
>
  <Accordion
  isDesktop={isDesktop}
    // key={state.activeProductIndex}
    items={[
      {
        title: "замовити",
        content: (
          <>
            {product.description}
            <ContactButton />
          </>
        ),
      },
      {
        title: product.name,
        // content: (<><ProductDrawing product={currentProduct}/>, {product.description2}</> ),
        content: product.description2,
      },
      {
        title: "вироби",
        content: (
          <ProductWorksPreview
            product={currentProduct}
            onOpenAt={(localIndex) =>
              openGallery?.(productType, state.activeProductIndex, localIndex)
            }
            onOpenAll={() =>
              openGallery?.(productType, state.activeProductIndex)
            }
          />
        ),
      },
    ]}
    mobileMode={true}
    controlled={true}
    openIndex={
      accordionState.purchase === 0
        ? 0
        : accordionState.product === 0
        ? 1
        : accordionState.virobi === 0
        ? 2
        : null
    }
    onToggle={onMobileTabSelect}
     forceCloseTrigger={state.activeProductIndex}
  />
</div>
    </div>
  );
}