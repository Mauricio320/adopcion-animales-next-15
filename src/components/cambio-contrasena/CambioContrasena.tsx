"use client";

import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useBlockUI } from "@/contexts/BlockUIContext";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

export const CambioContrasena = () => {
  const { push } = useRouter();
  const { user } = useAuthContext();
  const { showSuccess, showError } = useToast();
  const { showBlockUI, hideBlockUI } = useBlockUI();
  const { verifyPassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordRequirements = [
    {
      text: "Contraseña actual requerida",
      check: () => currentPassword.trim() !== "",
    },
    {
      text: "Confirmar contraseña coincide",
      check: () =>
        newPassword === confirmPassword && confirmPassword.trim() !== "",
    },
    { text: "Al menos 8 caracteres", check: () => newPassword.length >= 8 },
    { text: "Una letra mayúscula", check: () => /[A-Z]/.test(newPassword) },
    { text: "Una letra minúscula", check: () => /[a-z]/.test(newPassword) },
    { text: "Un número", check: () => /\d/.test(newPassword) },
    {
      text: "Un carácter especial",
      check: () => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
    },
  ];

  const validatePasswordStrength = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("Al menos 8 caracteres");
    if (!/[A-Z]/.test(password)) errors.push("Una letra mayúscula");
    if (!/[a-z]/.test(password)) errors.push("Una letra minúscula");
    if (!/\d/.test(password)) errors.push("Un número");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
      errors.push("Un carácter especial");
    return errors;
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Contraseña actual es requerida";
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = "Nueva contraseña es requerida";
    } else {
      const strengthErrors = validatePasswordStrength(newPassword);
      if (strengthErrors.length > 0) {
        newErrors.newPassword = `Contraseña débil: ${strengthErrors.join(
          ", "
        )}`;
      }
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirmación de contraseña es requerida";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    showBlockUI("Cambiando contraseña...");

    try {
      // Verificar contraseña actual
      const { error: authError } = await verifyPassword(
        user?.email || "",
        currentPassword
      );

      if (authError) {
        setErrors({ currentPassword: "Contraseña actual incorrecta" });
        hideBlockUI();
        return;
      }

      // Actualizar contraseña
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        let errorMessage = "Error al cambiar contraseña";
        if (updateError.code === "same_password")
          errorMessage = "La nueva contraseña no puede ser igual a la actual";
        showError(errorMessage);
      } else {
        showSuccess("Contraseña cambiada exitosamente");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});
        push("/dashboard");
      }
    } catch (error) {
      console.error("Error cambiando contraseña:", error);
      showError("Error al cambiar contraseña");
    } finally {
      hideBlockUI();
    }
  };

  const isFormValid =
    currentPassword.trim() &&
    newPassword.trim() &&
    confirmPassword.trim() &&
    newPassword === confirmPassword &&
    validatePasswordStrength(newPassword).length === 0;

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-4">
          Cambiar Contraseña
        </h1>
        <p className="text-gray-600">Actualiza tu contraseña de forma segura</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        {/* Contraseña actual */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña actual*
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setErrors((prev) => ({ ...prev, currentPassword: "" }));
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Ingrese su contraseña actual"
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.currentPassword}
            </p>
          )}
        </div>

        {/* Nueva contraseña */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nueva contraseña*
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErrors((prev) => ({ ...prev, newPassword: "" }));
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Ingrese su nueva contraseña"
          />
        </div>

        {/* Confirmar contraseña */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar nueva contraseña*
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Confirme su nueva contraseña"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Requisitos de contraseña */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">
            La contraseña debe cumplir con:
          </p>
          <ul className="text-sm space-y-1">
            {passwordRequirements.map((req, index) => (
              <li key={index} className="flex items-center">
                {req.check() ? (
                  <FaCheck className="text-green-500 mr-3" />
                ) : (
                  <FaTimes className="text-red-500 mr-3" />
                )}
                <span
                  className={req.check() ? "text-green-700" : "text-gray-500"}
                >
                  {req.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Botón de cambiar */}
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`cursor-pointer px-8 py-3 rounded-lg transition-colors ${
              isFormValid
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Cambiar Contraseña
          </button>
        </div>
      </div>
    </div>
  );
};
