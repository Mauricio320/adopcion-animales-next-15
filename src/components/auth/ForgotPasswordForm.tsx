"use client";

import { useBlockUI } from "@/contexts/BlockUIContext";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const { resetPassword } = useAuth();
  const { showSuccess, showError } = useToast();
  const { showBlockUI, hideBlockUI } = useBlockUI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return showError(
        "Email inválido",
        "Por favor ingresa un correo electrónico válido"
      );
    }
    showBlockUI("Enviando enlace de recuperación...");

    try {
      await resetPassword(email.trim());
      showSuccess(
        "Enlace enviado",
        "Se ha enviado un enlace de recuperación a tu correo electrónico. Revisa tu bandeja de entrada."
      );
      setEmail("");
    } catch (error) {
      console.error("Error al enviar enlace de recuperación:", error);
      showError(
        "Error",
        "No se pudo enviar el enlace de recuperación. Verifica tu correo electrónico e intenta nuevamente."
      );
    } finally {
      hideBlockUI();
    }
  };

  return (
    <div className="max-w-md m-auto bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-800 mb-2">
          ¿Olvidaste tu contraseña?
        </h2>
        <p className="text-gray-600">
          Ingresa tu correo electrónico y te enviaremos un enlace para
          restablecer tu contraseña.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Correo electrónico*
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Ingresa tu correo electrónico"
          />
        </div>

        <button
          type="submit"
          disabled={!email.trim()}
          className={`w-full cursor-pointer py-3 px-4 rounded-lg transition-colors font-medium ${
            !email.trim()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          }`}
        >
          {"Enviar enlace de recuperación"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm text-emerald-600 hover:text-emerald-500 font-medium"
        >
          ← Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
