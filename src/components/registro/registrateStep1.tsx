import { useTiposPersona } from "@/hooks/useTiposPersona";
import { useTiposUsuario } from "@/hooks/useTiposUsuario";
import { IUsuario } from "@/types/interfaces/usuarios";
import { FaChevronDown } from "react-icons/fa";

interface IProps {
  setCurrentStep: (value: number) => void;
  formData: Partial<IUsuario>;
  updateFormData: (field: keyof IUsuario, value: string | number) => void;
  errors: Record<string, string>;
  validateField: (field: keyof IUsuario, value: string | number) => string;
  updateError: (field: keyof IUsuario, error: string) => void;
}

export const RegistrateStep1 = ({
  setCurrentStep,
  formData,
  updateFormData,
  errors,
  validateField,
  updateError,
}: IProps) => {
  const { data: tiposUsuario, loading: loadingTipos } = useTiposUsuario();
  const { data: tiposPersona, loading: loadingPersonas } = useTiposPersona();

  const isStep1Valid =
    formData?.tipo_usuario_id && formData?.tipo_usuario_id !== "" && 
    formData?.tipo_persona_id && formData?.tipo_persona_id !== "";

  const handleSiguiente = () => {
    if (isStep1Valid) {
      setCurrentStep(2);
    }
  };

  const handleFieldChange = (field: keyof IUsuario, value: string) => {
    updateFormData(field, value);
    const error = validateField(field, value);
    updateError(field, error);
  };


  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-4">Registro</h1>
        <p className="text-gray-600">
          Regístrate llenando los campos, recuerda que los campos con (*) son
          obligatorios.
        </p>
      </div>

      {/* Indicadores de paso */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
            1
          </div>
          <div className="w-16 h-0.5 bg-gray-300 mx-2"></div>
          <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm">
            2
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="space-y-6">
          {/* Tipo de usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de usuario*
            </label>
            <div className="relative">
              <select
                value={formData.tipo_usuario_id || ""}
                onChange={(e) => handleFieldChange("tipo_usuario_id", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white text-gray-700"
                disabled={loadingTipos}
              >
                <option value="">Seleccione un tipo de usuario</option>
                {tiposUsuario.map((tipo) => (
                  <option key={tipo.id} value={String(tipo.id)}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.tipo_usuario_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tipo_usuario_id}
              </p>
            )}
          </div>

          {/* Tipo de persona */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de persona*
            </label>
            <div className="relative">
              <select
                value={formData.tipo_persona_id || ""}
                onChange={(e) => handleFieldChange("tipo_persona_id", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white text-gray-700"
                disabled={loadingPersonas}
              >
                <option value="">Seleccione un tipo de persona</option>
                {tiposPersona.map((tipo) => (
                  <option key={tipo.id} value={String(tipo.id)}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.tipo_persona_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tipo_persona_id}
              </p>
            )}
          </div>

          {/* Botón siguiente */}
          <button
            onClick={handleSiguiente}
            disabled={!isStep1Valid}
            className={`w-full cursor-pointer py-3 px-6 rounded-lg font-semibold transition duration-300 ${
              isStep1Valid
                ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Siguiente
          </button>
        </div>

        {/* Link para iniciar sesión */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <a
              href="/login"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
