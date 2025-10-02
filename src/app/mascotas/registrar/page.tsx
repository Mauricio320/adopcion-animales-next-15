import RouteGuard from "@/components/auth/RouteGuard";
import { RegistrarMascotaForm } from "@/components/mascotas/RegistrarMascotaForm";
import { RolesEnum } from "@/types/enums/enums";

const RegistrarMascota = () => {
  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF, RolesEnum.ADMIN]}>
      <RegistrarMascotaForm />;
    </RouteGuard>
  );
};

export default RegistrarMascota;
