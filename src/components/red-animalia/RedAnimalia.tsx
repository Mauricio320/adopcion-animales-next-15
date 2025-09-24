"use client";

import { useMunicipios } from "@/hooks/useMunicipios";
import { useUsuariosRedAnimalia } from "@/hooks/useUsuariosRedAnimalia";
import { useMemo, useState } from "react";
import { BannerPage } from "../common/BannerPage";
import { UsuarioCard } from "../adoptar-apadrinar/UsuarioCard";

export const RedAnimalia = () => {
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState<number>();

  const { data: municipios, loading: loadingMunicipios } = useMunicipios();

  const filtros = useMemo(
    () => ({
      municipio_id: municipioSeleccionado,
    }),
    [municipioSeleccionado]
  );

  const { data: usuarios, loading, error } = useUsuariosRedAnimalia(filtros);

  const handleMunicipioChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setMunicipioSeleccionado(value ? Number(value) : undefined);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-4">
        <BannerPage />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center mt-6">
          <div className="text-red-600 text-lg mb-2">
            ⚠️ Error al cargar usuarios de Red Animalia
          </div>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <BannerPage />

      <div className="w-full bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
          <h3 className="text-lg font-semibold text-emerald-800 mb-2 sm:mb-0 flex items-center gap-2">
            Filtrar por Municipio
          </h3>
        </div>

        <div className="max-w-md">
          <label
            htmlFor="municipio-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Selecciona un municipio
          </label>
          <select
            id="municipio-filter"
            value={municipioSeleccionado || ""}
            onChange={handleMunicipioChange}
            disabled={loadingMunicipios}
            className="w-full px-3 py-2 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:shadow-md transition-shadow duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Todos los municipios</option>
            {municipios.map((municipio) => (
              <option key={municipio.id} value={municipio.id.toString()}>
                {municipio.nombre}
              </option>
            ))}
          </select>
          {loadingMunicipios && (
            <p className="text-sm text-gray-500 mt-1">Cargando municipios...</p>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">
            Cargando miembros de Red Animalia...
          </span>
        </div>
      ) : usuarios.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay miembros disponibles
          </h3>
          <p className="text-gray-500 max-w-md">
            {municipioSeleccionado
              ? `No se encontraron miembros de Red Animalia en el municipio seleccionado.`
              : "No hay miembros registrados en la Red Animalia."}
          </p>
          <p className="text-sm text-blue-600 mt-3">
            💡 Intenta seleccionar otro municipio
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {usuarios.map((usuario) => (
            <UsuarioCard key={usuario.id} usuario={usuario} />
          ))}
        </div>
      )}
    </div>
  );
};
