import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import RouteGuard from "@/components/auth/RouteGuard";
import { ALL_ROLES } from "@/types/enums/enums";

const page = () => {
  return (
    <RouteGuard
      allowedRoles={ALL_ROLES}
      requireAuth={true}
      isContainerPage={false}
    >
      <ChangePasswordForm includeCurrentPassword={false} />
    </RouteGuard>
  );
};

export default page;
