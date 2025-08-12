import React, { useRef, useState, useCallback } from "react";
import type { PinDetailsPopupProps, Position } from "../types";
import { useAdjustedPosition } from "../hooks/useAdjustedPosition";

/* 
 * Component that displays pin details and allows editing or removal of pins
 * Positioned near the pin with viewport boundary adjustments
 */
const PinDetailsPopup: React.FC<PinDetailsPopupProps> = ({ pin, onClose, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFeedback, setEditedFeedback] = useState(pin.feedback);
  const popupRef = useRef<HTMLDivElement>(null);
  /* Use the pin position as the initial position for the popup */
  const position: Position = { x: pin.x, y: pin.y };
  
  /* Adjust position to ensure the popup is within viewport */
  const adjustedPosition = useAdjustedPosition(position, popupRef);

  /* Handle toggling edit mode */
  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  /* Handle canceling edit mode */
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditedFeedback(pin.feedback); // Reset to original feedback
  }, [pin.feedback]);

  /* Handle saving updated feedback */
  const handleSaveEdit = useCallback(() => {
    if (onUpdate && editedFeedback.trim()) {
      onUpdate({
        ...pin,
        feedback: editedFeedback,
      });
      setIsEditing(false);
    }
  }, [pin, editedFeedback, onUpdate]);

  return (
    <div 
      className="pin-details"
      ref={popupRef}
      style={{ 
        position: "fixed", // Changed from absolute to fixed
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
    >
      <div className="pin-details-header">
        <h3>Pin Details</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="pin-details-content">
        {isEditing ? (
          <textarea
            value={editedFeedback}
            onChange={(e) => setEditedFeedback(e.target.value)}
            className="feedback-edit-textarea"
            rows={4}
            autoFocus
          />
        ) : (
          <p className="feedback-text">{pin.feedback}</p>
        )}
        <p className="timestamp">
          Created: {new Date(pin.createdAt).toLocaleString()}
        </p>
      </div>
      
      <div className="pin-details-actions">
        {isEditing ? (
          <>
            <button onClick={handleCancelEdit}>Cancel</button>
            <button 
              onClick={handleSaveEdit}
              disabled={!editedFeedback.trim() || editedFeedback === pin.feedback}
            >
              Save
            </button>
          </>
        ) : (
          <>
            <button onClick={handleEditClick}>Edit</button>
            <button onClick={onRemove}>Remove Pin</button>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(PinDetailsPopup);
