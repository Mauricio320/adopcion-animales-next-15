"use client";

import { Modal } from "@/components/common/Modal";
import { MultiImageUploader } from "@/components/common/MultiImageUploader";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  CreateSeguimientoImagen,
  DeleteSeguimientoImagen,
  useImagenesSeguimientos,
} from "@/hooks/useImagenesSeguimientos";
import {
  CreateSeguimientoMutation,
  UpdateSeguimientoMutation,
} from "@/hooks/useSeguimientosAdopcion";
import { uploadImageToSupabase } from "@/lib/supabase/upload-image";
import { ISeguimientosAdopcion } from "@/types/interfaces/seguimientos_adopcion";
import Image from "next/image";
import { useState } from "react";
import { FiEdit, FiPlus, FiX } from "react-icons/fi";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{ id: number; path: string } | null>(null);

  const { data: imagenesExistentes, refetch: refetchImagenes } =
    useImagenesSeguimientos({
      seguimiento_id: isEdit ? initialData?.id : undefined,
    });

  const BUCKET_SEGUIMIENTOS = "seguimientos-imagenes";

  const uploadImages = async (seguimientoId: number, images: File[]) => {
    const uploadPromises = images.map(async (imagen, index) => {
      try {
        const fileName = `seguimiento-${seguimientoId}-${index}`;
        const uploadResult = await uploadImageToSupabase(
          imagen,
          fileName,
          BUCKET_SEGUIMIENTOS
        );

        if (uploadResult.success && uploadResult.fileName) {
          const imagenResult = await CreateSeguimientoImagen({
            seguimientoId,
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
    });

    await Promise.all(uploadPromises);
  };

  const handleDeleteImagen = (imagenId: number, pathImagen: string) => {
    setImageToDelete({ id: imagenId, path: pathImagen });
    setShowDeleteModal(true);
  };

  const confirmDeleteImagen = async () => {
    if (!imageToDelete) return;

    const fileName = imageToDelete.path.split("/").pop() as string;
    const result = await DeleteSeguimientoImagen({
      id: imageToDelete.id,
      pathImagen: fileName,
      bucket: BUCKET_SEGUIMIENTOS,
    });
    if (result.error) {
      showError("Error eliminando imagen");
    } else {
      showSuccess("Imagen eliminada exitosamente");
      refetchImagenes();
    }
    setShowDeleteModal(false);
    setImageToDelete(null);
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
        await uploadImages(seguimiento.id, imagenes);
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
    <>
      <PageHeader
        title={`${isEdit ? "Editar" : "Agregar"} Seguimiento`}
        icon={
          isEdit ? (
            <FiEdit className="w-8 h-8 text-emerald-600" />
          ) : (
            <FiPlus className="w-8 h-8 text-emerald-600" />
          )
        }
      />
      <div className="w-full max-w-2xl mx-auto">
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
                    <Image
                      src={`${imagen.path_imagen}`}
                      alt="Imagen del seguimiento"
                      width={300}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg border"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteImagen(imagen.id!, imagen.path_imagen!)
                      }
                      className="absolute cursor-pointer top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      title="Eliminar imagen"
                    >
                      <FiX className="w-4 h-4" />
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
            disabled={loading || observaciones.trim() === ""}
            className="w-full cursor-pointer disabled:cursor-auto bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Guardando..." : isEdit ? "Actualizar" : "Agregar"}{" "}
            Seguimiento
          </button>
        </form>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteImagen}
        type="confirm"
        title="Eliminar Imagen"
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      >
        <p>¿Estás seguro de que quieres eliminar esta imagen? Esta acción no se puede deshacer.</p>
      </Modal>
    </>
  );
};
