import RouteGuard from "@/components/auth/RouteGuard";
import { ContainerPage } from "@/components/common/ContainerPage";
import { MascotasContent } from "@/components/mascotas/MascotasContent";
import { ALL_ROLES } from "@/types/enums/enums";

export default function MascotasPage() {
  return (
    <RouteGuard allowedRoles={ALL_ROLES}>
      <ContainerPage>
        <MascotasContent />
      </ContainerPage>
    </RouteGuard>
  );
}
