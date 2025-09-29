"use client";

import { Modal } from "@/components/common/Modal";
import { PageHeader } from "@/components/common/PageHeader";
import { useToast } from "@/contexts/ToastContext";
import { UpdateSeguimientoMutation } from "@/hooks/useSeguimientosAdopcion";
import {
  UpdateSolicitudMutation,
  useSolicitudesAdopcion,
} from "@/hooks/useSolicitudesAdopcion";
import { ISolicitudesSeguimiento } from "@/types/interfaces/solicitudesSeguimiento";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdOutlineTrackChanges } from "react-icons/md";
import { SeguimientoItem } from "./SeguimientoItem";

interface SeguimientoContentProps {
  animalAlbergueId: number;
}

export const SeguimientoContent = ({
  animalAlbergueId,
}: SeguimientoContentProps) => {
  const solicitudesAdopcionOptions = useMemo(
    () => ({
      animal_albergue_id: animalAlbergueId,
    }),
    [animalAlbergueId]
  );

  const { sortedData: solicitudes, loading: loadingSolicitudes } =
    useSolicitudesAdopcion(solicitudesAdopcionOptions);

  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const [showDeleteSeguimientoModal, setShowDeleteSeguimientoModal] =
    useState(false);
  const [showDeleteSolicitudModal, setShowDeleteSolicitudModal] =
    useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: number;
    type: "seguimiento" | "solicitud";
  } | null>(null);

  const handleAddSeguimiento = (solicitudId: number) => {
    router.push(
      `/mascotas/mis-mascotas/seguimiento/${animalAlbergueId}/crear/${solicitudId}`
    );
  };

  const handleEditSeguimiento = (seguimiento: ISolicitudesSeguimiento) => {
    router.push(
      `/mascotas/mis-mascotas/seguimiento/${animalAlbergueId}/editar/${seguimiento.id}`
    );
  };

  const handleDeleteSeguimiento = (seguimientoId: number) => {
    setItemToDelete({ id: seguimientoId, type: "seguimiento" });
    setShowDeleteSeguimientoModal(true);
  };

  const confirmDeleteSeguimiento = async () => {
    if (!itemToDelete || itemToDelete.type !== "seguimiento") return;

    const result = await UpdateSeguimientoMutation({
      seguimientoId: itemToDelete.id,
      seguimientoData: { activo: false },
    });
    if (result.error) {
      showError("Error al Eliminar seguimiento");
    } else {
      showSuccess("Seguimiento Eliminado exitosamente");
    }
    setShowDeleteSeguimientoModal(false);
    setItemToDelete(null);
  };

  const handleDeleteSolicitud = (solicitudId: number) => {
    setItemToDelete({ id: solicitudId, type: "solicitud" });
    setShowDeleteSolicitudModal(true);
  };

  const confirmDeleteSolicitud = async () => {
    if (!itemToDelete || itemToDelete.type !== "solicitud") return;

    const result = await UpdateSolicitudMutation({
      solicitudId: itemToDelete.id,
      solicitudData: { activo: false },
    });
    if (result.error) {
      showError("Error al Eliminar solicitud");
    } else {
      showSuccess("Solicitud Eliminada exitosamente");
    }
    setShowDeleteSolicitudModal(false);
    setItemToDelete(null);
  };

  if (loadingSolicitudes) {
    return <div className="text-center">Cargando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <PageHeader
        redirectPath="/mascotas/mis-mascotas"
        title="Seguimientos del Animal"
        icon={<MdOutlineTrackChanges className="w-8 h-8 text-emerald-600" />}
      />

      {solicitudes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-gray-600">No hay seguimiento aun...</p>
        </div>
      ) : (
        solicitudes.map((solicitud) => (
          <div
            key={solicitud.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Header de la solicitud */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Solicitud de {solicitud.Estado?.nombre}
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    ID: {solicitud.id} • Creada:{" "}
                    {new Date(solicitud.created_at || "").toLocaleDateString(
                      "es-ES"
                    )}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      router.push(
                        `/mascotas/mis-mascotas/editar-solicitud/${solicitud.id}`
                      )
                    }
                    className="cursor-pointer bg-emerald-100 border border-emerald-300 text-emerald-700 p-2 rounded hover:bg-emerald-200 transition-colors"
                    title="Editar Solicitud"
                    aria-label="Editar Solicitud"
                  >
                    <FaEdit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSolicitud(solicitud.id!)}
                    className="cursor-pointer bg-pink-200 text-pink-700 p-2 rounded hover:bg-pink-300 transition-colors"
                    title="Eliminar Solicitud"
                    aria-label="Eliminar Solicitud"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Información del Adoptante */}
              {solicitud.UsuarioAdoptante && (
                <div className="bg-gray-50 rounded p-2">
                  <h3 className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                    Información del {solicitud.Estado?.nombre}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Nombre:</span>
                      <span className="text-gray-900">
                        {solicitud.UsuarioAdoptante.nombre}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        Apellidos:
                      </span>
                      <span className="text-gray-900">
                        {solicitud.UsuarioAdoptante.apellidos}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Correo:</span>
                      <span className="text-gray-900 break-words">
                        {solicitud.UsuarioAdoptante.correo}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        Celular:
                      </span>
                      <span className="text-gray-900">
                        {solicitud.UsuarioAdoptante.celular}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        Municipio:
                      </span>
                      <span className="text-gray-900">
                        {solicitud.UsuarioAdoptante.municipio?.nombre || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        Documento:
                      </span>
                      <span className="text-gray-900">
                        {solicitud.UsuarioAdoptante.numero_documento}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        Tipo Doc:
                      </span>
                      <span className="text-gray-900">
                        {solicitud.UsuarioAdoptante.tipo_documento?.nombre}
                      </span>
                    </div>
                    <div className="flex justify-between md:col-span-2">
                      <span className="font-medium text-gray-700">
                        Dirección:
                      </span>
                      <span className="text-gray-900 break-words">
                        {solicitud.UsuarioAdoptante.direccion}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Observaciones */}
              <div className="bg-emerald-50 rounded p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Observaciones
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {solicitud.observaciones}
                </p>
              </div>

              {/* Imágenes de la solicitud */}
              {solicitud.SolicitudesImagenes &&
                solicitud.SolicitudesImagenes.length > 0 && (
                  <div className="bg-gray-50 rounded p-3">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Imágenes de la Solicitud
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-2">
                      {solicitud.SolicitudesImagenes.map((img) => (
                        <div
                          key={img.id}
                          className="aspect-square relative rounded overflow-hidden border border-white shadow-md"
                        >
                          <Image
                            src={`${img.path_imagen}`}
                            alt="Imagen solicitud"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 12vw"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Seguimientos */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Seguimientos Realizados
                  </h3>
                  <button
                    onClick={() => handleAddSeguimiento(solicitud.id!)}
                    className="cursor-pointer bg-emerald-600 text-white px-3 py-1.5 rounded text-sm hover:bg-emerald-700 transition-colors shadow-sm font-medium"
                  >
                    Agregar Seguimiento
                  </button>
                </div>
                <div className="space-y-2">
                  {solicitud.SolicitudesSeguimientos.map((seg) => (
                    <SeguimientoItem
                      key={seg.id}
                      seg={seg}
                      onEdit={handleEditSeguimiento}
                      onDelete={handleDeleteSeguimiento}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      <Modal
        isOpen={showDeleteSeguimientoModal}
        onClose={() => setShowDeleteSeguimientoModal(false)}
        onConfirm={confirmDeleteSeguimiento}
        type="confirm"
        title="Eliminar Seguimiento"
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      >
        <p>
          ¿Estás seguro de que quieres desactivar este seguimiento? Esta acción
          no se puede deshacer.
        </p>
      </Modal>

      <Modal
        isOpen={showDeleteSolicitudModal}
        onClose={() => setShowDeleteSolicitudModal(false)}
        onConfirm={confirmDeleteSolicitud}
        type="confirm"
        title="Eliminar Solicitud"
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      >
        <p>
          ¿Estás seguro de que quieres eliminar esta solicitud? Esta acción no
          se puede deshacer.
        </p>
      </Modal>
    </div>
  );
};
