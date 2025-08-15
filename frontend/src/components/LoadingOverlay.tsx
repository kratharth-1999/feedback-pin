import React from "react";
import { ClipLoader } from "react-spinners";
import "../styles/LoadingOverlay.css";
import type { LoadingOverlayProps } from "../types";

/*
 * Loading overlay component to display during API calls
 * Uses react-spinners for the loading animation
 */
const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="loading-overlay" data-testid="loading-overlay">
            <div className="loading-container">
                <ClipLoader color="#3498db" size={50} />
                <p className="loading-text">Loading...</p>
            </div>
        </div>
    );
};

const MemoizedLoadingOverlay = React.memo(LoadingOverlay);
MemoizedLoadingOverlay.displayName = 'LoadingOverlay';

export default MemoizedLoadingOverlay;
