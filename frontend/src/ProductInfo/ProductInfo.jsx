import Accordion from "../Accordion/Accordion";
import ContactButton from "../ContactButtons/ContactButton";

export default function ProductInfo({
  product,
  state,
  accordionState,
  onAccordionToggle,
  refs,
  animationState,
  imageData,
}) {
  return (
    <div className="flex lg:flex-col bg-rgb(35, 35, 35)  w-full">
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
            items={[
              {
                title: product.name,
                content: product.description2,
              },
            ]}
            controlled={true}
            openIndex={accordionState.product}
            onToggle={onAccordionToggle("product")}
          />
        </div>

        <div
          className="w-full  bg-rgb(10,10,10)"
          ref={(el) => (refs.purchaceAccordion = el)}
          style={{ opacity: state.purchaseShown ? 1 : 0 }}
        >
          <Accordion
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
          />
        </div>

        <div
          className="w-full  bg-rgb(10,10,10)"
          ref={(el) => (refs.productionAccordion = el)}
          style={{ opacity: state.productionShown ? 1 : 0 }}
        >
          <Accordion
            items={[{ title: "вироби" }]}
            controlled={true}
            openIndex={accordionState.virobi}
            onToggle={onAccordionToggle("virobi")}
          />
        </div>
      </div>

      {/* MOBILE */}
      <div className="block lg:hidden w-full">
        <Accordion
          key={state.activeProductIndex}
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
              content: product.description2,
            },
            { title: "вироби", content: null },
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
          onToggle={(index) => {
            if (index === 0) onAccordionToggle("purchase")(0);
            else if (index === 1) onAccordionToggle("product")(0);
            else if (index === 2) onAccordionToggle("virobi")(0);
          }}
        />
      </div>
    </div>
  );
}