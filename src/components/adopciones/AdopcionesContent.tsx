"use client";

import { FaHome } from "react-icons/fa";
import { PageHeader } from "../common/PageHeader";
import { useAuthContext } from "@/contexts/AuthContext";
import { useMyAdaptationApplicationsQuery } from "@/hooks/useSolicitudesAdopcion";
import { SolicitudCard } from "../common/SolicitudCard";
import LoadingSpinner from "../common/LoadingSpinner";
import { EmptyStateCard } from "../common/EmptyStateCard";

export const AdopcionesContent = () => {
  const {
    user: { usuario },
  } = useAuthContext();

  const { data, loading, error } = useMyAdaptationApplicationsQuery({
    user_id: usuario?.id as number,
  });

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center text-red-600">
        Error al cargar las adopciones.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <PageHeader
        title="Mis Adopciones"
        icon={<FaHome className="w-8 h-8 text-emerald-600" />}
        redirectPath="/dashboard"
      />

      {data.length === 0 ? (
        <EmptyStateCard />
      ) : (
        data.map((solicitud, index) => (
          <div key={solicitud.id || index}>
            <SolicitudCard solicitud={solicitud} index={index} />
          </div>
        ))
      )}
    </div>
  );
};
