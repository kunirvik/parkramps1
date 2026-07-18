import { motion, AnimatePresence } from "framer-motion"; 

const services = [

  {
    label: "#розробка та виробництво скейтпаркiв",
    comment: "// від матеріалу до готової фігури",
    meta: [
      { key: "матеріал", value: "фанера / метал" },
      { key: "строк", value: "погоджується окремо" },
    ],
  },
  {
    label: "#під ключ",
    comment: "// повний цикл",
    active: true,
    meta: [
      { key: "вхід", value: "запит або референс" },
      { key: "вихід", value: "готовий скейтпарк" },
    ],
  },
  {
    label: "#івенти",
    comment: "// оренда конструкцій",
    meta: [
      { key: "формат", value: "демо / контест / фест" },
      { key: "монтаж", value: "включено" },
    ],
  },
  {
    label: "#diy",
    comment: "// збери сам",
    meta: [
      { key: "комплект", value: "розмічений матеріал" },
      { key: "складність", value: "просто за кресленням" },
    ],
  },
];

const SingleLabel = ({ text }) => (
  <div className="w-full bg-black border-b border-[#1a1a1a] px-6 py-2 flex items-center font-futura font-light z-50">
    <span className="w-2 h-2 rounded-full bg-[#2a2a2a] mr-3 flex-shrink-0" />

    <span className="text-[17px] tracking-wide px-3 py-1 text-[#555]">
      {text}
    </span>
  </div>
);
const AnimatedLabel = ({ text }) => (
  <div className="w-full bg-black border-b border-[#1a1a1a] px-6 py-2 flex items-center font-futura font-light z-50 overflow-hidden">
    <span className="w-2 h-2 rounded-full bg-[#2a2a2a] mr-3 flex-shrink-0" />
    <div className="relative h-6 flex-1 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 top-1 text-[17px] tracking-wide text-[#555] whitespace-nowrap"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </div>
  </div>
); 
export default function ServicesBar({ page }) {
  const category = page?.split("/")[2];
const categoryOther = page?.split("/")[1];
const otherSingleLabels = {
 
    // gallery: "галерея",
    blog: "блог",
  }; 

  
  const singleLabels = {
    skateparks: "скейтпарки",
    ramps: "рампи",
    sets: "фігури",
  
  };


  if (section === "gallery") {
    return <AnimatedLabel text={category || "галерея"} />;
  }
  // if (singleLabels[category] || otherSingleLabels[categoryOther]) {
  //   return <SingleLabel text={singleLabels[category] || otherSingleLabels[categoryOther]} />;
  // }
  if (singleLabels[productCategory] || otherSingleLabels[section]) {
    return <SingleLabel text={singleLabels[productCategory] || otherSingleLabels[section]} />;
  } 

  return (
    <div className="w-full bg-black border-b border-[#1a1a1a]  text-[#555] px-6 py-2 flex items-center font-futura font-light z-50">
      {/* <span className="w-2 h-2 rounded-full bg-[#2a2a2a]  text-[#555] mr-3 flex-shrink-0" /> */}

      {services.map((service, index) => (
        <div key={service.label} className="flex items-center">
          <div className="relative group">
        
              
         
<span
              className="text-[17px] tracking-wide px-3 py-1 text-[#555]"
           >
  {service.label}
</span>

           
          </div>

        
        </div>
      ))}
    </div>
  );
} 