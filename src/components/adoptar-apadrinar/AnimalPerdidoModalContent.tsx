"use client";

import { IAnimal } from "@/types/interfaces/animal";
import Image from "next/image";
import { FaCheck, FaEnvelope, FaPhone } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";

interface AnimalPerdidoModalContentProps {
  selectedAnimal: IAnimal | null;
}

export const AnimalPerdidoModalContent: React.FC<AnimalPerdidoModalContentProps> = ({
  selectedAnimal,
}) => {
  return (
    <div className="space-y-4">
      {/* Header con imagen y mensaje */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-shrink-0">
          <Image
            src={selectedAnimal?.imagen_url as string}
            alt={selectedAnimal?.nombre || "Imagen de la mascota"}
            width={80}
            height={80}
            className="rounded-full object-cover border-2 border-blue-200"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <FaCheck className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <h3 className="text-lg font-bold text-blue-900 mb-1">
              Información de Mascota Perdida
            </h3>
            <p className="text-sm text-blue-800">
              Esta mascota ha sido reportada como perdida. Si la has visto, por favor contacta al establecimiento para ayudar a reunirla con su familia.
            </p>
          </div>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
          <FaEnvelope className="w-4 h-4 mr-2 text-gray-600" />
          Contacto del Establecimiento
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center space-x-3 p-2 bg-white rounded-md border border-gray-200">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <IoLogoWhatsapp className="w-4 h-4 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                WhatsApp
              </p>
              <a
                href={`https://wa.me/${selectedAnimal?.AnimalAlbergue?.Albergue?.telefono?.replace(
                  /\D/g,
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors block truncate"
              >
                {selectedAnimal?.AnimalAlbergue?.Albergue?.telefono}
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2 bg-white rounded-md border border-gray-200">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FaPhone className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Celular
              </p>
              <p className="text-gray-900 font-medium text-sm truncate">
                {selectedAnimal?.AnimalAlbergue?.Albergue?.celular}
              </p>
            </div>
          </div>
          {selectedAnimal?.AnimalAlbergue?.Albergue?.email && (
            <div className="flex items-center space-x-3 p-2 bg-white rounded-md border border-gray-200 sm:col-span-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MdEmail className="w-4 h-4 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Email
                </p>
                <a
                  href={`mailto:${selectedAnimal.AnimalAlbergue?.Albergue?.email}`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors block truncate"
                >
                  {selectedAnimal.AnimalAlbergue?.Albergue?.email}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};