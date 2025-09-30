"use client";

import { ISolicitudesSeguimiento } from "@/types/interfaces/solicitudesSeguimiento";
import Image from "next/image";
import { FaEdit, FaTrash } from "react-icons/fa";

interface SeguimientoItemProps {
  seg: ISolicitudesSeguimiento;
  onEdit: (seguimiento: ISolicitudesSeguimiento) => void;
  onDelete: (seguimientoId: number) => void;
}

export const SeguimientoItem = ({
  seg,
  onEdit,
  onDelete,
}: SeguimientoItemProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {new Date(seg.fecha_seguimiento || "").toLocaleDateString()} -{" "}
          {seg.UsuarioSeguimiento?.nombre}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(seg)}
            className="cursor-pointer bg-emerald-100 border border-emerald-300 text-emerald-700 p-2 rounded hover:bg-emerald-200 transition-colors"
            title="Editar Seguimiento"
            aria-label="Editar Seguimiento"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(seg.id!)}
            className=" cursor-pointer bg-pink-200 text-pink-700 p-2 rounded hover:bg-pink-300 transition-colors"
            title="Eliminar Seguimiento"
            aria-label="Eliminar Seguimiento"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="my-3">
        <p className="text-gray-900 leading-relaxed">{seg.observaciones}</p>
      </div>

      {/* Imágenes del seguimiento */}
      {seg.SeguimientosImagenes && seg.SeguimientosImagenes.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Imágenes del seguimiento:
          </h4>
          <div className="flex gap-2">
            {seg.SeguimientosImagenes.map((img) => (
              <Image
                key={img.id}
                src={`${img.path_imagen}`}
                alt="Imagen seguimiento"
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded"
                unoptimized
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
