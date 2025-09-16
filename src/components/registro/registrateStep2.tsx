"use client";

import { IAlbergue } from "@/types/interfaces/albergue";;

import { IUsuario } from "@/types/interfaces/usuarios";
import { InformacionAlbergue } from "./InformacionAlbergue";
import { InformacionUsuario } from "./InformacionUsuario";
import { TiposDocumentoEnum, TiposUsuarioEnum } from "@/types/enums/enums";

interface IProps {
  formData: Partial<IUsuario>;
  updateFormData: (field: keyof IUsuario, value: string | number) => void;
  errors: Record<string, string>;
  validateField: (field: keyof IUsuario, value: string | number) => string;
  updateError: (field: keyof IUsuario, error: string) => void;
  albergueData: Partial<IAlbergue>;
  updateAlbergueData: (field: keyof IAlbergue, value: string | number) => void;
  albergueErrors: Record<string, string>;
  validateAlbergueField: (
    field: keyof IAlbergue,
    value: string | number
  ) => string;
  updateAlbergueError: (field: keyof IAlbergue, error: string) => void;
  setCurrentStep: (value: number) => void;
  onSubmit?: () => void;
}

export const RegistrateStep2 = ({
  formData,
  updateFormData,
  errors,
  validateField,
  updateError,
  albergueData,
  updateAlbergueData,
  albergueErrors,
  validateAlbergueField,
  updateAlbergueError,
  setCurrentStep,
  onSubmit,
}: IProps) => {
  // Verificar si el tipo de documento seleccionado requiere DV
  const tipoDocumentoSeleccionado = formData.tipo_documento_id
    ? Number(formData.tipo_documento_id)
    : null;
  const necesitaDV = tipoDocumentoSeleccionado === TiposDocumentoEnum.NIT;

  // Verificar si el tipo de usuario es albergue
  const esAlbergue = formData.tipo_usuario_id
    ? Number(formData.tipo_usuario_id) === TiposUsuarioEnum.ALBERGUE
    : false;

  const isStep2Valid =
    formData.tipo_documento_id &&
    formData.tipo_documento_id !== "" &&
    formData.numero_documento &&
    formData.numero_documento.trim() !== "" &&
    formData.nombre &&
    formData.nombre.trim() !== "" &&
    // Validar apellidos solo si NO es NIT (persona natural)
    (necesitaDV || (formData.apellidos && formData.apellidos.trim() !== "")) &&
    formData.celular &&
    formData.celular.trim() !== "" &&
    formData.correo &&
    formData.correo.trim() !== "" &&
    formData.municipio_id &&
    formData.municipio_id !== "" &&
    formData.direccion &&
    formData.direccion.trim() !== "" &&
    // Validar DV solo si es requerido
    (!necesitaDV || (necesitaDV && formData.dv && formData.dv.trim() !== "")) &&
    // Validaciones del albergue solo si es tipo albergue
    (!esAlbergue ||
      (esAlbergue &&
        albergueData.nombre &&
        albergueData.nombre.trim() !== "" &&
        albergueData.direccion &&
        albergueData.direccion.trim() !== "" &&
        albergueData.celular &&
        albergueData.celular.trim() !== "" &&
        albergueData.municipio_id &&
        albergueData.municipio_id !== 0 &&
        albergueData.descripcion &&
        albergueData.descripcion.trim() !== ""));

  const handleAnterior = () => {
    setCurrentStep(1);
  };

  const handleSiguiente = () => {
    if (isStep2Valid) {
     onSubmit?.();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-4">Registro</h1>
        <p className="text-gray-600">
          {esAlbergue
            ? "Paso 2: Información personal y del albergue"
            : "Paso 2: Información personal"}
        </p>
      </div>
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
            1
          </div>
          <div className="w-16 h-0.5 bg-emerald-600 mx-2"></div>
          <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
            2
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        {/* Información del Usuario */}
        <InformacionUsuario
          formData={formData}
          updateFormData={updateFormData}
          errors={errors}
          validateField={validateField}
          updateError={updateError}
        />

        {/* Línea de separación */}
        {esAlbergue && <div className="border-t border-gray-200 my-8"></div>}

        {/* Información del Albergue - Solo mostrar si es tipo albergue */}
        {esAlbergue && (
          <InformacionAlbergue
            albergueData={albergueData}
            updateAlbergueData={updateAlbergueData}
            albergueErrors={albergueErrors}
            validateAlbergueField={validateAlbergueField}
            updateAlbergueError={updateAlbergueError}
          />
        )}

        {/* Botones de navegación */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleAnterior}
            className="px-6 cursor-pointer py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={handleSiguiente}
            disabled={!isStep2Valid}
            className={`px-8 cursor-pointer py-3 rounded-lg transition-colors ${
              isStep2Valid
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
};
