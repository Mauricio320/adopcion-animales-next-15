"use client";

import { RolesEnum } from "@/types/enums/enums";
import { IUsuarioWithRelations } from "@/types/interfaces/usuarios";
import {
  FaEnvelope,
  FaHome,
  FaMapMarkerAlt,
  FaPhone
} from "react-icons/fa";
import PermissionGuard from "../auth/PermissionGuard";

interface UsuarioCardProps {
  usuario: IUsuarioWithRelations;
}

export const UsuarioCard: React.FC<UsuarioCardProps> = ({ usuario }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        {/* Header del usuario */}
        <div className="mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                {usuario.nombre?.[0]?.toUpperCase() || "U"}
              </div>
              {/* Indicador de estado */}
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white ${
                  usuario.estado === "activo" ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-emerald-900 truncate">
                {usuario.nombre} {usuario.apellidos}
              </h3>
            </div>
          </div>
        </div>

        {/* Información básica - Siempre visible */}
        <div className="space-y-2 mb-3">
          {usuario.municipio_id && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
              <FaMapMarkerAlt className="text-emerald-500 flex-shrink-0 text-sm" />
              <span className="text-sm font-medium text-gray-900 truncate">
                {usuario.municipio?.nombre}
              </span>
            </div>
          )}
          <PermissionGuard allowedRoles={[RolesEnum.RED_ANIMALIA]}>
            {usuario.direccion && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                <FaHome className="text-emerald-500 flex-shrink-0 text-sm" />
                <span className="text-sm font-medium text-gray-900 break-words">
                  {usuario.direccion}
                </span>
              </div>
            )}
          </PermissionGuard>
        </div>

        <PermissionGuard allowedRoles={[RolesEnum.RED_ANIMALIA]}>
          <div className="border-t border-gray-100 pt-3 mb-3">
            <div className="space-y-1.5">
              {usuario.celular && (
                <div className="flex items-center gap-2 p-1.5 bg-emerald-50 rounded">
                  <FaPhone className="text-emerald-600 flex-shrink-0 text-xs" />
                  <span className="text-sm font-medium text-emerald-900">
                    {usuario.celular}
                  </span>
                </div>
              )}

              {usuario.correo && (
                <div className="flex items-center gap-2 p-1.5 bg-emerald-50 rounded">
                  <FaEnvelope className="text-emerald-600 flex-shrink-0 text-xs" />
                  <span className="text-sm font-medium text-emerald-900 break-all">
                    {usuario.correo}
                  </span>
                </div>
              )}
            </div>
          </div>
        </PermissionGuard>
    </div>
  );
};
