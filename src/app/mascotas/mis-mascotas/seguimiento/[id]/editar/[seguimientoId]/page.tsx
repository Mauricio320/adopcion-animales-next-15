"use client";

import RouteGuard from "@/components/auth/RouteGuard";
import { ContainerPage } from "@/components/common/ContainerPage";
import { SeguimientoAdopcionForm } from "@/components/adoptar-apadrinar/SeguimientoAdopcionForm";
import { RolesEnum } from "@/types/enums/enums";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { ISeguimientosAdopcion } from "@/types/interfaces/seguimientos_adopcion";

export default function EditarSeguimientoPage({
  params,
}: {
  params: Promise<{ id: string; seguimientoId: string }>;
}) {
  const { id, seguimientoId } = use(params);
  const router = useRouter();
  const [seguimiento, setSeguimiento] = useState<ISeguimientosAdopcion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeguimiento = async () => {
      try {
        const { data, error } = await supabase
          .from("seguimientos_adopcion")
          .select(`
            *,
            UsuarioSeguimiento:usuarios(*),
            SeguimientosImagenes:seguimientos_imagenes(*)
          `)
          .eq("id", parseInt(seguimientoId))
          .single();

        if (error) throw error;
        setSeguimiento(data);
      } catch (error) {
        console.error("Error fetching seguimiento:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeguimiento();
  }, [seguimientoId]);

  const handleSuccess = () => {
    router.push(`/mascotas/mis-mascotas/seguimiento/${id}`);
  };

  if (loading) {
    return (
      <RouteGuard allowedRoles={[RolesEnum.STAFF]}>
        <ContainerPage>
          <div className="text-center">Cargando...</div>
        </ContainerPage>
      </RouteGuard>
    );
  }

  if (!seguimiento) {
    return (
      <RouteGuard allowedRoles={[RolesEnum.STAFF]}>
        <ContainerPage>
          <div className="text-center">Seguimiento no encontrado</div>
        </ContainerPage>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF]}>
      <ContainerPage>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Editar Seguimiento</h1>
          <SeguimientoAdopcionForm
            solicitudId={seguimiento.solicitud_id!}
            onSuccess={handleSuccess}
            initialData={seguimiento}
            isEdit={true}
          />
        </div>
      </ContainerPage>
    </RouteGuard>
  );
}