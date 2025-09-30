"use client";


import { AuthUser } from "@/hooks/useAuth";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
  user: AuthUser;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>();

  const setUser = async (newUser: AuthUser | null) => {
    setCurrentUser(newUser);
  };

  const value: AuthContextType = {
    user: currentUser as AuthUser,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext debe ser usado dentro de un AuthProvider");
  }
  return context;
};
