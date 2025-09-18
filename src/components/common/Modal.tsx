"use client";

import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
  type?: "default" | "confirm" | "info";
  size?: "sm" | "md" | "lg" | "xl";
  confirmButtonClass?: string;
  showCloseButton?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  isOpen: boolean;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({
  cancelText = "Cancelar",
  showCloseButton = true,
  confirmButtonClass,
  type = "default",
  size = "md",
  confirmText,
  onConfirm,
  children,
  onClose,
  isOpen,
  title,
  footer,
}) => {
  // Manejar el cierre con ESC
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "max-w-sm sm:max-w-md";
      case "md":
        return "max-w-md sm:max-w-lg";
      case "lg":
        return "max-w-lg sm:max-w-2xl";
      case "xl":
        return "max-w-xl sm:max-w-4xl";
      default:
        return "max-w-md sm:max-w-lg";
    }
  };

  // Determinar si mostrar footer por defecto
  const shouldShowDefaultFooter = type === "confirm" && onConfirm;

  // Footer por defecto para confirmaciones
  const defaultFooter = shouldShowDefaultFooter ? (
    <div className="flex flex-col w-full sm:flex-row gap-2 sm:gap-3 justify-end">
      <button
        onClick={onClose}
        className="px-4 cursor-pointer py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        {cancelText}
      </button>
      <button
        onClick={() => {
          onConfirm?.();
          onClose();
        }}
        className={`px-4 cursor-pointer py-2 text-white rounded-lg transition-colors ${
          confirmButtonClass ||
          (type === "confirm"
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-600 hover:bg-gray-700")
        }`}
      >
        {confirmText || "Confirmar"}
      </button>
    </div>
  ) : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div
          className={`relative w-full ${getSizeClasses()} transform rounded-lg bg-white shadow-xl transition-all max-h-[90vh] overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
              {title && (
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-2">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 h-7 w-7 flex items-center justify-center cursor-pointer hover:text-gray-600 transition-colors flex-shrink-0"
                  aria-label="Cerrar modal"
                >
                  <FaTimes className="h-4 w-4 sm:h-4 sm:w-4" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="px-4 sm:px-6 py-4 sm:py-6">{children}</div>

          {/* Footer */}
          {(footer || defaultFooter) && (
            <div className="flex w-full items-center flex-col sm:flex-row gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              {footer || defaultFooter}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
