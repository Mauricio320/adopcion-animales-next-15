"use client";

import { useState } from "react";
import { BannerPage } from "../common/banner-page";
import { ListaAlbergues } from "../common/ListaAlbergues";
import { useMunicipios } from "@/hooks/useMunicipios";

export const Instituciones = () => {
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState<number>();
  const { data: municipios, loading: loadingMunicipios } = useMunicipios();

  const handleMunicipioChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setMunicipioSeleccionado(value ? Number(value) : undefined);
  };

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

      <ListaAlbergues
        municipio_id={municipioSeleccionado}
        municipios={municipios}
        className="mt-4"
      />
    </div>
  );
};
