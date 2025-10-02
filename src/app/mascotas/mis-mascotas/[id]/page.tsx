import RouteGuard from "@/components/auth/RouteGuard";
import { EditarMascotaPage } from "@/components/mascotas/EditarMascotaPage";
import { RolesEnum } from "@/types/enums/enums";

export default function Page() {
  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF, RolesEnum.VETERINARIA]}>
      <EditarMascotaPage />;
    </RouteGuard>
  );
}
