import { useMunicipios } from "./useMunicipios";
import { useEspecies } from "./useEspecies";
import { useSexoAnimal } from "./useSexoAnimal";

/**
 * Hook combinado para obtener todos los datos de referencia de una vez
 * Útil cuando necesitas cargar múltiples catálogos en un solo componente
 */
export const useReferenceData = () => {
  const municipios = useMunicipios();
  const especies = useEspecies();
  const sexoAnimal = useSexoAnimal();

  const loading = municipios.loading || especies.loading || sexoAnimal.loading;
  const error = municipios.error || especies.error || sexoAnimal.error;

  const refetchAll = () => {
    municipios.refetch();
    especies.refetch();
    sexoAnimal.refetch();
  };

  return {
    municipios,
    especies,
    sexoAnimal,
    loading,
    error,
    refetchAll,
  };
};