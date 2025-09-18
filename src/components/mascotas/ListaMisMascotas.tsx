"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Modal } from "@/components/common/Modal";
import { PageHeader } from "@/components/common/PageHeader";
import { PaginationControls } from "@/components/common/PaginationControls";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useAnimals } from "@/hooks/useAnimals";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  FaHeart,
  FaPlus
} from "react-icons/fa";

import { UpdateAnimalAlbergueEstadoMutation } from "@/hooks/useAnimalAlbergue";
import { RiFileList3Fill } from "react-icons/ri";
import { MascotaCard } from "./MascotaCard";

const ITEMS_PER_PAGE = 10;

export const ListaMisMascotas = () => {
  const { user } = useAuthContext();
  const { push } = useRouter();
  const { showSuccess, showError } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'delete' | 'disponible';
    animalAlbergueId: number;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: 'delete',
    animalAlbergueId: 0,
  });

  const albergueId = user?.usuario?.usuario_albergue?.albergue_id;

  const animalsOptions = useMemo(
    () => ({
      albergue_id: albergueId,
      limit: ITEMS_PER_PAGE,
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
      orderBy: "created_at" as const,
    }),
    [albergueId, currentPage]
  );

  const {
    data: animals,
    refetch,
    loading,
    error,
    total,
  } = useAnimals(animalsOptions);

  const totalPages = useMemo(() => {
    return Math.ceil(total / ITEMS_PER_PAGE);
  }, [total]);

  const handleDeleteMascota = async () => {
    const result = await UpdateAnimalAlbergueEstadoMutation({
      animalAlbergueId: confirmModal.animalAlbergueId,
      body: { activo: false },
    });

    if (result.error) {
      showError("Error al eliminar mascota");
    } else {
      showSuccess("Mascota eliminada exitosamente");
      refetch();
    }
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleDisponible = async () => {
    const result = await UpdateAnimalAlbergueEstadoMutation({
      animalAlbergueId: confirmModal.animalAlbergueId,
      body: { estado_id: null },
    });

    if (result.error) {
      showError("Error al actualizar estado de la mascota");
    } else {
      showSuccess("Mascota ahora disponible para adopción/apadrinamiento");
      refetch();
    }
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const openDeleteModal = (animalAlbergueId: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Eliminar Mascota",
      message: "¿Estás seguro de que quieres eliminar esta mascota? Esta acción no se puede deshacer.",
      onConfirm: handleDeleteMascota,
      type: 'delete',
      animalAlbergueId,
    });
  };

  const openDisponibleModal = (animalAlbergueId: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Hacer Disponible",
      message: "¿Estás seguro de que quieres hacer disponible esta mascota para adopción o apadrinamiento?",
      onConfirm: handleDisponible,
      type: 'disponible',
      animalAlbergueId,
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar las mascotas: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Mis mascotas"
        icon={<RiFileList3Fill className="w-8 h-8 text-emerald-600" />}
        redirectPath="/dashboard"
      />

      <div className="flex items-center justify-end gap-4">
        <p className="text-emerald-600 text-sm font-medium">
          Total de mascotas:{" "}
          <span className="font-semibold text-emerald-700">{total}</span>
        </p>
        <button
          onClick={() => push("/mascotas/registrar")}
          className="inline-flex cursor-pointer items-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200 shadow-md"
        >
          <FaPlus className="w-4 h-4 mr-2" />
          Agregar Mascota
        </button>
      </div>

      {animals.length === 0 ? (
        <div className="text-center py-16 px-6">
          <div className="w-32 h-32 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-100">
            <FaHeart className="w-16 h-16 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No tienes mascotas registradas
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Comienza registrando tu primera mascota para darle un hogar y
            encontrarle una familia amorosa.
          </p>
          <button
            onClick={() => push("/mascotas/registrar")}
            className="inline-flex cursor-pointer items-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <FaPlus className="w-5 h-5 mr-2" />
            Registrar Primera Mascota
          </button>
        </div>
      ) : (
        <>
          {/* Lista de tarjetas en filas */}
          <div className="p-6">
            <div className="space-y-4">
              {animals.map((animal) => (
                <MascotaCard
                openDisponibleModal={openDisponibleModal}
                openDeleteModal={openDeleteModal}
                  key={animal.id}
                  animal={animal}
                  push={push}
                />
              ))}
            </div>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200">
              <PaginationControls
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </div>
          )}
        </>
      )}

      {/* Modal de confirmación */}
      <Modal
        confirmButtonClass={confirmModal.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
        confirmText={confirmModal.type === 'delete' ? 'Eliminar' : 'Confirmar'}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        type="confirm"
      >
        <p className="text-gray-700">{confirmModal.message}</p>
      </Modal>
    </div>
  );
};
