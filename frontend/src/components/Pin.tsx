import React from "react";
import type { PinType } from "../types";

interface PinProps {
    pin: PinType;
    onClick: (pin: PinType) => void;
}

const Pin = React.memo(({ pin, onClick }: PinProps) => {
    return (
        <div
            className="pin"
            style={{ left: `${pin.x}px`, top: `${pin.y}px` }}
            onClick={() => onClick(pin)}
        />
    );
});

export default Pin;
