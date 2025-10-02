"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useBlockUI } from "@/contexts/BlockUIContext";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase/client";
import {
  getPasswordRequirements,
  getPasswordStrengthErrors,
  isPasswordFormValid,
} from "@/utils/helpers/passwordValidation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

interface IProps {
  includeCurrentPassword?: boolean;
}

export const ChangePasswordForm = ({
  includeCurrentPassword = true,
}: IProps) => {
  const { push } = useRouter();
  const { user } = useAuthContext();
  const { showSuccess, showError } = useToast();
  const { showBlockUI, hideBlockUI } = useBlockUI();
  const { verifyPassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const params = {
    includeCurrentPassword,
    password: newPassword,
    confirmPassword,
    currentPassword,
  };

  const passwordRequirements = getPasswordRequirements(params);
  const isFormValid = isPasswordFormValid(params);
  const title = !includeCurrentPassword
    ? "Restablecer Contraseña"
    : "Cambiar Contraseña";
  const subtitle = !includeCurrentPassword
    ? "Ingresa tu nueva contraseña para completar el proceso de recuperación."
    : "Actualiza tu contraseña de forma segura";

  const handleSubmit = async () => {
    const newErrors = getPasswordStrengthErrors(params);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    showBlockUI("Actualizando contraseña...");

    try {
      if (includeCurrentPassword) {
        const { error: authError } = await verifyPassword(
          user?.email || "",
          currentPassword
        );
        if (authError) {
          setErrors({ currentPassword: "Contraseña actual incorrecta" });
          hideBlockUI();
          return;
        }
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

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {/* Contraseña actual */}
        <div className="mb-4" hidden={!includeCurrentPassword}>
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
