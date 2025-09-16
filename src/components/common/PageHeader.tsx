"use client";

import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  icon?: string | React.ReactNode;
  redirectPath?: string;
  showBackButton?: boolean;
  className?: string;
  children?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  icon,
  redirectPath,
  showBackButton = false,
  className = "",
  children,
  rightContent,
}) => {
  const router = useRouter();

  const handleRedirect = () => {
    if (redirectPath) {
      router.push(redirectPath);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center ${redirectPath ? 'cursor-pointer hover:text-gray-700 transition-colors duration-200' : ''}`}
          onClick={redirectPath ? handleRedirect : undefined}
        >
          {redirectPath && (
            <svg
              className="w-6 h-6 mr-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 drop-shadow-md"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          )}
          <h1 className="flex gap-2 text-3xl font-bold text-gray-900">
            {icon && (
              <span className="mr-2">
                {typeof icon === 'string' ? icon : icon}
              </span>
            )}
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {rightContent}
          {showBackButton && (
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver
            </button>
          )}
        </div>
      </div>

      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};
