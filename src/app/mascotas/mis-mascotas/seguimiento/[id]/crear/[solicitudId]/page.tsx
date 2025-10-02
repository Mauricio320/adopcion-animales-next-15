"use client";

import { SeguimientoAdopcionForm } from "@/components/adoptar-apadrinar/SeguimientoAdopcionForm";
import RouteGuard from "@/components/auth/RouteGuard";
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
    <RouteGuard allowedRoles={[RolesEnum.STAFF, RolesEnum.VETERINARIA]}>
      <SeguimientoAdopcionForm
        solicitudId={parseInt(solicitudId)}
        onSuccess={handleSuccess}
      />
    </RouteGuard>
  );
}
