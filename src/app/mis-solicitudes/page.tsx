import RouteGuard from "@/components/auth/RouteGuard";
import { ContainerPage } from "@/components/common/ContainerPage";
import { ListarMisSolicitudes } from "@/components/mis-solicitudes/ListarMisSolicitudes";
import { RolesEnum } from "@/types/enums/enums";
import React from "react";

const page = () => {
  return (
    <RouteGuard allowedRoles={[RolesEnum.STAFF, RolesEnum.VETERINARIA]}>
      <ContainerPage>
        <ListarMisSolicitudes />
      </ContainerPage>
    </RouteGuard>
  );
};

export default page;
