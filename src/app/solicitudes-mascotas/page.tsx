import RouteGuard from "@/components/auth/RouteGuard";
import { ContainerPage } from "@/components/common/ContainerPage";
import { ListaSolicitudesMascotas } from "@/components/solicitud-mascotas/ListaSolicitudesMascotas";
import { RolesEnum } from "@/types/enums/enums";

export default function SolicitudesMascotasPage() {
  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF, RolesEnum.VETERINARIA]}>
      <ContainerPage>
        <ListaSolicitudesMascotas />;
      </ContainerPage>
    </RouteGuard>
  );
}
