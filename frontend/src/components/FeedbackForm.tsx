import React, { useState, useCallback, useRef } from "react";
import { useAdjustedPosition } from "../hooks/useAdjustedPosition";
import type { FeedbackFormProps } from "../types";

/*
 * Component for collecting feedback from users
 * Renders a form at the clicked position with adjustments to ensure it stays within viewport
 */
const FeedbackForm: React.FC<FeedbackFormProps> = ({
    position,
    onSubmit,
    onCancel,
}) => {
    const [feedback, setFeedback] = useState("");
    const formRef = useRef<HTMLDivElement>(null);

    /* Adjust position to ensure the form is within viewport */
    const adjustedPosition = useAdjustedPosition(position, formRef);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (feedback.trim()) {
                onSubmit(feedback);
                setFeedback("");
            }
        },
        [feedback, onSubmit]
    );

    return (
        <div
            className="feedback-form"
            ref={formRef}
            style={{
                position: "fixed",
                left: `${adjustedPosition.x}px`,
                top: `${adjustedPosition.y}px`,
            }}
        >
            <form onSubmit={handleSubmit} className="feedback-form-content">
                <h3>Add Feedback</h3>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your feedback here..."
                    rows={4}
                    autoFocus
                    required
                />
                <div className="form-actions">
                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="submit" disabled={!feedback.trim()}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default React.memo(FeedbackForm);
