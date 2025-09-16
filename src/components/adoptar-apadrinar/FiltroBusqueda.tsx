"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMunicipios } from "@/hooks/useMunicipios";
import { useEspecies } from "@/hooks/useEspecies";
import { useSexoAnimal } from "@/hooks/useSexoAnimal";

interface IFormData {
  municipio_id: string;
  especie_id: string;
  sexo_id: string;
}

interface IFiltroBusquedaProps {
  onFilterChange?: (data: IFormData) => void;
  className?: string;
}

export const FiltroBusqueda: React.FC<IFiltroBusquedaProps> = ({
  onFilterChange,
  className = "",
}) => {
  const municipios = useMunicipios();
  const especies = useEspecies();
  const sexoAnimal = useSexoAnimal();

  const loading = municipios.loading || especies.loading || sexoAnimal.loading;
  const error = municipios.error || especies.error || sexoAnimal.error;

  const { register, watch } = useForm<IFormData>({
    defaultValues: {
      municipio_id: "",
      especie_id: "",
      sexo_id: "",
    },
  });

  useEffect(() => {
    const subscription = watch((formData) => {
      onFilterChange?.(formData as IFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onFilterChange]);

  // Calcular filtros activos para el indicador
  const watchedValues = watch();
  const filtrosActivos = Object.values(watchedValues).filter(
    (value) => value && value !== ""
  ).length;

  if (loading) {
    return (
      <div className={`w-full bg-white p-4 rounded-lg shadow-md ${className}`}>
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
          <span className="ml-2 text-gray-600">Cargando filtros...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full bg-white p-4 rounded-lg shadow-md ${className}`}>
        <div className="text-center py-4 text-red-600">
          Error al cargar filtros: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-white p-4 rounded-lg shadow-md ${className}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
        <h3 className="text-lg font-semibold text-emerald-800 mb-2 sm:mb-0">
          Filtrar Búsqueda
        </h3>
        {filtrosActivos > 0 && (
          <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
            <span className="text-emerald-700 text-xs font-medium">
              📋 {filtrosActivos} filtro{filtrosActivos !== 1 ? "s" : ""} activo
              {filtrosActivos !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      <form className="space-y-2 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4">
        <div className="w-full">
          <label
            htmlFor="municipio"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Municipio
          </label>
          <select
            id="municipio"
            {...register("municipio_id")}
            className="w-full px-3 py-2 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:shadow-md transition-shadow duration-200"
          >
            <option value="">Todos los municipios</option>
            {municipios.data.map((municipio) => (
              <option key={municipio.id} value={municipio.id.toString()}>
                {municipio.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Especie */}
        <div className="w-full">
          <label
            htmlFor="especie"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Especie
          </label>
          <select
            id="especie"
            {...register("especie_id")}
            className="w-full px-3 py-2 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:shadow-md transition-shadow duration-200"
          >
            <option value="">Todas las especies</option>
            {especies.data.map((especie) => (
              <option key={especie.id} value={especie.id.toString()}>
                {especie.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Sexo */}
        <div className="w-full">
          <label
            htmlFor="sexo"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Sexo
          </label>
          <select
            id="sexo"
            {...register("sexo_id")}
            className="w-full px-3 py-2 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:shadow-md transition-shadow duration-200"
          >
            <option value="">Todos los sexos</option>
            {sexoAnimal.data.map((sexo) => (
              <option key={sexo.id} value={sexo.id.toString()}>
                {sexo.nombre}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
};
