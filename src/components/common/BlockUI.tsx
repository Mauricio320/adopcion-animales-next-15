"use client";

import { useBlockUI } from '@/contexts/BlockUIContext';

export const BlockUI = () => {
  const { isBlocked, message } = useBlockUI();

  if (!isBlocked) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Contenido del BlockUI */}
      <div className="relative z-10 bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Spinner animado */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
          
          {/* Mensaje */}
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">{message}</p>
            <p className="text-sm text-gray-500 mt-1">Por favor espera...</p>
          </div>
        </div>
      </div>
    </div>
  );
};
