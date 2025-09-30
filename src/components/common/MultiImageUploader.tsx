"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { FiX, FiPlus } from "react-icons/fi";

interface MultiImageUploaderProps {
  onImagesChange: (files: File[]) => void;
  maxImages?: number;
  className?: string;
}

export const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  onImagesChange,
  maxImages = 5,
  className = "",
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalFiles = images.length + newFiles.length;

    if (totalFiles > maxImages) {
      setError(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    // Validar cada archivo
    for (const file of newFiles) {
      if (!file.type.startsWith("image/")) {
        setError("Solo se permiten archivos de imagen");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError("Cada imagen debe ser menor a 5MB");
        return;
      }
    }

    setError(null);

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    setImages(prev => [...prev, ...newFiles]);

    onImagesChange([...images, ...newFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    URL.revokeObjectURL(previews[index]);

    setImages(newImages);
    setPreviews(newPreviews);
    onImagesChange(newImages);
  };

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Imágenes existentes */}
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square relative border-2 border-gray-300 rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute cursor-pointer top-1 right-1 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl hover:shadow-2xl"
              >
                <FiX className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}

        {/* Botón para agregar más imágenes */}
        {images.length < maxImages && (
          <div className="aspect-square">
            <label className="flex items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center text-center px-4">
                <FiPlus className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-xs text-gray-500">
                  Agregar imagen
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {images.length}/{maxImages}
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
              />
            </label>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded p-3">
          {error}
        </div>
      )}
    </div>
  );
};