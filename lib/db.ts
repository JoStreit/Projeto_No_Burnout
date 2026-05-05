import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  estado: string;
  cidade: string;
  senhaHash: string;
  criadoEm: string;
  preferenciaBusca?: ("Presencial" | "RemotoBrasil" | "RemoToEstado")[];
}

export interface PacientePublico {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  estado: string;
  cidade: string;
  criadoEm: string;
  preferenciaBusca?: ("Presencial" | "RemotoBrasil" | "RemoToEstado")[];
}

export interface Profissional {
  id: string;
  nome: string;
  cpf: string;
  carteirinha: string;
  ramo: string;
  estado: string;
  cidade: string;
  email: string;
  telefone?: string;
  atendimento: string[];
  foto?: string;
  senhaHash: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  status: "Ativo" | "Inativo";
  criadoEm: string;
}

export type ProfissionalPublico = Omit<Profissional, "senhaHash">;

export interface Visita {
  id: string;
  timestamp: string;
  tipo: "anonimo" | "paciente" | "profissional";
}

export interface MensagemDica {
  id: string;
  icone: string;
  titulo: string;
  texto: string;
  ativa: boolean;
  criadoEm: string;
}

export interface ResetToken {
  token: string;
  userId: string;
  tipo: "paciente" | "profissional";
  expiraEm: string;
}

interface DB {
  pacientes: Paciente[];
  profissionais: Profissional[];
  visitas?: Visita[];
  questionarios?: { id: string; timestamp: string }[];
  mensagens?: MensagemDica[];
  resetTokens?: ResetToken[];
  tokensRevogados?: string[];
}

function lerDB(): DB {
  const conteudo = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(conteudo);
}

function salvarDB(db: DB): void {
  const tmp = DB_PATH + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf-8");
  fs.renameSync(tmp, DB_PATH);
}

function normalizarPreferenciaBusca(
  pref: unknown
): ("Presencial" | "RemotoBrasil" | "RemoToEstado")[] | undefined {
  if (!pref) return undefined;
  if (Array.isArray(pref)) return pref as ("Presencial" | "RemotoBrasil" | "RemoToEstado")[];
  if (typeof pref === "string") return [pref as "Presencial" | "RemotoBrasil" | "RemoToEstado"];
  return undefined;
}

function pacienteToPublico(p: Paciente): PacientePublico {
  const { senhaHash: _, ...pub } = p;
  const pref = normalizarPreferenciaBusca(pub.preferenciaBusca);
  if (pref !== undefined) pub.preferenciaBusca = pref;
  return pub;
}

function profissionalToPublico(p: Profissional): ProfissionalPublico {
  const { senhaHash: _, ...pub } = p;
  return pub;
}

// Hash fixo usado quando o usuário não existe — evita timing attack por enumeração de CPF
const DUMMY_HASH = bcrypt.hashSync("__dummy_saude_connect__", 10);

// ─── Pacientes ────────────────────────────────────────────────────────────────

export function listarPacientes(): PacientePublico[] {
  return lerDB().pacientes.map(pacienteToPublico);
}

export function buscarPacientePorCPF(cpf: string): Paciente | null {
  const cpfLimpo = cpf.replace(/\D/g, "");
  return lerDB().pacientes.find((p) => p.cpf === cpfLimpo) ?? null;
}

export function buscarPacientePorId(id: string): PacientePublico | null {
  const p = lerDB().pacientes.find((p) => p.id === id);
  return p ? pacienteToPublico(p) : null;
}

