interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

const LoadingSpinner = ({ text = "Cargando...", className }: LoadingSpinnerProps) => {
  return (
    <div className={`flex items-center justify-center min-h-screen ${className || ''}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      <span className="ml-3 text-gray-600">{text}</span>
    </div>
  );
};

export default LoadingSpinner;