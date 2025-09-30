"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import { IoClose, IoImage } from "react-icons/io5";

interface ImageUploaderProps {
  onImageUploaded: (file?: File) => void;
  currentImage?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUploaded,
  currentImage,
  className = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/"))
      return setError("Por favor selecciona un archivo de imagen válido");

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024)
      return setError("La imagen no puede ser mayor a 5MB");

    const previewUrl = URL.createObjectURL(file);

    setError(null);
    setIsUploading(false);
    setPreview(previewUrl);
    onImageUploaded(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUploaded(undefined);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-center">
        <label className="relative flex items-center justify-center w-38 h-54 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden">
          {preview ? (
            <>
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {!isUploading && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveImage();
                  }}
                  className="absolute cursor-pointer top-1 right-1 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-xl hover:shadow-2xl transition-all duration-200 z-10"
                >
                  <IoClose className="w-3 h-3" />
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center px-4">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-2"></div>
                  <p className="text-sm text-gray-500">Subiendo...</p>
                </>
              ) : (
                <>
                  <IoImage className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="text-sm text-gray-500 font-medium">
                    Foto de la mascota
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Click para subir</p>
                </>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </label>
      </div>

      {error && (
        <div className="mt-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded p-3">
          {error}
        </div>
      )}
    </div>
  );
};
