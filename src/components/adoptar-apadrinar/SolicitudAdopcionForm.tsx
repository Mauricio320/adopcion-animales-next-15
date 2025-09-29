"use client";

import { Modal } from "@/components/common/Modal";
import { MultiImageUploader } from "@/components/common/MultiImageUploader";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBlockUI } from "@/contexts/BlockUIContext";
import { useToast } from "@/contexts/ToastContext";
import { UpdateAnimalAlbergueEstadoMutation } from "@/hooks/useAnimalAlbergue";
import {
  CreateSolicitudImagen,
  DeleteSolicitudImagen,
  useImagenesSolicitudes,
} from "@/hooks/useImagenesSolicitudes";
import {
  CreateSolicitudMutation,
  UpdateSolicitudMutation,
} from "@/hooks/useSolicitudesAdopcion";
import { buscarUsuarioPorDocumento } from "@/hooks/useUsuarios";
import { uploadImageToSupabase } from "@/lib/supabase/upload-image";
import { EstadoAnimalEnum } from "@/types/enums/enums";
import { ISolicitudesAdopcionApadrinamiento } from "@/types/interfaces/solicitudes_adopcion_apadrinamiento";
import { IUsuario } from "@/types/interfaces/usuarios";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  IoAddCircle,
  IoCheckmarkCircle,
  IoClose,
  IoCreate,
} from "react-icons/io5";

interface SolicitudAdopcionFormProps {
  initialData?: ISolicitudesAdopcionApadrinamiento;
  estadoId: EstadoAnimalEnum;
  animalAlbergueId: number;
  onSuccess?: () => void;
  redirectPath?: string;
  isEdit?: boolean;
}

