"use client";

import Image from "next/image";
import { FaEdit, FaEye, FaHeart, FaTrash } from "react-icons/fa";
import { GiDogHouse } from "react-icons/gi";
import { SplitButton } from "@/components/common/SplitButton";
import { IAnimal } from "@/types/interfaces/animal";

interface MascotaCardProps {
  openDisponibleModal: (id: number) => void;
  openDeleteModal: (id: number) => void;
  push: (path: string) => void;
  animal: IAnimal;
}

export const MascotaCard = ({
  openDisponibleModal,
  openDeleteModal,
  animal,
  push,
}: MascotaCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200">
      <div className="flex flex-col md:flex-row items-center p-4">
        <div className="relative w-32 h-32 md:w-20 md:h-20 bg-gray-100 flex-shrink-0 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-4">
          {animal.imagen_url ? (
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

          {animal.AnimalAlbergue?.es_perdido && (
            <div className="absolute top-1 left-1 bg-amber-500 text-white px-1 py-0.5 rounded text-xs font-medium">
              Perdido
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 w-full md:w-auto">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1 min-w-0 mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {animal.nombre}
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                {animal.especies?.nombre}
                {animal.AnimalAlbergue?.Estado?.nombre && (
                  <span className="ml-2 font-semibold text-gray-600">
                    • {animal.AnimalAlbergue.Estado.nombre}
                  </span>
                )}
              </p>
              <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-3 mt-2 text-sm text-gray-600">
                <span>Sexo: {animal.sexo_animal?.nombre}</span>
                <span>
                  Edad: {animal.edad} {animal.tipo_edad_animal?.nombre}
                </span>
                <span>Tamaño: {animal.tamano_animal?.nombre}</span>
                <span>Ciudad: {animal.municipios?.nombre}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {animal.created_at && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                    Registrado:{" "}
                    {new Date(animal.created_at).toLocaleDateString("es-ES")}
                  </span>
                )}
                <div className="w-2"></div>
                {animal.esta_desparasitado && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    ✓ Desparasitado
                  </span>
                )}
                {animal.esta_vacunado && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    ✓ Vacunado
                  </span>
                )}
                {animal.esta_esterilizado && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                    ✓ Esterilizado
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
              <SplitButton
                mainLabel="Opciones"
                options={[
                  ...(animal.AnimalAlbergue?.Estado
                    ? []
                    : [
                        {
                          label: "Poner en adopción",
                          icon: <GiDogHouse className="w-4 h-4" />,
                          action: () =>
                            push(
                              `/mascotas/mis-mascotas/adopcion/${animal.AnimalAlbergue?.id}`
                            ),
                          color: "text-gray-600",
                          hoverColor: "bg-orange-50",
                        },
                        {
                          label: "Ofrecer apadrinamiento",
                          icon: <FaHeart className="w-4 h-4" />,
                          action: () =>
                            push(
                              `/mascotas/mis-mascotas/apadrinamiento/${animal.AnimalAlbergue?.id}`
                            ),
                          color: "text-gray-600",
                          hoverColor: "bg-orange-50",
                        },
                      ]),
                  ...(animal.AnimalAlbergue?.Estado
                    ? [
                        {
                          label: "Disponible para adopción/apadrinamiento",
                          icon: <GiDogHouse className="w-4 h-4" />,
                          action: () => {
                            if (animal.AnimalAlbergue?.id) {
                              openDisponibleModal(animal.AnimalAlbergue.id);
                            }
                          },
                          color: "text-gray-600",
                          hoverColor: "bg-orange-50",
                        },
                      ]
                    : []),
                  {
                    label: "Ver seguimiento",
                    icon: <FaEye className="w-4 h-4" />,
                    action: () =>
                      push(
                        `/mascotas/mis-mascotas/seguimiento/${animal.AnimalAlbergue?.id}`
                      ),
                    color: "text-gray-600",
                    hoverColor: "bg-orange-50",
                  },
                  {
                    label: "Editar información",
                    icon: <FaEdit className="w-4 h-4" />,
                    action: () => push(`/mascotas/mis-mascotas/${animal.id}`),
                    color: "text-gray-600",
                    hoverColor: "bg-orange-50",
                  },
                  {
                    label: "Eliminar mascota",
                    icon: <FaTrash className="w-4 h-4" />,
                    action: () => {
                      if (animal.AnimalAlbergue?.id) {
                        openDeleteModal(animal.AnimalAlbergue.id);
                      }
                    },
                    color: "text-gray-600",
                    hoverColor: "bg-orange-50",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
