import { useSeguimientoAdopcion } from "@/hooks/useSeguimientosAdopcion";
import { useRouter } from "next/navigation";
import React from "react";
import { SeguimientoAdopcionForm } from "./SeguimientoAdopcionForm";

interface IProps {
  seguimientoId: string;
  id: string;
}

export const SeguimientoEditarForm = ({ seguimientoId, id }: IProps) => {
  const router = useRouter();
  const {
    data: seguimiento,
    loading,
    error,
  } = useSeguimientoAdopcion(parseInt(seguimientoId));

  const handleSuccess = () => {
    router.push(`/mascotas/mis-mascotas/seguimiento/${id}`);
  };

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (error || !seguimiento) {
    return <div className="text-center">Seguimiento no encontrado</div>;
  }

  return (
    <SeguimientoAdopcionForm
      solicitudId={seguimiento.solicitud_id!}
      onSuccess={handleSuccess}
      initialData={seguimiento}
      isEdit={true}
    />
  );
};
