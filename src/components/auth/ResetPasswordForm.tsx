"use client";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/contexts/ToastContext";
import { useBlockUI } from "@/contexts/BlockUIContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getPasswordRequirements, isPasswordFormValid } from "@/utils/passwordValidation";

export function ResetPasswordForm() {
  const { updatePassword } = useAuth();
  const { showSuccess, showError } = useToast();
  const { showBlockUI, hideBlockUI } = useBlockUI();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const requirements = getPasswordRequirements(password, confirmPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar formulario
    const validationErrors: Record<string, string> = {};
    if (!password.trim()) {
      validationErrors.password = "La contraseña es requerida";
    }
    if (!confirmPassword.trim()) {
      validationErrors.confirmPassword = "La confirmación de contraseña es requerida";
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    const strengthErrors = requirements.filter(req => !req.check()).map(req => req.text);
    if (strengthErrors.length > 0) {
      validationErrors.password = `Contraseña inválida: ${strengthErrors.join(", ")}`;
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    showBlockUI("Actualizando contraseña...");

    try {
      await updatePassword(password.trim());
      showSuccess(
        "Contraseña actualizada",
        "Tu contraseña ha sido cambiada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña."
      );
      // Redirigir al login después de un breve delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      showError(
        "Error",
        "No se pudo actualizar la contraseña. Por favor intenta nuevamente."
      );
    } finally {
      hideBlockUI();
    }
  };

  return (
    <div className="max-w-md m-auto bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6 text-emerald-800">
        Restablecer Contraseña
      </h2>

      <p className="text-gray-600 text-center mb-6">
        Ingresa tu nueva contraseña para completar el proceso de recuperación.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nueva Contraseña*
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Ingresa tu nueva contraseña"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirmar Contraseña*
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Confirma tu nueva contraseña"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Requisitos de contraseña */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Requisitos de contraseña:
          </h3>
          <ul className="text-sm space-y-1">
            {requirements.map((req, index) => (
              <li
                key={index}
                className={`flex items-center ${
                  req.check() ? "text-green-600" : "text-gray-500"
                }`}
              >
                <span className="mr-2">
                  {req.check() ? "✓" : "○"}
                </span>
                {req.text}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          disabled={!isPasswordFormValid(password, confirmPassword)}
          className={`w-full cursor-pointer py-3 px-4 rounded-lg transition-colors font-medium ${
            isPasswordFormValid(password, confirmPassword)
              ? "bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Actualizar Contraseña
        </button>
      </form>
    </div>
  );
}
