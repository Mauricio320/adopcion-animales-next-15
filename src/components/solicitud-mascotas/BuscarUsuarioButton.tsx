"use client";

import { Modal } from "@/components/common/Modal";
import { IUsuario } from "@/types/interfaces/usuarios";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { BuscarUsuarioForm } from "./BuscarUsuarioForm";
import { UsuarioInfoModal } from "./UsuarioInfoModal";

export const BuscarUsuarioButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState<IUsuario | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"buscar" | "resultado">("buscar");

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setUsuarioEncontrado(null);
    setActiveTab("buscar");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUsuarioEncontrado(null);
    setActiveTab("buscar");
    setIsLoading(false);
  };

  const handleUsuarioEncontrado = (usuario: IUsuario | null) => {
    setUsuarioEncontrado(usuario);
    if (usuario) {
      setActiveTab("resultado");
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
      >
        <FaSearch className="w-4 h-4" />
        Consultar usuario
      </button>

      <Modal
        title={
          activeTab === "buscar"
            ? "Buscar Usuario por Documento"
            : "Información del Usuario"
        }
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        size="lg"
        type="default"
      >
        <div className="space-y-4">
          <BuscarUsuarioForm
            onUsuarioEncontrado={handleUsuarioEncontrado}
            onLoading={setIsLoading}
          />
          {usuarioEncontrado && (
            <UsuarioInfoModal usuario={usuarioEncontrado} loading={isLoading} />
          )}
        </div>
      </Modal>
    </>
  );
};
