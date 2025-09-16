import RouteGuard from "@/components/auth/RouteGuard";
import { ContainerPage } from "@/components/common/ContainerPage";
import { EditarMascotaPage } from "@/components/mascotas/EditarMascotaPage";
import { RolesEnum } from "@/types/enums/enums";

export default function Page() {
  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF]}>
      <ContainerPage>
        <EditarMascotaPage />;
      </ContainerPage>
    </RouteGuard>
  );
}
