"use client";

import { DashboardCard } from "../common/DashboardCard";
import { PageHeader } from "../common/PageHeader";

export const MascotasContent = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Gestión de Mascotas"
        icon="🐾"
        redirectPath="/dashboard"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          description="Agregar una nueva mascota al sistema"
          buttonText="Registrar Nueva"
          path="/mascotas/registrar"
          title="Registrar Mascota"
          buttonColor="green"
        />

        <DashboardCard
          description="Ver y editar mascotas de mi albergue"
          path="/mascotas/mis-mascotas"
          buttonText="Ver Lista"
          title="Mis Mascotas"
          buttonColor="blue"
        />

        <DashboardCard
          description="Gestionar solicitudes de adopción"
          title="Solicitudes de Adopción"
          buttonText="Ver Solicitudes"
          buttonColor="purple"
        />
      </div>
    </div>
  );
};
