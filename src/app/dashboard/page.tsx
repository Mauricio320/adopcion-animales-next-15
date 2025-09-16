import RouteGuard from "@/components/auth/RouteGuard";
import { ContainerPage } from "@/components/common/ContainerPage";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ALL_ROLES } from "@/types/enums/enums";

export default function DashboardPage() {
  return (
    <RouteGuard requireAuth={true} redirectTo="/login" allowedRoles={ALL_ROLES}>
      <ContainerPage>
        <Dashboard />
      </ContainerPage>
    </RouteGuard>
  );
}
