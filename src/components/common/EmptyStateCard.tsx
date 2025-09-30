"use client";

import { useRouter } from "next/navigation";
import { FaHeart, FaSearch } from "react-icons/fa";

interface EmptyStateCardProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonPath?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyStateCard = ({
  title = "¡Es hora de adoptar!",
  description = "No tienes adopciones registradas aún. ¡Descubre mascotas maravillosas esperando un hogar amoroso y comienza tu proceso de adopción o apadrinamiento hoy! Cada animal merece una segunda oportunidad.",
  buttonText = "Explorar Mascotas",
  buttonPath = "/",
  icon = <FaHeart className="w-12 h-12 text-emerald-600 mx-auto mb-4" />,
  className = "",
}: EmptyStateCardProps) => {
  const router = useRouter();

  return (
    <div className={`bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-lg border border-emerald-100 p-8 text-center max-w-md mx-auto ${className}`}>
      <div className="mb-6">
        {icon}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
      <button
        onClick={() => router.push(buttonPath)}
        className="bg-emerald-600 cursor-pointer text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 font-medium flex items-center gap-2 mx-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        <FaSearch className="w-5 h-5" />
        {buttonText}
      </button>
    </div>
  );
};