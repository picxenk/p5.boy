import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SketchContextType {
  availableSketches: string[];
  currentSketch: string;
  setCurrentSketch: (sketchName: string) => void;
}

const SketchContext = createContext<SketchContextType | undefined>(undefined);

export const useSketchContext = () => {
  const context = useContext(SketchContext);
  if (!context) {
    throw new Error('useSketchContext must be used within a SketchProvider');
  }
  return context;
};

interface SketchProviderProps {
  children: ReactNode;
}

export const SketchProvider: React.FC<SketchProviderProps> = ({ children }) => {
  // List of available sketches
  const availableSketches = ['pong', 'snake', 'tetris'];
  
  // Default to pong
  const [currentSketch, setCurrentSketch] = useState('pong');
  
  return (
    <SketchContext.Provider value={{
      availableSketches,
      currentSketch,
      setCurrentSketch
    }}>
      {children}
    </SketchContext.Provider>
  );
};