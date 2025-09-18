"use client";

import { useAnimals } from "@/hooks/useAnimals";
import { useMemo, useState } from "react";
import { ListaAnimalesCard } from "./ListaAnimalesCard";
import { Modal } from "./Modal";
import { PaginationControls } from "./PaginationControls";

interface ListaAnimalesProps {
  className?: string;
  itemsPerPage?: number;
  es_perdido?: boolean;
  municipio_id?: number;
  especie_id?: number;
  sexo_id?: number;
}

export const ListaAnimales: React.FC<ListaAnimalesProps> = ({
  className = "",
  itemsPerPage = 12,
  es_perdido = false,
  municipio_id,
  especie_id,
  sexo_id,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoizar los filtros para evitar recrear el objeto en cada render
  const filtros = useMemo(
    () => ({
      especie_id: especie_id,
      municipio_id: municipio_id,
      sexo_id: sexo_id,
      es_perdido,
    }),
    [especie_id, municipio_id, sexo_id, es_perdido]
  );

  const { data: animals, loading } = useAnimals(filtros);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnimals = animals.slice(startIndex, endIndex);
  const totalPages = Math.ceil(animals.length / itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 450, behavior: "smooth" });
  };

  return (
    <div className={`w-full ${className}`}>
      {!loading && animals.length > 0 && (
        <div className="mb-6">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Información sobre mascotas"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            {es_perdido
              ? "Este es el sistema para reportar y buscar mascotas perdidas. Aquí puedes:"
              : "Este es el sistema de adopción de mascotas. Aquí puedes:"}
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {es_perdido ? (
              <>
                <li>Reportar una mascota perdida</li>
                <li>Buscar mascotas reportadas como perdidas</li>
                <li>Contactar con los dueños de mascotas encontradas</li>
                <li>Filtrar por ubicación, especie y características</li>
              </>
            ) : (
              <>
                <li>Explorar mascotas disponibles para adopción</li>
                <li>Filtrar por especie, ubicación y características</li>
                <li>Contactar directamente con los albergues</li>
                <li>Conocer más sobre el proceso de adopción</li>
              </>
            )}
          </ul>
          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="text-emerald-800 font-medium">💡 Consejo</p>
            <p className="text-emerald-700 text-sm mt-1">
              Si no encuentras lo que buscas, intenta modificar los filtros de
              búsqueda o contacta directamente con los albergues de tu zona.
            </p>
          </div>
        </div>
      </Modal>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        Más información
      </button>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <span className="ml-3 text-gray-600">Cargando animales...</span>
        </div>
      ) : animals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {es_perdido
              ? "No hay mascotas perdidas"
              : "No hay mascotas disponibles"}
          </h3>
          <p className="text-gray-500 max-w-md">
            {es_perdido
              ? "En este momento no tenemos reportes de mascotas perdidas que coincidan con los filtros seleccionados."
              : "No hay mascotas disponibles para adopción que coincidan con los filtros seleccionados."}
          </p>
          <p className="text-sm text-emerald-600 mt-3">
            💡 Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {currentAnimals.map((animal) => (
            <ListaAnimalesCard key={animal.id} animal={animal} />
          ))}
        </div>
      )}

      {!loading && animals.length > 0 && (
        <div className="mt-8">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}
    </div>
  );
};
