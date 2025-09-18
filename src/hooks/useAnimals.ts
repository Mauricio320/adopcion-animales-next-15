import { supabase } from "@/lib/supabase/client";

import { IAnimal, IUseAnimalsOptions } from "@/types/interfaces/animal";
import { IAnimalAlbergue } from "@/types/interfaces/animalAlbergue";
import { useCallback, useEffect, useState } from "react";

// Función helper para transformar datos de animal desde Supabase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformAnimalData = (animal: Record<string, any>): IAnimal => {
  return {
    ...animal,
    AnimalAlbergue: animal.animal_albergue?.[0]
      ? {
          id: animal.animal_albergue[0].id,
          animal_id: animal.animal_albergue[0].animal_id,
          es_perdido: animal.animal_albergue[0].es_perdido,
          estado_id: animal.animal_albergue[0].estado_id,
          Estado: animal.animal_albergue[0].estado_animal,
          albergue_id: animal.animal_albergue[0].albergue_id,
          Albergue: animal.animal_albergue[0].albergues,
          created_at: animal.animal_albergue[0].created_at,
          updated_at: animal.animal_albergue[0].updated_at,
        }
      : undefined,
  };
};

export const useAnimals = (options: IUseAnimalsOptions = {}) => {
  const [animals, setAnimals] = useState<IAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchAnimals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from("animales").select(
        `
          *,
          especies (*),
          sexo_animal (*),
          tamano_animal (*),
          municipios (*),
          tipo_edad_animal (*),
          animal_albergue!inner (
            *,
            estado_animal (*),
            albergues (*)
          )
        `,
        { count: "exact" }
      );

      query = query.eq("animal_albergue.activo", true);

      if (options.es_perdido !== undefined) {
        query = query.eq("animal_albergue.es_perdido", options.es_perdido);
      }

      if (options.estado_id !== undefined) {
        if (options.estado_id === null) {
          query = query.is("animal_albergue.estado_id", null);
        } else {
          query = query.eq("animal_albergue.estado_id", options.estado_id);
        }
      }

      if (options.albergue_id) {
        query = query.eq("animal_albergue.albergue_id", options.albergue_id);
      }

      if (options.especie_id) {
        query = query.eq("especie_id", options.especie_id);
      }

      if (options.municipio_id) {
        query = query.eq("municipio_id", options.municipio_id);
      }

      if (options.sexo_id) {
        query = query.eq("sexo_id", options.sexo_id);
      }

      if (options.tamano_animal_id) {
        query = query.eq("tamano_animal_id", options.tamano_animal_id);
      }

      if (options.tipo_edad_id) {
        query = query.eq("tipo_edad_id", options.tipo_edad_id);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        );
      }

      // Ordenamiento
      const orderBy = options.orderBy || "created_at";
      query = query.order(orderBy, { ascending: false });

      const { data, error: supabaseError, count } = await query;

      if (supabaseError) throw supabaseError;

      const transformedData: IAnimal[] = data?.map(transformAnimalData) || [];

      setAnimals(transformedData);
      setTotal(count || 0);
    } catch (err) {
      console.error("Error fetching animals:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  return {
    refetch: fetchAnimals,
    data: animals,
    loading,
    error,
    total,
  };
};

export const CreateAnimalMutation = async ({
  animalData,
  animal_albergue,
}: {
  animalData: IAnimal;
  animal_albergue: IAnimalAlbergue;
}) => {
  try {
    delete animalData["es_perdido"];

    const { data: animal } = await supabase
      .from("animales")
      .insert([animalData])
      .select()
      .single();

    // Crear la relación con el albergue
    await supabase.from("animal_albergue").insert([
      {
        animal_id: animal.id,
        ...animal_albergue,
      },
    ]);

    return { animal };
  } catch (error) {
    console.error("Error al crear mascota:", error);
    return { error };
  }
};

export const getAnimalById = async (
  id: number | string,
  albergueId: number
): Promise<IAnimal | null> => {
  try {
    const { data, error } = await supabase
      .from("animales")
      .select(
        `
          *,
          especies (*),
          sexo_animal (*),
          tamano_animal (*),
          municipios (*),
          tipo_edad_animal (*),
          animal_albergue!inner (
            *,
            estado_animal (*),
            albergues (*)
          )
        `
      )
      .eq("id", id)
      .eq("animal_albergue.albergue_id", albergueId)
      .eq("animal_albergue.activo", true)
      .single();

    if (error) throw error;

    const transformedData: IAnimal = transformAnimalData(data);

    return transformedData;
  } catch (error) {
    console.error("Error al obtener mascota:", error);
    return null;
  }
};

export const UpdateAnimalMutation = async ({
  animalId,
  animalData,
  animal_albergue,
}: {
  animalId: number;
  animalData: Partial<IAnimal>;
  animal_albergue?: Partial<IAnimalAlbergue>;
}) => {
  try {
    // Actualizar datos del animal
    delete animalData["es_perdido"];
    const { data: animal, error: animalError } = await supabase
      .from("animales")
      .update(animalData)
      .eq("id", animalId)
      .select()
      .single();

    if (animalError) throw animalError;

    // Actualizar relación con albergue si se proporciona
    if (animal_albergue) {
      const { error: albergueError } = await supabase
        .from("animal_albergue")
        .update(animal_albergue)
        .eq("animal_id", animalId);

      if (albergueError) throw albergueError;
    }

    return { animal };
  } catch (error) {
    console.error("Error al actualizar mascota:", error);
    return { error };
  }
};

