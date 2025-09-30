import { supabase } from "@/lib/supabase/client";
import { ISeguimientosAdopcion } from "@/types/interfaces/seguimientos_adopcion";
import { useCallback, useEffect, useState } from "react";

export interface IUseSeguimientosOptions {
  solicitud_id?: number;
  usuario_seguimiento_id?: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
}

export const useSeguimientosAdopcion = (options: IUseSeguimientosOptions = {}) => {
  const [seguimientos, setSeguimientos] = useState<ISeguimientosAdopcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchSeguimientos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from("seguimientos_adopcion").select(
        `
          *,
          UsuarioSeguimiento:usuarios!fk_seguimientos_usuario(*),
          SeguimientosImagenes:seguimientos_imagenes(*)
        `,
        { count: "exact" }
      );

      if (options.solicitud_id) {
        query = query.eq("solicitud_id", options.solicitud_id);
      }

      if (options.usuario_seguimiento_id) {
        query = query.eq("usuario_seguimiento_id", options.usuario_seguimiento_id);
      }

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

      setSeguimientos(data || []);
      setTotal(count || 0);
    } catch (err) {
      console.error("Error fetching seguimientos:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchSeguimientos();
  }, [fetchSeguimientos]);

  return {
    refetch: fetchSeguimientos,
    data: seguimientos,
    loading,
    error,
    total,
  };
};

// Función separada para crear seguimiento
export const CreateSeguimientoMutation = async ({
  seguimientoData,
}: {
  seguimientoData: Omit<ISeguimientosAdopcion, 'id' | 'created_at' | 'updated_at'>;
}) => {
  try {
    const { data, error } = await supabase
      .from("seguimientos_adopcion")
      .insert([seguimientoData])
      .select()
      .single();

    if (error) throw error;

    return { data };
  } catch (error) {
    console.error("Error al crear seguimiento:", error);
    return { error };
  }
};

// Función separada para actualizar seguimiento
export const UpdateSeguimientoMutation = async ({
  seguimientoId,
  seguimientoData,
}: {
  seguimientoId: number;
  seguimientoData: Partial<ISeguimientosAdopcion>;
}) => {
  try {
    const { data, error } = await supabase
      .from("seguimientos_adopcion")
      .update(seguimientoData)
      .eq("id", seguimientoId)
      .select()
      .single();

    if (error) throw error;

    return { data };
  } catch (error) {
    console.error("Error al actualizar seguimiento:", error);
    return { error };
  }
};

// Hook para obtener un seguimiento específico por ID
export const useSeguimientoAdopcion = (seguimientoId: string | number | undefined) => {
  const [seguimiento, setSeguimiento] = useState<ISeguimientosAdopcion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeguimiento = useCallback(async () => {
    if (!seguimientoId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("seguimientos_adopcion")
        .select(
          `
            *,
            UsuarioSeguimiento:usuarios!fk_seguimientos_usuario(*),
            SeguimientosImagenes:seguimientos_imagenes(*)
          `
        )
        .eq("id", seguimientoId)
        .single();

      if (supabaseError) throw supabaseError;

      setSeguimiento(data);
    } catch (err) {
      console.error("Error fetching seguimiento:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [seguimientoId]);

  useEffect(() => {
    fetchSeguimiento();
  }, [fetchSeguimiento]);

  return {
    refetch: fetchSeguimiento,
    data: seguimiento,
    loading,
    error,
  };
};

// Función para obtener seguimientos por solicitud_id
export const fetchSeguimientosBySolicitudId = async (solicitudId: number) => {
  try {
    const { data, error } = await supabase
      .from("seguimientos_adopcion")
      .select(
        `
        *,
        UsuarioSeguimiento:usuarios!fk_seguimientos_usuario(*),
        SeguimientosImagenes:seguimientos_imagenes(*)
      `
      )
      .eq("solicitud_id", solicitudId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data: data || [] };
  } catch (error) {
    console.error("Error fetching seguimientos by solicitud_id:", error);
    return { error };
  }
};

// Función separada para eliminar seguimiento
export const DeleteSeguimientoMutation = async ({
  seguimientoId,
}: {
  seguimientoId: number;
}) => {
  try {
    const { error } = await supabase
      .from("seguimientos_adopcion")
      .delete()
      .eq("id", seguimientoId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error al eliminar seguimiento:", error);
    return { error };
  }
};