"use client";

import { ISolicitudesAdopcionApadrinamiento } from "@/types/interfaces/solicitudes_adopcion_apadrinamiento";
import Image from "next/image";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaw,
  FaPhone,
  FaWhatsapp,
} from "react-icons/fa";

interface SolicitudCardProps {
  solicitud: ISolicitudesAdopcionApadrinamiento;
  index: number;
}

export const SolicitudCard = ({ solicitud, index }: SolicitudCardProps) => {
  const abrirWhatsApp = (telefono: string) => {
    const numeroLimpio = telefono.replace(/\D/g, "");
    const url = `https://wa.me/${numeroLimpio}`;
    window.open(url, "_blank");
  };

  return (
    <div
      key={solicitud.id || index}
      className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 shadow-sm"
    >
      <div className="flex items-center justify-end mb-2">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
            solicitud.Estado?.nombre === "Aprobado"
              ? "bg-green-100 text-green-800"
              : solicitud.Estado?.nombre === "Rechazado"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {solicitud.Estado?.nombre || "Pendiente"}
        </span>
      </div>
      <div className="text-xs text-gray-600 mb-2">
        {solicitud.fecha_solicitud
          ? new Date(solicitud.fecha_solicitud).toLocaleDateString("es-ES")
          : "Fecha desconocida"}
      </div>

      {/* Información del animal y albergue en una sola fila */}
      {solicitud.AnimalAlbergue?.Animal && (
        <div className="bg-gray-50 rounded-lg p-2 mb-2">
          <div className="flex gap-2">
            {/* Foto de la mascota */}
            <div className="flex-shrink-0">
              {solicitud.AnimalAlbergue.Animal.imagen_url ? (
                <Image
                  src={solicitud.AnimalAlbergue.Animal.imagen_url}
                  alt={solicitud.AnimalAlbergue.Animal.nombre || "Mascota"}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                  <FaPaw className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>

            {/* Información compacta y responsive */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-1">
                <FaPaw className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                <span className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                  {solicitud.AnimalAlbergue.Animal.nombre || "Sin nombre"}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-600">
                <span className="flex-shrink-0">
                  <strong>Esp:</strong>{" "}
                  {solicitud.AnimalAlbergue.Animal.especies?.nombre || "N/A"}
                </span>
                <span className="flex-shrink-0">
                  <strong>Sex:</strong>{" "}
                  {solicitud.AnimalAlbergue.Animal.sexo_animal?.nombre || "N/A"}
                </span>
                {solicitud.AnimalAlbergue.Animal.edad &&
                  solicitud.AnimalAlbergue.Animal.tipo_edad_animal?.nombre && (
                    <span className="flex-shrink-0">
                      <strong>Edad:</strong>{" "}
                      {solicitud.AnimalAlbergue.Animal.edad}{" "}
                      {solicitud.AnimalAlbergue.Animal.tipo_edad_animal.nombre}
                    </span>
                  )}
              </div>
            </div>
          </div>

          {/* Información completa del albergue */}
          {solicitud.AnimalAlbergue?.Albergue && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="bg-gradient-to-r  bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-800">
                  <p className="font-medium text-emerald-900 mb-2">
                    🏠 {solicitud.AnimalAlbergue.Albergue.nombre}
                  </p>

                  {/* Información de contacto del albergue en dos columnas */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Celular con WhatsApp */}
                    {solicitud.AnimalAlbergue.Albergue.celular && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            solicitud.AnimalAlbergue?.Albergue?.celular &&
                            abrirWhatsApp(
                              solicitud.AnimalAlbergue.Albergue.celular
                            )
                          }
                          className="flex items-center gap-1 text-gray-600 hover:text-emerald-700 transition-colors"
                        >
                          <FaWhatsapp className="w-3 h-3 text-emerald-600" />
                          <span className="font-medium text-xs">
                            {solicitud.AnimalAlbergue.Albergue.celular}
                          </span>
                        </button>
                        <span className="text-xs text-gray-500">
                          (WhatsApp)
                        </span>
                      </div>
                    )}

                    {/* Teléfono fijo si existe */}
                    {solicitud.AnimalAlbergue.Albergue.telefono && (
                      <div className="flex items-center gap-1">
                        <FaPhone className="w-3 h-3 text-emerald-600" />
                        <span className="text-xs">
                          {solicitud.AnimalAlbergue.Albergue.telefono}
                        </span>
                      </div>
                    )}

                    {/* Email si existe */}
                    {solicitud.AnimalAlbergue.Albergue.email && (
                      <div className="flex items-center gap-1">
                        <FaEnvelope className="w-3 h-3 text-emerald-600" />
                        <span className="text-xs truncate">
                          {solicitud.AnimalAlbergue.Albergue.email}
                        </span>
                      </div>
                    )}

                    {/* Dirección */}
                    <div className="flex items-start gap-1">
                      <FaMapMarkerAlt className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs truncate">
                        <strong>Dirección:</strong>{" "}
                        {solicitud.AnimalAlbergue.Albergue.direccion ||
                          "No disponible"}
                      </div>
                    </div>

                    {/* Ciudad */}
                    <div className="flex items-start gap-1">
                      <FaMapMarkerAlt className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs truncate">
                        <strong>Ciudad:</strong>{" "}
                        {solicitud.AnimalAlbergue.Albergue.municipio?.nombre ||
                          "No disponible"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Observaciones - más compactas */}
      {solicitud.observaciones && (
        <div className="bg-yellow-50 rounded-lg p-2 text-xs">
          <p className="text-yellow-800">
            <strong>Nota:</strong> {solicitud.observaciones}
          </p>
        </div>
      )}
    </div>
  );
};
