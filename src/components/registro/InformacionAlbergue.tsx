"use client";

import React from "react";
import { FaBuilding, FaChevronDown } from "react-icons/fa";

import { useMunicipios } from "@/hooks/useMunicipios";
import { IAlbergue } from "@/types/interfaces/albergue";

interface IProps {
  albergueData: Partial<IAlbergue>;
  updateAlbergueData: (field: keyof IAlbergue, value: string | number) => void;
  albergueErrors: Record<string, string>;
  validateAlbergueField: (field: keyof IAlbergue, value: string | number) => string;
  updateAlbergueError: (field: keyof IAlbergue, error: string) => void;
}

export const InformacionAlbergue = ({
  albergueData,
  updateAlbergueData,
  albergueErrors,
  validateAlbergueField,
  updateAlbergueError,
}: IProps) => {
  const { data: municipios, loading: loadingMunicipios } = useMunicipios();

  const handleFieldChange = (field: keyof IAlbergue, value: string | number) => {
    updateAlbergueData(field, value);
    const error = validateAlbergueField(field, value);
    updateAlbergueError(field, error);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <FaBuilding className="text-emerald-600 mr-3 text-xl" />
        <h2 className="text-xl font-semibold text-emerald-800">
          Información del Albergue
        </h2>
      </div>

      <div className="space-y-6">
        {/* Nombre del albergue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del albergue*
          </label>
          <input
            type="text"
            value={albergueData.nombre || ""}
            onChange={(e) => handleFieldChange("nombre", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Ingrese el nombre del albergue"
          />
          {albergueErrors.nombre && (
            <p className="text-red-500 text-sm mt-1">{albergueErrors.nombre}</p>
          )}
        </div>

        {/* Dirección del albergue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección del albergue*
          </label>
          <input
            type="text"
            value={albergueData.direccion || ""}
            onChange={(e) => handleFieldChange("direccion", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Ingrese la dirección del albergue"
          />
          {albergueErrors.direccion && (
            <p className="text-red-500 text-sm mt-1">{albergueErrors.direccion}</p>
          )}
        </div>

        {/* Teléfono y Celular */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono para Whatsapp*
            </label>
            <input
              type="tel"
              value={albergueData.telefono || ""}
              onChange={(e) => handleFieldChange("telefono", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ingrese teléfono para Whatsapp*"
            />
            {albergueErrors.telefono && (
              <p className="text-red-500 text-sm mt-1">{albergueErrors.telefono}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono para recibir llamadas*
            </label>
            <input
              type="tel"
              value={albergueData.celular || ""}
              onChange={(e) => handleFieldChange("celular", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ingrese teléfono para recibir llamadas*"
            />
            {albergueErrors.celular && (
              <p className="text-red-500 text-sm mt-1">{albergueErrors.celular}</p>
            )}
          </div>
        </div>

        {/* Municipio del albergue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Municipio del albergue*
          </label>
          <div className="relative">
            <select
              value={albergueData.municipio_id || ""}
              onChange={(e) => handleFieldChange("municipio_id", Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white text-gray-700"
              disabled={loadingMunicipios}
            >
              <option value="">Seleccione municipio del albergue</option>
              {municipios.map((municipio) => (
                <option key={municipio.id} value={String(municipio.id)}>
                  {municipio.nombre}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {albergueErrors.municipio_id && (
            <p className="text-red-500 text-sm mt-1">{albergueErrors.municipio_id}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción del albergue*
          </label>
          <textarea
            rows={4}
            value={albergueData.descripcion || ""}
            onChange={(e) => handleFieldChange("descripcion", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            placeholder="Describe brevemente el albergue, su misión, servicios que ofrece, etc."
          />
          {albergueErrors.descripcion && (
            <p className="text-red-500 text-sm mt-1">{albergueErrors.descripcion}</p>
          )}
        </div>
      </div>
    </div>
  );
};
