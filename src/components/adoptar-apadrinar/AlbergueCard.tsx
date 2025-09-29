"use client";

import { useState } from "react";
import { RolesEnum } from "@/types/enums/enums";
import { IAlbergue } from "@/types/interfaces/albergue";
import { FaHeart, FaMapMarkerAlt, FaPaw } from "react-icons/fa";
import PermissionGuard from "../auth/PermissionGuard";
import { Modal } from "../common/Modal";
import { DonacionModalContent } from "./DonacionModalContent";

interface AlbergueCardProps {
  albergue: IAlbergue;
}

export const AlbergueCard: React.FC<AlbergueCardProps> = ({ albergue }) => {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const handleOpenDonationModal = () => {
    setIsDonationModalOpen(true);
  };

  const handleCloseDonationModal = () => {
    setIsDonationModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      {/* Header del albergue */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-emerald-800 mb-2">
          {albergue.nombre}
        </h3>
      </div>

      {/* Información básica */}
      <div className="mb-4 space-y-2">
        {albergue.municipio && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" />
            <span>{albergue.municipio.nombre}</span>
          </div>
        )}

        <PermissionGuard
          allowedRoles={[
            RolesEnum.STAFF,
            RolesEnum.ADMIN,
            RolesEnum.VETERINARIA,
          ]}
        >
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" />
            <span>{albergue.direccion}</span>
          </div>
        </PermissionGuard>

        <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
          <FaPaw className="text-emerald-600" />
          <span>
            {albergue.animales_activos || 0} {albergue.animales_activos === 1 ? "animal" : "animales"} activos
          </span>
        </div>
      </div>

      {/* Footer con botón de donación */}
      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={handleOpenDonationModal}
          className="flex-1 cursor-pointer rounded-lg w-full bg-gradient-to-r from-emerald-500 to-emerald-600 border-2 border-emerald-500 text-white py-2 px-3 text-xs font-semibold transition-all duration-300 transform shadow-md shadow-emerald-200 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg"
        >
          <div className="flex items-center justify-center gap-1">
            <FaHeart className="text-lg text-white mr-1" />
            <span>Hacer Donación</span>
          </div>
        </button>
      </div>

      {/* Modal de donación */}
      <Modal
        isOpen={isDonationModalOpen}
        onClose={handleCloseDonationModal}
        title={`Donar a ${albergue.nombre}`}
        size="lg"
      >
        <DonacionModalContent albergue={albergue} />
      </Modal>
    </div>
  );
};
