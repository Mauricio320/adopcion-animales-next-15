import { supabase } from "@/lib/supabase/client";
import { useCallback, useEffect, useState } from "react";

export interface ITipoPersona {
  id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
}

export const useTiposPersona = () => {
  const [tiposPersona, setTiposPersona] = useState<ITipoPersona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTiposPersona = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("tipos_persona")
        .select("*")
        .order("nombre", { ascending: true });

      if (supabaseError) throw supabaseError;

      setTiposPersona(data || []);
    } catch (err) {
      console.error("Error fetching tipos persona:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTiposPersona();
  }, [fetchTiposPersona]);

  const getTipoPersonaNombre = useCallback((id: number): string => {
    const tipo = tiposPersona.find(t => t.id === id);
    return tipo?.nombre || "No especificado";
  }, [tiposPersona]);

  return {
    data: tiposPersona,
    loading,
    error,
    refetch: fetchTiposPersona,
    getTipoPersonaNombre,
  };
};
