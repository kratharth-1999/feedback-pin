import React, { useState, useCallback } from "react";
import Overlay from "./Overlay";
import { usePinsContext } from "../context/PinsContext";
import type { FeedbackPinAppProps } from "../types";

/* 
 * Main component for the Feedback Pin application
 * Provides controls for feedback functionality and pin visibility
 */
const FeedbackPinApp: React.FC<FeedbackPinAppProps> = ({ 
  initialActive = false,
  initialShowPins = true
}) => {
  const { removePin, pins } = usePinsContext();
  const [isActive, setIsActive] = useState(initialActive);
  const [showPins, setShowPins] = useState(initialShowPins);

  /* Toggle feedback mode (ability to add new pins) */
  const toggleActive = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  /* Toggle pin visibility */
  const togglePinsVisibility = useCallback(() => {
    setShowPins(prev => !prev);
  }, []);

  /* Remove all pins from the current path with confirmation */
  const removeAllPins = useCallback(() => {
    const currentPath = window.location.href;
    const pathPins = pins.filter(pin => pin.path === currentPath);
    
    if (pathPins.length > 0) {
      const confirmMessage = `Are you sure you want to remove all ${pathPins.length} pins from this page?`;
      if (window.confirm(confirmMessage)) {
        pathPins.forEach(pin => removePin(pin.id));
      }
    } else {
      alert("No pins to remove on this page.");
    }
  }, [pins, removePin]);

  return (
    <div className="feedback-pin-app">
      <div className="feedback-controls">
        <button 
          className={`feedback-control-btn ${isActive ? 'active' : ''}`}
          onClick={toggleActive}
          title={isActive ? "Disable Feedback Mode" : "Enable Feedback Mode"}
        >
          {isActive ? "Disable Feedback" : "Enable Feedback"}
        </button>
        
        <button 
          className={`feedback-control-btn ${showPins ? 'active' : ''}`}
          onClick={togglePinsVisibility}
          title={showPins ? "Hide Pins" : "Show Pins"}
        >
          {showPins ? "Hide Pins" : "Show Pins"}
        </button>
        
        <button 
          className="feedback-control-btn danger"
          onClick={removeAllPins}
          title="Remove All Pins"
        >
          Remove All Pins
        </button>
      </div>
      
      <Overlay isActive={isActive} showPins={showPins} />
    </div>
  );
};

export default React.memo(FeedbackPinApp);
