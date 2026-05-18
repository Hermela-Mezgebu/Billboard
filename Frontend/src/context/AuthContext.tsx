"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string | number;
  email: string;
  name: string;
  role: "admin" | "owner" | "client";
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  role: string | null;
  setRole: (role: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
