"use client";

import { useRouter } from "next/navigation";

interface DashboardCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonColor: "green" | "blue" | "purple" | "orange" | "gray" | "red";
  path?: string;
  onClick?: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  buttonText,
  buttonColor,
  path,
  onClick,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      router.push(path);
    }
  };

  const getButtonColorClasses = (color: string) => {
    const colorMap = {
      green: "bg-green-600 hover:bg-green-700",
      blue: "bg-blue-600 hover:bg-blue-700",
      purple: "bg-purple-600 hover:bg-purple-700",
      orange: "bg-orange-600 hover:bg-orange-700",
      gray: "bg-gray-600 hover:bg-gray-700",
      red: "bg-red-600 hover:bg-red-700",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <button
        onClick={handleClick}
        className={`cursor-pointer text-white px-4 py-2 rounded transition-colors duration-200 ${getButtonColorClasses(
          buttonColor
        )}`}
      >
        {buttonText}
      </button>
    </div>
  );
};
