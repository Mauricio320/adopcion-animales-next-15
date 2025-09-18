"use client";

import RouteGuard from "@/components/auth/RouteGuard";
import { ContainerPage } from "@/components/common/ContainerPage";
import { useSolicitudesAdopcion } from "@/hooks/useSolicitudesAdopcion";
import { RolesEnum } from "@/types/enums/enums";
import { use, useMemo } from "react";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { ISeguimientosAdopcion } from "@/types/interfaces/seguimientos_adopcion";
import { UpdateSeguimientoMutation } from "@/hooks/useSeguimientosAdopcion";
import { UpdateSolicitudMutation } from "@/hooks/useSolicitudesAdopcion";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

export default function SeguimientoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const animalAlbergueId = parseInt(id);

  const solicitudesAdopcionOptions = useMemo(
    () => ({
      animal_albergue_id: animalAlbergueId,
    }),
    [animalAlbergueId]
  );

  const { data: solicitudes, loading: loadingSolicitudes } =
    useSolicitudesAdopcion(solicitudesAdopcionOptions);

  const [allSeguimientos, setAllSeguimientos] = useState<{
    [key: number]: ISeguimientosAdopcion[];
  }>({});
  const [loadingSeguimientos, setLoadingSeguimientos] = useState(false);

  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const loadAllSeguimientos = useCallback(async () => {
    setLoadingSeguimientos(true);
    const seguimientosMap: { [key: number]: ISeguimientosAdopcion[] } = {};

    for (const solicitud of solicitudes) {
      if (solicitud.id) {
        const { data, error } = await supabase
          .from("seguimientos_adopcion")
          .select(
            `
            *,
            UsuarioSeguimiento:usuarios!fk_seguimientos_usuario(*),
            SeguimientosImagenes:seguimientos_imagenes(*)
          `
          )
          .eq("solicitud_id", solicitud.id)
          .order("created_at", { ascending: false });

        if (!error) {
          seguimientosMap[solicitud.id] = data || [];
        }
      }
    }

    setAllSeguimientos(seguimientosMap);
    setLoadingSeguimientos(false);
  }, [solicitudes]);

  // Cargar seguimientos para todas las solicitudes
  useEffect(() => {
    if (solicitudes.length > 0) {
      loadAllSeguimientos();
    }
  }, [solicitudes, loadAllSeguimientos]);

  const handleAddSeguimiento = (solicitudId: number) => {
    router.push(
      `/mascotas/mis-mascotas/seguimiento/${animalAlbergueId}/crear/${solicitudId}`
    );
  };

  const handleEditSeguimiento = (seguimiento: ISeguimientosAdopcion) => {
    router.push(
      `/mascotas/mis-mascotas/seguimiento/${animalAlbergueId}/editar/${seguimiento.id}`
    );
  };

  const handleDeleteSeguimiento = async (seguimientoId: number) => {
    if (!confirm("¿Estás seguro de que quieres desactivar este seguimiento?"))
      return;

    const result = await UpdateSeguimientoMutation({
      seguimientoId,
      seguimientoData: { activo: false },
    });
    if (result.error) {
      showError("Error al Eliminar seguimiento");
    } else {
      showSuccess("Seguimiento Eliminado exitosamente");
      loadAllSeguimientos(); // Recargar seguimientos
    }
  };

  const handleDeleteSolicitud = async (solicitudId: number) => {
    if (!confirm("¿Estás seguro de que quieres Eliminar esta solicitud?"))
      return;

    const result = await UpdateSolicitudMutation({
      solicitudId,
      solicitudData: { activo: false },
    });
    if (result.error) {
      showError("Error al Eliminar solicitud");
    } else {
      showSuccess("Solicitud Eliminada exitosamente");
      loadAllSeguimientos();
    }
  };

  if (loadingSolicitudes) {
    return (
      <RouteGuard allowedRoles={[RolesEnum.STAFF]}>
        <ContainerPage>
          <div className="text-center">Cargando...</div>
        </ContainerPage>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF]}>
      <ContainerPage>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Seguimientos del Animal</h1>

          {solicitudes.length === 0 ? (
            <p>No hay solicitudes para este animal.</p>
          ) : (
            solicitudes.map((solicitud) => (
              <div
                key={solicitud.id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Solicitud de {solicitud.Estado?.nombre} -{" "}
                    {solicitud.UsuarioAdoptante?.nombre}{" "}
                    {solicitud.UsuarioAdoptante?.apellidos}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(
                          `/mascotas/mis-mascotas/editar-solicitud/${solicitud.id}`
                        )
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Editar Solicitud
                    </button>
                    <button
                      onClick={() => handleDeleteSolicitud(solicitud.id!)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Eliminar Solicitud
                    </button>
                  </div>
                </div>
                <p className="mb-4">{solicitud.observaciones}</p>

                {/* Imágenes de la solicitud */}
                {solicitud.SolicitudesImagenes &&
                  solicitud.SolicitudesImagenes.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-medium">Imágenes de la solicitud:</h3>
                      <div className="flex gap-2 mt-2">
                        {solicitud.SolicitudesImagenes.map((img) => (
                          <img
                            key={img.id}
                            src={`${img.path_imagen}`}
                            alt="Imagen solicitud"
                            className="w-20 h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                {/* Seguimientos */}
                <div className="mb-4">
                  <h3 className="font-medium">Seguimientos:</h3>
                  {loadingSeguimientos ? (
                    <p>Cargando seguimientos...</p>
                  ) : !allSeguimientos[solicitud.id!] ||
                    allSeguimientos[solicitud.id!].length === 0 ? (
                    <p>No hay seguimientos.</p>
                  ) : (
                    <div className="space-y-2 mt-2">
                      {allSeguimientos[solicitud.id!].map(
                        (seg: ISeguimientosAdopcion) => (
                          <div key={seg.id} className="bg-gray-50 p-4 rounded">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <p>{seg.observaciones}</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(
                                    seg.fecha_seguimiento || ""
                                  ).toLocaleDateString()}{" "}
                                  - {seg.UsuarioSeguimiento?.nombre}
                                </p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => handleEditSeguimiento(seg)}
                                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteSeguimiento(seg.id!)
                                  }
                                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>

                            {/* Imágenes del seguimiento */}
                            {seg.SeguimientosImagenes &&
                              seg.SeguimientosImagenes.length > 0 && (
                                <div className="mt-3">
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    Imágenes del seguimiento:
                                  </h4>
                                  <div className="flex gap-2">
                                    {seg.SeguimientosImagenes.map((img) => (
                                      <img
                                        key={img.id}
                                        src={`${img.path_imagen}`}
                                        alt="Imagen seguimiento"
                                        className="w-16 h-16 object-cover rounded"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleAddSeguimiento(solicitud.id!)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Agregar Seguimiento
                </button>
              </div>
            ))
          )}
        </div>
      </ContainerPage>
    </RouteGuard>
  );
}
