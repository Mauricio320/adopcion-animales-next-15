import { IAnimalAlbergue } from "./animalAlbergue";
import { IEspecie } from "./especie";
import { IMunicipio } from "./municipio";
import { ISexoAnimal } from "./sexoAnimal";
import { ITamanoAnimal } from "./tamanoAnimal";
import { ITipoEdadAnimal } from "./tipoEdadAnimal";

export interface IAnimal {
  id?: number;
  nombre?: string;
  especie_id?: number;
  municipio_id?: number;
  sexo_id?: number;
  tamano_animal_id?: number;
  tipo_edad_id?: number;
  edad?: number;
  peso?: number;
  esta_desparasitado?: boolean;
  esta_vacunado?: boolean;
  esta_esterilizado?: boolean;
  imagen_url?: string;
  created_at?: string;
  updated_at?: string;
  animal_albergue?: IAnimalAlbergue;
  AnimalAlbergue?: IAnimalAlbergue;
  especies?: IEspecie;
  sexo_animal?: ISexoAnimal;
  tamano_animal?: ITamanoAnimal;
  municipios?: IMunicipio;
  tipo_edad_animal?: ITipoEdadAnimal;
  es_perdido?: boolean;
}

export interface IUseAnimalsOptions {
  es_perdido?: boolean;
  estado_id?: number | null;
  albergue_id?: number;
  especie_id?: number;
  municipio_id?: number;
  sexo_id?: number;
  tamano_animal_id?: number;
  tipo_edad_id?: number;
  limit?: number;
  offset?: number;
  orderBy?: "created_at" | "nombre" | "edad" | "peso";
  orderDirection?: "asc" | "desc";
}
