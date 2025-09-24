"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  icon?: string | React.ReactNode;
  redirectPath?: string;
  className?: string;
  children?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  icon,
  redirectPath,
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
      <div className="flex items-center justify-between text-gray-500">
        <div
          className={`flex items-center cursor-pointer hover:text-gray-700 transition-colors duration-200`}
          onClick={redirectPath ? handleRedirect : handleBack}
        >
          <ArrowLeft
            className="w-6 h-6 mr-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 drop-shadow-md"
          />
          <h1 className="flex gap-2 text-3xl font-bold text-gray-900">
            {icon && (
              <span className="mr-2">
                {typeof icon === "string" ? icon : icon}
              </span>
            )}
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-4">{rightContent}</div>
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};
