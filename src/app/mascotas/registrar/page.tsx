import RouteGuard from "@/components/auth/RouteGuard";
import { ContainerPage } from "@/components/common/ContainerPage";
import { RegistrarMascotaForm } from "@/components/mascotas/RegistrarMascotaForm";
import { RolesEnum } from "@/types/enums/enums";

const RegistrarMascota = () => {
  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF, RolesEnum.ADMIN]}>
      <ContainerPage>
        <RegistrarMascotaForm />;
      </ContainerPage>
    </RouteGuard>
  );
};

export default RegistrarMascota;
