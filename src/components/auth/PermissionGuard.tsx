"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { RolesEnum } from "@/types/enums/enums";

interface PermissionGuardProps {
  children: React.ReactNode;
  allowedRoles: RolesEnum[];
}

export default function PermissionGuard({
  children,
  allowedRoles,
}: PermissionGuardProps) {
  const { user } = useAuthContext();
  const cond = allowedRoles.includes(user?.usuario?.rol as RolesEnum);
  if (cond) return <>{children}</>;
  return <></>;
}
