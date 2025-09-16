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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
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
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right - 192, // 192px = w-48 (12rem)
      });
    }
    setIsOpen(!isOpen);
  };

  const handleOptionClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className={`relative inline-block ${className}`} ref={buttonRef}>
        <div className="flex">
          <button
            onClick={handleMainClick}
            className="cursor-pointer px-4 py-2 bg-emerald-600 text-white rounded-l-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
          >
            {mainLabel}
          </button>
          <button
            onClick={handleToggleClick}
            className="cursor-pointer px-3 py-2 bg-emerald-600 text-white rounded-r-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-200 border-l border-emerald-500 flex items-center"
          >
            <FaChevronDown size={12} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed w-fit min-w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
          style={{
            top: `${dropdownPosition.top + 8}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  option.action();
                  handleOptionClick();
                }}
                className={`cursor-pointer flex items-center gap-3 w-full text-left px-4 py-2 text-sm ${
                  option.color || 'text-gray-700'
                } hover:${
                  option.hoverColor || 'bg-gray-50'
                } transition-colors duration-200`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};