"use client";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/contexts/ToastContext";
import Link from "next/link";
import { useState, useEffect } from "react";

export function LoginForm() {
  const { signIn, error } = useAuth();
  const { showError } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Manejar errores del hook useAuth con Toast
  useEffect(() => {
    if (error) {
      showError("Error en el inicio de sesión", error);
    }
  }, [error, showError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showError("Campos requeridos", "Todos los campos son requeridos");
      return;
    }
    await signIn({ email, password });
  };

  return (
    <div className="max-w-md m-auto bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6 text-emerald-800">
        Iniciar Sesión
      </h2>

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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Ingresa tu correo electrónico"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Contraseña*
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Ingresa tu contraseña"
          />
          <p className="text-sm text-gray-500 mt-1">Tu contraseña</p>
        </div>

        <button
          type="submit"
          className={`w-full cursor-pointer py-3 px-4 rounded-lg transition-colors font-medium bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
        >
          Iniciar Sesión
        </button>
      </form>

      <div className="mt-6 space-y-3 text-center">
        <Link
          href="/registrate"
          className="block text-emerald-600 hover:text-emerald-500 font-medium"
        >
          ¿No tienes cuenta? Regístrate aquí
        </Link>

        <button
          type="button"
          className="text-sm text-gray-600 hover:text-gray-500"
          onClick={() => {
            const email = prompt(
              "Ingresa tu correo electrónico para restablecer tu contraseña:"
            );
            if (email) {
              // Aquí podrías implementar resetPassword(email)
              alert("Se ha enviado un enlace de restablecimiento a tu correo");
            }
          }}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </div>
  );
}
