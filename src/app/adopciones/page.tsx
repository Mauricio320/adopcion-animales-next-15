import { AdopcionesContent } from "@/components/adopciones/AdopcionesContent";
import RouteGuard from "@/components/auth/RouteGuard";
import { ALL_ROLES } from "@/types/enums/enums";

export default function AdopcionesPage() {
  return (
    <RouteGuard allowedRoles={ALL_ROLES}>
      <AdopcionesContent />
    </RouteGuard>
  );
}
