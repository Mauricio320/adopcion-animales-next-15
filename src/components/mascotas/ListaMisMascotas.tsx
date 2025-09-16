"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import { PaginationControls } from "@/components/common/PaginationControls";
import { SplitButton } from "@/components/common/SplitButton";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAnimals } from "@/hooks/useAnimals";
import { useMemo, useState } from "react";
import { FaEdit, FaHeart, FaTrash } from "react-icons/fa";
import { GiDogHouse } from "react-icons/gi";

const ITEMS_PER_PAGE = 10;

export const ListaMisMascotas = () => {
  const { user } = useAuthContext();
  const [currentPage, setCurrentPage] = useState(1);

  const albergueId = user?.usuario?.usuario_albergue?.albergue_id;

  const {
    data: animals,
    loading,
    error,
    total,
  } = useAnimals({
    albergue_id: albergueId,
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
    orderBy: "created_at",
  });

  const totalPages = useMemo(() => {
    return Math.ceil(total / ITEMS_PER_PAGE);
  }, [total]);

  const onPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const onNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const onGoToPage = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar las mascotas: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
        <div className="px-8 py-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-emerald-800">
              Mis Mascotas
            </h2>
            <p className="text-emerald-600 text-sm font-medium">
              Total de mascotas:{" "}
              <span className="font-semibold text-emerald-700">{total}</span>
            </p>
          </div>
        </div>

        {animals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No tienes mascotas registradas</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Especie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sexo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Edad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tamaño
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ciudad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {animals.map((animal) => (
                    <tr key={animal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {animal.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {animal.especies?.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {animal.sexo_animal?.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {animal.edad} {animal.tipo_edad_animal?.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {animal.tamano_animal?.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {animal.municipios?.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <SplitButton
                          mainLabel="Opciones"
                          options={[
                            {
                              label: "Poner en adopción",
                              icon: <GiDogHouse className="w-4 h-4" />,
                              action: () =>
                                console.log("Poner en adopción", animal.id),
                              color: "text-gray-500",
                              hoverColor: "bg-green-50",
                            },
                            {
                              label: "Ofrecer apadrinamiento",
                              icon: <FaHeart className="w-4 h-4" />,
                              action: () =>
                                console.log(
                                  "Ofrecer apadrinamiento",
                                  animal.id
                                ),
                              color: "text-gray-500",
                              hoverColor: "bg-green-50",
                            },
                            {
                              label: "Editar información",
                              icon: <FaEdit className="w-4 h-4" />,
                              action: () =>
                                console.log("Editar información", animal.id),
                              color: "text-gray-500",
                              hoverColor: "bg-green-50",
                            },
                            {
                              label: "Eliminar mascota",
                              icon: <FaTrash className="w-4 h-4" />,
                              action: () =>
                                console.log("Eliminar mascota", animal.id),
                              color: "text-gray-500",
                              hoverColor: "bg-green-50",
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPreviousPage={onPreviousPage}
                  onNextPage={onNextPage}
                  onGoToPage={onGoToPage}
                  getPageNumbers={getPageNumbers}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
