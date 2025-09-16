"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useEspecies } from "@/hooks/useEspecies";
import { useMunicipios } from "@/hooks/useMunicipios";
import { useSexoAnimal } from "@/hooks/useSexoAnimal";
import { useTamanoAnimal } from "@/hooks/useTamanoAnimal";
import { useTipoEdadAnimal } from "@/hooks/useTipoEdadAnimal";
import React, { useState } from "react";
import { ImageUploader } from "../common/ImageUploader";
import { PageHeader } from "../common/PageHeader";
import { uploadImageToSupabase } from "@/lib/supabase/upload-image";
import { CreateAnimalMutation } from "@/hooks/useAnimals";
import { IAnimal } from "@/types/interfaces/animal";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBlockUI } from "@/contexts/BlockUIContext";
import { useRouter } from "next/navigation";

interface FormData {
  nombre: string;
  especie_id: number | "";
  municipio_id: number | "";
  sexo_id: number | "";
  tamano_animal_id: number | "";
  tipo_edad_id: number | "";
  edad: number | "";
  peso: number | "";
  esta_desparasitado: boolean;
  esta_vacunado: boolean;
  esta_esterilizado: boolean;
  es_perdido: boolean;
  imagen_url: string;
}

const defaultFormData: FormData = {
  nombre: "",
  especie_id: "",
  municipio_id: "",
  sexo_id: "",
  tamano_animal_id: "",
  tipo_edad_id: "",
  edad: "",
  peso: "",
  esta_desparasitado: false,
  esta_vacunado: false,
  esta_esterilizado: false,
  es_perdido: false,
  imagen_url: "",
};

