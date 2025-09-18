import { supabase } from "@/lib/supabase/client";
import { IAnimalAlbergue } from "@/types/interfaces/animalAlbergue";

export const UpdateAnimalAlbergueEstadoMutation = async ({
  animalAlbergueId,
  body,
}: {
  animalAlbergueId: number;
  body: IAnimalAlbergue;
}) => {
  try {
    const { data, error } = await supabase
      .from("animal_albergue")
      .update(body)
      .eq("id", animalAlbergueId)
      .select()
      .single();

    if (error) throw error;

    return { data };
  } catch (error) {
    console.error("Error al actualizar estado de animal_albergue:", error);
    return { error };
  }
};
