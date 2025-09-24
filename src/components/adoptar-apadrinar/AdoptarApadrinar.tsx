"use client";

import { useState, useCallback } from "react";
import { BannerPage } from "../common/BannerPage";
import { TabView } from "@/components/common/TabView";
import { FiltroBusqueda } from "./FiltroBusqueda";

import { FaDog, FaHeart } from "react-icons/fa";
import { ListaAnimales } from "./ListaAnimales";

interface Filtros {
  municipio_id?: number;
  especie_id?: number;
  sexo_id?: number;
}

interface FormData {
  municipio_id: string;
  especie_id: string;
  sexo_id: string;
}

export const AdoptarApadrinar = () => {
  const [filtros, setFiltros] = useState<Filtros>({});

  const handleFilterChange = useCallback((formData: FormData) => {
    const processedFilters: Filtros = {
      municipio_id:
        formData.municipio_id && formData.municipio_id !== ""
          ? Number(formData.municipio_id)
          : undefined,
      especie_id:
        formData.especie_id && formData.especie_id !== ""
          ? Number(formData.especie_id)
          : undefined,
      sexo_id:
        formData.sexo_id && formData.sexo_id !== ""
          ? Number(formData.sexo_id)
          : undefined,
    };

    setFiltros(processedFilters);
  }, []);

  const renderAdoptarContent = () => (
    <div className="p-6">
      <p className="text-gray-600 mb-4">
        Dale un hogar amoroso a una mascota necesitada. Puedes adoptar o
        apadrinar y formar parte del cambio en la vida de un animal.
      </p>
      <ListaAnimales
        es_perdido={false}
        municipio_id={filtros.municipio_id}
        especie_id={filtros.especie_id}
        sexo_id={filtros.sexo_id}
      />
    </div>
  );

  // Función para renderizar contenido del tab Perdidos
  const renderPerdidosContent = () => (
    <div className="p-6">
      <p className="text-gray-600 mb-4">
        ¿Has visto a alguno de estos amigos perdidos? Ayúdanos a reunirlos con
        sus familias. Si reconoces a alguna mascota, contacta inmediatamente con
        el albergue correspondiente.
      </p>
      <ListaAnimales
        es_perdido={true}
        municipio_id={filtros.municipio_id}
        especie_id={filtros.especie_id}
        sexo_id={filtros.sexo_id}
      />
    </div>
  );

  const tabs = [
    {
      id: "adoptar",
      label: "Adopta un amigo",
      icon: <FaDog />,
      content: renderAdoptarContent,
    },
    {
      id: "apadrinar",
      label: "Amigos perdidos",
      icon: <FaHeart />,
      content: renderPerdidosContent,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-4">
      <BannerPage />
      <FiltroBusqueda onFilterChange={handleFilterChange} />
      <TabView tabs={tabs} defaultActiveTab="adoptar" className="mt-2" />
    </div>
  );
};
