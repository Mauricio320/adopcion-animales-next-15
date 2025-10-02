import RouteGuard from "@/components/auth/RouteGuard";
import { Registrate } from "@/components/registro/registrate";

const page = () => {
  return (
    <RouteGuard requireAuth={false} guestOnly={true} isContainerPage={false} redirectTo="/dashboard">
      <Registrate />;
    </RouteGuard>
  );
};

export default page;
