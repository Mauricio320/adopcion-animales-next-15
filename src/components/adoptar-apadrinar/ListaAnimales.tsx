"use client";

import { useAnimals } from "@/hooks/useAnimals";
import { useMemo, useState } from "react";
import { ListaAnimalesCard } from "./ListaAnimalesCard";
import { Modal } from "../common/Modal";
import { PaginationControls } from "../common/PaginationControls";
import { AdopcionModalContent } from "./AdopcionModalContent";
import { AnimalPerdidoModalContent } from "./AnimalPerdidoModalContent";
import { useAuthContext } from "@/contexts/AuthContext";
import { IAnimal } from "@/types/interfaces/animal";

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
  const { user } = useAuthContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<IAnimal | null>(null);
  const [modalType, setModalType] = useState<"adoptar" | "apadrinar" | "visto">("adoptar");

  // Memorizar los filtros para evitar recrear el objeto en cada render
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

  const handleOpenModal = (animal: IAnimal, type: "adoptar" | "apadrinar" | "visto") => {
    setSelectedAnimal(animal);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAnimal(null);
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
            <ListaAnimalesCard
              key={animal.id}
              animal={animal}
              onOpenModal={handleOpenModal}
            />
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

      {/* Modal único para toda la lista */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          modalType === "adoptar"
            ? "Solicitud de Adopción"
            : modalType === "apadrinar"
            ? "Solicitud de Apadrinamiento"
            : "Información de Mascota Perdida"
        }
        size="lg"
      >
        {modalType === "visto" ? (
          <AnimalPerdidoModalContent selectedAnimal={selectedAnimal} />
        ) : (
          <AdopcionModalContent
            selectedAnimal={selectedAnimal}
            modalType={modalType as "adoptar" | "apadrinar"}
            user={user}
          />
        )}
      </Modal>
    </div>
  );
};
