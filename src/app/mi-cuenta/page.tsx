import RouteGuard from "@/components/auth/RouteGuard";
import { EditarUsuario } from "@/components/mi-cuenta/EditarUsuario";
import { RolesEnum } from "@/types/enums/enums";

const page = () => {
  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF, RolesEnum.VETERINARIA]}>
      <EditarUsuario />
    </RouteGuard>
  );
};

export default page;
