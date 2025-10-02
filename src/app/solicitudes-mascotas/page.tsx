import RouteGuard from "@/components/auth/RouteGuard";
import { ListaSolicitudesMascotas } from "@/components/solicitud-mascotas/ListaSolicitudesMascotas";
import { RolesEnum } from "@/types/enums/enums";

export default function SolicitudesMascotasPage() {
  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF, RolesEnum.VETERINARIA]}>
      <ListaSolicitudesMascotas />;
    </RouteGuard>
  );
}
