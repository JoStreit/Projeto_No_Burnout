"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface PacienteSession {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  estado: string;
  cidade: string;
  criadoEm: string;
  preferenciaBusca?: "Presencial" | "RemotoBrasil" | "RemoToEstado";
}

export interface ProfissionalSession {
  id: string;
  nome: string;
  cpf: string;
  carteirinha: string;
  ramo: string;
  estado: string;
  cidade: string;
  email: string;
  atendimento: string[];
  vigenciaInicio: string;
  vigenciaFim: string;
  status: "Ativo" | "Inativo";
  criadoEm: string;
}

interface AuthContextType {
  // Paciente
  paciente: PacienteSession | null;
  carregandoPaciente: boolean;
  recarregarPaciente: () => Promise<void>;
  logoutPaciente: () => Promise<void>;

  // Profissional
  profissional: ProfissionalSession | null;
  carregandoProfissional: boolean;
  recarregarProfissional: () => Promise<void>;
  logoutProfissional: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  paciente: null,
  carregandoPaciente: true,
  recarregarPaciente: async () => {},
  logoutPaciente: async () => {},
  profissional: null,
  carregandoProfissional: true,
  recarregarProfissional: async () => {},
  logoutProfissional: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [paciente, setPaciente] = useState<PacienteSession | null>(null);
  const [carregandoPaciente, setCarregandoPaciente] = useState(true);

  const [profissional, setProfissional] = useState<ProfissionalSession | null>(null);
  const [carregandoProfissional, setCarregandoProfissional] = useState(true);

  const recarregarPaciente = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      setPaciente(await res.json());
    } catch {
      setPaciente(null);
    } finally {
      setCarregandoPaciente(false);
    }
  }, []);

  const logoutPaciente = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setPaciente(null);
  }, []);

  const recarregarProfissional = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me-profissional");
      setProfissional(await res.json());
    } catch {
      setProfissional(null);
    } finally {
      setCarregandoProfissional(false);
    }
  }, []);

  const logoutProfissional = useCallback(async () => {
    await fetch("/api/auth/logout-profissional", { method: "POST" });
    setProfissional(null);
  }, []);

  useEffect(() => {
    recarregarPaciente();
    recarregarProfissional();
  }, [recarregarPaciente, recarregarProfissional]);

  return (
    <AuthContext.Provider
      value={{
        paciente,
        carregandoPaciente,
        recarregarPaciente,
        logoutPaciente,
        profissional,
        carregandoProfissional,
        recarregarProfissional,
        logoutProfissional,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
