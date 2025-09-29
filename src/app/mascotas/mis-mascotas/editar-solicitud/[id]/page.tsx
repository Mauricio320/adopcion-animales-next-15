import RouteGuard from "@/components/auth/RouteGuard";
import { ContainerPage } from "@/components/common/ContainerPage";
import { EditarSolicitud } from "@/components/mascotas/EditarSolicitud";
import { RolesEnum } from "@/types/enums/enums";
import { use } from "react";

export default function EditarSolicitudPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF]}>
      <ContainerPage>
        <EditarSolicitud id={id} />
      </ContainerPage>
    </RouteGuard>
  );
}
