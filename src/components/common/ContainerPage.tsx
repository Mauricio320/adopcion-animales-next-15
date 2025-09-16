import React from "react";

interface IProps {
  children: React.ReactNode;
}

export const ContainerPage: React.FC<IProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">{children}</div>
      </div>
    </div>
  );
};
