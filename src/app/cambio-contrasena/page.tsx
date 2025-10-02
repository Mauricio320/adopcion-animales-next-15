import RouteGuard from "@/components/auth/RouteGuard";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { ALL_ROLES } from "@/types/enums/enums";

const page = () => {
  return (
    <RouteGuard allowedRoles={ALL_ROLES}>
      <ChangePasswordForm />
    </RouteGuard>
  );
};

export default page;
