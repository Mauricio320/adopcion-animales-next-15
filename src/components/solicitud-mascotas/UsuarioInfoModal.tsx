"use client";

import { IUsuario } from "@/types/interfaces/usuarios";
import Image from "next/image";
import {
  FaEnvelope,
  FaHeart,
  FaMapMarkerAlt,
  FaPaw,
  FaPhone,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa";

interface UsuarioInfoModalProps {
  usuario: IUsuario | null;
  loading: boolean;
}

export const UsuarioInfoModal = ({
  usuario,
  loading,
}: UsuarioInfoModalProps) => {
  // Función para abrir WhatsApp
  const abrirWhatsApp = (telefono: string) => {
    const numeroLimpio = telefono.replace(/\D/g, "");
    const url = `https://wa.me/${numeroLimpio}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
        <span className="ml-2 text-sm text-gray-600">
          Cargando información del usuario...
        </span>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <FaUser className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500">
          No se ha encontrado información del usuario
        </p>
      </div>
    );
  }

  const solicitudesActivas =
    usuario.solicitudes_adopcion_apadrinamiento_usuario_adoptante;

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto px-1">
      {/* Información básica del usuario - Diseño compacto y responsive */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-3 border border-emerald-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate pr-2">
            {usuario.nombre} {usuario.apellidos}
          </h3>
          <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full flex-shrink-0">
            Usuario
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-gray-600">
            <FaEnvelope className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">
              {usuario.correo || "No disponible"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <FaPhone className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">
              {usuario.celular || "No disponible"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 sm:col-span-2">
            <FaMapMarkerAlt className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">
              {[usuario.direccion, usuario.municipio?.nombre]
                .filter(Boolean)
                .join(", ") || "Ubicación no disponible"}
            </span>
          </div>
        </div>
      </div>

      {/* Solicitudes activas */}
      {(solicitudesActivas ?? []).length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
              <FaHeart className="w-4 h-4 text-emerald-600" />
              Solicitudes
            </h4>
            <span className="text-xs sm:text-sm text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
              {(solicitudesActivas ?? []).length}
            </span>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {solicitudesActivas?.map((solicitud, index) => (
              <div
                key={solicitud.id || index}
                className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Solicitud
                  </span>
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
                    ? new Date(solicitud.fecha_solicitud).toLocaleDateString(
                        "es-ES"
                      )
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
                            alt={
                              solicitud.AnimalAlbergue.Animal.nombre ||
                              "Mascota"
                            }
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
                            {solicitud.AnimalAlbergue.Animal.nombre ||
                              "Sin nombre"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-600">
                          <span className="flex-shrink-0">
                            <strong>Esp:</strong>{" "}
                            {solicitud.AnimalAlbergue.Animal.especies?.nombre ||
                              "N/A"}
                          </span>
                          <span className="flex-shrink-0">
                            <strong>Sex:</strong>{" "}
                            {solicitud.AnimalAlbergue.Animal.sexo_animal
                              ?.nombre || "N/A"}
                          </span>
                          {solicitud.AnimalAlbergue.Animal.edad &&
                            solicitud.AnimalAlbergue.Animal.tipo_edad_animal
                              ?.nombre && (
                              <span className="flex-shrink-0">
                                <strong>Edad:</strong>{" "}
                                {solicitud.AnimalAlbergue.Animal.edad}{" "}
                                {
                                  solicitud.AnimalAlbergue.Animal
                                    .tipo_edad_animal.nombre
                                }
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
                                      solicitud.AnimalAlbergue?.Albergue
                                        ?.celular &&
                                      abrirWhatsApp(
                                        solicitud.AnimalAlbergue.Albergue
                                          .celular
                                      )
                                    }
                                    className="flex items-center gap-1 text-gray-600 hover:text-emerald-700 transition-colors"
                                  >
                                    <FaWhatsapp className="w-3 h-3 text-emerald-600" />
                                    <span className="font-medium text-xs">
                                      {
                                        solicitud.AnimalAlbergue.Albergue
                                          .celular
                                      }
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
                                  {solicitud.AnimalAlbergue.Albergue
                                    .direccion || "No disponible"}
                                </div>
                              </div>

                              {/* Ciudad */}
                              <div className="flex items-start gap-1">
                                <FaMapMarkerAlt className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div className="text-xs truncate">
                                  <strong>Ciudad:</strong>{" "}
                                  {solicitud.AnimalAlbergue.Albergue.municipio
                                    ?.nombre || "No disponible"}
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
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaHeart className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">
            Este usuario no tiene solicitudes activas
          </p>
        </div>
      )}
    </div>
  );
};
