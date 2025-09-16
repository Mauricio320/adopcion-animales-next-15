"use client";

interface InfoBannerProps {
  title: string;
  description: string;
  variant?: "info" | "success" | "warning" | "error" | "purple";
  className?: string;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({
  title,
  description,
  variant = "info",
  className = "",
}) => {
  const getVariantClasses = (variant: string) => {
    const variantMap = {
      info: "bg-blue-50 border-blue-200 text-blue-800 text-blue-700",
      success: "bg-green-50 border-green-200 text-green-800 text-green-700",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-800 text-yellow-700",
      error: "bg-red-50 border-red-200 text-red-800 text-red-700",
      purple: "bg-purple-50 border-purple-200 text-purple-800 text-purple-700",
    };
    return variantMap[variant as keyof typeof variantMap] || variantMap.info;
  };

  const classes = getVariantClasses(variant);
  const [bgColor, borderColor, titleColor, textColor] = classes.split(" ");

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-6 mb-8 ${className}`}>
      <h2 className={`text-xl font-semibold ${titleColor} mb-2`}>
        {title}
      </h2>
      <p className={textColor}>
        {description}
      </p>
    </div>
  );
};
