"use client";

import { useAuthContext } from "@/contexts/AuthContext";
import { useGetNotificacionesInteresadosByUser } from "@/hooks/useNotificacionesInteresados";
import { SolicitudCard } from "./SolicitudCard";
import { PageHeader } from "../common/PageHeader";
import { FaClipboardList } from "react-icons/fa";
import LoadingSpinner from "../common/LoadingSpinner";
import { EmptyStateCard } from "../common/EmptyStateCard";

export const ListarMisSolicitudes = () => {
  const {
    user: { usuario },
  } = useAuthContext();

  const { data, loading, error } = useGetNotificacionesInteresadosByUser(usuario?.id as number);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center text-red-600">
        Error al cargar las adopciones.
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Mis solicitudes"
        icon={<FaClipboardList className="w-8 h-8 text-emerald-600" />}
        redirectPath="/dashboard"
      />
      {data.length === 0 ? (
        <EmptyStateCard description="No tienes solicitudes registradas aún. ¡Descubre mascotas maravillosas esperando un hogar amoroso y comienza tu proceso de adopción o apadrinamiento hoy! Cada animal merece una segunda oportunidad." />
      ) : (
        data.map((solicitud, index) => (
          <div key={solicitud.id || index} className="mb-4">
            <SolicitudCard solicitud={solicitud} />
          </div>
        ))
      )}
    </>
  );
};
