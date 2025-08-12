import React, { createContext, useContext } from "react";
import { usePins } from "../hooks/usePins";
import type { PinsContextType, PinsProviderProps } from "../types";

/* 
 * Context for managing pins across the application
 * Provides access to pins data and operations to components
 */
const PinsContext = createContext<PinsContextType | undefined>(undefined);

export const PinsProvider: React.FC<PinsProviderProps> = ({ children }) => {
  const pinsData = usePins();
  
  return (
    <PinsContext.Provider value={pinsData}>
      {children}
    </PinsContext.Provider>
  );
};

/* Custom hook to use the pins context */
export const usePinsContext = (): PinsContextType => {
  const context = useContext(PinsContext);
  
  if (context === undefined) {
    throw new Error("usePinsContext must be used within a PinsProvider");
  }
  
  return context;
};