export const SolicitudAdopcionForm = ({
  animalAlbergueId,
  isEdit = false,
  redirectPath,
  initialData,
  onSuccess,
  estadoId,
}: SolicitudAdopcionFormProps) => {
  const { user } = useAuthContext();
  const { showBlockUI, hideBlockUI } = useBlockUI();
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [usuarioAdoptante, setUsuarioAdoptante] = useState<IUsuario | null>(
    null
  );
  const [observaciones, setObservaciones] = useState(
    initialData?.observaciones || ""
  );
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [buscandoUsuario, setBuscandoUsuario] = useState(false);
  const [usuarioValidado, setUsuarioValidado] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imagenToDelete, setImagenToDelete] = useState<{
    id: number;
    path: string;
  } | null>(null);

  const { showSuccess, showError } = useToast();

  const { data: imagenesExistentes, refetch: refetchImagenes } =
    useImagenesSolicitudes({
      solicitud_id: isEdit ? initialData?.id : undefined,
    });

  const BUCKET_SOLICITUDES = "solicitudes-imagenes";

  useEffect(() => {
    if (initialData?.UsuarioAdoptante) {
      setUsuarioAdoptante(initialData.UsuarioAdoptante);
      setNumeroDocumento(initialData.UsuarioAdoptante.numero_documento || "");
      setUsuarioValidado(true);
    }
  }, [initialData]);

  useEffect(() => {
    if (numeroDocumento !== initialData?.UsuarioAdoptante?.numero_documento) {
      setUsuarioValidado(false);
      setUsuarioAdoptante(null);
    }
  }, [numeroDocumento, initialData?.UsuarioAdoptante?.numero_documento]);

  const uploadSolicitudImages = async (images: File[], solicitudId: number) => {
    if (images.length === 0) return { success: true, results: [] };

    const uploadPromises = images.map(async (imagen) => {
      try {
        const fileName = `solicitud-${solicitudId}`;
        const uploadResult = await uploadImageToSupabase(
          imagen,
          fileName,
          BUCKET_SOLICITUDES
        );

        if (uploadResult.success && uploadResult.fileName) {
          await CreateSolicitudImagen(solicitudId, uploadResult.url);
          return { success: true, fileName: uploadResult.fileName };
        } else {
          return { success: false, error: uploadResult.error, fileName };
        }
      } catch (error) {
        console.error("Error subiendo imagen:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        };
      }
    });

    const results = await Promise.all(uploadPromises);
    const hasErrors = results.some((result) => !result.success);

    return {
      success: !hasErrors,
      results,
      totalUploaded: results.filter((r) => r.success).length,
      totalErrors: results.filter((r) => !r.success).length,
    };
  };

  const handleDeleteImagen = (imagenId: number, pathImagen: string) => {
    setImagenToDelete({ id: imagenId, path: pathImagen });
    setShowDeleteModal(true);
  };

  const confirmDeleteImagen = async () => {
    if (!imagenToDelete) return;

    const fileName = imagenToDelete.path.split("/").pop() as string;
    const result = await DeleteSolicitudImagen({
      id: imagenToDelete.id,
      pathImagen: fileName,
      bucket: BUCKET_SOLICITUDES,
    });

    if (result.error) {
      showError("Error eliminando imagen");
    } else {
      showSuccess("Imagen eliminada exitosamente");
      refetchImagenes();
    }

    setShowDeleteModal(false);
    setImagenToDelete(null);
  };

  const buscarUsuario = async () => {
    if (!numeroDocumento.trim()) return;

    setBuscandoUsuario(true);
    try {
      const usuario = await buscarUsuarioPorDocumento(numeroDocumento.trim());

      if (usuario) {
        setUsuarioAdoptante(usuario);
        setUsuarioValidado(true);
        showSuccess("Usuario encontrado y validado");
      } else {
        setUsuarioAdoptante(null);
        setUsuarioValidado(false);
        showError(
          "Usuario no encontrado. El adoptante debe estar registrado previamente en el sistema."
        );
      }
    } catch (error) {
      console.error("Error buscando usuario:", error);
      showError("Error al buscar usuario");
      setUsuarioValidado(false);
    } finally {
      setBuscandoUsuario(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuarioValidado || !usuarioAdoptante) {
      return showError("Debe buscar y validar al adoptante antes de guardar");
    }

    showBlockUI("Guardando solicitud...");

    try {
      const solicitudData = {
        estado_id: estadoId,
        animal_albergue_id: animalAlbergueId,
        usuario_adoptante_id: usuarioAdoptante.id,
        observaciones: observaciones.trim() || undefined,
        usuario_entrega_id: user.usuario?.id,
        SolicitudesSeguimientos: [],
      };

      let solicitud;
      if (isEdit && initialData?.id) {
        const result = await UpdateSolicitudMutation({
          solicitudId: initialData.id,
          solicitudData,
        });
        if (result.error) showError("Error actualizando solicitud");
        solicitud = result.data;
      } else {
        const result = await CreateSolicitudMutation({ solicitudData });
        if (result.error) showError("Error creando solicitud");
        solicitud = result.data;

        const updateResult = await UpdateAnimalAlbergueEstadoMutation({
          animalAlbergueId,
          body: { estado_id: estadoId },
        });
        if (updateResult.error) {
          showError("Error actualizando estado del animal");
        }
      }

      if (imagenes.length > 0 && solicitud?.id) {
        await uploadSolicitudImages(imagenes, solicitud.id);
      }

      const textSuccess = isEdit
        ? "Solicitud actualizada exitosamente"
        : "Solicitud creada exitosamente";

      showSuccess(textSuccess);
      onSuccess?.();
    } catch (error) {
      console.error("Error guardando solicitud:", error);
      showError(`Error ${isEdit ? "actualizando" : "creando"} solicitud`);
    } finally {
      hideBlockUI();
    }
  };

  const pageTitle = `${isEdit ? "Editar" : "Crear"} ${
    estadoId === 1 ? "adopción" : "apadrinamiento"
  }`;

  const pageIcon = isEdit ? (
    <IoCreate className="w-8 h-8 text-emerald-600" />
  ) : (
    <IoAddCircle className="w-8 h-8 text-emerald-600" />
  );

  return (
    <>
      <PageHeader
        redirectPath={redirectPath}
        title={pageTitle}
        icon={pageIcon}
      />
      <div className="w-full max-w-2xl mx-auto">
        <p className="text-sm text-gray-600 mb-6">
          El usuario que va a adoptar debe estar registrado previamente en el
          sistema. Busque al adoptante por número de documento antes de
          continuar.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="numeroDocumento"
              className="block text-sm font-medium text-gray-700"
            >
              Número de Documento del Adoptante
            </label>
            <div className="flex gap-2 mt-1">
              <input
                id="numeroDocumento"
                type="text"
                value={numeroDocumento}
                onChange={(e) => setNumeroDocumento(e.target.value)}
                placeholder="Ingrese número de documento"
                required
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={buscarUsuario}
                disabled={buscandoUsuario || !numeroDocumento.trim()}
                className="px-4 py-2 cursor-pointer disabled:cursor-auto bg-emerald-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {buscandoUsuario ? "Validando..." : "Validar Adoptante"}
              </button>
            </div>
            {usuarioAdoptante && usuarioValidado && (
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <IoCheckmarkCircle className="w-4 h-4 mr-1" />
                Adoptante validado: {usuarioAdoptante.nombre}{" "}
                {usuarioAdoptante.apellidos}
              </p>
            )}
            {numeroDocumento && !usuarioValidado && !buscandoUsuario && (
              <p className="text-sm text-red-600 mt-1">
                Debe validar al adoptante antes de guardar
              </p>
            )}
          </div>

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
              placeholder="Observaciones adicionales..."
              rows={4}
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
                      alt="Imagen de la solicitud"
                      width={400}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg border"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteImagen(imagen.id!, imagen.path_imagen!)
                      }
                      className="absolute cursor-pointer disabled:cursor-auto top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      title="Eliminar imagen"
                    >
                      <IoClose className="w-4 h-4" />
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
            disabled={
              (!usuarioValidado && !isEdit) ||
              observaciones.trim() === "" ||
              imagenes.length === 0
            }
            className="w-full cursor-pointer disabled:cursor-auto bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isEdit ? "Actualizar" : "Crear"} Solicitud
          </button>
        </form>

        {/* Modal de confirmación para eliminar imagen */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          type="confirm"
          title="Confirmar eliminación"
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={confirmDeleteImagen}
          size="sm"
        >
          <p className="text-gray-700">
            ¿Estás seguro de que quieres eliminar esta imagen? Esta acción no se
            puede deshacer.
          </p>
        </Modal>
      </div>
    </>
  );
};
