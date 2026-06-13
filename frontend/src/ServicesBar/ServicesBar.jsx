

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

export default function ServicesBar({ page }) {
  const category = page?.split("/")[2];

  const singleLabels = {
    skateparks: "скейтпарки",
    ramps: "рампи",
    sets: "фігури",
  };

  if (singleLabels[category]) {
    return <SingleLabel text={singleLabels[category]} />;
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