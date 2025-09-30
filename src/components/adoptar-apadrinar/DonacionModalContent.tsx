"use client";

import { IAlbergue } from "@/types/interfaces/albergue";
import { RolesEnum, TiposUsuarioEnum } from "@/types/enums/enums";
import { FaEnvelope, FaHeart, FaPhone } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import PermissionGuard from "../auth/PermissionGuard";

interface DonacionModalContentProps {
  albergue: IAlbergue;
}

export const DonacionModalContent: React.FC<DonacionModalContentProps> = ({
  albergue,
}) => {
  return (
    <div className="space-y-4">
      {/* Información del albergue */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
          <FaEnvelope className="w-4 h-4 mr-2 text-gray-600" />
          {albergue.nombre}
        </h4>
        <div className="space-y-3">
          <div className="bg-white rounded-md border border-gray-200 p-3">
            <p className="text-sm text-gray-600 mb-2">{albergue.descripcion}</p>

            {/* Dirección solo visible para roles específicos */}

            <div className="text-xs text-gray-500">
              📍 {albergue.municipio?.nombre}
              <PermissionGuard
                allowedRoles={[
                  RolesEnum.STAFF,
                  RolesEnum.ADMIN,
                  RolesEnum.VETERINARIA,
                ]}
              >
                {' - '}
                {albergue.direccion}
              </PermissionGuard>
            </div>
          </div>
        </div>
      </div>

      {/* Información de contacto para donaciones */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <h4 className="font-semibold text-emerald-900 mb-3 flex items-center text-sm">
          <FaHeart className="w-4 h-4 mr-2 text-emerald-600" />
          Datos de contacto del{" "}
          {albergue.tipo === TiposUsuarioEnum.ALBERGUE
            ? "albergue"
            : "veterinaria"}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center space-x-3 p-2 bg-white rounded-md border border-emerald-200">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <IoLogoWhatsapp className="w-4 h-4 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                WhatsApp
              </p>
              <a
                href={`https://wa.me/${albergue.telefono?.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-800 font-medium text-sm transition-colors block truncate"
              >
                {albergue.telefono}
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2 bg-white rounded-md border border-emerald-200">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FaPhone className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Celular
              </p>
              <p className="text-gray-900 font-medium text-sm truncate">
                {albergue.celular}
              </p>
            </div>
          </div>
          {albergue.email && (
            <div className="flex items-center space-x-3 p-2 bg-white rounded-md border border-emerald-200 sm:col-span-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MdEmail className="w-4 h-4 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Email
                </p>
                <a
                  href={`mailto:${albergue.email}`}
                  className="text-emerald-600 hover:text-emerald-800 font-medium text-sm transition-colors block truncate"
                >
                  {albergue.email}
                </a>
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 p-3 bg-emerald-100 border border-emerald-300 rounded-md">
          <p className="text-sm text-emerald-800 text-center">
            💝 <strong>¡Tu apoyo es fundamental!</strong> Por favor contacta
            directamente al albergue para coordinar tu donación y conocer las
            diferentes formas de ayudar.
          </p>
        </div>
      </div>
    </div>
  );
};
