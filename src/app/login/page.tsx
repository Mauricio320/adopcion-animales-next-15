import { LoginForm } from "@/components/auth/LoginForm";
import RouteGuard from "@/components/auth/RouteGuard";
import { ContainerPage } from "@/components/common/ContainerPage";

export default function LoginPage() {
  return (
    <RouteGuard requireAuth={false} guestOnly={true} redirectTo="/dashboard">
      <ContainerPage>
        <LoginForm />
      </ContainerPage>
    </RouteGuard>
  );
}
