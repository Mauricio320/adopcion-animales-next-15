"use client";

import RouteGuard from "@/components/auth/RouteGuard";
import { ContainerPage } from "@/components/common/ContainerPage";
import { SeguimientoAdopcionForm } from "@/components/adoptar-apadrinar/SeguimientoAdopcionForm";
import { RolesEnum } from "@/types/enums/enums";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function CrearSeguimientoPage({
  params,
}: {
  params: Promise<{ id: string; solicitudId: string }>;
}) {
  const { id, solicitudId } = use(params);
  const router = useRouter();

  const handleSuccess = () => {
    router.push(`/mascotas/mis-mascotas/seguimiento/${id}`);
  };

  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF]}>
      <ContainerPage>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Crear Nuevo Seguimiento</h1>
          <SeguimientoAdopcionForm
            solicitudId={parseInt(solicitudId)}
            onSuccess={handleSuccess}
          />
        </div>
      </ContainerPage>
    </RouteGuard>
  );
}