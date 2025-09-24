import { supabase } from "@/lib/supabase/client";
import { IUsuario } from "@/types/interfaces/usuarios";
import { IAlbergue } from "@/types/interfaces/albergue";
import { useCallback, useState } from "react";
import { RolesForTipoUsuario } from "@/types/enums/enums";

export interface IUseUsuariosOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
}

export const useUsuarios = (options: IUseUsuariosOptions = {}) => {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from("usuarios").select("*", { count: "exact" });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        );
      }

      const orderBy = options.orderBy || "created_at";
      query = query.order(orderBy, { ascending: false });

      const { data, error: supabaseError, count } = await query;

      if (supabaseError) throw supabaseError;

      setUsuarios(data || []);
      setTotal(count || 0);
    } catch (err) {
      console.error("Error fetching usuarios:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [options]);

  return {
    refetch: fetchUsuarios,
    data: usuarios,
    loading,
    error,
    total,
  };
};

// Función para buscar usuario por documento
export const buscarUsuarioPorDocumento = async (
  numeroDocumento: string
): Promise<IUsuario | null> => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("numero_documento", numeroDocumento.trim())
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data || null;
  } catch (error) {
    console.error("Error buscando usuario por documento:", error);
    return null;
  }
};

// Función para crear usuario con autenticación
export const createUsuarioWithAuth = async (data: {
  usuario: Partial<IUsuario>;
  usuarioAlbergue?: {
    es_activo: boolean;
    es_propietario: boolean;
    albergue: Partial<IAlbergue>;
  };
}) => {
  try {
    const { usuario, usuarioAlbergue } = data;

    // Crear usuario en auth.users
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: usuario.correo!,
      password: usuario.numero_documento!.slice(-6), // Últimos 6 dígitos del documento
    });

    if (authError) throw authError;

    // Crear usuario en public.usuarios
    const usuarioData = {
      ...usuario,
      auth_id: authData.user?.id,
      password: usuario.numero_documento!.slice(-6),
      estado: "activo",
      rol: RolesForTipoUsuario[
        usuario.tipo_usuario_id as keyof typeof RolesForTipoUsuario
      ],
      email_confirmed: false,
    };

    const { data: usuarioCreado, error: usuarioError } = await supabase
      .from("usuarios")
      .insert([usuarioData])
      .select()
      .single();

    if (usuarioError) throw usuarioError;

    // Si es albergue, crear albergue y relación
    if (usuarioAlbergue) {
      const { data: albergue, error: albergueError } = await supabase
        .from("albergues")
        .insert([usuarioAlbergue.albergue])
        .select()
        .single();

      if (albergueError) throw albergueError;

      // Crear relación usuario-albergue
      await supabase.from("usuarios_albergues").insert([
        {
          usuario_id: usuarioCreado.id,
          albergue_id: albergue.id,
          es_activo: usuarioAlbergue.es_activo,
          es_propietario: usuarioAlbergue.es_propietario,
        },
      ]);
    }

    return usuarioCreado;
  } catch (error) {
    console.error("Error creando usuario con auth:", error);
    throw error;
  }
};
