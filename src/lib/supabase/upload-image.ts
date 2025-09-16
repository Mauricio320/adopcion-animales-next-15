import imageCompression from "browser-image-compression";
import { supabase } from "./client";

const MASCOTAS_BUCKET = process.env.MASCOTAS_BUCKET ?? "mascotas-imagenes";

interface ImageUploadOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  quality?: number;
  initialQuality?: number;
  alwaysKeepResolution?: boolean;
  fileType?: string;
}

export const uploadImageToSupabase = async (
  file: File,
  fileName: string,
  options: ImageUploadOptions = {}
) => {
  const defaultOptions = {
    maxSizeMB: 0.5, // Reducido a 500KB máximo
    maxWidthOrHeight: 600, // Reducido a 600px (suficiente para web)
    useWebWorker: true,
    quality: 0.6, // Reducido a 60% de calidad
    initialQuality: 0.6, // Calidad inicial más baja
    alwaysKeepResolution: false, // Permite reducir resolución
    fileType: "image/jpeg", // Forzar JPEG (mejor compresión que PNG)
    ...options,
  };

  try {
    console.log("originalFile instanceof Blob", file instanceof Blob); // true
    console.log(`originalFile size ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    // 1. Redimensionar y comprimir la imagen
    const compressedFile = await imageCompression(file, defaultOptions);

    console.log(
      "compressedFile instanceof Blob",
      compressedFile instanceof Blob
    ); // true
    console.log(
      `compressedFile size ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`
    );

    // 2. Generar nombre único para el archivo
    const fileExt = compressedFile.name.split(".").pop();
    const uniqueFileName = `${fileName}-${Date.now()}.${fileExt}`;

    // 3. Subir a Supabase Storage
    const { error } = await supabase.storage
      .from(MASCOTAS_BUCKET)
      .upload(uniqueFileName, compressedFile);

    if (error) {
      throw new Error(`Error al subir imagen: ${error.message}`);
    }

    // 4. Obtener URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from(MASCOTAS_BUCKET).getPublicUrl(uniqueFileName);

    return {
      success: true,
      url: publicUrl,
      fileName: uniqueFileName as string,
      size: compressedFile.size,
    };
  } catch (error) {
    console.error("Error en uploadImageToSupabase:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

// Función para eliminar imagen de Supabase
export const deleteImageFromSupabase = async (fileName: string) => {
  try {
    const { error } = await supabase.storage
      .from(MASCOTAS_BUCKET)
      .remove([fileName]);

    if (error) {
      throw new Error(`Error al eliminar imagen: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error en deleteImageFromSupabase:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};
