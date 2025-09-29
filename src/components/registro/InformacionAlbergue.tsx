"use client";

import React from "react";
import { FaBuilding, FaChevronDown } from "react-icons/fa";

import { useMunicipios } from "@/hooks/useMunicipios";
import { IAlbergue } from "@/types/interfaces/albergue";
import { TiposUsuarioLabels } from "@/types/enums/enums";
import { IUsuario } from "@/types/interfaces/usuarios";

interface IProps {
  updateAlbergueData: (field: keyof IAlbergue, value: string | number) => void;
  validateAlbergueField: (
    field: keyof IAlbergue,
    value: string | number
  ) => string;
  updateAlbergueError: (field: keyof IAlbergue, error: string) => void;
  albergueErrors: Record<string, string>;
  albergueData: Partial<IAlbergue>;
  formUsuario: Partial<IUsuario>;
}

export const InformacionAlbergue = ({
  validateAlbergueField,
  updateAlbergueError,
  updateAlbergueData,
  albergueErrors,
  albergueData,
  formUsuario,
}: IProps) => {
  const { data: municipios, loading: loadingMunicipios } = useMunicipios();

  const handleFieldChange = (
    field: keyof IAlbergue,
    value: string | number
  ) => {
    updateAlbergueData(field, value);
    const error = validateAlbergueField(field, value);
    updateAlbergueError(field, error);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <FaBuilding className="text-emerald-600 mr-3 text-xl" />
        <h2 className="text-xl font-semibold text-emerald-800">
          Información{" "}
          {
            TiposUsuarioLabels[
              formUsuario?.tipo_usuario_id as keyof typeof TiposUsuarioLabels
            ]
          }
        </h2>
      </div>

      <div className="space-y-6">
        {/* Nombre del albergue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre*
          </label>
          <input
            type="text"
            value={albergueData.nombre || ""}
            onChange={(e) => handleFieldChange("nombre", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Ingrese el nombre"
          />
          {albergueErrors.nombre && (
            <p className="text-red-500 text-sm mt-1">{albergueErrors.nombre}</p>
          )}
        </div>

        {/* Dirección del albergue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección*
          </label>
          <input
            type="text"
            value={albergueData.direccion || ""}
            onChange={(e) => handleFieldChange("direccion", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Ingrese la dirección"
          />
          {albergueErrors.direccion && (
            <p className="text-red-500 text-sm mt-1">
              {albergueErrors.direccion}
            </p>
          )}
        </div>

        {/* Dirección del albergue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email*
          </label>
          <input
            type="email"
            value={albergueData.email || ""}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Ingrese el email"
          />
          {albergueErrors.email && (
            <p className="text-red-500 text-sm mt-1">
              {albergueErrors.email}
            </p>
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
              <p className="text-red-500 text-sm mt-1">
                {albergueErrors.telefono}
              </p>
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
              <p className="text-red-500 text-sm mt-1">
                {albergueErrors.celular}
              </p>
            )}
          </div>
        </div>

        {/* Municipio del albergue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Municipio*
          </label>
          <div className="relative">
            <select
              value={albergueData.municipio_id || ""}
              onChange={(e) =>
                handleFieldChange("municipio_id", Number(e.target.value))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white text-gray-700"
              disabled={loadingMunicipios}
            >
              <option value="">Seleccione municipio</option>
              {municipios.map((municipio) => (
                <option key={municipio.id} value={String(municipio.id)}>
                  {municipio.nombre}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {albergueErrors.municipio_id && (
            <p className="text-red-500 text-sm mt-1">
              {albergueErrors.municipio_id}
            </p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción*
          </label>
          <textarea
            rows={4}
            value={albergueData.descripcion || ""}
            onChange={(e) => handleFieldChange("descripcion", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            placeholder="Describe brevemente el establecimiento, su misión, servicios que ofrece, etc."
          />
          {albergueErrors.descripcion && (
            <p className="text-red-500 text-sm mt-1">
              {albergueErrors.descripcion}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