export const RegistrarMascotaForm = () => {
  const { user } = useAuthContext();
  const { showBlockUI, hideBlockUI } = useBlockUI();
  const { push } = useRouter();

  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imgFile, setImgFile] = useState<File | null>();

  // Hooks para obtener datos
  const { data: municipios, loading: loadingMunicipios } = useMunicipios();
  const { data: especies, loading: loadingEspecies } = useEspecies();
  const { data: sexoAnimal, loading: loadingSexo } = useSexoAnimal();
  const { data: tamanoAnimal, loading: loadingTamano } = useTamanoAnimal();
  const { data: tipoEdadAnimal, loading: loadingTipoEdad } =
    useTipoEdadAnimal();

  const isLoading =
    loadingMunicipios ||
    loadingEspecies ||
    loadingSexo ||
    loadingTamano ||
    loadingTipoEdad;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUploaded = (file?: File) => {
    setImgFile(file);
  };

  console.log({user});
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      showBlockUI("Registrando Mascota...");
      const { url } = await uploadImg();
      const animal: IAnimal = {
        ...formData,
        imagen_url: url,
      } as IAnimal;

      await CreateAnimalMutation({
        animalData: animal,
        animal_albergue: {
          albergue_id: user?.usuario?.usuario_albergue?.albergue_id,
          es_perdido: formData.es_perdido,
        },
      });

      push("/mascotas/mis-mascotas");
      hideBlockUI();
    } catch (error) {
      console.error("Error al registrar mascota:", error);
      alert("Error al registrar la mascota");
      hideBlockUI();
    } finally {
      setIsSubmitting(false);
      hideBlockUI();
    }
  };

  const uploadImg = async () => {
    return uploadImageToSupabase(imgFile as File, `mascota-${Date.now()}`);
  };

  if (isLoading) {
    return <LoadingSpinner text="Cargando formulario..." />;
  }

  return (
    <div>
      <PageHeader
        title="Registrar Nueva Mascota"
        icon="📋"
        redirectPath="/mascotas"
      />

      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Imagen - ocupa 3 filas */}
          <div className="md:row-span-3">
            <label
              htmlFor="imagen"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Imagen de la mascota*
            </label>
            <ImageUploader
              onImageUploaded={handleImageUploaded}
              currentImage={formData.imagen_url}
            />
          </div>

          {/* Input 1 - Nombre */}
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre de la mascota *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleTextChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Ingresa el nombre"
            />
          </div>

          {/* Input 2 - Especie */}
          <div>
            <label
              htmlFor="especie_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Especie *
            </label>
            <select
              id="especie_id"
              name="especie_id"
              required
              value={formData.especie_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Seleccionar especie</option>
              {especies.map((especie) => (
                <option key={especie.id} value={especie.id}>
                  {especie.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Input 3 - Municipio */}
          <div>
            <label
              htmlFor="municipio_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Municipio *
            </label>
            <select
              id="municipio_id"
              name="municipio_id"
              required
              value={formData.municipio_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Seleccionar municipio</option>
              {municipios.map((municipio) => (
                <option key={municipio.id} value={municipio.id}>
                  {municipio.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resto de campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="sexo_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Sexo *
            </label>
            <select
              id="sexo_id"
              name="sexo_id"
              required
              value={formData.sexo_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Seleccionar sexo</option>
              {sexoAnimal.map((sexo) => (
                <option key={sexo.id} value={sexo.id}>
                  {sexo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="tamano_animal_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tamaño *
            </label>
            <select
              id="tamano_animal_id"
              name="tamano_animal_id"
              required
              value={formData.tamano_animal_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Seleccionar tamaño</option>
              {tamanoAnimal.map((tamano) => (
                <option key={tamano.id} value={tamano.id}>
                  {tamano.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="edad"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Edad *
            </label>
            <input
              type="number"
              id="edad"
              name="edad"
              required
              min="0"
              value={formData.edad}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Edad en años"
            />
          </div>

          <div>
            <label
              htmlFor="tipo_edad_id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tipo de edad *
            </label>
            <select
              id="tipo_edad_id"
              name="tipo_edad_id"
              required
              value={formData.tipo_edad_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Seleccionar tipo de edad</option>
              {tipoEdadAnimal.map((tipoEdad) => (
                <option key={tipoEdad.id} value={tipoEdad.id}>
                  {tipoEdad.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="peso"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Peso (kg) *
            </label>
            <input
              type="number"
              id="peso"
              name="peso"
              required
              min="0"
              step="0.1"
              value={formData.peso}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Peso en kilogramos"
            />
          </div>
        </div>

        {/* Campos booleanos */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Estado de salud
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="esta_desparasitado"
                name="esta_desparasitado"
                checked={formData.esta_desparasitado}
                onChange={handleInputChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label
                htmlFor="esta_desparasitado"
                className="ml-2 text-sm text-gray-700"
              >
                Está desparasitado
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="esta_vacunado"
                name="esta_vacunado"
                checked={formData.esta_vacunado}
                onChange={handleInputChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label
                htmlFor="esta_vacunado"
                className="ml-2 text-sm text-gray-700"
              >
                Está vacunado
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="esta_esterilizado"
                name="esta_esterilizado"
                checked={formData.esta_esterilizado}
                onChange={handleInputChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label
                htmlFor="esta_esterilizado"
                className="ml-2 text-sm text-gray-700"
              >
                Está esterilizado
              </label>
            </div>
          </div>
        </div>

        {/* Estado del animal */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Estado del animal
          </h3>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="es_perdido"
                name="es_perdido"
                checked={formData.es_perdido}
                onChange={handleInputChange}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label
                htmlFor="es_perdido"
                className="ml-3 text-sm text-gray-700"
              >
                <span className="font-medium">¿Es un animal perdido?</span>
                <br />
                <span className="text-xs text-gray-500">
                  Marca esta opción si encontraste este animal pero no pudiste
                  localizar a su dueño
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isSubmitting || !imgFile}
            className={`px-8 cursor-pointer disabled:bg-gray-100 disabled:text-gray-500 py-3 rounded-md text-white font-medium transition-colors ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Registrando...
              </div>
            ) : (
              "Registrar Mascota"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
