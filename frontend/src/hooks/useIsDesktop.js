// import { useState, useEffect } from "react";

// export function useIsDesktop(breakpoint = 1024) {
//   const [isDesktop, setIsDesktop] = useState(
//     typeof window !== "undefined" ? window.innerWidth >= breakpoint : true
//   );

//   useEffect(() => {
//     const handleResize = () => setIsDesktop(window.innerWidth >= breakpoint);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [breakpoint]);

//   return isDesktop;
// }

// hooks/useIsDesktop.js
import { useState, useEffect } from "react";

export function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= breakpoint
  );

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const handler = (e) => setIsDesktop(e.matches);
    setIsDesktop(mql.matches); // синхронизация сразу при маунте
    mql.addEventListener ? mql.addEventListener("change", handler) : mql.addListener(handler);
    return () => {
      mql.removeEventListener ? mql.removeEventListener("change", handler) : mql.removeListener(handler);
    };
  }, [breakpoint]);

  return isDesktop;
}