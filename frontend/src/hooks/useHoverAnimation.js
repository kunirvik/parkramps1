import { useCallback, useRef } from "react";

export function useHoverAnimation(isTouchDevice, setState) {
  const hoverIntervalRef = useRef(null);

  const getIntervalDuration = useCallback((totalImages) => {
    if (totalImages <= 1) return null;

    const minImages = 3;
    const maxImages = 15;
    const minInterval = 200;
    const maxInterval = 1500;

    if (totalImages <= minImages) return maxInterval;
    if (totalImages >= maxImages) return minInterval;

    const ratio = (totalImages - minImages) / (maxImages - minImages);
    return maxInterval - ratio * (maxInterval - minInterval);
  }, []);

  const stopHoverAnimation = useCallback(() => {
    clearInterval(hoverIntervalRef.current);
    hoverIntervalRef.current = null;
  }, []);

  const startHoverAnimation = useCallback(
    (index, product) => {
      if (isTouchDevice) return;

      stopHoverAnimation();

      const totalImages = 1 + (product?.altImages?.length || 0);
      if (totalImages <= 1) return;

      const intervalDuration = getIntervalDuration(totalImages);

      hoverIntervalRef.current = setInterval(() => {
        setState((prev) => {
          const newIndices = [...prev.selectedImageIndices];
          const cur = newIndices[index] ?? 0;
          newIndices[index] = (cur + 1) % totalImages;

          return {
            ...prev,
            selectedImageIndices: newIndices,
          };
        });
      }, intervalDuration);
    },
    [getIntervalDuration, isTouchDevice, setState, stopHoverAnimation]
  );

  const handleMouseEnter = useCallback(
    (index, product, canAnimate = true) => {
      if (isTouchDevice || !canAnimate) return;

      setState((prev) => ({
        ...prev,
        hoveredIndex: index,
      }));

      startHoverAnimation(index, product);
    },
    [isTouchDevice, setState, startHoverAnimation]
  );

  const handleMouseLeave = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hoveredIndex: null,
    }));
    stopHoverAnimation();
  }, [setState, stopHoverAnimation]);

  return {
    handleMouseEnter,
    handleMouseLeave,
    startHoverAnimation,
    stopHoverAnimation,
    getIntervalDuration,
    hoverIntervalRef,
  };
}