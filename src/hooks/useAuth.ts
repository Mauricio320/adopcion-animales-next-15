"use client";

import { supabase } from "@/lib/supabase/client";
import { IUsuario } from "@/types/interfaces/usuarios";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { getUsuarioWithActiveAlbergue } from "@/hooks/useUsuarios";
import { useBlockUI } from "@/contexts/BlockUIContext";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser extends User {
  usuario?: IUsuario;
}

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showBlockUI, hideBlockUI } = useBlockUI();
  const { setUser } = useAuthContext();

  const signIn = async ({ email, password }: LoginCredentials) => {
    try {
      setError(null);
      setLoading(true);
      showBlockUI("Iniciando sesión...");
      console.log("🔐 Intentando login con:", { email, password: "***" });

      const { data, error } = await verifyPassword(email, password);

      if (error) throw error;

      if (data.user) {
        const usuarioData = await getUsuarioWithActiveAlbergue(data.user.id);

        const userWithData = { ...data.user, usuario: usuarioData || undefined };
        setUser(userWithData);
        router.push("/dashboard");
        hideBlockUI();
      }

      return data;
    } catch (err: unknown) {
      const error = err as Error;

      console.log("❌ Error en login:", error.message);
      hideBlockUI();
      if (error.message.includes("Email not confirmed")) {
        setError(
          "Tu email no ha sido confirmado. Por favor revisa tu bandeja de entrada y haz clic en el enlace de confirmación."
        );
      } else if (error.message.includes("Invalid login credentials")) {
        setError("Email o contraseña incorrectos");
      }

      throw err;
    } finally {
      hideBlockUI();
      console.log("🔄 Finalizando login, setLoading(false)");
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      showBlockUI("Cerrando sesión...");
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setTimeout(() => {
        hideBlockUI();
        localStorage.clear();
        setUser(null);
      }, 200);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
      hideBlockUI();
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    console.log({email});
    
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
      throw err;
    }
  };

  const verifyPassword = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const resendConfirmation = async (email: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
      throw err;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
      throw err;
    }
  };

  return {
    loading,
    error,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    resendConfirmation,
    verifyPassword,
  };
}
