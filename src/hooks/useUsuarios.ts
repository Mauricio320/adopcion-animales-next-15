import { supabase } from "@/lib/supabase/client";
import { RolesForTipoUsuario, TiposUsuarioEnum } from "@/types/enums/enums";
import { IAlbergue } from "@/types/interfaces/albergue";
import { IUsuario } from "@/types/interfaces/usuarios";
import { useCallback, useState } from "react";

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

// Función para actualizar usuario
export const updateUsuario = async (data: {
  usuarioId: number;
  usuario: Partial<IUsuario>;
  albergue?: Partial<IAlbergue>;
}) => {
  try {
    const { usuarioId, usuario, albergue } = data;
    // Actualizar usuario en public.usuarios
    const { data: usuarioActualizado, error: usuarioError } = await supabase
      .from("usuarios")
      .update({
        ...usuario,
        updated_at: new Date().toISOString(),
      })
      .eq("id", usuarioId)
      .select()
      .single();

    if (usuarioError) throw usuarioError;

    const staffRoles = [
      TiposUsuarioEnum.ALBERGUE,
      TiposUsuarioEnum.VETERINARIA,
    ];

    if (albergue && staffRoles.includes(Number(usuario.tipo_usuario_id))) {
      delete albergue.municipio;
      const { error: albergueError } = await supabase
        .from("albergues")
        .update({
          ...albergue,
          updated_at: new Date().toISOString(),
        })
        .eq("id", albergue.id);

      if (albergueError) throw albergueError;
    }

    return usuarioActualizado;
  } catch (error) {
    console.log(error);

    console.error("Error actualizando usuario:", error);
    throw error;
  }
};
// Función para obtener usuario con albergue activo (versión asíncrona)
export const getUsuarioWithActiveAlbergue = async (
  authId: string
): Promise<IUsuario | null> => {
  try {
    const { data, error } = await supabase
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
      .eq("auth_id", authId)
      .eq("usuarios_albergues.es_activo", true)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    if (data) {
      data["usuario_albergue"] = data?.usuario_albergue[0];
    }

    return data || null;
  } catch (error) {
    console.error("Error obteniendo usuario con albergue activo:", error);
    return null;
  }
};

// Función para buscar usuario por documento con información adicional de solicitudes
export const buscarUsuarioPorDocumentoConSolicitudes = async (
  numeroDocumento: string
): Promise<IUsuario | null> => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select(
        `
        *,
        municipio:municipios (*),
        solicitudes_adopcion_apadrinamiento_usuario_adoptante:solicitudes_adopcion_apadrinamiento!usuario_adoptante_id (
          *,
          activo,
          Estado:estado_id (*),
          AnimalAlbergue:animal_albergue_id (
            *,
            Estado:estado_id (*),
            Albergue:albergue_id (
              *,
              municipio:municipios (*)
            ),
            Animal:animales!animal_id (
              nombre,
              imagen_url,
              edad,
              especies (
                nombre
              ),
              sexo_animal (
                nombre
              ),
              tipo_edad_animal (
                nombre
              ),
              municipios (
                nombre
              )
            )
          ),
          UsuarioEntrega:usuario_entrega_id (*)
        )
      `
      )
      .eq("numero_documento", numeroDocumento.trim())
      .order("id", {
        ascending: false,
        referencedTable:
          "solicitudes_adopcion_apadrinamiento_usuario_adoptante",
      })
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data || null;
  } catch (error) {
    console.error(
      "Error buscando usuario por documento con solicitudes:",
      error
    );
    return null;
  }
};
