"use client";

import { INotificacionesInteresadosWithRelations } from "@/types/interfaces/notificacionesInteresados";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";

interface SolicitudCardProps {
  solicitud: INotificacionesInteresadosWithRelations;
}

export const SolicitudCard = ({ solicitud }: SolicitudCardProps) => {
  const animal = solicitud.animal_albergue?.animal;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
      <div className="flex flex-col md:flex-row p-4">
        {/* Imagen de la mascota */}
        <div className="relative w-32 h-32 md:w-20 md:h-20 bg-gray-100 flex-shrink-0 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-4 self-start">
          {animal?.imagen_url ? (
            <Image
              src={animal.imagen_url}
              alt={animal.nombre || "Imagen de mascota"}
              className="object-cover"
              sizes="(max-width: 768px) 128px, 80px"
              fill
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <FaHeart className="w-12 h-12 md:w-8 md:h-8 text-gray-300" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 w-full md:w-auto">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1 min-w-0 mb-4 md:mb-0">
              {/* Información de la solicitud */}
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                Solicitud de{" "}
                {solicitud.tipo === 1 ? "Adopción" : "Apadrinamiento"}
              </h3>

              {/* Información del usuario */}
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-gray-800 block">
                      <span className="font-semibold text-gray-600">
                        Institución:{" "}
                      </span>
                      {solicitud.animal_albergue?.Albergue?.nombre ||
                        "No especificado"}
                    </span>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-gray-600">
                      {solicitud.animal_albergue?.Albergue?.email && (
                        <span className="flex items-center gap-1">
                          <span>📧</span>{" "}
                          {solicitud.animal_albergue?.Albergue?.email}
                        </span>
                      )}
                      {solicitud.animal_albergue?.Albergue?.celular && (
                        <span className="flex items-center gap-1">
                          <span>📱</span>{" "}
                          {solicitud.animal_albergue?.Albergue?.celular}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <span>📍</span>
                        {solicitud.animal_albergue?.Albergue?.municipio?.nombre}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de la mascota */}
              <p className="text-sm text-gray-600 mt-1">
                Mascota: {animal?.nombre}
                {animal?.especies?.nombre && (
                  <span className="ml-2 font-medium text-gray-700">
                    • {animal.especies.nombre}
                  </span>
                )}
              </p>

              <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-3 mt-2 text-sm text-gray-600">
                {animal?.sexo_animal?.nombre && (
                  <span>Sexo: {animal.sexo_animal.nombre}</span>
                )}
                {animal?.edad && animal?.tipo_edad_animal?.nombre && (
                  <span>
                    Edad: {animal.edad} {animal.tipo_edad_animal.nombre}
                  </span>
                )}
              </div>

              {/* Estado de la solicitud */}
              <div className="flex flex-wrap gap-2 mt-2 text-sm">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                  {new Date(solicitud.created_at).toLocaleDateString("es-ES")}
                </span>

                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    solicitud.aprobado === true
                      ? "bg-green-100 text-green-800"
                      : solicitud.aprobado === false
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {solicitud.aprobado === true
                    ? "Aprobado"
                    : solicitud.aprobado === false
                    ? "Rechazado"
                    : "Pendiente"}
                </span>
              </div>

              {/* Respuesta si existe */}
              {solicitud.respuesta && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Respuesta:</strong> {solicitud.respuesta}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
