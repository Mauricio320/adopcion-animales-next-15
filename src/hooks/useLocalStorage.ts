import { useState, useEffect } from 'react';

// Utilidades de encriptación básica
class LocalStorageCrypto {
  private static readonly ALGORITHM = 'AES-GCM';
  private static readonly KEY_LENGTH = 256;
  private static readonly IV_LENGTH = 12; // 96 bits para AES-GCM

  // Generar clave basada en una semilla fija (en producción usar clave más segura)
  private static async getKey(): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode('mi-clave-secreta-adopcion-animales-2024'), // En producción: usar variable de entorno
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('adopcion-salt'), // En producción: usar salt aleatorio
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: this.ALGORITHM, length: this.KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Encriptar datos
  static async encrypt(data: string): Promise<string> {
    try {
      if (!crypto.subtle) {
        console.warn('Web Crypto API no disponible, guardando sin encriptar');
        return btoa(data); // Base64 básico como fallback
      }

      const key = await this.getKey();
      const encoder = new TextEncoder();
      const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
      
      const encryptedData = await crypto.subtle.encrypt(
        { name: this.ALGORITHM, iv },
        key,
        encoder.encode(data)
      );

      // Combinar IV + datos encriptados y convertir a base64
      const combined = new Uint8Array(iv.length + encryptedData.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedData), iv.length);
      
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.warn('Error encriptando datos:', error);
      return btoa(data); // Fallback a base64
    }
  }

  // Desencriptar datos
  static async decrypt(encryptedData: string): Promise<string> {
    try {
      if (!crypto.subtle) {
        console.warn('Web Crypto API no disponible, desencriptando base64');
        return atob(encryptedData); // Base64 básico como fallback
      }

      const key = await this.getKey();
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );
      
      const iv = combined.slice(0, this.IV_LENGTH);
      const data = combined.slice(this.IV_LENGTH);
      
      const decryptedData = await crypto.subtle.decrypt(
        { name: this.ALGORITHM, iv },
        key,
        data
      );

      const decoder = new TextDecoder();
      return decoder.decode(decryptedData);
    } catch (error) {
      console.warn('Error desencriptando datos:', error);
      try {
        return atob(encryptedData); // Fallback a base64
      } catch {
        return encryptedData; // Si todo falla, devolver tal como está
      }
    }
  }
}

/**
 * Hook personalizado para manejar localStorage de forma reactiva con encriptación
 * @param key - Clave del localStorage
 * @param initialValue - Valor inicial si no existe en localStorage
 * @param encrypt - Si debe encriptar los datos (default: true)
 * @returns [value, setValue, removeValue, getCurrentValue] - Valor actual, función para actualizar, función para eliminar, función para obtener valor actual
 */
