"use client";

import { useMunicipios } from "@/hooks/useMunicipios";
import { useTiposDocumento } from "@/hooks/useTiposDocumento";
import {
  TiposDocumentoEnum,
  TiposPersonaEnum
} from "@/types/enums/enums";
import { IUsuario } from "@/types/interfaces/usuarios";
import { useEffect } from "react";
import { FaChevronDown, FaUser } from "react-icons/fa";

interface IProps {
  formData: Partial<IUsuario>;
  updateFormData: (field: keyof IUsuario, value: string | number) => void;
  errors: Record<string, string>;
  validateField: (field: keyof IUsuario, value: string | number) => string;
  updateError: (field: keyof IUsuario, error: string) => void;
}

export const InformacionUsuario = ({
  formData,
  updateFormData,
  errors,
  validateField,
  updateError,
}: IProps) => {
  const { data: tiposDocumento, loading: loadingTiposDoc } =
    useTiposDocumento();
  const { data: municipios, loading: loadingMunicipios } = useMunicipios();

  const tipoDocumentoSeleccionado = formData.tipo_documento_id
    ? Number(formData.tipo_documento_id)
    : null;

  const esNIT = tipoDocumentoSeleccionado === TiposDocumentoEnum.NIT;

  useEffect(() => {
    if (formData.tipo_persona_id) {
      const tipoPersonaId = Number(formData.tipo_persona_id);

      if (
        tipoPersonaId === TiposPersonaEnum.JURIDICA &&
        formData.tipo_documento_id !== String(TiposDocumentoEnum.NIT)
      ) {
        updateFormData("tipo_documento_id", String(TiposDocumentoEnum.NIT));
      }
    }
  }, [formData.tipo_persona_id, formData.tipo_documento_id, updateFormData]);

  useEffect(() => {
    return () => {
      updateFormData("tipo_documento_id", "");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFieldChange = (field: keyof IUsuario, value: string) => {
    updateFormData(field, value);
    const error = validateField(field, value);
    updateError(field, error);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <FaUser className="text-emerald-600 mr-3 text-xl" />
        <h2 className="text-xl font-semibold text-emerald-800">
          Información del Usuario
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de documento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de documento*
          </label>
          <div className="relative">
            <select
              value={formData.tipo_documento_id || ""}
              onChange={(e) =>
                handleFieldChange("tipo_documento_id", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white text-gray-700"
              disabled={loadingTiposDoc}
            >
              <option value="">Seleccione tipo de documento</option>
              {tiposDocumento.map((tipo) => (
                <option key={tipo.id} value={String(tipo.id)}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {errors.tipo_documento_id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.tipo_documento_id}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de documento*
            </label>
            <input
              type="text"
              value={formData.numero_documento || ""}
              onChange={(e) =>
                handleFieldChange("numero_documento", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ingrese número de documento"
            />
            {errors.numero_documento && (
              <p className="text-red-500 text-sm mt-1">
                {errors.numero_documento}
              </p>
            )}
          </div>

          {esNIT && (
            <div className="w-20">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DV*
              </label>
              <input
                type="text"
                value={formData.dv || ""}
                onChange={(e) => handleFieldChange("dv", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center"
                placeholder="0"
                maxLength={1}
              />
              {errors.dv && (
                <p className="text-red-500 text-sm mt-1">{errors.dv}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Nombre y Apellidos */}
      {esNIT ? (
        /* Solo Razón social para NIT */
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Razón social*
          </label>
          <input
            type="text"
            value={formData.nombre || ""}
            onChange={(e) => handleFieldChange("nombre", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Ingrese razón social"
          />
          {errors.nombre && (
            <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
          )}
        </div>
      ) : (
        /* Nombre y Apellidos en dos columnas para personas naturales */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombres*
            </label>
            <input
              type="text"
              value={formData.nombre || ""}
              onChange={(e) => handleFieldChange("nombre", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ingrese nombre"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellidos*
            </label>
            <input
              type="text"
              value={formData.apellidos || ""}
              onChange={(e) => handleFieldChange("apellidos", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ingrese apellidos"
            />
            {errors.apellidos && (
              <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Celular */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Celular*
          </label>
          <input
            type="tel"
            value={formData.celular || ""}
            onChange={(e) => handleFieldChange("celular", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Ingrese número de celular"
          />
          {errors.celular && (
            <p className="text-red-500 text-sm mt-1">{errors.celular}</p>
          )}
        </div>

        {/* Correo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico*
          </label>
          <input
            type="email"
            value={formData.correo || ""}
            onChange={(e) => handleFieldChange("correo", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Ingrese correo electrónico"
          />
          {errors.correo && (
            <p className="text-red-500 text-sm mt-1">{errors.correo}</p>
          )}
        </div>
      </div>

      {/* Municipio */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Municipio*
        </label>
        <div className="relative">
          <select
            value={formData.municipio_id || ""}
            onChange={(e) => handleFieldChange("municipio_id", e.target.value)}
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
        {errors.municipio_id && (
          <p className="text-red-500 text-sm mt-1">{errors.municipio_id}</p>
        )}
      </div>

      {/* Dirección */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dirección*
        </label>
        <input
          type="text"
          value={formData.direccion || ""}
          onChange={(e) => handleFieldChange("direccion", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Ingrese dirección"
        />
        {errors.direccion && (
          <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>
        )}
      </div>
    </div>
  );
};
