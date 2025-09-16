"use client";

import { DashboardCard } from "../common/DashboardCard";
import { PageHeader } from "../common/PageHeader";

export const AdopcionesContent = () => {
  return (
    <div>
      <PageHeader title="Mis Adopciones" icon="🏠" redirectPath="/dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Mascotas Disponibles"
          description="Explorar mascotas disponibles para adopción"
          buttonText="Ver Disponibles"
          buttonColor="green"
          path="/"
        />

        <DashboardCard
          title="Mis Solicitudes"
          description="Ver el estado de mis solicitudes de adopción"
          buttonText="Ver Solicitudes"
          buttonColor="blue"
        />

        <DashboardCard
          title="Mis Mascotas Adoptadas"
          description="Ver mascotas que he adoptado exitosamente"
          buttonText="Ver Adoptadas"
          buttonColor="purple"
        />

        <DashboardCard
          title="Proceso de Apadrinamiento"
          description="Ver mascotas que he apadrinado exitosamente"
          buttonText="Ver Proceso"
          buttonColor="orange"
        />

        <DashboardCard
          title="Contactar Albergues"
          description="Ponerse en contacto con albergues"
          buttonText="Contactar"
          buttonColor="gray"
          path="/instituciones"
        />
      </div>
    </div>
  );
};
