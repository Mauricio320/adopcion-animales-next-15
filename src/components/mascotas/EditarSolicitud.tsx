"use client";

import { useSolicitudAdopcion } from "@/hooks/useSolicitudesAdopcion";

import { SolicitudAdopcionForm } from "../adoptar-apadrinar/SolicitudAdopcionForm";
import { useRouter } from "next/navigation";

interface IPrps {
  id: string | number;
}

export const EditarSolicitud = ({ id }: IPrps) => {
  const router = useRouter();
  const { data: solicitud, loading, error } = useSolicitudAdopcion(id);

  const handleSuccess = () => {
    router.push(
      `/mascotas/mis-mascotas/seguimiento/${solicitud?.animal_albergue_id}`
    );
  };

  if (loading) {
    return <div className="text-center">Cargando solicitud...</div>;
  }

  if (error || !solicitud) {
    return <div className="text-center">Solicitud no encontrada</div>;
  }

  return (
    <>
      <SolicitudAdopcionForm
        animalAlbergueId={solicitud.animal_albergue_id!}
        estadoId={solicitud.estado_id!}
        onSuccess={handleSuccess}
        initialData={solicitud}
        isEdit={true}
      />
    </>
  );
};
