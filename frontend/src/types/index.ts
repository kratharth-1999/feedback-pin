/*
 * Type definitions for the feedback pin application
 */
import type { ReactNode } from "react";

/* Position type representing x,y coordinates */
export type Position = {
    x: number;
    y: number;
};

/* Props for the LoadingOverlay component */
export interface LoadingOverlayProps {
    isLoading: boolean;
}

/* State for API operations */
export interface ApiState {
    isLoading: boolean;
    error: Error | null;
    successMessage: string | null;
}

/* State for fetch operations */
export interface FetchState<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
}

/* Options for fetch operations */
export interface FetchOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: unknown;
}

/* Pin data structure representing user feedback attached to a specific position on a page */
export interface PinType {
    id: string;
    x: number;
    y: number;
    path: string;
    feedback: string;
    createdAt: number;
    emailId: string;
}

/* Context for managing pins across the application */
export interface PinsContextType {
    pins: PinType[];
    isLoading: boolean;
    emailId: string;
    addPin: (pin: PinType) => void;
    removePin: (pinId: string) => void;
    updatePin: (pin: PinType) => void;
    getPinsByPath: (path: string) => PinType[];
    removeAllPinsByPath: (path: string) => void;
}

/* Props for the PinsProvider component */
export interface PinsProviderProps {
    children: ReactNode;
    emailId: string;
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
    emailId: string;
}

/* Props for the FeedbackForm component */
export interface FeedbackFormProps {
    position: Position;
    onSubmit: (feedback: string) => void;
    onCancel: () => void;
}
