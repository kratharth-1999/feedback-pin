/* 
 * Type definitions for the feedback pin application
 */
import type { ReactNode } from "react";

/* Position type representing x,y coordinates */
export type Position = {
  x: number;
  y: number;
};

/* Pin data structure representing user feedback attached to a specific position on a page */
export interface PinType {
    id: string;
    x: number;
    y: number;
    path: string;
    feedback: string;
    createdAt: number;
}

/* Context for managing pins across the application */
export interface PinsContextType {
  pins: PinType[];
  isLoading: boolean;
  addPin: (pin: PinType) => void;
  removePin: (pinId: string) => void;
  updatePin: (pin: PinType) => void;
  getPinsByPath: (path: string) => PinType[];
}

/* Props for the PinsProvider component */
export interface PinsProviderProps {
  children: ReactNode;
}

/* Props for the Pin component */
export interface PinProps {
  pin: PinType;
  onClick: (pin: PinType) => void;
}

/* Props for the Overlay component */
export interface OverlayProps {
  isActive: boolean;
  showPins: boolean;
}

/* Props for the PinDetailsPopup component */
export interface PinDetailsPopupProps {
  pin: PinType;
  onClose: () => void;
  onRemove: () => void;
  onUpdate?: (updatedPin: PinType) => void;
}

/* Props for the FeedbackPinApp component */
export interface FeedbackPinAppProps {
  initialActive?: boolean;
  initialShowPins?: boolean;
}

/* Props for the FeedbackForm component */
export interface FeedbackFormProps {
  position: Position;
  onSubmit: (feedback: string) => void;
  onCancel: () => void;
}
