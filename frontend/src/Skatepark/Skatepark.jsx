// import { useRef, useState } from "react";
// import gsap from "gsap";
// import "../Skatepark/Skatepark.css";


// const figures = [
//   {
//     id: "rail",
//     title: "Rail",
//     image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257520/volt_park_visual10_2_oo1az0.jpg",
//     area: {
//       left: "20%",
//       top: "45%",
//       width: "12%",
//       height: "8%",
//     },
//   },

//   {
//     id: "quarter",
//     title: "Quarter Pipe",
//     image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257520/volt_park_visual10_2_oo1az0.jpg",
//     area: {
//       left: "65%",
//       top: "20%",
//       width: "18%",
//       height: "35%",
//     },
//   },

//   {
//     id: "box",
//     title: "Fun Box",
//     image: "https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual9_2_jrzknr.jpg",
//     area: {
//       left: "40%",
//       top: "60%",
//       width: "15%",
//       height: "10%",
//     },
//   },

//   // добавь еще 7 фигур сюда
// ];


// export default function Skatepark() {

//   const layers = useRef({});
//   const tooltip = useRef(null);

//   const [active, setActive] = useState(null);


//   const showFigure = (id, title) => {

//     setActive(title);


//     Object.keys(layers.current).forEach((key)=>{

//       gsap.to(layers.current[key],{
//         opacity:key === id ? 1 : 0,
//         duration:.45,
//         ease:"power3.out"
//       });

//     });


//     gsap.fromTo(
//       tooltip.current,
//       {
//         opacity:0,
//         y:10,
//         scale:.9
//       },
//       {
//         opacity:1,
//         y:0,
//         scale:1,
//         duration:.3
//       }
//     );

//   };


//   const hideFigure = ()=>{

//     setActive(null);


//     Object.values(layers.current).forEach(layer=>{

//       gsap.to(layer,{
//         opacity:0,
//         duration:.45,
//         ease:"power3.out"
//       });

//     });


//     gsap.to(
//       tooltip.current,
//       {
//         opacity:0,
//         y:10,
//         duration:.25
//       }
//     );

//   };


//   const moveTooltip = (e)=>{

//     if(!tooltip.current) return;


//     gsap.to(tooltip.current,{
//       x:e.clientX + 15,
//       y:e.clientY + 15,
//       duration:.15
//     });

//   };



// return (

// <div
// className="skatepark"
// onMouseMove={moveTooltip}
// >


// {/* основа */}

// <img
// className="park-image"
// src="https://res.cloudinary.com/dbx6muxub/image/upload/v1785257521/voltparkvisual2_k4c3fr.jpg"
// alt=""
// />



// {/* цветные слои */}

// {
// figures.map(item=>(

// <img

// key={item.id}

// ref={(el)=>
// layers.current[item.id]=el
// }

// className="park-layer"

// src={item.image}

// alt=""

// />

// ))
// }




// {/* зоны */}

// {
// figures.map(item=>(

// <div

// key={item.id}

// className="hotspot"

// style={item.area}

// onMouseEnter={()=>
// showFigure(item.id,item.title)
// }

// onMouseLeave={hideFigure}

// />

// ))
// }



// {/* подсказка */}

// <div
// ref={tooltip}
// className="skate-tooltip"
// >

// {active}

// </div>



// </div>

// );

// }

import { useRef, useState } from "react";
import gsap from "gsap";
import "../Skatepark/Skatepark.css";


const figures = [

  {
    id:"rail",
    title:"Rail",

    image:"https://res.cloudinary.com/dbx6muxub/image/upload/v1785257520/volt_park_visual10_2_oo1az0.jpg",

    area:{
      left:"20%",
      top:"45%",
      width:"12%",
      height:"8%"
    }
  },


  {
    id:"quarter",
    title:"Quarter Pipe",

    image:"https://res.cloudinary.com/dbx6muxub/image/upload/v1785257520/volt_park_visual10_2_oo1az0.jpg",

    area:{
      left:"65%",
      top:"20%",
      width:"18%",
      height:"35%"
    }
  },


  {
    id:"box",
    title:"Fun Box",

    image:"https://res.cloudinary.com/dbx6muxub/image/upload/v1785257519/volt_park_visual9_2_jrzknr.jpg",

    area:{
      left:"40%",
      top:"60%",
      width:"15%",
      height:"10%"
    }
  },


  // добавляешь остальные фигуры сюда

];



export default function Skatepark(){

const layers = useRef({});
const tooltip = useRef(null);

const [active,setActive]=useState(null);



const showFigure=(id,title)=>{


setActive(title);


Object.keys(layers.current).forEach(key=>{

gsap.to(
layers.current[key],
{
opacity:key===id?1:0,
duration:.4,
ease:"power3.out"
}
)

});


gsap.fromTo(
tooltip.current,

{
opacity:0,
scale:.8,
y:10
},

{
opacity:1,
scale:1,
y:0,
duration:.3
}

);


}



const hideFigure=()=>{


setActive(null);


Object.values(layers.current).forEach(layer=>{

gsap.to(
layer,
{
opacity:0,
duration:.4
}
)

});


gsap.to(
tooltip.current,
{
opacity:0,
y:10,
duration:.2
}
)


}




const moveTooltip=(e)=>{


if(!tooltip.current)return;


gsap.to(
tooltip.current,
{
x:e.clientX+15,
y:e.clientY+15,
duration:.1
}
)


}




return (

<div
className="skatepark"
onMouseMove={moveTooltip}
>


{/* базовая карта */}

<img

className="park-image"

src="https://res.cloudinary.com/dbx6muxub/image/upload/v1785257521/voltparkvisual2_k4c3fr.jpg"

alt="skatepark"

/>



{/* слои подсветки */}

{

figures.map(item=>(

<img

key={item.id}

ref={el=>layers.current[item.id]=el}

className="park-layer"

src={item.image}

alt=""

/>

))

}




{/* интерактивные зоны */}

{

figures.map(item=>(

<div

key={item.id}

className="hotspot"

style={item.area}

onMouseEnter={()=>showFigure(item.id,item.title)}

onMouseLeave={hideFigure}

/>

))

}




<div

ref={tooltip}

className="skate-tooltip"

>

{active}

</div>



</div>

)


}