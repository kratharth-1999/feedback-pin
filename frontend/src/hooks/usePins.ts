import { useState, useEffect, useCallback } from "react";
import type { PinType } from "../types";
import { pinService } from "../services/pinService";

/* 
 * Custom hook to manage pins across the application
 * Handles loading, saving, adding, removing, and updating pins
 */
export function usePins() {
  const [pins, setPins] = useState<PinType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* Load pins on initial render */
  useEffect(() => {
    const loadPins = async () => {
      try {
        const allPins = await pinService.getAllPins();
        setPins(allPins);
      } catch (error) {
        console.error("Error loading pins:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPins();
  }, []);

  /* Add a new pin */
  const addPin = useCallback(async (pin: PinType) => {
    try {
      await pinService.addPin(pin);
      setPins(prevPins => [...prevPins, pin]);
    } catch (error) {
      console.error("Error adding pin:", error);
    }
  }, []);

  /* Remove a pin by id */
  const removePin = useCallback(async (pinId: string) => {
    try {
      await pinService.removePin(pinId);
      setPins(prevPins => prevPins.filter(pin => pin.id !== pinId));
    } catch (error) {
      console.error("Error removing pin:", error);
    }
  }, []);

  /* Update a pin */
  const updatePin = useCallback(async (updatedPin: PinType) => {
    try {
      await pinService.updatePin(updatedPin);
      setPins(prevPins => 
        prevPins.map(pin => pin.id === updatedPin.id ? updatedPin : pin)
      );
    } catch (error) {
      console.error("Error updating pin:", error);
    }
  }, []);

  /* Get pins for a specific path */
  const getPinsByPath = useCallback((path: string) => {
    return pins.filter(pin => pin.path === path);
  }, [pins]);

  return {
    pins,
    isLoading,
    addPin,
    removePin,
    updatePin,
    getPinsByPath
  };
}
