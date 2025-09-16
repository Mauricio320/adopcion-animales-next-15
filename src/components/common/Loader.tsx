interface LoaderProps {
  title?: string;
  subtitle?: string;
  spinnerColor?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fullScreen?: boolean;
  className?: string;
}

export const Loader = ({
  title = "Cargando...",
  subtitle = "Por favor espera un momento",
  spinnerColor = "border-emerald-600",
  size = "md",
  fullScreen = true,
  className = "",
}: LoaderProps) => {
  // Tamaños del spinner
  const spinnerSizes = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };

  // Contenedor base
  const containerClasses = fullScreen
    ? "min-h-screen flex items-center justify-center bg-gray-50"
    : "flex items-center justify-center p-8";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner animado */}
        <div
          className={`animate-spin rounded-full border-b-2 ${spinnerSizes[size]} ${spinnerColor}`}
        />

        {/* Texto de carga */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

// Variantes predefinidas para casos comunes
export const AuthLoader = () => <PageLoader />;

export const PageLoader = () => (
  <Loader
    title="Cargando página"
    subtitle="Preparando el contenido"
    spinnerColor="border-emerald-600"
  />
);

export const DataLoader = () => (
  <Loader
    title="Cargando datos"
    subtitle="Obteniendo información"
    size="lg"
    spinnerColor="border-purple-600"
  />
);

export const SubmitLoader = () => (
  <Loader
    title="Procesando"
    subtitle="Guardando información"
    size="sm"
    fullScreen={false}
    spinnerColor="border-green-600"
  />
);

// Loader inline para usar dentro de componentes
export const InlineLoader = ({ text = "Cargando..." }: { text?: string }) => (
  <div className="flex items-center space-x-2 justify-center py-4">
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600" />
    <span className="text-sm text-gray-600">{text}</span>
  </div>
);
