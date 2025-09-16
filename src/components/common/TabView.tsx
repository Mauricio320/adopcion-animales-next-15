"use client";
import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode | (() => React.ReactNode);
}

interface TabViewProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  className?: string;
}

export const TabView: React.FC<TabViewProps> = ({
  tabs,
  defaultActiveTab,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState(
    defaultActiveTab || tabs[0]?.id || ""
  );

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  const renderActiveContent = () => {
    if (!activeTabData) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          Contenido no disponible
        </div>
      );
    }

    const content =
      typeof activeTabData.content === "function"
        ? activeTabData.content()
        : activeTabData.content;

    return content;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-center border-b border-gray-200 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === tab.id
                ? "border-emerald-600 text-emerald-600 bg-emerald-50"
                : "border-transparent text-gray-600 hover:text-emerald-600 hover:border-gray-300"
            }`}
          >
            {tab.icon && <span className="text-lg">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[200px]">{renderActiveContent()}</div>
    </div>
  );
};
