"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function UnauthorizedPage() {
  const { user } = useAuthContext();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m0-6V7a4 4 0 10-8 0v4a1 1 0 001 1h14a1 1 0 001-1V7a4 4 0 00-4-4z"
              />
            </svg>
          </div>
          
          {/* Título */}
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Acceso Denegado
          </h2>
          
          {/* Mensaje */}
          <p className="mt-2 text-sm text-gray-600">
            No tienes permisos suficientes para acceder a esta página.
          </p>
          
          {/* Información del usuario */}
          {user && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Usuario actual:</strong> {user.usuario?.nombre || user.email}
              </p>
              <p className="text-sm text-yellow-800">
                <strong>Rol:</strong> {user.usuario?.rol || 'Sin rol asignado'}
              </p>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ir al Dashboard
          </Link>
          
          <Link
            href="/"
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ir al Inicio
          </Link>
          
          <button
            onClick={signOut}
            className="group cursor-pointer relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Contacto */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Si crees que esto es un error, contacta al administrador del sistema.
          </p>
        </div>
      </div>
    </div>
  );
}
