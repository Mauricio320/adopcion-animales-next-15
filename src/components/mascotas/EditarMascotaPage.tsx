"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAnimalById } from "@/hooks/useAnimals";
import { MascotaForm } from "./MascotaForm";
import { IAnimal } from "@/types/interfaces/animal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useAuthContext } from "@/contexts/AuthContext";

export const EditarMascotaPage = () => {
  const params = useParams();
  const { user } = useAuthContext();
  const { push } = useRouter();

  const id = params.id as string;

  const [animal, setAnimal] = useState<IAnimal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const albergueId = user?.usuario?.usuario_albergue?.albergue_id;

  useEffect(() => {
    const loadAnimal = async () => {
      if (!albergueId) {
        setError("No se pudo verificar los permisos de acceso");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const animalData = await getAnimalById(id, albergueId);
        setAnimal(animalData);
      } finally {
        setLoading(false);
      }
    };

    if (id && albergueId) loadAnimal();
  }, [id, albergueId]);

  const NotPermission = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Acceso Denegado
            </h1>
            <p className="text-gray-600 mb-6">
              No tienes permisos para acceder a esta mascota o la mascota no
              existe.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full cursor-pointer bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Volver Atrás
            </button>
            <button
              onClick={() => push("/mascotas/mis-mascotas")}
              className="w-full cursor-pointer bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Ir a Mis Mascotas
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <LoadingSpinner text="Cargando mascota..." />;

  if (error) return <NotPermission />;

  if (!animal) return <NotPermission />;

  return <MascotaForm animal={animal} />;
};
