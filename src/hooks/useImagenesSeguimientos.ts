import { supabase } from "@/lib/supabase/client";
import {
  deleteImageFromSupabase
} from "@/lib/supabase/upload-image";
import { ISeguimientosImagenes } from "@/types/interfaces/seguimientos_imagenes";
import { useCallback, useEffect, useState } from "react";

export interface IUseImagenesSeguimientosOptions {
  seguimiento_id?: number;
}

export const useImagenesSeguimientos = (
  options: IUseImagenesSeguimientosOptions = {}
) => {
  const [imagenes, setImagenes] = useState<ISeguimientosImagenes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImagenes = useCallback(async () => {
    if (!options.seguimiento_id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("seguimientos_imagenes")
        .select("*")
        .eq("seguimiento_id", options.seguimiento_id)
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;

      setImagenes(data || []);
    } catch (err) {
      console.error("Error fetching imagenes seguimientos:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [options.seguimiento_id]);

  useEffect(() => {
    fetchImagenes();
  }, [fetchImagenes]);

  return {
    refetch: fetchImagenes,
    data: imagenes,
    loading,
    error,
  };
};

export const CreateSeguimientoImagen = async ({
  seguimientoId,
  pathImagen,
}: {
  seguimientoId: number;
  pathImagen: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("seguimientos_imagenes")
      .insert([
        {
          seguimiento_id: seguimientoId,
          path_imagen: pathImagen,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error("Error creating seguimiento imagen:", error);
    return { error };
  }
};

export const DeleteSeguimientoImagen = async ({
  id,
  pathImagen,
  bucket,
}: {
  id: number;
  pathImagen: string;
  bucket: string;
}) => {
  try {

    const deleteResult = await deleteImageFromSupabase(pathImagen, bucket);
    if (!deleteResult.success) {
      return { error: deleteResult.error };
    }

    const { error } = await supabase
      .from("seguimientos_imagenes")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error("Error deleting imagen seguimiento:", err);
    return { error: err instanceof Error ? err.message : "Error desconocido" };
  }
};