export function criarPaciente(dados: {
  nome: string;
  cpf: string;
  email: string;
  estado: string;
  cidade: string;
  senha: string;
  preferenciaBusca?: ("Presencial" | "RemotoBrasil" | "RemoToEstado")[];
}): PacientePublico {
  const db = lerDB();
  const cpfLimpo = dados.cpf.replace(/\D/g, "");

  // CPF único apenas dentro dos pacientes
  if (db.pacientes.some((p) => p.cpf === cpfLimpo)) {
    throw new Error("CPF já cadastrado como paciente");
  }
  if (db.pacientes.some((p) => p.email?.toLowerCase() === dados.email.toLowerCase())) {
    throw new Error("E-mail já cadastrado");
  }

  const paciente: Paciente = {
    id: crypto.randomUUID(),
    nome: dados.nome,
    cpf: cpfLimpo,
    email: dados.email.toLowerCase(),
    estado: dados.estado,
    cidade: dados.cidade,
    senhaHash: bcrypt.hashSync(dados.senha, 10),
    criadoEm: new Date().toISOString(),
    ...(dados.preferenciaBusca ? { preferenciaBusca: dados.preferenciaBusca } : {}),
  };

  db.pacientes.push(paciente);
  salvarDB(db);
  return pacienteToPublico(paciente);
}

export function atualizarPaciente(
  id: string,
  dados: {
    nome?: string;
    email?: string;
    estado?: string;
    cidade?: string;
    preferenciaBusca?: ("Presencial" | "RemotoBrasil" | "RemoToEstado")[];
  }
): PacientePublico {
  const db = lerDB();
  const idx = db.pacientes.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Paciente não encontrado");

  if (dados.email) {
    const emailLower = dados.email.toLowerCase();
    if (db.pacientes.some((p) => p.id !== id && p.email?.toLowerCase() === emailLower)) {
      throw new Error("E-mail já cadastrado");
    }
  }

  db.pacientes[idx] = {
    ...db.pacientes[idx],
    ...(dados.nome ? { nome: dados.nome } : {}),
    ...(dados.email ? { email: dados.email.toLowerCase() } : {}),
    ...(dados.estado ? { estado: dados.estado } : {}),
    ...(dados.cidade ? { cidade: dados.cidade } : {}),
    ...(dados.preferenciaBusca !== undefined ? { preferenciaBusca: dados.preferenciaBusca } : {}),
  };

  salvarDB(db);
  return pacienteToPublico(db.pacientes[idx]);
}

export function verificarSenhaPaciente(cpf: string, senha: string): PacientePublico | null {
  const paciente = buscarPacientePorCPF(cpf);
  // Sempre executa bcrypt (mesmo sem usuário) para evitar timing attack
  const hash = paciente?.senhaHash ?? DUMMY_HASH;
  const valido = bcrypt.compareSync(senha, hash);
  if (!valido || !paciente) return null;
  return pacienteToPublico(paciente);
}

// ─── Profissionais ────────────────────────────────────────────────────────────

export function listarProfissionais(filtros?: {
  ramo?: string;
  cidade?: string;
  estado?: string;
  limit?: number;
  offset?: number;
  incluirExpirados?: boolean;
}): { data: ProfissionalPublico[]; total: number } {
  const agora = new Date();
  let lista = filtros?.incluirExpirados
    ? lerDB().profissionais
    : lerDB().profissionais.filter(
        (p) => p.vigenciaFim && new Date(p.vigenciaFim) > agora
      );
  if (filtros?.ramo) {
    lista = lista.filter((p) => p.ramo?.toLowerCase() === filtros.ramo!.toLowerCase());
  }
  if (filtros?.cidade) {
    lista = lista.filter((p) => p.cidade?.toLowerCase().includes(filtros.cidade!.toLowerCase()));
  }
  if (filtros?.estado) {
    lista = lista.filter((p) => p.estado?.toLowerCase() === filtros.estado!.toLowerCase());
  }
  const total = lista.length;
  const offset = filtros?.offset ?? 0;
  const limit = Math.min(filtros?.limit ?? 20, 100);
  const data = lista.slice(offset, offset + limit).map(profissionalToPublico);
  return { data, total };
}

export function buscarProfissionalPorId(id: string): ProfissionalPublico | null {
  const p = lerDB().profissionais.find((p) => p.id === id);
  return p ? profissionalToPublico(p) : null;
}

export function buscarProfissionalPorCPF(cpf: string): Profissional | null {
  const cpfLimpo = cpf.replace(/\D/g, "");
  return lerDB().profissionais.find((p) => p.cpf === cpfLimpo) ?? null;
}

