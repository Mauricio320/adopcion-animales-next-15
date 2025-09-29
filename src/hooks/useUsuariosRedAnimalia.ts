import { supabase } from "@/lib/supabase/client";
import { IUsuario } from "@/types/interfaces/usuarios";
import { useCallback, useEffect, useState } from "react";
import { RolesEnum } from "@/types/enums/enums";

export interface IUseUsuariosRedAnimaliaOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  municipio_id?: number;
}

export const useUsuariosRedAnimalia = (
  options: IUseUsuariosRedAnimaliaOptions = {}
) => {
  const [data, setData] = useState<IUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("usuarios")
        .select(
          `
          *,
          municipio:municipios(*),
          tipo_usuario:tipos_usuario(*),
          tipo_persona:tipos_persona(*),
          tipo_documento:tipos_documento(*)
        `,
          { count: "exact" }
        )
        .eq("rol", RolesEnum.RED_ANIMALIA);
      // .eq("estado", "activo");

      // Filtro por municipio si se especifica
      if (options.municipio_id) {
        query = query.eq("municipio_id", options.municipio_id);
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

      setData(data || []);
      setTotal(count || 0);
    } catch (err) {
      console.error("Error fetching usuarios red animalia:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    refetch,
    loading,
    data,
    error,
    total,
  };
};
