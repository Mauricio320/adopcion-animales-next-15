import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { IUsuario } from "@/types/interfaces/usuarios";
import { IAlbergue } from "@/types/interfaces/albergue";;
import { TiposUsuarioEnum } from "@/types/enums/enums";



export interface IUsuarioAlbergue {
  id: number;
  usuario_id: number;
  albergue_id: number;
  es_activo: boolean;
  es_propietario: boolean;
  created_at: string;
  updated_at: string;
}

export interface IUsuarioAlbergueData {
  es_activo: boolean;
  es_propietario: boolean;
  albergue: Partial<IAlbergue>;
}

export interface ICreateUsuarioData {
  usuario: Partial<IUsuario>;
  usuarioAlbergue?: IUsuarioAlbergueData;
}

export interface ICreateUsuarioResponse {
  usuario: IUsuario;
  albergue?: IAlbergue;
  usuarioAlbergue?: IUsuarioAlbergue;
}

export const useUsuarios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUsuarioManual = async (
    data: ICreateUsuarioData
  ): Promise<ICreateUsuarioResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const { usuario, usuarioAlbergue } = data;

      const esAlbergue = usuario.tipo_usuario_id
        ? Number(usuario.tipo_usuario_id) === TiposUsuarioEnum.ALBERGUE
        : false;

      // ✅ ASIGNACIÓN AUTOMÁTICA DE ROLES
      const usuarioConRol = {
        ...usuario,
        rol: esAlbergue ? "staff" : "usuario", // Albergues = staff, Ciudadanos = usuario
        estado: "activo", // Por defecto activo
      };

      if (esAlbergue && usuarioAlbergue) {
        const { data: resultado, error: errorRPC } = await supabase.rpc(
          "create_usuario_simple",
          {
            usuario_data: usuarioConRol,
            albergue_data: usuarioAlbergue.albergue,
          }
        );

        if (errorRPC) throw errorRPC;

        return {
          usuario: { id: resultado.usuario_id },
        } as ICreateUsuarioResponse;
      } else {
        const usuarioParaBD = {
          ...usuarioConRol,
          contrasena: "",
        };
        delete usuarioParaBD.password;

        const { data: usuarioCreado, error: usuarioError } = await supabase
          .from("usuarios")
          .insert([usuarioParaBD])
          .select()
          .single();

        if (usuarioError) throw usuarioError;

        return { usuario: usuarioCreado };
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (id: number): Promise<IUsuario | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("usuarios")
        .select(
          `
          *,
          usuarios_albergues (
            *,
            albergues (*)
          )
        `
        )
        .eq("id", id)
        .single();

      if (supabaseError) throw supabaseError;

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = (numeroDocumento: string): string => {
    const documento = numeroDocumento.replace(/\D/g, "");
    return documento.slice(-6);
  };

  const createUsuarioWithAuth = async (
    data: ICreateUsuarioData
  ): Promise<(ICreateUsuarioResponse & { password?: string }) | null> => {
    try {
      setLoading(true);
      setError(null);

      const { usuario, usuarioAlbergue } = data;

      if (!usuario.correo) {
        throw new Error("Correo es requerido para crear cuenta");
      }
      if (!usuario.numero_documento) {
        throw new Error("Número de documento es requerido");
      }

      const password = generatePassword(usuario.numero_documento!);

      if (password.length < 6) {
        throw new Error("El número de documento debe tener al menos 6 dígitos");
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: usuario.correo!,
        password: password,
        options: {
          data: {
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            numero_documento: usuario.numero_documento,
          },
        },
      });

      if (authError) {
        throw authError;
      }
      if (!authData.user) {
        throw new Error("No se pudo crear el usuario en Supabase Auth");
      }

      try {
        const esAlbergue = usuario.tipo_usuario_id
          ? Number(usuario.tipo_usuario_id) === TiposUsuarioEnum.ALBERGUE
          : false;

        const usuarioData = {
          ...usuario,
          auth_id: authData.user.id,
          contrasena: "",
          rol: esAlbergue ? "staff" : "usuario", // ✅ ASIGNACIÓN AUTOMÁTICA DE ROLES
          estado: "activo", // Por defecto activo
        };

        if (esAlbergue && usuarioAlbergue) {
          const { data: result, error } = await supabase.rpc(
            "create_usuario_simple",
            {
              usuario_data: usuarioData,
              albergue_data: usuarioAlbergue.albergue,
            }
          );

          if (error) throw error;
          return { ...result, password };
        } else {
          const { data: result, error } = await supabase
            .from("usuarios")
            .insert([usuarioData])
            .select()
            .single();

          if (error) throw error;
          return { usuario: result, password };
        }
      } catch (error) {
        throw error;
      }
    } catch (err) {
      const error = err as Error;
      const errorMessage = error.message || "Error desconocido";
      
      // Verificar si es error de correo duplicado
      if (errorMessage.includes('usuarios_correo_key')) {
        setError('El correo ya está registrado');
        throw new Error('El correo ya está registrado');
      }
      
      // Verificar si es error de número de documento duplicado
      if (errorMessage.includes('usuarios_numero_documento_key')) {
        setError('El número de documento ya está registrado');
        throw new Error('El número de documento ya está registrado');
      }
      
      // Verificar si es error de límite de tiempo de seguridad
      if (errorMessage.includes('For security purposes, you can only request this after')) {
        setError('Por motivos de seguridad, debes esperar antes de realizar otra solicitud. Intenta nuevamente en unos momentos.');
        throw new Error('Por motivos de seguridad, debes esperar antes de realizar otra solicitud. Intenta nuevamente en unos momentos.');
      }
      
      setError(errorMessage);
      throw error; // Re-lanzar el error para que sea capturado por el componente
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createUsuarioManual,
    createUsuarioWithAuth,
    getUserById,
  };
};
