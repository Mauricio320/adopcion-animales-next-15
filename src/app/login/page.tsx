import { LoginForm } from "@/components/auth/LoginForm";
import RouteGuard from "@/components/auth/RouteGuard";

export default function LoginPage() {
  return (
    <RouteGuard requireAuth={false} guestOnly={true} isContainerPage={false} redirectTo="/dashboard">
      <LoginForm />
    </RouteGuard>
  );
}
