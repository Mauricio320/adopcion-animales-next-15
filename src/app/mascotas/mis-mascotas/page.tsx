import RouteGuard from "@/components/auth/RouteGuard";
import { ListaMisMascotas } from "@/components/mascotas/ListaMisMascotas";
import { RolesEnum } from "@/types/enums/enums";

const page = () => {
  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF, RolesEnum.VETERINARIA]}>
      <ListaMisMascotas />
    </RouteGuard>
  );
};

export default page;