export function criarProfissional(dados: {
  nome: string;
  cpf: string;
  carteirinha: string;
  ramo: string;
  estado: string;
  cidade: string;
  email: string;
  telefone?: string;
  atendimento: string[];
  foto?: string;
  senha: string;
}): ProfissionalPublico {
  const db = lerDB();
  const cpfLimpo = dados.cpf.replace(/\D/g, "");

  // CPF único apenas dentro dos profissionais (pode ter mesmo CPF como paciente)
  if (db.profissionais.some((p) => p.cpf === cpfLimpo)) {
    throw new Error("CPF já cadastrado como profissional");
  }
  if (db.profissionais.some((p) => p.email?.toLowerCase() === dados.email.toLowerCase())) {
    throw new Error("E-mail já cadastrado");
  }

  const agora = new Date();
  const vigenciaFim = new Date(agora);
  vigenciaFim.setDate(vigenciaFim.getDate() + 3);

  const profissional: Profissional = {
    id: crypto.randomUUID(),
    nome: dados.nome,
    cpf: cpfLimpo,
    carteirinha: dados.carteirinha,
    ramo: dados.ramo,
    estado: dados.estado,
    cidade: dados.cidade,
    email: dados.email.toLowerCase(),
    ...(dados.telefone ? { telefone: dados.telefone } : {}),
    atendimento: dados.atendimento,
    ...(dados.foto ? { foto: dados.foto } : {}),
    senhaHash: bcrypt.hashSync(dados.senha, 10),
    vigenciaInicio: agora.toISOString(),
    vigenciaFim: vigenciaFim.toISOString(),
    status: "Ativo",
    criadoEm: agora.toISOString(),
  };

  db.profissionais.push(profissional);
  salvarDB(db);
  return profissionalToPublico(profissional);
}

export function verificarSenhaProfissional(cpf: string, senha: string): ProfissionalPublico | null {
  const profissional = buscarProfissionalPorCPF(cpf);
  // Sempre executa bcrypt (mesmo sem usuário) para evitar timing attack
  const hash = profissional?.senhaHash ?? DUMMY_HASH;
  const valido = bcrypt.compareSync(senha, hash);
  if (!valido || !profissional) return null;
  return profissionalToPublico(profissional);
}

export function atualizarStatusProfissional(
  id: string,
  novoStatus: "Ativo" | "Inativo"
): ProfissionalPublico {
  const db = lerDB();
  const idx = db.profissionais.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Profissional não encontrado");

  const prof = db.profissionais[idx];

  if (novoStatus === "Ativo") {
    const agora = new Date();
    const fim = new Date(prof.vigenciaFim);
    if (agora > fim) {
      throw new Error("Não é possível ativar fora do período de vigência");
    }
  }

  db.profissionais[idx] = { ...prof, status: novoStatus };
  salvarDB(db);
  return profissionalToPublico(db.profissionais[idx]);
}

export function atualizarProfissional(
  id: string,
  dados: {
    nome?: string;
    estado?: string;
    cidade?: string;
    atendimento?: string[];
    email?: string;
    telefone?: string;
    foto?: string;
  }
): ProfissionalPublico {
  const db = lerDB();
  const idx = db.profissionais.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Profissional não encontrado");

  if (dados.email) {
    const emailLower = dados.email.toLowerCase();
    if (db.profissionais.some((p) => p.id !== id && p.email?.toLowerCase() === emailLower)) {
      throw new Error("E-mail já cadastrado");
    }
  }

  db.profissionais[idx] = {
    ...db.profissionais[idx],
    ...(dados.nome ? { nome: dados.nome } : {}),
    ...(dados.estado ? { estado: dados.estado } : {}),
    ...(dados.cidade ? { cidade: dados.cidade } : {}),
    ...(dados.atendimento ? { atendimento: dados.atendimento } : {}),
    ...(dados.email ? { email: dados.email.toLowerCase() } : {}),
    ...(dados.telefone !== undefined ? { telefone: dados.telefone || undefined } : {}),
    ...(dados.foto !== undefined ? { foto: dados.foto } : {}),
  };

  salvarDB(db);
  return profissionalToPublico(db.profissionais[idx]);
}

