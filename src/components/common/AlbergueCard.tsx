"use client";

import { IAlbergue } from "@/types/interfaces/albergue";
import { FaHeart, FaInfoCircle } from "react-icons/fa";

interface AlbergueCardProps {
  albergue: IAlbergue;
}

export const AlbergueCard: React.FC<AlbergueCardProps> = ({ albergue }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      {/* Header del albergue */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-emerald-800 mb-2">
          {albergue.nombre}
        </h3>

        {/* Dirección */}
        <div className="flex items-start gap-2 text-gray-600 mb-3">
          <div className="text-sm">
            <div>{albergue.direccion}</div>
            {albergue.municipio && (
              <div className="text-gray-500 mt-1">
                {albergue.municipio.nombre}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="space-y-2 mb-4">
        {(albergue.telefono || albergue.celular) && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Contacto:</span>
            <div className="mt-1 space-y-1">
              <div>Tel: {albergue?.telefono ?? "-"}</div>
              <div>Cel: {albergue?.celular ?? "-"}</div>
            </div>
          </div>
        )}
      </div>

      {/* Descripción */}
      {albergue.descripcion && (
        <div className="mb-4 ">
          <div className="flex items-start gap-2 text-gray-600">
            <FaInfoCircle className="text-emerald-600 mt-1 flex-shrink-0" />
            <div className="text-sm text-gray-700 leading-relaxed h-18 max-h-18 overflow-y-auto">
              {albergue.descripcion}
            </div>
          </div>
        </div>
      )}

      {/* Footer con botón de donación */}
      <div className="pt-4 border-t border-gray-100">
        <button className="w-full bg-gradient-to-r from-green-50 to-green-200 hover:from-green-100 hover:to-green-300 text-green-800 font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-green-300">
          <FaHeart className="text-lg" />
          <span>Hacer Donación</span>
        </button>
      </div>
    </div>
  );
};
