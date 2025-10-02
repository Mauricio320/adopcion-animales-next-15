import RouteGuard from "@/components/auth/RouteGuard";
import { CambioContrasena } from "@/components/cambio-contrasena/CambioContrasena";
import { ALL_ROLES } from "@/types/enums/enums";

const page = () => {
  return (
    <RouteGuard allowedRoles={ALL_ROLES}>
      <CambioContrasena />
    </RouteGuard>
  );
};

export default page;
