"use client";

import { useBlockUI } from "@/contexts/BlockUIContext";
import { useToast } from "@/contexts/ToastContext";
import { createUsuarioWithAuth } from "@/hooks/useUsuarios";
import {
  requiereDigitoVerificacion,
  TiposUsuarioEnum,
} from "@/types/enums/enums";
import { IAlbergue } from "@/types/interfaces/albergue";
import { IUsuario } from "@/types/interfaces/usuarios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RegistrateStep1 } from "./registrateStep1";
import { RegistrateStep2 } from "./registrateStep2";

export const Registrate = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const { showBlockUI, hideBlockUI } = useBlockUI();
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<IUsuario>>({
    tipo_usuario_id: "",
    tipo_persona_id: "",
    tipo_documento_id: "",
    numero_documento: "",
    dv: "",
    nombre: "",
    apellidos: "",
    celular: "",
    correo: "",
    municipio_id: "",
    direccion: "",
  });

  // Estado separado para los datos del albergue
  const [albergueData, setAlbergueData] = useState<Partial<IAlbergue>>({
    nombre: "",
    direccion: "",
    telefono: "",
    celular: "",
    municipio_id: 0,
    descripcion: "",
    email: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [albergueErrors, setAlbergueErrors] = useState<Record<string, string>>(
    {}
  );

  const updateFormData = (field: keyof IUsuario, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateAlbergueData = (
    field: keyof IAlbergue,
    value: string | number
  ) => {
    setAlbergueData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateField = (
    field: keyof IUsuario,
    value: string | number
  ): string => {
    switch (field) {
      case "tipo_usuario_id":
        return !value || value === "" ? "Tipo de usuario es requerido" : "";
      case "tipo_persona_id":
        return !value || value === "" ? "Tipo de persona es requerido" : "";
      case "tipo_documento_id":
        return !value || value === "" ? "Tipo de documento es requerido" : "";
      case "numero_documento":
        return !value || value === "" ? "Número de documento es requerido" : "";
      case "dv":
        // Validar DV solo si el tipo de documento lo requiere
        const tipoDoc = formData.tipo_documento_id
          ? Number(formData.tipo_documento_id)
          : null;
        const necesitaDV = tipoDoc
          ? requiereDigitoVerificacion(tipoDoc)
          : false;
        if (necesitaDV && (!value || value === "")) {
          return "Dígito de verificación es requerido";
        }
        return "";
      case "nombre":
        return !value || value === "" ? "Nombre es requerido" : "";
      case "apellidos":
        return !value || value === "" ? "Apellidos son requeridos" : "";
      case "celular":
        return !value || value === "" ? "Celular es requerido" : "";
      case "correo":
        if (!value || value === "") return "Correo es requerido";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(String(value)) ? "Correo no válido" : "";
      case "municipio_id":
        return !value || value === "" ? "Municipio es requerido" : "";
      case "direccion":
        return !value || value === "" ? "Dirección es requerida" : "";
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
        return !value || value === ""
          ? "Nombre del establecimiento es requerido"
          : "";
      case "direccion":
        return !value || value === ""
          ? "Dirección del establecimiento es requerida"
          : "";
      case "celular":
        return !value || value === ""
          ? "Celular del establecimiento es requerido"
          : "";
      case "municipio_id":
        return !value || value === 0
          ? "Municipio del establecimiento es requerido"
          : "";
      case "descripcion":
        return !value || value === ""
          ? "Descripción del establecimiento es requerida"
          : "";
      case "telefono":
        // Teléfono fijo es opcional, no validamos
        return "";
      default:
        return "";
    }
  };

  const updateError = (field: keyof IUsuario, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const updateAlbergueError = (field: keyof IAlbergue, error: string) => {
    setAlbergueErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const onSubmit = async () => {
    showBlockUI("Registrando usuario...");

    try {
      const includeAlbergue = [
        TiposUsuarioEnum.ALBERGUE,
        TiposUsuarioEnum.VETERINARIA,
      ];

      const esAlbergue = includeAlbergue.includes(
        Number(formData.tipo_usuario_id)
      );

      const data = {
        usuario: formData,
        ...(esAlbergue && {
          usuarioAlbergue: {
            es_activo: true,
            es_propietario: true,
            albergue: { ...albergueData, tipo: Number(formData.tipo_usuario_id) },
          },
        }),
      };

      await createUsuarioWithAuth(data);

      showSuccess(
        "¡Usuario registrado exitosamente!",
        `Se ha enviado un email de confirmación a: ${formData.correo}\n\nPor favor revisa tu bandeja de entrada (y spam) y haz clic en el enlace de confirmación antes de intentar iniciar sesión.\n\nTu contraseña son los últimos 6 dígitos de tu documento.`
      );

      router.push("/login");
    } catch (err: unknown) {
      const error = err as Error;
      showError("Error en el registro", error.message);
    } finally {
      hideBlockUI();
    }
  };

  return (
    <div >
      {currentStep === 1 ? (
        <RegistrateStep1
          setCurrentStep={setCurrentStep}
          updateFormData={updateFormData}
          validateField={validateField}
          updateError={updateError}
          formData={formData}
          errors={errors}
        />
      ) : (
        <RegistrateStep2
          validateAlbergueField={validateAlbergueField}
          updateAlbergueError={updateAlbergueError}
          updateAlbergueData={updateAlbergueData}
          albergueErrors={albergueErrors}
          updateFormData={updateFormData}
          setCurrentStep={setCurrentStep}
          validateField={validateField}
          albergueData={albergueData}
          updateError={updateError}
          onSubmit={onSubmit}
          formData={formData}
          errors={errors}
        />
      )}
    </div>
  );
};
