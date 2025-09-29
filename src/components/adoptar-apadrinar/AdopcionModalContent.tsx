/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { AuthUser } from "@/components/data-login/DataLogin";
import { useBlockUI } from "@/contexts/BlockUIContext";
import {
  CreateNotificacionInteresadosMutation,
  useGetOneNotificacionesInteresados,
} from "@/hooks/useNotificacionesInteresados";
import { IAnimal } from "@/types/interfaces/animal";
import { INotificacionesInteresados } from "@/types/interfaces/notificacionesInteresados";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { FaCheck, FaEnvelope, FaPhone } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { PiDog } from "react-icons/pi";

interface AdopcionModalContentProps {
  user: AuthUser | null;
  selectedAnimal: IAnimal | null;
  modalType: "adoptar" | "apadrinar";
}

export const AdopcionModalContent: React.FC<AdopcionModalContentProps> = ({
  selectedAnimal,
  modalType,
  user,
}) => {
  if (!user) {
    return (
      <NoSessionContent modalType={modalType} selectedAnimal={selectedAnimal} />
    );
  }

  return (
    <SessionContent
      modalType={modalType}
      selectedAnimal={selectedAnimal}
      user={user}
    />
  );
};

interface IGenericSessionContentProps {
  modalType: "adoptar" | "apadrinar";
  selectedAnimal: IAnimal | null;
}

const NoSessionContent = ({
  modalType,
  selectedAnimal,
}: IGenericSessionContentProps) => {
  const router = useRouter();
  return (
    <div className="text-center py-4 px-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
          <PiDog className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            ¡Agradecemos tu deseo de apoyar!
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Para notificar tu interés en{" "}
            {modalType === "adoptar" ? "adoptar" : "apadrinar"} a{" "}
            {selectedAnimal?.nombre}, es necesario que inicies sesión.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="inline-flex cursor-pointer items-center px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200 shadow-md"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

interface ISessionContentProps extends IGenericSessionContentProps {
  user: AuthUser;
}

const SessionContent = ({
  selectedAnimal,
  modalType,
  user,
}: ISessionContentProps) => {
  const { usuario } = user;
  const cond = {
    animal_albergue_id: selectedAnimal?.AnimalAlbergue?.id as number,
    usuario_envia_id: usuario?.id as number,
  };
  const { data, loading } = useGetOneNotificacionesInteresados(cond);
  const { showBlockUI, hideBlockUI } = useBlockUI();

  const createSolicitud = useCallback(async () => {
    const body: INotificacionesInteresados = {
      ...cond,
      visto: false,
      tipo: modalType === "adoptar" ? 1 : 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await CreateNotificacionInteresadosMutation(body);
    hideBlockUI();
  }, [selectedAnimal?.AnimalAlbergue?.id, user, hideBlockUI]);

  useEffect(() => {
    showBlockUI("Validando solicitud...");
    if (!loading && !data) createSolicitud();
    if (!loading && data) hideBlockUI();
  }, [loading, data]);

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
            className="rounded-full object-cover border-2 border-emerald-200"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <FaCheck className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className={`bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-3 ${data?.aprobado === false ? 'bg-red-50 border-red-200' : data?.aprobado === true ? 'bg-green-50 border-green-200' : ''}`}>
            <h3 className={`text-lg font-bold mb-1 ${data?.aprobado === false ? 'text-red-900' : data?.aprobado === true ? 'text-green-900' : 'text-emerald-900'}`}>
              {data ? (
                data.aprobado === null ? "Solicitud ya enviada" :
                data.aprobado === false ? "Solicitud Rechazada" :
                "Solicitud Aceptada"
              ) : "¡Solicitud Registrada!"}
            </h3>
            <p className={`text-sm ${data?.aprobado === false ? 'text-red-800' : data?.aprobado === true ? 'text-green-800' : 'text-emerald-800'}`}>
              {data ? (
                data.aprobado === null ? (
                  <>
                    Ya has enviado una solicitud para{" "}
                    <span className="font-semibold">
                      {selectedAnimal?.nombre}
                    </span>
                    . El establecimiento revisará tu solicitud pronto.
                  </>
                ) : data.aprobado === false ? (
                  <>
                    Lamentablemente, tu solicitud para{" "}
                    {modalType === "adoptar" ? "adoptar" : "apadrinar"} a{" "}
                    <span className="font-semibold">
                      {selectedAnimal?.nombre}
                    </span>{" "}
                    ha sido rechazada. Puedes contactar al establecimiento para más información.
                  </>
                ) : (
                  <>
                    ¡Felicidades! Tu solicitud para{" "}
                    {modalType === "adoptar" ? "adoptar" : "apadrinar"} a{" "}
                    <span className="font-semibold">
                      {selectedAnimal?.nombre}
                    </span>{" "}
                    ha sido aceptada. El establecimiento se pondrá en contacto contigo pronto.
                  </>
                )
              ) : (
                <>
                  <span className="font-semibold">
                    {selectedAnimal?.AnimalAlbergue?.Albergue?.nombre}
                  </span>{" "}
                  ha sido notificado de tu interés en{" "}
                  {modalType === "adoptar" ? "adoptar" : "apadrinar"} a{" "}
                  <span className="font-semibold">
                    {selectedAnimal?.nombre}
                  </span>
                  .
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
          <FaEnvelope className="w-4 h-4 mr-2 text-gray-600" />
          Contacto del establecimiento
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
                className="text-emerald-600 hover:text-emerald-800 font-medium text-sm transition-colors block truncate"
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
                  className="text-emerald-600 hover:text-emerald-800 font-medium text-sm transition-colors block truncate"
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
