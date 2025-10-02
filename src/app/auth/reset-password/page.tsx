import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import RouteGuard from "@/components/auth/RouteGuard";
import { ALL_ROLES } from "@/types/enums/enums";

const page = () => {
  return (
    <RouteGuard allowedRoles={ALL_ROLES} requireAuth={true} isContainerPage={false}>
      <ResetPasswordForm />
    </RouteGuard>
  );
};

export default page;