export function useLocalStorage<T>(key: string, initialValue: T, encrypt: boolean = true) {
  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    
    // Si no es encriptado, intentar cargar sincrónicamente
    if (!encrypt) {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.warn(`Error loading localStorage key "${key}":`, error);
        return initialValue;
      }
    }
    
    // Para datos encriptados, intentar cargar de forma síncrona primero
    // usando el fallback base64 si existe
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        // Intentar cargar como base64 simple primero (fallback)
        try {
          const decoded = atob(item);
          return JSON.parse(decoded);
        } catch {
          // Si falla, devolver valor inicial y cargar async después
          return initialValue;
        }
      }
    } catch (error) {
      console.warn(`Error loading localStorage key "${key}":`, error);
    }
    
    return initialValue; // Valor por defecto
  });

  // Estado para saber si ya se cargó la data encriptada
  const [isEncryptedDataLoaded, setIsEncryptedDataLoaded] = useState(!encrypt);

  // Cargar valor inicial encriptado de forma asíncrona
  useEffect(() => {
    if (!encrypt || isEncryptedDataLoaded) return;
    
    const loadEncryptedValue = async () => {
      if (typeof window === "undefined") return;
      
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          try {
            // Intentar desencriptar con Web Crypto API
            const decryptedItem = await LocalStorageCrypto.decrypt(item);
            const parsedValue = JSON.parse(decryptedItem);
            setStoredValue(parsedValue);
          } catch (error) {
            // Si falla la desencriptación, mantener el valor ya cargado
            console.warn(`Error decrypting localStorage key "${key}":`, error);
          }
        }
      } catch (error) {
        console.warn(`Error loading encrypted localStorage key "${key}":`, error);
      } finally {
        setIsEncryptedDataLoaded(true);
      }
    };

    loadEncryptedValue();
  }, [key, encrypt, isEncryptedDataLoaded]);

  // Función para actualizar el valor
  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      // Permitir que el valor sea una función para que tengamos la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Guardar en estado
      setStoredValue(valueToStore);
      
      // Guardar en localStorage
      if (typeof window !== "undefined") {
        const stringValue = JSON.stringify(valueToStore);
        const finalValue = encrypt ? await LocalStorageCrypto.encrypt(stringValue) : stringValue;
        window.localStorage.setItem(key, finalValue);
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Función para eliminar el valor
  const removeValue = () => {
    try {
      // Eliminar del estado (volver al valor inicial)
      setStoredValue(initialValue);
      
      // Eliminar del localStorage
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  // Función para obtener el valor actual del localStorage (sin estado reactivo)
  const getCurrentValue = async (): Promise<T> => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        if (encrypt) {
          const decryptedItem = await LocalStorageCrypto.decrypt(item);
          return JSON.parse(decryptedItem);
        } else {
          return JSON.parse(item);
        }
      }
      return initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // Sincronizar con localStorage cuando cambie en otras pestañas
  useEffect(() => {
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          let parsedValue: T;
          if (encrypt) {
            const decryptedValue = await LocalStorageCrypto.decrypt(e.newValue);
            parsedValue = JSON.parse(decryptedValue);
          } else {
            parsedValue = JSON.parse(e.newValue);
          }
          setStoredValue(parsedValue);
        } catch (error) {
          console.warn(`Error parsing localStorage key "${key}":`, error);
        }
      }
    };

    // Escuchar cambios en localStorage
    if (typeof window !== "undefined") {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [key, encrypt]);

  return [storedValue, setValue, removeValue, getCurrentValue, isEncryptedDataLoaded] as const;
}

// Hook específico para datos de usuario (encriptado por defecto)
export function useUserLocalStorage() {
  return useLocalStorage('userData', null, true);
}

// Hook específico para preferencias de la aplicación (sin encriptar para mejor rendimiento)
export function useAppPreferences() {
  return useLocalStorage('appPreferences', {
    theme: 'light',
    language: 'es',
    notifications: true,
  }, false);
}

// Hook específico para datos temporales de formularios (encriptado)
export function useFormStorage(formName: string) {
  return useLocalStorage(`form_${formName}`, {}, true);
}

// Hook específico para datos sensibles (siempre encriptado)
export function useSecureStorage<T>(key: string, initialValue: T) {
  return useLocalStorage(key, initialValue, true);
}

// Hook específico para datos no sensibles (sin encriptar para mejor rendimiento)
export function useSimpleStorage<T>(key: string, initialValue: T) {
  return useLocalStorage(key, initialValue, false);
}

// Hook específico para cargar datos inmediatamente (sin encriptación)
export function useInstantStorage<T>(key: string, initialValue: T) {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue, false);
  return [value, setValue, removeValue] as const;
}

// Hook híbrido que carga inmediatamente como base64 y luego mejora con encriptación
export function useHybridStorage<T>(key: string, initialValue: T) {
  const [value, setValue, removeValue, getCurrentValue, isFullyLoaded] = useLocalStorage(key, initialValue, true);
  
  return {
    value,
    setValue,
    removeValue,
    getCurrentValue,
    isFullyLoaded // Indica si los datos encriptados se cargaron completamente
  } as const;
}
