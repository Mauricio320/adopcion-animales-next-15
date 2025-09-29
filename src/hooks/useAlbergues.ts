import { supabase } from "@/lib/supabase/client";
import { IAlbergue } from "@/types/interfaces/albergue";

import { useCallback, useEffect, useState } from "react";

interface IUseAlberguesOptions {
  municipio_id?: number;
  tipo?: number;
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

      // Query para albergues
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

      if (options.tipo) {
        query = query.eq("tipo", options.tipo);
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

      const { data: alberguesData, error: alberguesError, count } = await query;
      if (alberguesError) throw alberguesError;

      // Query para counts de animales activos
      const { data: countsData, error: countsError } = await supabase
        .from("animal_albergue")
        .select("albergue_id")
        .eq("activo", true);

      if (countsError) throw countsError;

      // Contar por albergue_id
      const countsMap = (countsData || []).reduce((acc, item) => {
        acc[item.albergue_id] = (acc[item.albergue_id] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      // Agregar counts a los albergues
      const alberguesWithCounts = (alberguesData || []).map((albergue) => ({
        ...albergue,
        animales_activos: countsMap[albergue.id] || 0,
      }));

      setAlbergues(alberguesWithCounts);
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
