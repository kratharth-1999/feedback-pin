import type { PinType } from "../types";

/* 
 * Service for handling pin operations with the backend
 * Currently implemented as a mock service using localStorage
 * In a real application, this would make API calls to the backend
 */
export const pinService = {
  /* 
   * Get all pins from storage
   */
  getAllPins: async (): Promise<PinType[]> => {
    try {
      const storedPins = localStorage.getItem("feedback-pins");
      return storedPins ? JSON.parse(storedPins) : [];
    } catch (error) {
      console.error("Error getting pins:", error);
      return [];
    }
  },

  /* 
   * Get pins for a specific path
   */
  getPinsByPath: async (path: string): Promise<PinType[]> => {
    try {
      const allPins = await pinService.getAllPins();
      return allPins.filter(pin => pin.path === path);
    } catch (error) {
      console.error(`Error getting pins for path ${path}:`, error);
      return [];
    }
  },

  /* 
   * Add a new pin
   */
  addPin: async (pin: PinType): Promise<PinType> => {
    try {
      const allPins = await pinService.getAllPins();
      const updatedPins = [...allPins, pin];
      localStorage.setItem("feedback-pins", JSON.stringify(updatedPins));
      return pin;
    } catch (error) {
      console.error("Error adding pin:", error);
      throw new Error("Failed to add pin");
    }
  },

  /* 
   * Remove a pin by id
   */
  removePin: async (pinId: string): Promise<void> => {
    try {
      const allPins = await pinService.getAllPins();
      const updatedPins = allPins.filter(pin => pin.id !== pinId);
      localStorage.setItem("feedback-pins", JSON.stringify(updatedPins));
    } catch (error) {
      console.error(`Error removing pin ${pinId}:`, error);
      throw new Error("Failed to remove pin");
    }
  },

  /* 
   * Update a pin
   */
  updatePin: async (updatedPin: PinType): Promise<PinType> => {
    try {
      const allPins = await pinService.getAllPins();
      const updatedPins = allPins.map(pin => 
        pin.id === updatedPin.id ? updatedPin : pin
      );
      localStorage.setItem("feedback-pins", JSON.stringify(updatedPins));
      return updatedPin;
    } catch (error) {
      console.error(`Error updating pin ${updatedPin.id}:`, error);
      throw new Error("Failed to update pin");
    }
  }
};
