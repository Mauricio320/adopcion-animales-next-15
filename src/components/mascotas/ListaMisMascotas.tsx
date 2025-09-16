"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import { PaginationControls } from "@/components/common/PaginationControls";
import { SplitButton } from "@/components/common/SplitButton";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAnimals } from "@/hooks/useAnimals";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaHeart, FaTrash, FaPlus, FaList } from "react-icons/fa";
import { GiDogHouse } from "react-icons/gi";
import Image from "next/image";

const ITEMS_PER_PAGE = 10;

export const ListaMisMascotas = () => {
  const { user } = useAuthContext();
  const { push } = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const albergueId = user?.usuario?.usuario_albergue?.albergue_id;

  // Memoizar las opciones del hook para evitar recrear el objeto
  const animalsOptions = useMemo(
    () => ({
      albergue_id: albergueId,
      limit: ITEMS_PER_PAGE,
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
      orderBy: "created_at" as const,
    }),
    [albergueId, currentPage]
  );

  const { data: animals, loading, error, total } = useAnimals(animalsOptions);

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
    <div >
      <PageHeader
        title="Mis mascotas"
        icon={<FaList className="w-8 h-8 text-emerald-600" />}
        redirectPath="/dashboard"
        rightContent={
          <div className="flex items-center gap-4">
            <p className="text-emerald-600 text-sm font-medium">
              Total de mascotas:{" "}
              <span className="font-semibold text-emerald-700">{total}</span>
            </p>
            <button
              onClick={() => push("/mascotas/registrar")}
              className="inline-flex cursor-pointer items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200 shadow-md"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Agregar Mascota
            </button>
          </div>
        }
      />

      {animals.length === 0 ? (
        <div className="text-center py-16 px-6">
          <div className="w-32 h-32 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-100">
            <svg
              className="w-16 h-16 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No tienes mascotas registradas
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Comienza registrando tu primera mascota para darle un hogar y
            encontrarle una familia amorosa.
          </p>
          <button
            onClick={() => push("/mascotas/registrar")}
            className="inline-flex cursor-pointer items-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Registrar Primera Mascota
          </button>
        </div>
      ) : (
        <>
          {/* Lista de tarjetas en filas */}
          <div className="p-6">
            <div className="space-y-6">
              {animals.map((animal) => (
                <div
                  key={animal.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Imagen del animal */}
                    <div className="relative w-full md:w-64 h-48 md:h-40 bg-gray-100 flex-shrink-0 shadow-md rounded-t-xl overflow-hidden">
                      {animal.imagen_url ? (
                        <Image
                          src={animal.imagen_url}
                          alt={animal.nombre || "Imagen de mascota"}
                          fill
                          className="object-cover rounded-t-xl"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center rounded-t-xl bg-gray-50">
                          <svg
                            className="w-16 h-16 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Estado perdido */}
                      {animal.AnimalAlbergue?.es_perdido && (
                        <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Perdido
                        </div>
                      )}
                    </div>

                    {/* Información del animal */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {animal.nombre}
                          </h3>
                          <p className="text-sm text-emerald-600 font-medium">
                            {animal.especies?.nombre}
                          </p>
                        </div>

                        {/* Botones de acción */}
                        <div className="mt-3 md:mt-0">
                          <SplitButton
                            mainLabel="Opciones"
                            options={[
                              {
                                label: "Poner en adopción",
                                icon: <GiDogHouse className="w-4 h-4" />,
                                action: () => {
                                  // TODO: Implementar lógica para poner en adopción
                                  console.log("Poner en adopción", animal.id);
                                },
                                color: "text-gray-600",
                                hoverColor: "bg-green-50",
                              },
                              {
                                label: "Ofrecer apadrinamiento",
                                icon: <FaHeart className="w-4 h-4" />,
                                action: () => {
                                  // TODO: Implementar lógica para ofrecer apadrinamiento
                                  console.log(
                                    "Ofrecer apadrinamiento",
                                    animal.id
                                  );
                                },
                                color: "text-gray-600",
                                hoverColor: "bg-green-50",
                              },
                              {
                                label: "Editar información",
                                icon: <FaEdit className="w-4 h-4" />,
                                action: () =>
                                  push(`/mascotas/mis-mascotas/${animal.id}`),
                                color: "text-gray-600",
                                hoverColor: "bg-green-50",
                              },
                              {
                                label: "Eliminar mascota",
                                icon: <FaTrash className="w-4 h-4" />,
                                action: () => {
                                  // TODO: Implementar lógica para eliminar mascota
                                  console.log("Eliminar mascota", animal.id);
                                },
                                color: "text-gray-600",
                                hoverColor: "bg-green-50",
                              },
                            ]}
                          />
                        </div>
                      </div>

                      {/* Detalles principales */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Sexo
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {animal.sexo_animal?.nombre}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Edad
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {animal.edad} {animal.tipo_edad_animal?.nombre}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Tamaño
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {animal.tamano_animal?.nombre}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Ciudad
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {animal.municipios?.nombre}
                          </p>
                        </div>
                      </div>

                      {/* Estado de salud */}
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          Estado de salud:
                        </p>
                        <div className="flex flex-wrap gap-2">
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

                      {/* Fecha de registro */}
                      <div className="text-xs text-gray-500">
                        Registrado:{" "}
                        {new Date(animal.created_at || "").toLocaleDateString(
                          "es-ES"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200">
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
  );
};
