"use client";

import { useState, useEffect } from "react";
import { MultiImageUploader } from "@/components/common/MultiImageUploader";
import {
  CreateSolicitudMutation,
  UpdateSolicitudMutation,
} from "@/hooks/useSolicitudesAdopcion";
import {
  useImagenesSolicitudes,
  DeleteSolicitudImagen,
} from "@/hooks/useImagenesSolicitudes";
import { buscarUsuarioPorDocumento } from "@/hooks/useUsuarios";
import { UpdateAnimalAlbergueEstadoMutation } from "@/hooks/useAnimalAlbergue";
import { uploadImageToSupabase } from "@/lib/supabase/upload-image";
import { supabase } from "@/lib/supabase/client";
import { ISolicitudesAdopcionApadrinamiento } from "@/types/interfaces/solicitudes_adopcion_apadrinamiento";
import { IUsuario } from "@/types/interfaces/usuarios";
import { useToast } from "@/contexts/ToastContext";
import { useAuthContext } from "@/contexts/AuthContext";

// Función helper para crear registro de imagen
const createSolicitudImagen = async (
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

interface SolicitudAdopcionFormProps {
  animalAlbergueId: number;
  estadoId: number; // 1 para adopción, 2 para apadrinamiento
  onSuccess?: () => void;
  initialData?: ISolicitudesAdopcionApadrinamiento;
  isEdit?: boolean;
}

export const SolicitudAdopcionForm = ({
  animalAlbergueId,
  estadoId,
  onSuccess,
  initialData,
  isEdit = false,
}: SolicitudAdopcionFormProps) => {
  const { user } = useAuthContext();
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [usuarioAdoptante, setUsuarioAdoptante] = useState<IUsuario | null>(
    null
  );
  const [observaciones, setObservaciones] = useState(
    initialData?.observaciones || ""
  );
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [buscandoUsuario, setBuscandoUsuario] = useState(false);
  const [usuarioValidado, setUsuarioValidado] = useState(false);

  // Las funciones de mutación están importadas directamente
  const { showSuccess, showError } = useToast();

  // Hook para gestionar imágenes existentes (solo en modo edición)
  const { data: imagenesExistentes, refetch: refetchImagenes } =
    useImagenesSolicitudes({
      solicitud_id: isEdit ? initialData?.id : undefined,
    });

  // Bucket para imágenes de solicitudes
  const BUCKET_SOLICITUDES = "solicitudes-imagenes";

  const handleDeleteImagen = async (imagenId: number, pathImagen: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta imagen?")) return;
    const fileName = pathImagen.split("/").pop() as string;
    const result = await DeleteSolicitudImagen({
      id: imagenId,
      pathImagen: fileName,
      bucket: BUCKET_SOLICITUDES,
    });
    if (result.error) {
      showError("Error eliminando imagen");
    } else {
      showSuccess("Imagen eliminada exitosamente");
      // Refrescar la lista de imágenes
      refetchImagenes();
    }
  };

  useEffect(() => {
    if (initialData?.UsuarioAdoptante) {
      setUsuarioAdoptante(initialData.UsuarioAdoptante);
      setNumeroDocumento(initialData.UsuarioAdoptante.numero_documento || "");
      setUsuarioValidado(true);
    }
  }, [initialData]);

  // Resetear validación cuando cambie el número de documento
  useEffect(() => {
    if (numeroDocumento !== initialData?.UsuarioAdoptante?.numero_documento) {
      setUsuarioValidado(false);
      setUsuarioAdoptante(null);
    }
  }, [numeroDocumento, initialData?.UsuarioAdoptante?.numero_documento]);

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

    // Verificar que el usuario esté validado
    if (!usuarioValidado || !usuarioAdoptante) {
      showError("Debe buscar y validar al adoptante antes de guardar");
      return;
    }

    setLoading(true);

    try {
      const solicitudData = {
        estado_id: estadoId,
        animal_albergue_id: animalAlbergueId,
        usuario_adoptante_id: usuarioAdoptante.id,
        observaciones: observaciones.trim() || undefined,
        usuario_entrega_id: user.usuario?.id, // Usuario que crea la solicitud
      };

      let solicitud;
      if (isEdit && initialData?.id) {
        const result = await UpdateSolicitudMutation({
          solicitudId: initialData.id,
          solicitudData,
        });
        if (result.error) throw new Error("Error actualizando solicitud");
        solicitud = result.data;
      } else {
        const result = await CreateSolicitudMutation({ solicitudData });
        if (result.error) throw new Error("Error creando solicitud");
        solicitud = result.data;

        // Actualizar estado del animal_albergue
        const updateResult = await UpdateAnimalAlbergueEstadoMutation({
          animalAlbergueId,
          body: { estado_id: estadoId },
        });
        if (updateResult.error)
          throw new Error("Error actualizando estado del animal");
      }

      // Subir imágenes si hay
      if (imagenes.length > 0 && solicitud?.id) {
        for (const imagen of imagenes) {
          try {
            const fileName = `solicitud-${solicitud.id}`;
            const uploadResult = await uploadImageToSupabase(
              imagen,
              fileName,
              BUCKET_SOLICITUDES
            );

            if (uploadResult.success && uploadResult.fileName) {
              // Crear registro en solicitudes_imagenes usando función helper
              const imagenResult = await createSolicitudImagen(
                solicitud.id,
                uploadResult.url
              );
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
          ? "Solicitud actualizada exitosamente"
          : "Solicitud creada exitosamente"
      );
      onSuccess?.();
    } catch (error) {
      console.error("Error guardando solicitud:", error);
      showError(`Error ${isEdit ? "actualizando" : "creando"} solicitud`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {isEdit ? "Editar" : "Crear"} Solicitud de{" "}
        {estadoId === 1 ? "Adopción" : "Apadrinamiento"}
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        El usuario que va a adoptar debe estar registrado previamente en el
        sistema. Busque al adoptante por número de documento antes de continuar.
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {buscandoUsuario ? "Validando..." : "Validar Adoptante"}
            </button>
          </div>
          {usuarioAdoptante && usuarioValidado && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
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
                  <img
                    src={`${imagen.path_imagen}`}
                    alt="Imagen de la solicitud"
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
          disabled={loading || (!usuarioValidado && !isEdit)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"} Solicitud
        </button>
      </form>
    </div>
  );
};
