"use client";

import Image from "next/image";

import { IAnimal } from "@/types/interfaces/animal";

interface ListaAnimalesCardProps {
  animal: IAnimal;
  onOpenModal: (animal: IAnimal, type: "adoptar" | "apadrinar" | "visto") => void;
}

export const ListaAnimalesCard: React.FC<ListaAnimalesCardProps> = ({
  animal,
  onOpenModal,
}) => {

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-gray-100">
      <div className="relative h-40 bg-gradient-to-br from-emerald-50 to-blue-50 overflow-hidden">
        <div className="absolute bottom-2 left-2 w-12 h-12 opacity-20">
          <Image
            src="/img/bienestar-animal-recortada.png"
            alt="Bienestar Animal"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>

        <Image
          src={animal.imagen_url as string}
          alt={animal.nombre || "Imagen de la mascota"}
          width={140}
          height={140}
          className="absolute w-40 h-40 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            clipPath: "polygon(50% 0%, 100% 25%, 82% 100%, 18% 100%, 0% 25%)",
          }}
        />
      </div>

      <div className="p-3">
        <div className="text-center mb-2">
          <h3 className="text-base font-bold text-gray-800 mb-1">
            {animal.nombre}
          </h3>
          <p className="text-emerald-600 text-xs font-medium">
            {animal?.AnimalAlbergue?.Albergue?.nombre}
          </p>
        </div>

        <div className="space-y-0.5 mb-3 text-xs">
          <div className="flex items-center justify-between text-gray-700">
            <span className="flex items-center">
              <span className="font-medium">Especie:</span>
            </span>
            <span>{animal.especies?.nombre}</span>
          </div>

          <div className="flex items-center justify-between text-gray-700">
            <span className="font-medium">Sexo:</span>
            <span>{animal.sexo_animal?.nombre}</span>
          </div>

          <div className="flex items-center justify-between text-gray-700">
            <span className="font-medium">Edad:</span>
            <span>
              {animal.edad} {animal.tipo_edad_animal?.nombre.toLowerCase()}
            </span>
          </div>

          <div className="flex items-center justify-between text-gray-700">
            <span className="font-medium">Tamaño:</span>
            <span>{animal.tamano_animal?.nombre}</span>
          </div>

          <div className="flex items-center justify-between text-gray-700">
            Ciudad:
            <span className="text-xs">{animal.municipios?.nombre}</span>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                animal.esta_vacunado
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {animal.esta_vacunado ? "✓ Vacunado" : "✗ Sin vacunar"}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                animal.esta_desparasitado
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {animal.esta_desparasitado
                ? "✓ Desparasitado"
                : "✗ Sin desparasitar"}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                animal.esta_esterilizado
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {animal.esta_esterilizado
                ? "✓ Esterilizado"
                : "○ Sin esterilizar"}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {animal.AnimalAlbergue?.es_perdido && !animal.AnimalAlbergue?.estado_id  && (
            <button
              onClick={() => onOpenModal(animal, "visto")}
              className="flex-1 cursor-pointer bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-200 text-gray-700 py-2 px-3 rounded-lg text-xs font-semibold hover:from-gray-200 hover:to-gray-300 hover:scale-105 transition-all duration-300 transform shadow-md shadow-gray-200"
            >
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm">🔍</span>
                <span>¿Lo has visto?</span>
              </div>
            </button>
          )}

          <div
            hidden={
              !!animal.AnimalAlbergue?.estado_id ||
              animal.AnimalAlbergue?.es_perdido
            }
            className="flex gap-2 flex-1"
          >
            <button
              onClick={() => onOpenModal(animal, "apadrinar")}
              className="cursor-pointer flex-1 bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-200 text-gray-700 py-2 px-3 rounded-lg text-xs font-semibold hover:from-gray-200 hover:to-gray-300 hover:scale-105 transition-all duration-300 transform shadow-md shadow-gray-200"
            >
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm">❤️</span>
                <span>Apadrinar</span>
              </div>
            </button>
            <button
              onClick={() => onOpenModal(animal, "adoptar")}
              className="cursor-pointer  flex-1 bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-200 text-gray-700 py-2 px-3 rounded-lg text-xs font-semibold hover:from-gray-200 hover:to-gray-300 hover:scale-105 transition-all duration-300 transform shadow-md shadow-gray-200"
            >
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm">🏠</span>
                <span>Adoptar</span>
              </div>
            </button>
          </div>

          <div
            hidden={!animal.AnimalAlbergue?.estado_id}
            className="flex gap-2 flex-1"
          >
            <button
              className={`flex-1 rounded-lg  cursor-default bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-200 text-gray-700 py-2 px-3 text-xs font-semibold transition-all duration-300 transform shadow-md shadow-gray-200`}
              disabled
            >
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm">
                  {animal.AnimalAlbergue?.Estado?.nombre === "Adoptado"
                    ? "🏠"
                    : "❤️"}
                </span>
                <span>{animal.AnimalAlbergue?.Estado?.nombre}</span>
                <span className="text-xs opacity-80">✓</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