export function atualizarProfissionalAdmin(
  id: string,
  dados: {
    nome?: string;
    email?: string;
    telefone?: string;
    estado?: string;
    cidade?: string;
    ramo?: string;
    carteirinha?: string;
    atendimento?: string[];
    vigenciaFim?: string;
    status?: "Ativo" | "Inativo";
  }
): ProfissionalPublico {
  const db = lerDB();
  const idx = db.profissionais.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Profissional não encontrado");

  if (dados.email) {
    const emailLower = dados.email.toLowerCase();
    if (db.profissionais.some((p) => p.id !== id && p.email?.toLowerCase() === emailLower)) {
      throw new Error("E-mail já cadastrado");
    }
  }

  db.profissionais[idx] = {
    ...db.profissionais[idx],
    ...(dados.nome ? { nome: dados.nome } : {}),
    ...(dados.email ? { email: dados.email.toLowerCase() } : {}),
    ...(dados.telefone !== undefined ? { telefone: dados.telefone || undefined } : {}),
    ...(dados.estado ? { estado: dados.estado } : {}),
    ...(dados.cidade ? { cidade: dados.cidade } : {}),
    ...(dados.ramo ? { ramo: dados.ramo } : {}),
    ...(dados.carteirinha ? { carteirinha: dados.carteirinha } : {}),
    ...(dados.atendimento ? { atendimento: dados.atendimento } : {}),
    ...(dados.vigenciaFim ? { vigenciaFim: dados.vigenciaFim } : {}),
    ...(dados.status ? { status: dados.status } : {}),
  };

  salvarDB(db);
  return profissionalToPublico(db.profissionais[idx]);
}

export function atualizarPacienteAdmin(
  id: string,
  dados: {
    nome?: string;
    email?: string;
    estado?: string;
    cidade?: string;
    preferenciaBusca?: ("Presencial" | "RemotoBrasil" | "RemoToEstado")[];
  }
): PacientePublico {
  const db = lerDB();
  const idx = db.pacientes.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Paciente não encontrado");

  if (dados.email) {
    const emailLower = dados.email.toLowerCase();
    if (db.pacientes.some((p) => p.id !== id && p.email?.toLowerCase() === emailLower)) {
      throw new Error("E-mail já cadastrado");
    }
  }

  db.pacientes[idx] = {
    ...db.pacientes[idx],
    ...(dados.nome ? { nome: dados.nome } : {}),
    ...(dados.email ? { email: dados.email.toLowerCase() } : {}),
    ...(dados.estado ? { estado: dados.estado } : {}),
    ...(dados.cidade ? { cidade: dados.cidade } : {}),
    ...(dados.preferenciaBusca !== undefined ? { preferenciaBusca: dados.preferenciaBusca } : {}),
  };

  salvarDB(db);
  return pacienteToPublico(db.pacientes[idx]);
}

// ─── Visitas ──────────────────────────────────────────────────────────────────

export function registrarVisita(tipo: "anonimo" | "paciente" | "profissional"): void {
  const db = lerDB();
  if (!db.visitas) db.visitas = [];
  db.visitas.push({ id: crypto.randomUUID(), timestamp: new Date().toISOString(), tipo });
  salvarDB(db);
}

export function listarVisitas(filtros?: { inicio?: string; fim?: string }): Visita[] {
  const db = lerDB();
  let lista: Visita[] = db.visitas ?? [];
  if (filtros?.inicio) lista = lista.filter((v) => v.timestamp >= filtros.inicio!);
  if (filtros?.fim) lista = lista.filter((v) => v.timestamp <= filtros.fim! + "T23:59:59.999Z");
  return lista;
}

// ─── Questionários ────────────────────────────────────────────────────────────

export function registrarQuestionario(): void {
  const db = lerDB();
  if (!db.questionarios) db.questionarios = [];
  db.questionarios.push({ id: crypto.randomUUID(), timestamp: new Date().toISOString() });
  salvarDB(db);
}

