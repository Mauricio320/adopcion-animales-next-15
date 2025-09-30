"use client";

import RouteGuard from "@/components/auth/RouteGuard";
import { ContainerPage } from "@/components/common/ContainerPage";
import { SeguimientoContent } from "@/components/mascotas/SeguimientoContent";
import { RolesEnum } from "@/types/enums/enums";
import { use } from "react";

export default function SeguimientoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const animalAlbergueId = parseInt(id);

  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF, RolesEnum.VETERINARIA]}>
      <ContainerPage>
        <SeguimientoContent animalAlbergueId={animalAlbergueId} />
      </ContainerPage>
    </RouteGuard>
  );
}
