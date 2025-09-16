import { LoginForm } from "@/components/auth/LoginForm";
import RouteGuard from "@/components/auth/RouteGuard";

export default function LoginPage() {
  return (
    <RouteGuard requireAuth={false} guestOnly={true} redirectTo="/dashboard">
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <LoginForm />
        </div>
      </div>
    </RouteGuard>
  );
}
