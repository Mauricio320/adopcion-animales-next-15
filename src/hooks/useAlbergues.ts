import { supabase } from "@/lib/supabase/client";
import { IAlbergue } from "@/types/interfaces/albergue";

import { useCallback, useEffect, useState } from "react";

interface IUseAlberguesOptions {
  municipio_id?: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

export const useAlbergues = (options: IUseAlberguesOptions = {}) => {
  const [albergues, setAlbergues] = useState<IAlbergue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchAlbergues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from("albergues").select(
        `
          *,
          municipio:municipios(*)
        `,
        { count: "exact" }
      );

      // Filtros opcionales
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

      // Ordenamiento
      const orderBy = options.orderBy || "nombre";
      const orderDirection =
        options.orderDirection === "asc"
          ? { ascending: true }
          : { ascending: false };
      query = query.order(orderBy, orderDirection);

      const { data, error: supabaseError, count } = await query;

      if (supabaseError) throw supabaseError;

      setAlbergues(data || []);
      setTotal(count || 0);
    } catch (err) {
      console.error("Error fetching albergues:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchAlbergues();
  }, [fetchAlbergues]);

  return {
    data: albergues,
    loading,
    error,
    total,
    refetch: fetchAlbergues,
  };
};
