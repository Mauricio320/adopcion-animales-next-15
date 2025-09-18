"use client";

import RouteGuard from "@/components/auth/RouteGuard";
import { ContainerPage } from "@/components/common/ContainerPage";
import { SolicitudAdopcionForm } from "@/components/adoptar-apadrinar/SolicitudAdopcionForm";
import { RolesEnum } from "@/types/enums/enums";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function AdopcionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/mascotas/mis-mascotas");
  };

  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF]}>
      <ContainerPage>
        <SolicitudAdopcionForm
          animalAlbergueId={parseInt(id)}
          estadoId={1} // Adopción
          onSuccess={handleSuccess}
        />
      </ContainerPage>
    </RouteGuard>
  );
}
