import { supabase } from "@/lib/supabase/client";
import { ISolicitudesImagenes } from "@/types/interfaces/solicitudes_imagenes";
import {
  uploadImageToSupabase,
  deleteImageFromSupabase,
} from "@/lib/supabase/upload-image";
import { useCallback, useEffect, useState } from "react";

export interface IUseImagenesSolicitudesOptions {
  solicitud_id?: number;
}

export const useImagenesSolicitudes = (
  options: IUseImagenesSolicitudesOptions = {}
) => {
  const [imagenes, setImagenes] = useState<ISolicitudesImagenes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImagenes = useCallback(async () => {
    if (!options.solicitud_id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("solicitudes_imagenes")
        .select("*")
        .eq("solicitud_id", options.solicitud_id)
        .order("created_at", { ascending: false });

      if (supabaseError) throw supabaseError;

      setImagenes(data || []);
    } catch (err) {
      console.error("Error fetching imagenes solicitudes:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [options.solicitud_id]);

  useEffect(() => {
    fetchImagenes();
  }, [fetchImagenes]);

  const uploadImagen = useCallback(
    async (file: File, bucket: string) => {
      if (!options.solicitud_id) return { error: "Solicitud ID requerido" };

      try {
        const fileName = `solicitud-${options.solicitud_id}`;
        const uploadResult = await uploadImageToSupabase(
          file,
          fileName,
          bucket
        );

        if (!uploadResult.success) {
          return { error: uploadResult.error };
        }

        const { data, error } = await supabase
          .from("solicitudes_imagenes")
          .insert([
            {
              solicitud_id: options.solicitud_id,
              path_imagen: uploadResult.fileName,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        setImagenes((prev) => [data, ...prev]);
        return { data };
      } catch (err) {
        console.error("Error uploading imagen solicitud:", err);
        return {
          error: err instanceof Error ? err.message : "Error desconocido",
        };
      }
    },
    [options.solicitud_id]
  );

  const deleteImagen = useCallback(
    async (id: number, pathImagen: string, bucket: string) => {
      try {
        // Eliminar de Supabase Storage
        const deleteResult = await deleteImageFromSupabase(pathImagen, bucket);
        if (!deleteResult.success) {
          return { error: deleteResult.error };
        }

        // Eliminar de DB
        const { error } = await supabase
          .from("solicitudes_imagenes")
          .delete()
          .eq("id", id);

        if (error) throw error;

        setImagenes((prev) => prev.filter((img) => img.id !== id));
        return { success: true };
      } catch (err) {
        console.error("Error deleting imagen solicitud:", err);
        return {
          error: err instanceof Error ? err.message : "Error desconocido",
        };
      }
    },
    []
  );

  const createImagen = useCallback(
    async (solicitudId: number, pathImagen: string) => {
      try {
        const { data, error } = await supabase
          .from("solicitudes_imagenes")
          .insert([
            {
              solicitud_id: solicitudId,
              path_imagen: pathImagen,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        // Si estamos en la solicitud correcta, actualizar el estado local
        if (options.solicitud_id === solicitudId) {
          setImagenes((prev) => [data, ...prev]);
        }

        return { data };
      } catch (err) {
        console.error("Error creating imagen solicitud:", err);
        return {
          error: err instanceof Error ? err.message : "Error desconocido",
        };
      }
    },
    [options.solicitud_id]
  );

  return {
    refetch: fetchImagenes,
    data: imagenes,
    loading,
    error,
    uploadImagen,
    deleteImagen,
    createImagen,
  };
};

export const DeleteSolicitudImagen = async ({
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
    if (!deleteResult.success) return { error: deleteResult.error };

    const { error } = await supabase
      .from("solicitudes_imagenes")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error("Error deleting imagen solicitud:", err);
    return { error: err instanceof Error ? err.message : "Error desconocido" };
  }
};

export const CreateSolicitudImagen = async (
  solicitudId: number,
  pathImagen: string
) => {
  try {
    const { data, error } = await supabase
      .from("solicitudes_imagenes")
      .insert([
        {
          solicitud_id: solicitudId,
          path_imagen: pathImagen,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error("Error creating solicitud imagen:", error);
    return { error };
  }
};
