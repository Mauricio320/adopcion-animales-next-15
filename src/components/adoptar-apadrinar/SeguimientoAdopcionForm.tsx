"use client";

import { MultiImageUploader } from "@/components/common/MultiImageUploader";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  useImagenesSeguimientos,
  CreateSeguimientoImagen,
  DeleteSeguimientoImagen,
} from "@/hooks/useImagenesSeguimientos";
import {
  CreateSeguimientoMutation,
  UpdateSeguimientoMutation,
} from "@/hooks/useSeguimientosAdopcion";
import { uploadImageToSupabase } from "@/lib/supabase/upload-image";
import { ISeguimientosAdopcion } from "@/types/interfaces/seguimientos_adopcion";
import { useEffect, useState } from "react";

interface SeguimientoAdopcionFormProps {
  solicitudId: number;
  onSuccess?: () => void;
  initialData?: ISeguimientosAdopcion;
  isEdit?: boolean;
}

export const SeguimientoAdopcionForm = ({
  solicitudId,
  onSuccess,
  initialData,
  isEdit = false,
}: SeguimientoAdopcionFormProps) => {
  const { showSuccess, showError } = useToast();
  const { user } = useAuthContext();

  const [observaciones, setObservaciones] = useState(
    initialData?.observaciones || ""
  );
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Hook para gestionar imágenes existentes (solo en modo edición)
  const { data: imagenesExistentes, refetch: refetchImagenes } =
    useImagenesSeguimientos({
      seguimiento_id: isEdit ? initialData?.id : undefined,
    });

  const BUCKET_SEGUIMIENTOS = "seguimientos-imagenes";

  const handleDeleteImagen = async (imagenId: number, pathImagen: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta imagen?")) return;
    const fileName = pathImagen.split("/").pop() as string;
    const result = await DeleteSeguimientoImagen({
      id: imagenId,
      pathImagen: fileName,
      bucket: BUCKET_SEGUIMIENTOS,
    });
    if (result.error) {
      showError("Error eliminando imagen");
    } else {
      showSuccess("Imagen eliminada exitosamente");
      // Refrescar la lista de imágenes
      refetchImagenes();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const seguimientoData = {
        solicitud_id: solicitudId,
        observaciones: observaciones.trim() || undefined,
        fecha_seguimiento: new Date().toISOString(),
        usuario_seguimiento_id: user.usuario?.id,
      };

      let seguimiento;
      if (isEdit && initialData?.id) {
        const result = await UpdateSeguimientoMutation({
          seguimientoId: initialData.id,
          seguimientoData,
        });
        if (result.error) throw new Error("Error actualizando seguimiento");
        seguimiento = result.data;
      } else {
        const result = await CreateSeguimientoMutation({ seguimientoData });
        if (result.error) throw new Error("Error creando seguimiento");
        seguimiento = result.data;
      }

      // Subir imágenes si hay
      if (imagenes.length > 0 && seguimiento?.id) {
        for (const imagen of imagenes) {
          try {
            const fileName = `seguimiento-${seguimiento.id}`;
            const uploadResult = await uploadImageToSupabase(
              imagen,
              fileName,
              BUCKET_SEGUIMIENTOS
            );

            if (uploadResult.success && uploadResult.fileName) {
              const imagenResult = await CreateSeguimientoImagen({
                seguimientoId: seguimiento.id,
                pathImagen: uploadResult.url,
              });
              if (imagenResult.error) {
                console.error(
                  "Error creando registro de imagen:",
                  imagenResult.error
                );
              }
            }
          } catch (error) {
            console.error("Error subiendo imagen:", error);
            // No fallar todo el proceso por una imagen
          }
        }
      }

      showSuccess(
        isEdit
          ? "Seguimiento actualizado exitosamente"
          : "Seguimiento creado exitosamente"
      );
      onSuccess?.();
    } catch (error) {
      console.error("Error guardando seguimiento:", error);
      showError(`Error ${isEdit ? "actualizando" : "creando"} seguimiento`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">
        {isEdit ? "Editar" : "Agregar"} Seguimiento
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="observaciones"
            className="block text-sm font-medium text-gray-700"
          >
            Observaciones
          </label>
          <textarea
            id="observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Observaciones del seguimiento..."
            rows={4}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {isEdit && imagenesExistentes && imagenesExistentes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imágenes Existentes
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imagenesExistentes.map((imagen) => (
                <div key={imagen.id} className="relative">
                  <img
                    src={`${imagen.path_imagen}`}
                    alt="Imagen del seguimiento"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteImagen(imagen.id!, imagen.path_imagen!)
                    }
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    title="Eliminar imagen"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {isEdit ? "Agregar Nuevas Imágenes" : "Imágenes"}
          </label>
          <div className="mt-1">
            <MultiImageUploader onImagesChange={setImagenes} maxImages={5} />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Guardando..." : isEdit ? "Actualizar" : "Agregar"}{" "}
          Seguimiento
        </button>
      </form>
    </div>
  );
};
