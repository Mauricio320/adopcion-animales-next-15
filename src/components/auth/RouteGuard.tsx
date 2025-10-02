"use client";

import { AuthLoader } from "@/components/common/Loader";
import { useAuthContext } from "@/contexts/AuthContext";
import { RolesEnum } from "@/types/enums/enums";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type RolUsuario = RolesEnum;

interface RouteGuardProps {
  children: React.ReactNode;
  // Configuración de protección
  requireAuth?: boolean; // Si requiere estar autenticado
  allowedRoles?: RolUsuario[]; // Roles permitidos (solo si requireAuth = true)
  guestOnly?: boolean; // Solo para usuarios NO autenticados (ej: login)

  // Configuración de redirección
  redirectTo?: string; // URL personalizada de redirección
  redirectIfLoggedIn?: string; // URL si está logueado (para guestOnly)
  isContainerPage?: boolean; // Si el contenido está dentro de un ContainerPage
}

export default function RouteGuard({
  children,
  requireAuth = false,
  allowedRoles = [],
  guestOnly = false,
  redirectTo = "/login",
  redirectIfLoggedIn = "/dashboard",
  isContainerPage = true,
}: RouteGuardProps) {
  const { user } = useAuthContext();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  const useGuestOnly = !user && !guestOnly;

  const validLogin = useCallback(() => {
    const isLoggedIn = !!user && !!user.id;
    const userRole = user?.usuario?.rol as RolUsuario;

    if (useGuestOnly) {
      setIsChecking(false);
      return router.push("/login");
    }

    if (guestOnly) {
      if (isLoggedIn) {
        router.push(redirectIfLoggedIn);
        return;
      }
      setIsChecking(false);
      return;
    }

    if (requireAuth) {
      if (!isLoggedIn) {
        router.push(redirectTo);
        return;
      }

      if (allowedRoles.length > 0) {
        if (!userRole || !allowedRoles.includes(userRole)) {
          router.push("/unauthorized");
          return;
        }
      }

      setIsChecking(false);
      return;
    }

    setIsChecking(false);
  }, [
    user,
    requireAuth,
    allowedRoles,
    guestOnly,
    router,
    redirectTo,
    redirectIfLoggedIn,
    useGuestOnly,
  ]);

  useEffect(() => {
    validLogin();
  }, [validLogin]);

  if (useGuestOnly) return <AuthLoader />;
  if (isChecking) return <AuthLoader />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {isContainerPage ? (
          <div className="bg-white rounded-lg shadow-lg p-8">{children}</div>
        ) : (
          <>{children}</>
        )}
      </div>
    </div>
  );
}
