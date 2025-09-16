"use client";

import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState, useCallback } from "react";
import { IUsuario } from "@/types/interfaces/usuarios";
import { AuthLoader } from "@/components/common/Loader";
import { useAuthContext } from "@/contexts/AuthContext";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser extends User {
  usuario?: IUsuario;
}

export const DataLogin = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setUser } = useAuthContext();

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUser = useCallback(async () => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: usuarioData } = await supabase
          .from("usuarios")
          .select(
            `
            *,
            usuario_albergue:usuarios_albergues (
              *,
              albergues (*, municipio:municipios(*))
            )
          `
          )
          .eq("auth_id", user.id)
          .eq("usuarios_albergues.es_activo", true)
          .single();

        usuarioData["usuario_albergue"] = usuarioData?.usuario_albergue[0];
        const userWithData = { ...user, usuario: usuarioData };

        setUser(userWithData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      setError("Error al cargar datos del usuario");
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  if (loading) return <AuthLoader />;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0">
              <svg
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Error de Autenticación
              </h3>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              getUser();
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return <div>{children}</div>;
};
