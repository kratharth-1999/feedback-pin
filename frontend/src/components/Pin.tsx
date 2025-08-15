import React, { useState, useEffect } from "react";
import type { PinProps } from "../types";

/*
 * Component that renders a visual pin marker at a specific position
 * Handles position adjustments when the page scrolls to maintain pin position
 */
const Pin = React.memo(({ pin, onClick }: PinProps) => {
    const [scrollPosition, setScrollPosition] = useState({
        scrollX: window.scrollX,
        scrollY: window.scrollY,
    });

    /* Update scroll position when scrolling or resizing */
    useEffect(() => {
        const handleScrollOrResize = () => {
            setScrollPosition({
                scrollX: window.scrollX,
                scrollY: window.scrollY,
            });
        };

        window.addEventListener("scroll", handleScrollOrResize);
        window.addEventListener("resize", handleScrollOrResize);

        /* Initial call to set correct values */
        handleScrollOrResize();

        return () => {
            window.removeEventListener("scroll", handleScrollOrResize);
            window.removeEventListener("resize", handleScrollOrResize);
        };
    }, []);

    /* Adjust pin position based on scroll */
    const adjustedX = pin.x - scrollPosition.scrollX;
    const adjustedY = pin.y - scrollPosition.scrollY;

    return (
        <div
            className="pin"
            style={{ left: `${adjustedX}px`, top: `${adjustedY}px` }}
            onClick={() => onClick(pin)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick(pin);
                }
            }}
        />
    );
});

Pin.displayName = 'Pin';

export default Pin;
