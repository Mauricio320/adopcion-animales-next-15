"use client";

import { IAlbergue } from "@/types/interfaces/albergue";
import { IUsuario } from "@/types/interfaces/usuarios";
import { InformacionAlbergue } from "../registro/InformacionAlbergue";
import { InformacionUsuario } from "../registro/InformacionUsuario";
import { TiposDocumentoEnum, TiposUsuarioEnum } from "@/types/enums/enums";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { updateUsuario } from "@/hooks/useUsuarios";
import { useToast } from "@/contexts/ToastContext";
import { useBlockUI } from "@/contexts/BlockUIContext";
import { supabase } from "@/lib/supabase/client";

export const EditarUsuario = () => {
  const { user, setUser } = useAuthContext();
  const { showSuccess, showError } = useToast();
  const { showBlockUI, hideBlockUI } = useBlockUI();

  const [formData, setFormData] = useState<Partial<IUsuario>>({});
  const [albergueData, setAlbergueData] = useState<Partial<IAlbergue>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [albergueErrors, setAlbergueErrors] = useState<Record<string, string>>(
    {}
  );
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.usuario) {
      setFormData(user.usuario);
      if (user.usuario.usuario_albergue?.albergues) {
        setAlbergueData(user.usuario.usuario_albergue.albergues);
      }
    }
  }, [user]);

  const updateFormData = (field: keyof IUsuario, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateError = (field: keyof IUsuario, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const updateAlbergueData = (
    field: keyof IAlbergue,
    value: string | number
  ) => {
    setAlbergueData((prev) => ({ ...prev, [field]: value }));
  };

  const updateAlbergueError = (field: keyof IAlbergue, error: string) => {
    setAlbergueErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateField = (
    field: keyof IUsuario,
    value: string | number
  ): string => {
    // Similar validation as in registrateStep2
    switch (field) {
      case "tipo_documento_id":
        return !value ? "Tipo de documento es requerido" : "";
      case "numero_documento":
        return !value || String(value).trim() === ""
          ? "Número de documento es requerido"
          : "";
      case "nombre":
        return !value || String(value).trim() === ""
          ? "Nombre es requerido"
          : "";
      case "apellidos":
        const tipoDoc = Number(formData.tipo_documento_id);
        if (
          tipoDoc !== TiposDocumentoEnum.NIT &&
          (!value || String(value).trim() === "")
        ) {
          return "Apellidos son requeridos";
        }
        return "";
      case "celular":
        return !value || String(value).trim() === ""
          ? "Celular es requerido"
          : "";
      case "correo":
        return !value || String(value).trim() === ""
          ? "Correo es requerido"
          : "";
      case "municipio_id":
        return !value ? "Municipio es requerido" : "";
      case "direccion":
        return !value || String(value).trim() === ""
          ? "Dirección es requerida"
          : "";
      case "dv":
        const tipoDocDv = Number(formData.tipo_documento_id);
        if (
          tipoDocDv === TiposDocumentoEnum.NIT &&
          (!value || String(value).trim() === "")
        ) {
          return "DV es requerido para NIT";
        }
        return "";
      default:
        return "";
    }
  };

  const validateAlbergueField = (
    field: keyof IAlbergue,
    value: string | number
  ): string => {
    switch (field) {
      case "nombre":
        return !value || String(value).trim() === ""
          ? "Nombre del albergue es requerido"
          : "";
      case "direccion":
        return !value || String(value).trim() === ""
          ? "Dirección del albergue es requerida"
          : "";
      case "celular":
        return !value || String(value).trim() === ""
          ? "Celular del albergue es requerido"
          : "";
      case "municipio_id":
        return !value ? "Municipio del albergue es requerido" : "";
      case "descripcion":
        return !value || String(value).trim() === ""
          ? "Descripción del albergue es requerida"
          : "";
      case "email":
        return !value || String(value).trim() === ""
          ? "Email del albergue es requerido"
          : "";
      default:
        return "";
    }
  };

  const tipoDocumentoSeleccionado = formData.tipo_documento_id
    ? Number(formData.tipo_documento_id)
    : null;
  const necesitaDV = tipoDocumentoSeleccionado === TiposDocumentoEnum.NIT;

  const includeAlbergue = [
    TiposUsuarioEnum.ALBERGUE,
    TiposUsuarioEnum.VETERINARIA,
  ];

  const esAlbergue = includeAlbergue.includes(Number(formData.tipo_usuario_id));

  const isFormValid =
    formData.tipo_documento_id &&
    formData.tipo_documento_id !== "" &&
    formData.numero_documento &&
    formData.numero_documento.trim() !== "" &&
    formData.nombre &&
    formData.nombre.trim() !== "" &&
    (necesitaDV || (formData.apellidos && formData.apellidos.trim() !== "")) &&
    formData.celular &&
    formData.celular.trim() !== "" &&
    formData.correo &&
    formData.correo.trim() !== "" &&
    formData.municipio_id &&
    formData.municipio_id !== "" &&
    formData.direccion &&
    formData.direccion.trim() !== "" &&
    (!necesitaDV || (necesitaDV && formData.dv && formData.dv.trim() !== "")) &&
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
        albergueData.descripcion.trim() !== "" &&
        albergueData.email &&
        albergueData.email.trim() !== ""));

  const handleSubmit = async () => {
    if (!isFormValid || !password.trim()) {
      if (!password.trim())
        setPasswordError("Contraseña es requerida para confirmar cambios");
      return;
    }

    showBlockUI('Validando contraseña');
    setLoading(true);
    try {
      // Verificar contraseña
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password,
      });

      if (authError) {
        setPasswordError("Contraseña incorrecta");
        hideBlockUI();
        setLoading(false);
        return;
      }

      // Actualizar usuario
      delete formData.usuario_albergue;

      const updatedUser = await updateUsuario({
        usuarioId: user?.usuario?.id || 0,
        usuario: formData,
        albergue: albergueData,
      });

      if (user) {
        const updatedAuthUser = { ...user, usuario: updatedUser };
        setUser(updatedAuthUser);
      }

      showSuccess("Usuario actualizado exitosamente");
      setPassword("");
      setPasswordError("");
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      showError("Error al actualizar usuario");
    } finally {
      hideBlockUI();
      setLoading(false);
    }
  };

  return (
    <div >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-4">
          Editar Mi Cuenta
        </h1>
        <p className="text-gray-600">Actualiza tu información personal</p>
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
            validateAlbergueField={validateAlbergueField}
            updateAlbergueData={updateAlbergueData}
            updateAlbergueError={updateAlbergueError}
            albergueErrors={albergueErrors}
            albergueData={albergueData}
            formUsuario={formData}
          />
        )}

        {/* Confirmación de contraseña */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña actual*
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Ingrese su contraseña actual"
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}
        </div>

        {/* Botón de actualizar */}
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
            className={`cursor-pointer px-8 py-3 rounded-lg transition-colors ${
              isFormValid && !loading
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
};
