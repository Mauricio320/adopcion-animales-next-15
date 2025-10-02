import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import RouteGuard from "@/components/auth/RouteGuard";
import { ALL_ROLES } from "@/types/enums/enums";

const page = () => {
  return (
    <RouteGuard allowedRoles={ALL_ROLES} guestOnly={true} isContainerPage={false}>
      <ForgotPasswordForm />
    </RouteGuard>
  );
};

export default page;
