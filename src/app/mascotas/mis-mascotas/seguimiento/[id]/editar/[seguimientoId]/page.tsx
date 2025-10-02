"use client";

import { SeguimientoEditarForm } from "@/components/adoptar-apadrinar/SeguimientoEditarForm";
import RouteGuard from "@/components/auth/RouteGuard";
import { RolesEnum } from "@/types/enums/enums";
import { use } from "react";

export default function EditarSeguimientoPage({
  params,
}: {
  params: Promise<{ id: string; seguimientoId: string }>;
}) {
  const { id, seguimientoId } = use(params);

  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF, RolesEnum.VETERINARIA]}>
      <SeguimientoEditarForm seguimientoId={seguimientoId} id={id} />
    </RouteGuard>
  );
}
