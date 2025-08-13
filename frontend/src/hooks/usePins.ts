import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import type { PinType } from "../types";
import { apiService } from "../services/apiService";

/*
 * Custom hook to manage pins across the application
 * Handles loading, saving, adding, removing, and updating pins
 */
export function usePins(emailId: string) {
    const [pins, setPins] = useState<PinType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    /* Load pins on initial render */
    useEffect(() => {
        const loadPins = async () => {
            setIsLoading(true);
            try {
                const currentUrl = window.location.href;
                const urlPins = await apiService.getPinsByUrl(
                    currentUrl,
                    emailId
                );
                setPins(urlPins);
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Error loading pins";
                toast.error(errorMessage);
                console.error("Error loading pins:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadPins();
    }, [emailId]);

    /* Add a new pin */
    const addPin = useCallback(
        async (pin: PinType) => {
            setIsLoading(true);
            try {
                // Ensure the pin has the correct emailId
                const pinWithEmail = { ...pin, emailId };
                await apiService.savePin(pinWithEmail);
                setPins((prevPins) => [...prevPins, pinWithEmail]);
                toast.success("Pin added successfully");
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "Error adding pin";
                toast.error(errorMessage);
                console.error("Error adding pin:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [emailId]
    );

    /* Remove a pin by id */
    const removePin = useCallback(async (pinId: string) => {
        setIsLoading(true);
        try {
            await apiService.deletePin(pinId);
            setPins((prevPins) => prevPins.filter((pin) => pin.id !== pinId));
            toast.success("Pin removed successfully");
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Error removing pin";
            toast.error(errorMessage);
            console.error("Error removing pin:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /* Update a pin */
    const updatePin = useCallback(
        async (updatedPin: PinType) => {
            setIsLoading(true);
            try {
                // Ensure the pin has the correct emailId
                const pinWithEmail = { ...updatedPin, emailId };
                await apiService.savePin(pinWithEmail);
                setPins((prevPins) =>
                    prevPins.map((pin) =>
                        pin.id === updatedPin.id ? pinWithEmail : pin
                    )
                );
                toast.success("Pin updated successfully");
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Error updating pin";
                toast.error(errorMessage);
                console.error("Error updating pin:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [emailId]
    );

    /* Get pins for a specific path */
    const getPinsByPath = useCallback(
        (path: string) => {
            return pins.filter((pin) => pin.path === path);
        },
        [pins]
    );

    /* Remove all pins for a specific path */
    const removeAllPinsByPath = useCallback(
        async (path: string) => {
            setIsLoading(true);
            try {
                await apiService.deletePinsByUrl(path, emailId);
                setPins((prevPins) =>
                    prevPins.filter((pin) => pin.path !== path)
                );
                toast.success("All pins removed successfully");
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Error removing pins";
                toast.error(errorMessage);
                console.error("Error removing pins for path:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [emailId]
    );

    return {
        pins,
        isLoading,
        emailId,
        addPin,
        removePin,
        updatePin,
        getPinsByPath,
        removeAllPinsByPath,
    };
}
