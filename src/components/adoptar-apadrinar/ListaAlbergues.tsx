"use client";

import { useAlbergues } from "@/hooks/useAlbergues";

import { TiposUsuarioEnum } from "@/types/enums/enums";
import { IMunicipio } from "@/types/interfaces/municipio";
import { useEffect, useState } from "react";

import { PaginationControls } from "../common/PaginationControls";
import { AlbergueCard } from "./AlbergueCard";

interface ListaAlberguesProps {
  className?: string;
  itemsPerPage?: number;
  municipio_id?: number;
  municipios: IMunicipio[];
  tipo: number;
}

export const ListaAlbergues: React.FC<ListaAlberguesProps> = ({
  className = "",
  itemsPerPage = 9,
  municipio_id,
  municipios,
  tipo,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filtros, setFiltros] = useState({
    municipio_id: municipio_id,
    tipo,
  });

  const { data: albergues, loading, error } = useAlbergues(filtros);

  useEffect(() => {
    setFiltros({
      municipio_id: municipio_id,
      tipo,
    });
    setCurrentPage(1); // Reiniciar página cuando cambien los filtros
  }, [municipio_id, tipo]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAlbergues = albergues.slice(startIndex, endIndex);
  const totalPages = Math.ceil(albergues.length / itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 450, behavior: "smooth" });
  };

  const getMunicipioNombre = () => {
    if (!municipio_id) return "Todos los municipios";
    const municipio = municipios.find((m) => m.id === municipio_id);
    return municipio ? municipio.nombre : `Municipio ${municipio_id}`;
  };

  if (error) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-red-600 text-lg mb-2">
            ⚠️ Error al cargar{" "}
            {tipo === TiposUsuarioEnum.ALBERGUE ? "albergues" : "veterinarias"}
          </div>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Header con información del filtro */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-emerald-800">
              {tipo === TiposUsuarioEnum.ALBERGUE
                ? "Albergues"
                : "Veterinarias"}{" "}
              en {getMunicipioNombre()}
            </h2>
            {!loading && (
              <p className="text-gray-600 mt-1">
                {albergues.length}{" "}
                {tipo === TiposUsuarioEnum.ALBERGUE
                  ? "albergue"
                  : "veterinaria"}
                {albergues.length !== 1 ? "s" : ""} encontrado
                {albergues.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Pagination superior - Solo mostrar si hay resultados */}
      {!loading && albergues.length > 0 && totalPages > 1 && (
        <div className="mb-6">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}

      {/* Contenido principal */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <span className="ml-3 text-gray-600">Cargando {tipo === TiposUsuarioEnum.ALBERGUE ? "albergues" : "veterinarias"}...</span>
        </div>
      ) : albergues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay albergues disponibles
          </h3>
          <p className="text-gray-500 max-w-md">
            {municipio_id
              ? `No se encontraron albergues en ${getMunicipioNombre()}.`
              : "No hay albergues registrados en el sistema."}
          </p>
          <p className="text-sm text-emerald-600 mt-3">
            💡 Intenta seleccionar otro municipio
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {currentAlbergues.map((albergue) => (
            <AlbergueCard key={albergue.id} albergue={albergue} />
          ))}
        </div>
      )}

      {/* Paginación inferior - Solo mostrar si hay resultados */}
      {!loading && albergues.length > 0 && totalPages > 1 && (
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
