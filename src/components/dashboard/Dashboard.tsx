"use client";

import PermissionGuard from "@/components/auth/PermissionGuard";
import { useAuthContext } from "@/contexts/AuthContext";
import { ALL_ROLES, RolesEnum, TitleLabels } from "@/types/enums/enums";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Dashboard = () => {
  const { user } = useAuthContext();
  const routes = useRouter();
  const [descripcionExpanded, setDescripcionExpanded] = useState(false);

  const usuarioData = user?.usuario;
  const albergueData = usuarioData?.usuario_albergue?.albergues;

  return (
    <div>
      <h1 className="text-3xl font-bold text-emerald-800 mb-6">
        ¡Bienvenido al Home!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">
            Información de Autenticación
          </h2>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Usuario ID:</strong> {user?.id}
          </p>
          <p>
            <strong>Confirmado:</strong>{" "}
            {user?.email_confirmed_at ? "Sí" : "No"}
          </p>
        </div>

        {usuarioData && (
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Información del Usuario
            </h2>
            <p>
              <strong>Nombre:</strong> {usuarioData.nombre}
            </p>
            <p>
              <strong>Documento:</strong> {usuarioData.numero_documento}
            </p>
            <p>
              <strong>Celular:</strong> {usuarioData.celular}
            </p>
            <p>
              <strong>Estado:</strong> {usuarioData.estado}
            </p>
          </div>
        )}
      </div>

      <PermissionGuard allowedRoles={[RolesEnum.STAFF, RolesEnum.VETERINARIA]}>
        <div className="mt-6 bg-orange-50 p-6 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-orange-800">
              🏠 Información del Albergue
            </h2>
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  usuarioData?.usuario_albergue?.es_activo
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {usuarioData?.usuario_albergue?.es_activo
                  ? "Activo"
                  : "Inactivo"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="col-span-2">
              <strong className="text-orange-700">Nombre:</strong>{" "}
              {albergueData?.nombre}
            </div>
            <div>
              <strong className="text-orange-700">Municipio:</strong>{" "}
              {albergueData?.municipio?.nombre ?? "-"}
            </div>
            <div>
              <strong className="text-orange-700">Dirección:</strong>{" "}
              {albergueData?.direccion || "No especificada"}
            </div>
            <div>
              <strong className="text-orange-700">Whatsapp:</strong>{" "}
              {albergueData?.telefono || "No especificado"}
            </div>
            <div>
              <strong className="text-orange-700">Llamadas:</strong>{" "}
              {albergueData?.celular || "No especificado"}
            </div>
          </div>

          {albergueData?.descripcion && (
            <div className="mt-2 pt-2 border-t border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-orange-800">
                  Descripción
                </h3>
                <button
                  onClick={() => setDescripcionExpanded(!descripcionExpanded)}
                  className="flex items-center space-x-1 text-orange-600 hover:text-orange-800 transition-all duration-300 cursor-pointer hover:scale-105"
                  title={
                    descripcionExpanded ? "Contraer" : "Expandir descripción"
                  }
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      descripcionExpanded ? "rotate-45" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="text-sm transition-opacity duration-300">
                    {descripcionExpanded ? "Contraer" : "Expandir"}
                  </span>
                </button>
              </div>
              <div
                className={`text-orange-700 leading-relaxed overflow-hidden transition-all duration-500 ease-in-out ${
                  descripcionExpanded ? "max-h-[500px]" : "max-h-[80px]"
                }`}
              >
                <div
                  className={`transition-all duration-500 ease-in-out transform ${
                    descripcionExpanded
                      ? "opacity-100 translate-y-0"
                      : "opacity-90"
                  }`}
                >
                  <p className="relative">
                    {albergueData.descripcion}
                    {!descripcionExpanded &&
                      albergueData.descripcion.length > 150 && (
                        <span className="absolute bottom-0 right-0 bg-gradient-to-l from-orange-50 via-orange-50 to-transparent pl-8 transition-all duration-300">
                          <span className="bg-orange-50 text-orange-500 text-sm animate-pulse">
                            ...
                          </span>
                        </span>
                      )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <h1 className="mt-5 font-semibold">
          Modulos {TitleLabels[user.usuario?.rol as keyof typeof TitleLabels]}
        </h1>
        <div className="grid py-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-b-1 border-gray-200">
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">
              🏥 Gestión de Mascotas
            </h3>
            <p className="text-purple-700 mb-4 h-16">
              Administra el registro y estado de mascotas
            </p>
            <button
              onClick={() => routes.push("/mascotas/mis-mascotas")}
              className="w-full cursor-pointer bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
            >
              Gestionar Mascotas
            </button>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              📋 Solicitudes mascotas
            </h3>
            <p className="text-blue-700 mb-4 h-16">
              Gestiona las solicitudes de adopción y apadrinamiento de mascotas
            </p>
            <button
              onClick={() => routes.push("/solicitudes-mascotas")}
              className="w-full cursor-pointer bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Ver Solicitudes
            </button>
          </div>
        </div>
      </PermissionGuard>
      <h1 className="my-5 font-semibold">Modulos Usuario</h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            🐾 Mis mascotas
          </h3>
          <p className="text-green-700 mb-4 ">
            Mis mascotas adoptadas o apadrinadas
          </p>
          <button
            onClick={() => routes.push("/adopciones")}
            className="w-full cursor-pointer bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Mis mascotas
          </button>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            🐾 Mis solicitudes
          </h3>
          <p className="text-blue-700 mb-4">
            Revisa el estado de tus solicitudes de adopción y apadrinamiento
          </p>
          <button
            onClick={() => routes.push("/adopciones")}
            className="w-full cursor-pointer bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Ver Mis Solicitudes
          </button>
        </div>
      </div>
    </div>
  );
};
