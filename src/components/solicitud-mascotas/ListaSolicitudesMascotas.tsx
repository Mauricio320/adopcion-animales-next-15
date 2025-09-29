"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Modal } from "@/components/common/Modal";
import { PageHeader } from "@/components/common/PageHeader";
import { SolicitudCard } from "@/components/solicitud-mascotas/SolicitudCard";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  useGetNotificacionesInteresadosByAlbergue,
  UpdateNotificacionInteresadosMutation,
} from "@/hooks/useNotificacionesInteresados";
import { INotificacionesInteresadosWithRelations } from "@/types/interfaces/notificacionesInteresados";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { BuscarUsuarioButton } from "./BuscarUsuarioButton";

export const ListaSolicitudesMascotas = () => {
  const { user } = useAuthContext();
  const { showSuccess, showError } = useToast();
  const [responseModal, setResponseModal] = useState<{
    isOpen: boolean;
    notificacion: INotificacionesInteresadosWithRelations | null;
  }>({
    isOpen: false,
    notificacion: null,
  });
  const [responseText, setResponseText] = useState("");

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "approve" | "reject";
    notificacion: INotificacionesInteresadosWithRelations | null;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "approve",
    notificacion: null,
  });

  const albergueId = user?.usuario?.usuario_albergue?.albergue_id;

  const {
    data: solicitudes,
    loading,
    error,
    refetch,
  } = useGetNotificacionesInteresadosByAlbergue(albergueId || 0);

  const handleResponse = async () => {
    if (!responseModal.notificacion) return;

    const result = await UpdateNotificacionInteresadosMutation(
      responseModal.notificacion.id!,
      {
        respuesta: responseText,
        visto: true,
        usuario_responde_id: user?.usuario?.id,
      }
    );

    if (result.error) {
      showError("Error al enviar respuesta");
    } else {
      showSuccess("Respuesta enviada exitosamente");
      refetch();
    }
    setResponseModal({ isOpen: false, notificacion: null });
    setResponseText("");
  };

  const handleApproveConfirmed = async () => {
    if (!confirmModal.notificacion) return;

    const result = await UpdateNotificacionInteresadosMutation(
      confirmModal.notificacion.id!,
      {
        aprobado: true,
        visto: true,
        usuario_responde_id: user?.usuario?.id,
      }
    );

    if (result.error) {
      showError("Error al aprobar solicitud");
    } else {
      showSuccess("Solicitud aprobada exitosamente");
      refetch();
    }
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleRejectConfirmed = async () => {
    if (!confirmModal.notificacion) return;

    const result = await UpdateNotificacionInteresadosMutation(
      confirmModal.notificacion.id!,
      {
        aprobado: false,
        visto: true,
        usuario_responde_id: user?.usuario?.id,
      }
    );

    if (result.error) {
      showError("Error al rechazar solicitud");
    } else {
      showSuccess("Solicitud rechazada exitosamente");
      refetch();
    }
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const openApproveModal = (
    notificacion: INotificacionesInteresadosWithRelations
  ) => {
    setConfirmModal({
      isOpen: true,
      title: "Aprobar Solicitud",
      message: `¿Estás seguro de que quieres aprobar la solicitud de ${
        notificacion.tipo === 1 ? "adopción" : "apadrinamiento"
      }? Esta acción marcará la solicitud como vista y aprobada.`,
      type: "approve",
      notificacion,
    });
  };

  const openRejectModal = (
    notificacion: INotificacionesInteresadosWithRelations
  ) => {
    setConfirmModal({
      isOpen: true,
      title: "Rechazar Solicitud",
      message: `¿Estás seguro de que quieres rechazar la solicitud de ${
        notificacion.tipo === 1 ? "adopción" : "apadrinamiento"
      }? Esta acción marcará la solicitud como vista y rechazada.`,
      type: "reject",
      notificacion,
    });
  };

  const openResponseModal = (
    notificacion: INotificacionesInteresadosWithRelations
  ) => {
    setResponseModal({ isOpen: true, notificacion });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar las solicitudes: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Solicitudes de Mascotas"
        icon={<FaUser className="w-8 h-8 text-emerald-600" />}
        redirectPath="/dashboard"
      />
      <div className="flex items-center justify-between gap-4">
        <BuscarUsuarioButton />
        <p className="text-emerald-600 text-sm font-medium">
          Total de solicitudes:{" "}
          <span className="font-semibold text-emerald-700">
            {solicitudes.length}
          </span>
        </p>
      </div>

      {solicitudes.length === 0 ? (
        <div className="text-center py-16 px-6">
          <div className="w-32 h-32 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-100">
            <FaUser className="w-16 h-16 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No hay solicitudes pendientes
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Las solicitudes de adopción o apadrinamiento aparecerán aquí cuando
            los usuarios estén interesados en tus mascotas.
          </p>
        </div>
      ) : (
        <div className="p-6">
          <div className="space-y-4">
            {solicitudes.map((solicitud) => (
              <SolicitudCard
                onResponse={openResponseModal}
                onApprove={openApproveModal}
                onReject={openRejectModal}
                solicitud={solicitud}
                key={solicitud.id}
              />
            ))}
          </div>
        </div>
      )}

      <Modal
        title="Responder Solicitud"
        onClose={() => setResponseModal({ isOpen: false, notificacion: null })}
        onConfirm={handleResponse}
        isOpen={responseModal.isOpen}
        confirmText="Enviar Respuesta"
        size="lg"
        type="confirm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Responde a la solicitud de{" "}
            {responseModal.notificacion?.tipo === 1
              ? "adopción"
              : "apadrinamiento"}
            .
          </p>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
            className="w-full outline-0 h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            maxLength={300}
          />
          <p className="text-sm text-gray-500 text-right">
            {responseText.length}/300 caracteres
          </p>
        </div>
      </Modal>

      <Modal
        confirmButtonClass={
          confirmModal.type === "reject"
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }
        confirmText={confirmModal.type === "reject" ? "Rechazar" : "Aprobar"}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={
          confirmModal.type === "reject"
            ? handleRejectConfirmed
            : handleApproveConfirmed
        }
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        type="confirm"
      >
        <p className="text-gray-700">{confirmModal.message}</p>
      </Modal>
    </div>
  );
};
