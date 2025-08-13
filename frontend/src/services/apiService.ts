import type { PinType } from "../types";

const API_BASE_URL = "https://feedback-pin-production.up.railway.app";

/*
 * Service for handling pin operations with the backend API
 * Provides methods for fetching, creating, updating, and deleting pins
 */
export const apiService = {
    /*
     * Get pins for a specific URL and email ID
     */
    getPinsByUrl: async (url: string, emailId: string): Promise<PinType[]> => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/pins?url=${encodeURIComponent(
                    url
                )}&emailId=${encodeURIComponent(emailId)}`
            );
            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to fetch pins for URL"
                );
            }

            return result.data || [];
        } catch (error) {
            console.error(`Error getting pins for URL ${url}:`, error);
            throw error;
        }
    },

    /*
     * Create or update a pin
     */
    savePin: async (pin: PinType): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/pin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(pin),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to create/update pin"
                );
            }
        } catch (error) {
            console.error("Error saving pin:", error);
            throw error;
        }
    },

    /*
     * Delete a pin by ID
     */
    deletePin: async (id: string): Promise<void> => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/pin?id=${encodeURIComponent(id)}`,
                {
                    method: "DELETE",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to delete pin");
            }
        } catch (error) {
            console.error(`Error deleting pin ${id}:`, error);
            throw error;
        }
    },

    /*
     * Delete all pins for a specific URL and email ID
     */
    deletePinsByUrl: async (url: string, emailId: string): Promise<void> => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/pin?url=${encodeURIComponent(
                    url
                )}&emailId=${encodeURIComponent(emailId)}`,
                {
                    method: "DELETE",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to delete pins for URL"
                );
            }
        } catch (error) {
            console.error(`Error deleting pins for URL ${url}:`, error);
            throw error;
        }
    },
};
