import RouteGuard from "@/components/auth/RouteGuard";
import { ContainerPage } from "@/components/common/ContainerPage";
import { Registrate } from "@/components/registro/registrate";
import React from "react";

const page = () => {
  return (
    <RouteGuard requireAuth={false} guestOnly={true} redirectTo="/dashboard">
      <ContainerPage>
        <Registrate />;
      </ContainerPage>
    </RouteGuard>
  );
};

export default page;
