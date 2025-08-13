import React, { useState, useCallback } from "react";
import Overlay from "./Overlay";
import LoadingOverlay from "./LoadingOverlay";
import { PinsProvider } from "../context/PinsContext";
import { usePinsContext } from "../context/PinsContext";
import type { FeedbackPinAppProps } from "../types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* 
 * Inner component that uses the PinsContext
 */
const FeedbackPinContent: React.FC<{
  initialActive: boolean;
  initialShowPins: boolean;
}> = ({ initialActive, initialShowPins }) => {
  const {pins, removeAllPinsByPath, isLoading } = usePinsContext();
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
        removeAllPinsByPath(currentPath);
      }
    } else {
      alert("No pins to remove on this page.");
    }
  }, [pins, removeAllPinsByPath]);

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
      
      <LoadingOverlay isLoading={isLoading} />
      <Overlay isActive={isActive} showPins={showPins} />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

/* 
 * Main component for the Feedback Pin application
 * Provides controls for feedback functionality and pin visibility
 * Wraps content with PinsProvider to isolate context
 */
const FeedbackPinApp: React.FC<FeedbackPinAppProps> = ({ 
  initialActive = false,
  initialShowPins = true,
  emailId
}) => {
  return (
    <PinsProvider emailId={emailId}>
      <FeedbackPinContent 
        initialActive={initialActive}
        initialShowPins={initialShowPins}
      />
    </PinsProvider>
  );
};

export default React.memo(FeedbackPinApp);
