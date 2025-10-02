import RouteGuard from "@/components/auth/RouteGuard";
import { ListarMisSolicitudes } from "@/components/mis-solicitudes/ListarMisSolicitudes";
import { RolesEnum } from "@/types/enums/enums";

const page = () => {
  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF, RolesEnum.VETERINARIA]}>
      <ListarMisSolicitudes />
    </RouteGuard>
  );
};

export default page;
