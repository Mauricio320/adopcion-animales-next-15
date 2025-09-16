"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BlockUIContextType {
  isBlocked: boolean;
  showBlockUI: (message?: string) => void;
  hideBlockUI: () => void;
  message: string;
}

const BlockUIContext = createContext<BlockUIContextType | undefined>(undefined);

interface BlockUIProviderProps {
  children: ReactNode;
}

export const BlockUIProvider = ({ children }: BlockUIProviderProps) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [message, setMessage] = useState('Cargando...');

  const showBlockUI = (customMessage?: string) => {
    if (customMessage) {
      setMessage(customMessage);
    }
    setIsBlocked(true);
  };

  const hideBlockUI = () => {
    setIsBlocked(false);
    setMessage('Cargando...'); // Reset al mensaje por defecto
  };

  const value: BlockUIContextType = {
    isBlocked,
    showBlockUI,
    hideBlockUI,
    message,
  };

  return (
    <BlockUIContext.Provider value={value}>
      {children}
    </BlockUIContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useBlockUI = () => {
  const context = useContext(BlockUIContext);
  if (context === undefined) {
    throw new Error('useBlockUI debe ser usado dentro de un BlockUIProvider');
  }
  return context;
};
