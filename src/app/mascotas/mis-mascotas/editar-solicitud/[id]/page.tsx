"use client";

import RouteGuard from "@/components/auth/RouteGuard";
import { ContainerPage } from "@/components/common/ContainerPage";
import { SolicitudAdopcionForm } from "@/components/adoptar-apadrinar/SolicitudAdopcionForm";
import { RolesEnum } from "@/types/enums/enums";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { ISolicitudesAdopcionApadrinamiento } from "@/types/interfaces/solicitudes_adopcion_apadrinamiento";

export default function EditarSolicitudPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [solicitud, setSolicitud] = useState<ISolicitudesAdopcionApadrinamiento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const { data, error } = await supabase
          .from("solicitudes_adopcion_apadrinamiento")
          .select(`
            *,
            Estado:estado_animal(*),
            AnimalAlbergue:animal_albergue(*, Estado:estado_animal(*), Albergue:albergues(*)),
            UsuarioAdoptante:usuarios!fk_solicitudes_usuario_adoptante(*),
            UsuarioEntrega:usuarios!fk_solicitudes_usuario_entrega(*),
            SolicitudesImagenes:solicitudes_imagenes(*)
          `)
          .eq("id", parseInt(id))
          .single();

        if (error) throw error;
        setSolicitud(data);
      } catch (error) {
        console.error("Error fetching solicitud:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitud();
  }, [id]);

  const handleSuccess = () => {
    router.push(`/mascotas/mis-mascotas/seguimiento/${solicitud?.animal_albergue_id}`);
  };

  if (loading) {
    return (
      <RouteGuard allowedRoles={[RolesEnum.STAFF]}>
        <ContainerPage>
          <div className="text-center">Cargando solicitud...</div>
        </ContainerPage>
      </RouteGuard>
    );
  }

  if (!solicitud) {
    return (
      <RouteGuard allowedRoles={[RolesEnum.STAFF]}>
        <ContainerPage>
          <div className="text-center">Solicitud no encontrada</div>
        </ContainerPage>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF]}>
      <ContainerPage>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Editar Solicitud de {solicitud.Estado?.nombre}</h1>
          <SolicitudAdopcionForm
            animalAlbergueId={solicitud.animal_albergue_id!}
            estadoId={solicitud.estado_id!}
            onSuccess={handleSuccess}
            initialData={solicitud}
            isEdit={true}
          />
        </div>
      </ContainerPage>
    </RouteGuard>
  );
}