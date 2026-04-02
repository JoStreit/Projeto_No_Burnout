"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  criadoEm: string;
}

interface AuthContextType {
  paciente: Paciente | null;
  carregando: boolean;
  recarregar: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  paciente: null,
  carregando: true,
  recarregar: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [carregando, setCarregando] = useState(true);

  const recarregar = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setPaciente(data);
    } catch {
      setPaciente(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setPaciente(null);
  }, []);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return (
    <AuthContext.Provider value={{ paciente, carregando, recarregar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
