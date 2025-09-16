import RouteGuard from "@/components/auth/RouteGuard";
import { ContainerPage } from "@/components/common/ContainerPage";
import { RolesEnum } from "@/types/enums/enums";

export default function Page() {
  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF]}>
      <ContainerPage>contenido</ContainerPage>
    </RouteGuard>
  );
}
