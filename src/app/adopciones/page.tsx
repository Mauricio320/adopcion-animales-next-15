import RouteGuard from "@/components/auth/RouteGuard";
import { AdopcionesContent } from "@/components/adoptar-apadrinar/AdopcionesContent";
import { ALL_ROLES } from "@/types/enums/enums";
import { ContainerPage } from "@/components/common/ContainerPage";

export default function AdopcionesPage() {
  return (
    <RouteGuard allowedRoles={ALL_ROLES}>
      <ContainerPage>
        <AdopcionesContent />
      </ContainerPage>
    </RouteGuard>
  );
}
