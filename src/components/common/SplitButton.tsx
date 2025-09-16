"use client";

import { useState, useRef, useEffect, ReactElement } from "react";
import { FaChevronDown } from "react-icons/fa";

export interface SplitButtonOption {
  label: string;
  icon: ReactElement;
  action: () => void;
  color?: string;
  hoverColor?: string;
}

interface SplitButtonProps {
  options: SplitButtonOption[];
  mainAction?: () => void;
  mainLabel?: string;
  className?: string;
}

export const SplitButton: React.FC<SplitButtonProps> = ({
  options,
  mainAction,
  mainLabel = "Acciones",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMainClick = () => {
    if (mainAction) {
      mainAction();
    }
    setIsOpen(!isOpen);
  };

  const handleToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = () => {
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={buttonRef}>
      <div className="flex">
        <button
          onClick={handleMainClick}
          className="cursor-pointer text-white px-4 py-2 bg-orange-300 rounded-l-lg hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 transition-colors duration-200 flex items-center"
        >
          {mainLabel}
        </button>
        <button
          onClick={handleToggleClick}
          className="cursor-pointer px-3 py-2 bg-orange-300 text-white rounded-r-lg hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 transition-colors duration-200 border-l border-white flex items-center"
        >
          <FaChevronDown size={12} />
        </button>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-0.5 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
        >
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  option.action();
                  handleOptionClick();
                }}
                className={`cursor-pointer flex items-center gap-3 w-full text-left px-4 py-1.5 text-sm ${
                  option.color || 'text-gray-700'
                } ${option.hoverColor ? `hover:${option.hoverColor}` : 'hover:bg-gray-50'} transition-colors duration-200`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};