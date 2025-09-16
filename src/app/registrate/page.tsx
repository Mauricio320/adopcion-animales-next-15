import RouteGuard from "@/components/auth/RouteGuard";
import { Registrate } from "@/components/registro/registrate";
import React from "react";

const page = () => {
  return (
    <RouteGuard requireAuth={false} guestOnly={true} redirectTo="/dashboard">
      <Registrate />;
    </RouteGuard>
  );
};

export default page;
