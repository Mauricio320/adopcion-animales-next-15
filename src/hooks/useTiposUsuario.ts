import { supabase } from "@/lib/supabase/client";
import { useCallback, useEffect, useState } from "react";

export interface ITipoUsuario {
  id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
}

export const useTiposUsuario = () => {
  const [tiposUsuario, setTiposUsuario] = useState<ITipoUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTiposUsuario = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("tipos_usuario")
        .select("*")
        .order("nombre", { ascending: true });

      if (supabaseError) throw supabaseError;

      setTiposUsuario(data || []);
    } catch (err) {
      console.error("Error fetching tipos usuario:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTiposUsuario();
  }, [fetchTiposUsuario]);

  const getTipoUsuarioNombre = useCallback((id: number): string => {
    const tipo = tiposUsuario.find(t => t.id === id);
    return tipo?.nombre || "No especificado";
  }, [tiposUsuario]);

  return {
    data: tiposUsuario,
    loading,
    error,
    refetch: fetchTiposUsuario,
    getTipoUsuarioNombre,
  };
};
