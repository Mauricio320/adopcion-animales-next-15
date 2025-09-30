"use client";

import { IUsuario } from "@/types/interfaces/usuarios";
import { SolicitudCard } from "@/components/common/SolicitudCard";
import {
  FaEnvelope,
  FaHeart,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
} from "react-icons/fa";

interface UsuarioInfoModalProps {
  usuario: IUsuario | null;
  loading: boolean;
}

export const UsuarioInfoModal = ({
  usuario,
  loading,
}: UsuarioInfoModalProps) => {

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
              Adopciones | Apadrinamientos
            </h4>
            <span className="text-xs sm:text-sm text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
              {(solicitudesActivas ?? []).length}
            </span>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {solicitudesActivas?.map((solicitud, index) => (
              <SolicitudCard
                key={solicitud.id || index}
                solicitud={solicitud}
                index={index}
              />
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
