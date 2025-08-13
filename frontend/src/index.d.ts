import { ReactNode } from "react";

export interface Position {
    x: number;
    y: number;
}

export interface PinType {
    id: string;
    x: number;
    y: number;
    path: string;
    feedback: string;
    createdAt: number;
    emailId: string;
}

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

export interface PinsProviderProps {
    children: ReactNode;
    emailId: string;
}

export interface FeedbackPinAppProps {
    initialActive?: boolean;
    initialShowPins?: boolean;
    initialShowControls?: boolean;
    emailId: string;
}

export declare const FeedbackPin: React.FC<FeedbackPinAppProps>;