// ─── Mensagens Dica ───────────────────────────────────────────────────────────

export function listarMensagens(apenasAtivas = false): MensagemDica[] {
  const db = lerDB();
  const lista = db.mensagens ?? [];
  return apenasAtivas ? lista.filter((m) => m.ativa) : lista;
}

export function criarMensagem(dados: {
  icone: string;
  titulo: string;
  texto: string;
  ativa: boolean;
}): MensagemDica {
  const db = lerDB();
  const nova: MensagemDica = {
    id: crypto.randomUUID(),
    icone: dados.icone,
    titulo: dados.titulo,
    texto: dados.texto,
    ativa: dados.ativa,
    criadoEm: new Date().toISOString(),
  };
  if (!db.mensagens) db.mensagens = [];
  db.mensagens.push(nova);
  salvarDB(db);
  return nova;
}

export function atualizarMensagem(
  id: string,
  dados: { icone?: string; titulo?: string; texto?: string; ativa?: boolean }
): MensagemDica {
  const db = lerDB();
  if (!db.mensagens) db.mensagens = [];
  const idx = db.mensagens.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error("Mensagem não encontrada");
  db.mensagens[idx] = { ...db.mensagens[idx], ...dados };
  salvarDB(db);
  return db.mensagens[idx];
}

export function excluirMensagem(id: string): void {
  const db = lerDB();
  if (!db.mensagens) return;
  db.mensagens = db.mensagens.filter((m) => m.id !== id);
  salvarDB(db);
}

export function contarQuestionarios(filtros?: { inicio?: string; fim?: string }): number {
  const db = lerDB();
  let lista = db.questionarios ?? [];
  if (filtros?.inicio) lista = lista.filter((q) => q.timestamp >= filtros.inicio!);
  if (filtros?.fim) lista = lista.filter((q) => q.timestamp <= filtros.fim! + "T23:59:59.999Z");
  return lista.length;
}

// ─── Reset de Senha ───────────────────────────────────────────────────────────

export function criarResetToken(userId: string, tipo: "paciente" | "profissional"): string {
  const db = lerDB();
  if (!db.resetTokens) db.resetTokens = [];

  // Remove tokens anteriores do mesmo usuário
  db.resetTokens = db.resetTokens.filter((t) => t.userId !== userId);

  const token = crypto.randomUUID();
  const expiraEm = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hora
  db.resetTokens.push({ token, userId, tipo, expiraEm });
  salvarDB(db);
  return token;
}

export function consumirResetToken(token: string): ResetToken | null {
  const db = lerDB();
  if (!db.resetTokens) return null;
  const entry = db.resetTokens.find((t) => t.token === token);
  if (!entry) return null;
  if (new Date(entry.expiraEm) < new Date()) {
    db.resetTokens = db.resetTokens.filter((t) => t.token !== token);
    salvarDB(db);
    return null;
  }
  // Consome o token (uso único)
  db.resetTokens = db.resetTokens.filter((t) => t.token !== token);
  salvarDB(db);
  return entry;
}

// ─── Tokens revogados (logout persistido) ─────────────────────────────────────

export function revogarTokenDB(token: string): void {
  const db = lerDB();
  if (!db.tokensRevogados) db.tokensRevogados = [];
  if (!db.tokensRevogados.includes(token)) {
    db.tokensRevogados.push(token);
    salvarDB(db);
  }
}

export function isTokenRevogadoDB(token: string): boolean {
  const db = lerDB();
  return (db.tokensRevogados ?? []).includes(token);
}

export function atualizarSenhaPaciente(id: string, novaSenha: string): void {
  const db = lerDB();
  const idx = db.pacientes.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Paciente não encontrado");
  db.pacientes[idx].senhaHash = bcrypt.hashSync(novaSenha, 10);
  salvarDB(db);
}

export function atualizarSenhaProfissional(id: string, novaSenha: string): void {
  const db = lerDB();
  const idx = db.profissionais.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Profissional não encontrado");
  db.profissionais[idx].senhaHash = bcrypt.hashSync(novaSenha, 10);
  salvarDB(db);
}
