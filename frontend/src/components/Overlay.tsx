import React, { useState, useCallback, useEffect } from "react";
import Pin from "./Pin";
import FeedbackForm from "./FeedbackForm";
import PinDetailsPopup from "./PinDetailsPopup";
import type { PinType, OverlayProps, Position } from "../types";
import { usePinsContext } from "../context/PinsContext";

/*
 * Component that overlays the entire page to capture clicks and display pins
 * Manages the interaction between pins, feedback forms, and pin details
 */
const Overlay: React.FC<OverlayProps> = ({ isActive, showPins }) => {
    const { pins, addPin, removePin, updatePin, emailId } = usePinsContext();
    const [clickPosition, setClickPosition] = useState<Position | null>(null);
    const [selectedPin, setSelectedPin] = useState<PinType | null>(null);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [showPinDetails, setShowPinDetails] = useState(false);

    const handleOverlayClick = useCallback(
        (e: React.MouseEvent) => {
            if (!isActive) return;

            /* Only handle direct clicks on the overlay, not on pins or popups */
            if ((e.target as HTMLElement).className === "overlay") {
                setClickPosition({ x: e.clientX, y: e.clientY });
                setShowFeedbackForm(true);
            }
        },
        [isActive]
    );

    const handlePinClick = useCallback((pin: PinType) => {
        setSelectedPin(pin);
        setShowPinDetails(true);
    }, []);

    const handleFeedbackSubmit = useCallback(
        (feedback: string) => {
            if (clickPosition) {
                /*
                 * Store pin position relative to the document, not the viewport
                 * by subtracting the current scroll position.
                 * The user could be in a scrolled position while setting a pin and
                 * then proceed to maximize/minimize the window
                 */
                const newPin: PinType = {
                    id: Date.now().toString(),
                    x: clickPosition.x - window.scrollX,
                    y: clickPosition.y - window.scrollY,
                    path: window.location.href,
                    feedback,
                    createdAt: Date.now(),
                    emailId,
                };

                addPin(newPin);
                setShowFeedbackForm(false);
                setClickPosition(null);
            }
        },
        [clickPosition, addPin, emailId]
    );

    const handleFeedbackCancel = useCallback(() => {
        setShowFeedbackForm(false);
        setClickPosition(null);
    }, []);

    const handlePinRemove = useCallback(() => {
        if (selectedPin) {
            /*Show confirmation dialog before removing the pin*/
            if (window.confirm("Are you sure you want to remove this pin?")) {
                removePin(selectedPin.id);
                setShowPinDetails(false);
                setSelectedPin(null);
            }
        }
    }, [selectedPin, removePin]);

    const handlePinUpdate = useCallback(
        (updatedPin: PinType) => {
            updatePin(updatedPin);
            setSelectedPin(updatedPin);
        },
        [updatePin]
    );

    const handlePinDetailsClose = useCallback(() => {
        setShowPinDetails(false);
        setSelectedPin(null);
    }, []);

    /* Close popups when clicking outside */
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                !target.closest(".feedback-form") &&
                !target.closest(".pin-details") &&
                !target.closest(".pin")
            ) {
                setShowFeedbackForm(false);
                setShowPinDetails(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="overlay" onClick={handleOverlayClick}>
            {showPins &&
                pins
                    .filter((pin) => pin.path === window.location.href)
                    .map((pin) => (
                        <Pin key={pin.id} pin={pin} onClick={handlePinClick} />
                    ))}

            {/* Show blue indicator button at the exact click position */}
            {showFeedbackForm && clickPosition && (
                <div
                    className="potential-pin"
                    style={{
                        position: "fixed", // Use fixed positioning for the indicator
                        left: `${clickPosition.x}px`,
                        top: `${clickPosition.y}px`,
                    }}
                />
            )}

            {showFeedbackForm && clickPosition && (
                <FeedbackForm
                    position={clickPosition}
                    onSubmit={handleFeedbackSubmit}
                    onCancel={handleFeedbackCancel}
                />
            )}

            {showPinDetails && selectedPin && (
                <PinDetailsPopup
                    pin={selectedPin}
                    onClose={handlePinDetailsClose}
                    onRemove={handlePinRemove}
                    onUpdate={handlePinUpdate}
                />
            )}
        </div>
    );
};

export default React.memo(Overlay);
