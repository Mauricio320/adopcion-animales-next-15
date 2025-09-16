import { supabase } from "@/lib/supabase/client";
import { useCallback, useEffect, useState } from "react";

export interface ITipoDocumento {
  id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
}

export const useTiposDocumento = () => {
  const [tiposDocumento, setTiposDocumento] = useState<ITipoDocumento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTiposDocumento = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("tipos_documento")
        .select("*")
        .order("nombre", { ascending: true });

      if (supabaseError) throw supabaseError;

      setTiposDocumento(data || []);
    } catch (err) {
      console.error("Error fetching tipos documento:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTiposDocumento();
  }, [fetchTiposDocumento]);

  const getTipoDocumentoNombre = useCallback((id: number): string => {
    const tipo = tiposDocumento.find(t => t.id === id);
    return tipo?.nombre || "No especificado";
  }, [tiposDocumento]);

  return {
    data: tiposDocumento,
    loading,
    error,
    refetch: fetchTiposDocumento,
    getTipoDocumentoNombre,
  };
};
