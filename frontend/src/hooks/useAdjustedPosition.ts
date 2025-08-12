import { useState, useEffect } from "react";
import type { RefObject } from "react";
import type { Position } from "../types";

/* 
 * Custom hook to adjust position to ensure the element stays within viewport
 * @param position Initial position
 * @param elementRef Reference to the element to position
 * @returns Adjusted position that keeps the element within viewport
 */
export function useAdjustedPosition(
  position: Position,
  elementRef: RefObject<HTMLElement | null>
) {
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  
  /* 
   * Run the adjustment logic when the position changes, when the component mounts,
   * and when the window resizes
   */
  useEffect(() => {
    const updatePosition = () => {
      if (!elementRef.current) return;
      
      /* Get the element's dimensions */
      const rect = elementRef.current.getBoundingClientRect();
      const elementWidth = rect.width;
      const elementHeight = rect.height;
      
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const PADDING = 10; /* Padding from viewport edges */
      
      /* 
       * Calculate the best position for the element
       * Start with the click position
       */
      let x = position.x;
      let y = position.y;
      
      /* Ensure the element is fully visible horizontally */
      if (x + elementWidth > viewportWidth - PADDING) {
        x = viewportWidth - elementWidth - PADDING;
      }
      
      if (x < PADDING) {
        x = PADDING;
      }
      
      /* Ensure the element is fully visible vertically */
      if (y + elementHeight > viewportHeight - PADDING) {
        y = viewportHeight - elementHeight - PADDING;
      }
      
      if (y < PADDING) {
        y = PADDING;
      }
    
      setAdjustedPosition({ x, y });
    };

    /* Initial position adjustment with a small delay to ensure the element is rendered */
    const timeoutId = setTimeout(updatePosition, 100); // Increased timeout for better rendering
    
    /* Re-adjust on window resize */
    window.addEventListener("resize", updatePosition);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updatePosition);
    };
  }, [position]);

  return adjustedPosition;
}
