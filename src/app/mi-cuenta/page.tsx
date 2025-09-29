import React from "react";
import { EditarUsuario } from "@/components/mi-cuenta/EditarUsuario";
import RouteGuard from "@/components/auth/RouteGuard";
import { ContainerPage } from "@/components/common/ContainerPage";
import { RolesEnum } from "@/types/enums/enums";

const page = () => {
  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF]}>
      <ContainerPage>
        <EditarUsuario />
      </ContainerPage>
    </RouteGuard>
  );
};

export default page;
