"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { RolesEnum, RolesLabels } from "@/types/enums/enums";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

const MenuBar = () => {
  const pathname = usePathname();
  const { user } = useAuthContext();
  const { signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="flex sm:justify-center md:justify-center sm:py-4 md:py-4  xl:px-6 xl:justify-between items-center justify-center bg-white shadow px-2 py-4 w-full">
      <div className="hidden xl:flex items-center gap-2">
        <Image
          src="/img/escudo-gov.png"
          alt="Gobierno de Colombia"
          width={90}
          height={90}
          unoptimized
        />
        <div className="flex items-center">
          <div className="hidden md:flex flex-col leading-none">
            <div className="text-[1.7rem]">Gobernación de</div>
            <div className="text-[1.7rem]">Casanare</div>
            <div className="text-[1.2rem]">
              Direccion de desarrollo comunitario
            </div>
          </div>
        </div>
      </div>

      <ul className="grid space-y-1 grid-cols-2 sm:grid-cols-2 md:grid-cols-5 items-center px-4 place-items-center">
        <li>
          <Link href="/">
            <button
              className={`cursor-pointer hover:bg-emerald-700 hover:text-white px-4 py-2 **:transition-all duration-400 ease-in-out ${
                pathname === "/" && "border-b-2 border-b-emerald-700"
              }`}
            >
              Apadrinar | Adoptar
            </button>
          </Link>
        </li>
        <li>
          <Link href="/instituciones">
            <button
              className={`cursor-pointer  px-4 py-2 **:transition-all duration-400 ease-in-out hover:bg-emerald-700 hover:text-white ${
                pathname === "/instituciones" &&
                "border-b-2 border-b-emerald-700"
              }`}
            >
              Instituciones
            </button>
          </Link>
        </li>
        <li>
          <Link href="/red-animalia">
            <button
              className={`cursor-pointer  px-4 py-2 **:transition-all duration-400 ease-in-out hover:bg-emerald-700 hover:text-white ${
                pathname === "/red-animalia" &&
                "border-b-2 border-b-emerald-700"
              }`}
            >
              Red Animalia
            </button>
          </Link>
        </li>
        {!user ? (
          // Opciones para usuarios no logueados
          <>
            <li>
              <Link href="/registrate">
                <button
                  className={`cursor-pointer px-4 py-2 transition-all duration-400 ease-in-out hover:bg-emerald-700 hover:text-white ${
                    pathname === "/registrate" &&
                    "border-b-2 border-b-emerald-700"
                  }`}
                >
                  Registrarte
                </button>
              </Link>
            </li>
            <li>
              <Link href="/login">
                <button
                  className={`group relative cursor-pointer px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-600 hover:from-emerald-400 hover:via-emerald-500 hover:to-emerald-600 transition-all duration-500 ease-in-out shadow-lg hover:shadow-xl border border-emerald-500/30 hover:border-emerald-400/50 rounded-xl overflow-hidden`}
                >
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

                  {/* Contenido del botón */}
                  <div className="relative flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4 text-white/90 group-hover:text-white transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="text-white font-semibold text-sm tracking-wide">
                      Iniciar sesión
                    </span>
                  </div>
                </button>
              </Link>
            </li>
          </>
        ) : (
          // Opciones para usuarios logueados
          <>
            <li>
              <Link href="/dashboard">
                <button
                  className={`cursor-pointer px-4 py-2 transition-all duration-400 ease-in-out hover:bg-emerald-700 hover:text-white ${
                    pathname === "/dashboard" &&
                    "border-b-2 border-b-emerald-700"
                  }`}
                >
                  Home
                </button>
              </Link>
            </li>
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="group relative cursor-pointer px-4 py-2.5 bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50 hover:from-emerald-100 hover:via-emerald-200 hover:to-emerald-100 transition-all duration-500 ease-in-out shadow-lg hover:shadow-xl text-emerald-700 rounded-xl flex items-center gap-3 border border-emerald-200/50 hover:border-emerald-300/70 overflow-hidden"
              >
                {/* Efecto de brillo sutil */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

                {/* Contenido del botón */}
                <div className="relative flex items-center gap-3">
                  {/* Avatar circular mejorado */}
                  <div className="w-8 h-8 font-bold bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm shadow-md">
                    {(
                      user.usuario?.nombre?.[0] ||
                      user.email?.[0] ||
                      "U"
                    ).toUpperCase()}
                  </div>
                  <span className="font-semibold text-emerald-700 group-hover:text-emerald-800 transition-colors duration-300">
                    {user.usuario?.nombre || user.email?.split("@")[0]}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-all duration-300 text-emerald-600 group-hover:text-emerald-700 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 overflow-hidden">
                  {/* Flecha del dropdown */}
                  <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>

                  <div className="py-2">
                    {/* Información del usuario */}
                    <div className="px-4 py-3 bg-gradient-to-r bg-slate-50 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                          {(
                            user.usuario?.nombre?.[0] ||
                            user.email?.[0] ||
                            "U"
                          ).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-gray-800">
                            {user.usuario?.nombre} {user.usuario?.apellidos}
                          </div>
                          {user.usuario?.usuario_albergue?.albergues
                            ?.nombre && (
                            <div className="text-xs uppercase text-gray-600 font-medium truncate overflow-hidden whitespace-nowrap max-w-[180px]">
                              {
                                user.usuario?.usuario_albergue?.albergues
                                  ?.nombre
                              }
                            </div>
                          )}
                          <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                            {RolesLabels[user.usuario?.rol as RolesEnum]}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Opciones del menú */}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                      }}
                      className="w-full cursor-pointer flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Mi Cuenta
                    </button>

                    <button
                      onClick={() => {
                        signOut();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full cursor-pointer flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default MenuBar;
