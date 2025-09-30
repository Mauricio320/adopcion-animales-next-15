"use client";

import { buscarUsuarioPorDocumentoConSolicitudes } from "@/hooks/useUsuarios";
import { IUsuario } from "@/types/interfaces/usuarios";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface BuscarUsuarioFormProps {
  onUsuarioEncontrado: (usuario: IUsuario | null) => void;
  onLoading: (loading: boolean) => void;
}

export const BuscarUsuarioForm = ({
  onUsuarioEncontrado,
  onLoading,
}: BuscarUsuarioFormProps) => {
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleBuscar = async () => {
    if (!numeroDocumento.trim()) {
      setError("Por favor ingresa un número de documento");
      return;
    }

    try {
      setError(null);
      onLoading(true);

      const usuario = await buscarUsuarioPorDocumentoConSolicitudes(
        numeroDocumento.trim()
      );

      if (!usuario) {
        setError("No se encontró ningún usuario con ese número de documento");
        onUsuarioEncontrado(null);
      } else {
        onUsuarioEncontrado(usuario);
      }
    } catch (err) {
      console.error("Error buscando usuario:", err);
      setError("Error al buscar el usuario. Por favor intenta nuevamente.");
      onUsuarioEncontrado(null);
    } finally {
      onLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBuscar();
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="numeroDocumento"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Número de Documento
        </label>
        <div className="relative">
          <input
            type="text"
            id="numeroDocumento"
            value={numeroDocumento}
            onChange={(e) => setNumeroDocumento(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ingresa el número de documento"
            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-colors"
            maxLength={20}
          />
          <button
            onClick={handleBuscar}
            disabled={!numeroDocumento.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-emerald-600 hover:text-emerald-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            aria-label="Buscar usuario"
          >
            <FaSearch className="w-5 h-5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        onClick={handleBuscar}
        disabled={!numeroDocumento.trim()}
        className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <FaSearch className="w-4 h-4" />
        Buscar Usuario
      </button>
    </div>
  );
};
