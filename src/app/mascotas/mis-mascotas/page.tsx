import RouteGuard from "@/components/auth/RouteGuard";
import { ContainerPage } from "@/components/common/ContainerPage";
import { RolesEnum } from "@/types/enums/enums";
import React from "react";

const page = () => {
  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF]}>
      <ContainerPage>mis mascotas</ContainerPage>
    </RouteGuard>
  );
};

export default page;
