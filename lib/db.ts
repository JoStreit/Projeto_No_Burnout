import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  senhaHash: string;
  criadoEm: string;
}

export interface PacientePublico {
  id: string;
  nome: string;
  cpf: string;
  criadoEm: string;
}

export interface Profissional {
  id: string;
  nome: string;
  cpf: string;
  ramo: string;
  cidade: string;
  criadoEm: string;
}

interface DB {
  pacientes: Paciente[];
  profissionais: Profissional[];
}

function lerDB(): DB {
  const conteudo = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(conteudo);
}

function salvarDB(db: DB): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

function toPublico(p: Paciente): PacientePublico {
  const { senhaHash: _, ...pub } = p;
  return pub;
}

export function listarPacientes(): PacientePublico[] {
  return lerDB().pacientes.map(toPublico);
}

export function buscarPacientePorCPF(cpf: string): Paciente | null {
  const cpfLimpo = cpf.replace(/\D/g, "");
  return lerDB().pacientes.find((p) => p.cpf === cpfLimpo) ?? null;
}

export function buscarPacientePorId(id: string): PacientePublico | null {
  const p = lerDB().pacientes.find((p) => p.id === id);
  return p ? toPublico(p) : null;
}

export function criarPaciente(
  nome: string,
  cpf: string,
  senha: string
): PacientePublico {
  const db = lerDB();
  const cpfLimpo = cpf.replace(/\D/g, "");

  if (db.pacientes.some((p) => p.cpf === cpfLimpo)) {
    throw new Error("CPF já cadastrado");
  }

  const paciente: Paciente = {
    id: crypto.randomUUID(),
    nome,
    cpf: cpfLimpo,
    senhaHash: bcrypt.hashSync(senha, 10),
    criadoEm: new Date().toISOString(),
  };

  db.pacientes.push(paciente);
  salvarDB(db);
  return toPublico(paciente);
}

export function verificarSenhaPaciente(
  cpf: string,
  senha: string
): PacientePublico | null {
  const paciente = buscarPacientePorCPF(cpf);
  if (!paciente) return null;
  if (!paciente.senhaHash) return null;
  if (!bcrypt.compareSync(senha, paciente.senhaHash)) return null;
  return toPublico(paciente);
}

export function listarProfissionais(filtros?: {
  ramo?: string;
  cidade?: string;
}): Profissional[] {
  let lista = lerDB().profissionais;
  if (filtros?.ramo) {
    lista = lista.filter((p) =>
      p.ramo.toLowerCase() === filtros.ramo!.toLowerCase()
    );
  }
  if (filtros?.cidade) {
    lista = lista.filter((p) =>
      p.cidade.toLowerCase().includes(filtros.cidade!.toLowerCase())
    );
  }
  return lista;
}

export function criarProfissional(
  nome: string,
  cpf: string,
  ramo: string,
  cidade: string
): Profissional {
  const db = lerDB();
  const cpfLimpo = cpf.replace(/\D/g, "");

  if (db.profissionais.some((p) => p.cpf === cpfLimpo)) {
    throw new Error("CPF já cadastrado");
  }

  const profissional: Profissional = {
    id: crypto.randomUUID(),
    nome,
    cpf: cpfLimpo,
    ramo,
    cidade,
    criadoEm: new Date().toISOString(),
  };

  db.profissionais.push(profissional);
  salvarDB(db);
  return profissional;
}
