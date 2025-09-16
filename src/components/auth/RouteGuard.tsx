"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { AuthLoader } from "@/components/common/Loader";
import { RolesEnum } from "@/types/enums/enums";

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
}

export default function RouteGuard({
  children,
  requireAuth = false,
  allowedRoles = [],
  guestOnly = false,
  redirectTo = "/login",
  redirectIfLoggedIn = "/dashboard",
}: RouteGuardProps) {
  const { user } = useAuthContext();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  const validLogin = useCallback(() => {
    const isLoggedIn = !!user && !!user.id;
    const userRole = user?.usuario?.rol as RolUsuario;

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
  ]);

  useEffect(() => {
    validLogin();
  }, [validLogin]);

  if (isChecking) return <AuthLoader />;

  return <>{children}</>;
}
