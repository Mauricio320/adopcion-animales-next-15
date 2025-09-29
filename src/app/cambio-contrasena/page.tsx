import RouteGuard from "@/components/auth/RouteGuard";
import { CambioContrasena } from "@/components/cambio-contrasena/CambioContrasena";
import { ContainerPage } from "@/components/common/ContainerPage";
import { ALL_ROLES } from "@/types/enums/enums";

const page = () => {
  return (
    <RouteGuard allowedRoles={ALL_ROLES}>
      <ContainerPage>
        <CambioContrasena />
      </ContainerPage>
    </RouteGuard>
  );
};

export default page;
