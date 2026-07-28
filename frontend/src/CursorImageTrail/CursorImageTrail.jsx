"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";


const images = [
  "/1.png",
  "/2.png",
  "/3.png",
  "/4.png",
  "/5.png",
];


export default function CursorImageTrail() {

  const container = useRef(null);

  const lastPosition = useRef({
    x: 0,
    y: 0,
  });

  const counter = useRef(0);



  useEffect(() => {

    const wrapper = container.current;

    if (!wrapper) return;



    const createImage = (x, y) => {

      const img = document.createElement("img");


      img.src =
        images[
          Math.floor(
            Math.random() * images.length
          )
        ];


      const size =
        120 + Math.random() * 80;


      const rotation =
        Math.random() * 50 - 25;



      Object.assign(img.style, {
        position: "absolute",
        width: `${size}px`,
        pointerEvents: "none",
        borderRadius: "16px",
        left: `${x}px`,
        top: `${y}px`,
        zIndex: 999,
        transformOrigin: "center",
      });



      wrapper.appendChild(img);



      // появление

      gsap.fromTo(
        img,
        {
          opacity: 0,
          scale: 0.4,
          rotate: rotation,
          xPercent: -50,
          yPercent: -50,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        }
      );



      // падение вниз

      gsap.to(
        img,
        {
          y:
            window.innerHeight + 300,


          x:
            (Math.random() - 0.5) * 300,


          rotate:
            rotation +
            (Math.random() * 80 - 40),


          opacity: 0,


          scale:
            0.8 +
            Math.random() * 0.4,


          duration:
            2.5 +
            Math.random(),


          ease: "power3.in",


          onComplete: () => {
            img.remove();
          },
        }
      );

    };





    const handleMouseMove = (e) => {


      const dx =
        e.clientX -
        lastPosition.current.x;


      const dy =
        e.clientY -
        lastPosition.current.y;



      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        );



      // расстояние между появлениями

      if (distance < 50) return;



      lastPosition.current = {
        x: e.clientX,
        y: e.clientY,
      };



      createImage(
        e.clientX,
        e.clientY
      );



      counter.current++;



      // ограничение количества картинок

      if (counter.current > 40) {

        if (wrapper.children[0]) {
          wrapper.children[0].remove();
        }

        counter.current = 20;
      }

    };





    window.addEventListener(
      "mousemove",
      handleMouseMove
    );



    return () => {

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

    };


  }, []);




  return (
    <div
      ref={container}
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}