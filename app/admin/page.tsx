"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { ESTADOS, buscarCidadesPorEstado } from "@/lib/brasil";
import { formatarCPF } from "@/lib/cpf";

const RAMOS = ["Fisioterapeuta", "Nutricionista", "Psicólogo", "Personal Trainer"];
const OPCOES_ESTADO = ESTADOS.map((e) => ({ value: e.uf, label: e.uf, sublabel: e.nome }));

type Aba = "visitas" | "pacientes" | "profissionais" | "mensagens" | "logs";

interface LogEntry {
  ts: string;
  evento: "login_falhou" | "acesso_negado" | "rate_limit" | "csrf_bloqueado";
  ip?: string;
  rota?: string;
  info?: string;
}

interface MensagemDica {
  id: string;
  icone: string;
  titulo: string;
  texto: string;
  ativa: boolean;
  criadoEm: string;
}

interface Stats {
  total: number;
  pacientes: number;
  profissionais: number;
  anonimos: number;
  questionarios: number;
}

interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  estado: string;
  cidade: string;
  criadoEm: string;
  preferenciaBusca?: string[];
}

interface Profissional {
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
  vigenciaInicio: string;
  vigenciaFim: string;
  status: "Ativo" | "Inativo";
  criadoEm: string;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function fmtCPF(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function vigenciaAtiva(fim: string | undefined) {
  if (!fim) return false;
  return new Date() <= new Date(fim);
}

// ─── Login ───────────────────────────────────────────────────────────────────

function TelaLogin({ onLogado }: { onLogado: () => void }) {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, senha }),
      });
      const data = await res.json();
      if (!res.ok) setErro(data.erro);
      else onLogado();
    } catch {
      setErro("Erro ao conectar com o servidor");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-sm text-gray-500 mt-1">Calma mente — Acesso restrito</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="adm-cpf">CPF</Label>
            <Input
              id="adm-cpf"
              value={cpf}
              onChange={(e) => setCpf(formatarCPF(e.target.value))}
              placeholder="000.000.000-00"
              maxLength={14}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="adm-senha">Senha</Label>
            <Input
              id="adm-senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha de paciente"
            />
          </div>
          {erro && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{erro}</p>}
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ─── Card de stat ─────────────────────────────────────────────────────────────

function StatCard({ label, valor, cor }: { label: string; valor: number; cor: string }) {
  return (
    <div className={`rounded-xl border p-4 ${cor}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="text-3xl font-bold mt-1">{valor}</p>
    </div>
  );
}

// ─── Modal Editar Paciente ────────────────────────────────────────────────────

function ModalEditarPaciente({
  paciente,
  onFechar,
  onSalvo,
}: {
  paciente: Paciente;
  onFechar: () => void;
  onSalvo: (p: Paciente) => void;
}) {
  const [nome, setNome] = useState(paciente.nome);
  const [email, setEmail] = useState(paciente.email);
  const [estado, setEstado] = useState(paciente.estado);
  const [cidade, setCidade] = useState(paciente.cidade);
  const [presencial, setPresencial] = useState(paciente.preferenciaBusca?.includes("Presencial") ?? false);
  const [remotoBrasil, setRemotoBrasil] = useState(paciente.preferenciaBusca?.includes("RemotoBrasil") ?? false);
  const [remotoEstado, setRemotoEstado] = useState(paciente.preferenciaBusca?.includes("RemoToEstado") ?? false);
  const [opcoesCidades, setOpcoesCidades] = useState<{ value: string; label: string }[]>([]);
  const [carregandoCidades, setCarregandoCidades] = useState(false);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!estado) { setOpcoesCidades([]); return; }
    setCarregandoCidades(true);
    buscarCidadesPorEstado(estado)
      .then((lista) => setOpcoesCidades(lista.map((c) => ({ value: c, label: c }))))
      .finally(() => setCarregandoCidades(false));
  }, [estado]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) { setErro("Nome é obrigatório"); return; }
    if (!email.trim()) { setErro("E-mail é obrigatório"); return; }

    const preferenciaBusca: string[] = [];
    if (presencial) preferenciaBusca.push("Presencial");
    if (remotoBrasil) preferenciaBusca.push("RemotoBrasil");
    if (remotoEstado) preferenciaBusca.push("RemoToEstado");

    setSalvando(true);
    setErro("");
    try {
      const res = await fetch(`/api/admin/pacientes/${paciente.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome.trim(), email: email.trim(), estado, cidade, preferenciaBusca }),
      });
      const data = await res.json();
      if (!res.ok) setErro(data.erro);
      else onSalvo(data);
    } catch {
      setErro("Erro ao conectar com o servidor");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialog open onOpenChange={onFechar}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-green-700">Editar Paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 overflow-y-auto pr-1">
          <div className="space-y-1">
            <Label>Nome</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>E-mail</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Estado</Label>
              <Combobox
                options={OPCOES_ESTADO}
                value={estado}
                onChange={(v) => { setEstado(v); setCidade(""); }}
                placeholder="Estado"
                searchPlaceholder="Buscar estado..."
              />
            </div>
            <div className="space-y-1">
              <Label>Cidade</Label>
              <Combobox
                options={opcoesCidades}
                value={cidade}
                onChange={setCidade}
                placeholder={!estado ? "Selecione estado" : carregandoCidades ? "Carregando..." : "Cidade"}
                searchPlaceholder="Buscar cidade..."
                disabled={!estado || carregandoCidades}
                emptyText="Nenhuma cidade."
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Preferência de Busca</Label>
            <div className="flex flex-wrap gap-4">
              {[
                { label: "Presencial", val: presencial, set: setPresencial },
                { label: "Remoto Brasil", val: remotoBrasil, set: setRemotoBrasil },
                { label: "Remoto Estado", val: remotoEstado, set: setRemotoEstado },
              ].map(({ label, val, set }) => (
                <label key={label} className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox checked={val} onCheckedChange={(v) => set(!!v)} />
                  {label}
                </label>
              ))}
            </div>
          </div>
          {erro && <p className="text-sm text-red-600">{erro}</p>}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onFechar}>Cancelar</Button>
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Modal Editar Profissional ────────────────────────────────────────────────

function ModalEditarProfissional({
  profissional,
  onFechar,
  onSalvo,
}: {
  profissional: Profissional;
  onFechar: () => void;
  onSalvo: (p: Profissional) => void;
}) {
  const [nome, setNome] = useState(profissional.nome);
  const [email, setEmail] = useState(profissional.email);
  const [telefone, setTelefone] = useState(profissional.telefone ?? "");
  const [estado, setEstado] = useState(profissional.estado);
  const [cidade, setCidade] = useState(profissional.cidade);
  const [ramo, setRamo] = useState(profissional.ramo);
  const [carteirinha, setCarteirinha] = useState(profissional.carteirinha);
  const [atendOnline, setAtendOnline] = useState((profissional.atendimento ?? []).includes("Online"));
  const [atendPresencial, setAtendPresencial] = useState((profissional.atendimento ?? []).includes("Presencial"));
  const [vigenciaFim, setVigenciaFim] = useState(profissional.vigenciaFim.slice(0, 10));
  const [status, setStatus] = useState<"Ativo" | "Inativo">(profissional.status);
  const [opcoesCidades, setOpcoesCidades] = useState<{ value: string; label: string }[]>([]);
  const [carregandoCidades, setCarregandoCidades] = useState(false);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!estado) { setOpcoesCidades([]); return; }
    setCarregandoCidades(true);
    buscarCidadesPorEstado(estado)
      .then((lista) => setOpcoesCidades(lista.map((c) => ({ value: c, label: c }))))
      .finally(() => setCarregandoCidades(false));
  }, [estado]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) { setErro("Nome é obrigatório"); return; }
    if (!email.trim()) { setErro("E-mail é obrigatório"); return; }
    if (!atendOnline && !atendPresencial) { setErro("Selecione ao menos uma modalidade"); return; }

    const atendimento: string[] = [];
    if (atendOnline) atendimento.push("Online");
    if (atendPresencial) atendimento.push("Presencial");

    setSalvando(true);
    setErro("");
    try {
      const res = await fetch(`/api/admin/profissionais/${profissional.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          telefone: telefone.trim() || undefined,
          estado,
          cidade,
          ramo,
          carteirinha: carteirinha.trim(),
          atendimento,
          vigenciaFim: vigenciaFim ? new Date(vigenciaFim + "T23:59:59").toISOString() : undefined,
          status,
        }),
      });
      const data = await res.json();
      if (!res.ok) setErro(data.erro);
      else onSalvo(data);
    } catch {
      setErro("Erro ao conectar com o servidor");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialog open onOpenChange={onFechar}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-teal-700">Editar Profissional</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 overflow-y-auto pr-1">
          <div className="space-y-1">
            <Label>Nome</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>E-mail</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Telefone <span className="text-gray-400 text-xs">(opcional)</span></Label>
            <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(XX) XXXXX-XXXX" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Ramo</Label>
              <Select value={ramo} onValueChange={(v) => setRamo(v ?? "")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {RAMOS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>{({ Nutricionista: "CRN", "Psicólogo": "CRP", "Personal Trainer": "CREF", Fisioterapeuta: "CREFITO" } as Record<string, string>)[ramo] ?? "Carteirinha"}</Label>
              <Input value={carteirinha} onChange={(e) => setCarteirinha(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Estado</Label>
              <Combobox
                options={OPCOES_ESTADO}
                value={estado}
                onChange={(v) => { setEstado(v); setCidade(""); }}
                placeholder="Estado"
                searchPlaceholder="Buscar estado..."
              />
            </div>
            <div className="space-y-1">
              <Label>Cidade</Label>
              <Combobox
                options={opcoesCidades}
                value={cidade}
                onChange={setCidade}
                placeholder={!estado ? "Selecione estado" : carregandoCidades ? "Carregando..." : "Cidade"}
                searchPlaceholder="Buscar cidade..."
                disabled={!estado || carregandoCidades}
                emptyText="Nenhuma cidade."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => { if (v) setStatus(v as "Ativo" | "Inativo"); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Vigência até</Label>
              <Input type="date" value={vigenciaFim} onChange={(e) => setVigenciaFim(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Modalidade de Atendimento</Label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox checked={atendOnline} onCheckedChange={(v) => setAtendOnline(!!v)} />
                Online
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox checked={atendPresencial} onCheckedChange={(v) => setAtendPresencial(!!v)} />
                Presencial
              </label>
            </div>
          </div>
          {erro && <p className="text-sm text-red-600">{erro}</p>}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onFechar}>Cancelar</Button>
            <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Picker de ícones ────────────────────────────────────────────────────────

const ICONES_SAUDE = [
  "💧","🚶","☀️","👥","🌬️","🌙","🍎","🪑","📵","🙏","🧘","🥗",
  "🎵","📞","🪜","🌿","🍵","😄","🛏️","🩺","🧠","🌊","💪","🏃",
  "🥦","❤️","🌱","🌸","🍃","🏋️","🚴","🤸","🏊","🎯","📚","✍️",
  "🎨","🌅","🌺","🦋","🌻","🍇","🥑","🥕","🫐","🍓","🥝","💊",
  "🩹","🧬","💡","⭐","🌟","✨","🎁","🎉","🏆","🫀","🧪","🔬",
];

function IconePicker({ valor, onChange }: { valor: string; onChange: (v: string) => void }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="relative">
      <Label>Ícone</Label>
      <button
        type="button"
        onClick={() => setAberto((p) => !p)}
        className="mt-1 w-16 h-10 rounded-md border border-input bg-background text-2xl flex items-center justify-center hover:bg-accent transition-colors"
      >
        {valor}
      </button>
      {aberto && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-2 w-72">
          <p className="text-xs text-gray-400 px-1 pb-1.5">Selecione um ícone</p>
          <div className="grid grid-cols-10 gap-0.5 max-h-48 overflow-y-auto">
            {ICONES_SAUDE.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => { onChange(ic); setAberto(false); }}
                className={`text-xl p-1.5 rounded-lg hover:bg-[#EBF4E3] transition-colors ${valor === ic ? "bg-[#EBF4E3] ring-1 ring-[#5C8A3C]" : ""}`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Modal Mensagem ───────────────────────────────────────────────────────────

function ModalMensagem({
  mensagem,
  onFechar,
  onSalvo,
}: {
  mensagem: MensagemDica | null; // null = nova
  onFechar: () => void;
  onSalvo: (m: MensagemDica) => void;
}) {
  const [icone, setIcone] = useState(mensagem?.icone ?? "💡");
  const [titulo, setTitulo] = useState(mensagem?.titulo ?? "");
  const [texto, setTexto] = useState(mensagem?.texto ?? "");
  const [ativa, setAtiva] = useState(mensagem?.ativa ?? true);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!icone.trim()) { setErro("Ícone é obrigatório"); return; }
    if (!titulo.trim()) { setErro("Título é obrigatório"); return; }
    if (!texto.trim()) { setErro("Texto é obrigatório"); return; }

    setSalvando(true);
    setErro("");
    try {
      const url = mensagem ? `/api/admin/mensagens/${mensagem.id}` : "/api/admin/mensagens";
      const method = mensagem ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icone: icone.trim(), titulo: titulo.trim(), texto: texto.trim(), ativa }),
      });
      const data = await res.json();
      if (!res.ok) setErro(data.erro);
      else onSalvo(data);
    } catch {
      setErro("Erro ao conectar com o servidor");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialog open onOpenChange={onFechar}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-[#5C8A3C]">
            {mensagem ? "Editar Mensagem" : "Nova Mensagem"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 overflow-y-auto pr-1">
          <div className="flex gap-3 items-end">
            <IconePicker valor={icone} onChange={setIcone} />
            <div className="space-y-1 flex-1">
              <Label>Título</Label>
              <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Hidratação" />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Texto da mensagem</Label>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={4}
              placeholder="Escreva a dica ou mensagem motivadora..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <Checkbox checked={ativa} onCheckedChange={(v) => setAtiva(!!v)} />
            Mensagem ativa (aparece no sorteio)
          </label>
          {erro && <p className="text-sm text-red-600">{erro}</p>}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onFechar}>Cancelar</Button>
            <Button type="submit" className="flex-1 bg-[#5C8A3C] hover:bg-[#3A6624]" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ onLogout, adminCpf }: { onLogout: () => void; adminCpf: string }) {
  const [aba, setAba] = useState<Aba>("visitas");

  // Stats
  const [stats, setStats] = useState<Stats | null>(null);
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [carregandoStats, setCarregandoStats] = useState(false);

  // Pacientes
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [buscaPac, setBuscaPac] = useState("");
  const [carregandoPac, setCarregandoPac] = useState(false);
  const [editandoPac, setEditandoPac] = useState<Paciente | null>(null);

  // Profissionais
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [buscaProf, setBuscaProf] = useState("");
  const [carregandoProf, setCarregandoProf] = useState(false);
  const [editandoProf, setEditandoProf] = useState<Profissional | null>(null);

  // Mensagens
  const [mensagens, setMensagens] = useState<MensagemDica[]>([]);
  const [buscaMsg, setBuscaMsg] = useState("");
  const [carregandoMsg, setCarregandoMsg] = useState(false);
  const [editandoMsg, setEditandoMsg] = useState<MensagemDica | null | "nova">(null);
  const [excluindoMsg, setExcluindoMsg] = useState<string | null>(null);

  // Logs
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [carregandoLogs, setCarregandoLogs] = useState(false);
  const [filtroEvento, setFiltroEvento] = useState<string>("todos");

  const carregarStats = useCallback(async () => {
    setCarregandoStats(true);
    const params = new URLSearchParams();
    if (inicio) params.set("inicio", inicio);
    if (fim) params.set("fim", fim);
    try {
      const res = await fetch(`/api/admin/stats?${params}`);
      setStats(await res.json());
    } finally {
      setCarregandoStats(false);
    }
  }, [inicio, fim]);

  const carregarPacientes = useCallback(async () => {
    setCarregandoPac(true);
    try {
      const res = await fetch("/api/admin/pacientes");
      setPacientes(await res.json());
    } finally {
      setCarregandoPac(false);
    }
  }, []);

  const carregarProfissionais = useCallback(async () => {
    setCarregandoProf(true);
    try {
      const res = await fetch("/api/admin/profissionais");
      setProfissionais(await res.json());
    } finally {
      setCarregandoProf(false);
    }
  }, []);

  const carregarMensagens = useCallback(async () => {
    setCarregandoMsg(true);
    try {
      const res = await fetch("/api/admin/mensagens");
      setMensagens(await res.json());
    } finally {
      setCarregandoMsg(false);
    }
  }, []);

  const carregarLogs = useCallback(async () => {
    setCarregandoLogs(true);
    try {
      const res = await fetch("/api/admin/logs");
      setLogs(await res.json());
    } finally {
      setCarregandoLogs(false);
    }
  }, []);

  async function excluirMensagem(id: string) {
    setExcluindoMsg(id);
    try {
      await fetch(`/api/admin/mensagens/${id}`, { method: "DELETE" });
      setMensagens((prev) => prev.filter((m) => m.id !== id));
    } finally {
      setExcluindoMsg(null);
    }
  }

  async function toggleAtiva(m: MensagemDica) {
    const res = await fetch(`/api/admin/mensagens/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativa: !m.ativa }),
    });
    if (res.ok) {
      const atualizada = await res.json();
      setMensagens((prev) => prev.map((x) => x.id === atualizada.id ? atualizada : x));
    }
  }

  useEffect(() => { carregarStats(); }, [carregarStats]);
  useEffect(() => { carregarPacientes(); }, [carregarPacientes]);
  useEffect(() => { carregarProfissionais(); }, [carregarProfissionais]);
  useEffect(() => { carregarMensagens(); }, [carregarMensagens]);
  useEffect(() => { if (aba === "logs") carregarLogs(); }, [aba, carregarLogs]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    onLogout();
  }

  // Filtragem local
  const pacientesFiltrados = pacientes.filter((p) => {
    const q = buscaPac.toLowerCase();
    return (
      (p.nome ?? "").toLowerCase().includes(q) ||
      (p.cpf ?? "").includes(q.replace(/\D/g, "")) ||
      (p.email ?? "").toLowerCase().includes(q) ||
      (p.cidade ?? "").toLowerCase().includes(q) ||
      (p.estado ?? "").toLowerCase().includes(q)
    );
  });

  const profissionaisFiltrados = profissionais.filter((p) => {
    const q = buscaProf.toLowerCase();
    return (
      (p.nome ?? "").toLowerCase().includes(q) ||
      (p.cpf ?? "").includes(q.replace(/\D/g, "")) ||
      (p.email ?? "").toLowerCase().includes(q) ||
      (p.ramo ?? "").toLowerCase().includes(q) ||
      (p.cidade ?? "").toLowerCase().includes(q) ||
      (p.estado ?? "").toLowerCase().includes(q)
    );
  });

  const mensagensFiltradas = mensagens.filter((m) => {
    const q = buscaMsg.toLowerCase();
    return (
      m.titulo.toLowerCase().includes(q) ||
      m.texto.toLowerCase().includes(q)
    );
  });

  const logsFiltrados = filtroEvento === "todos"
    ? logs
    : logs.filter((l) => l.evento === filtroEvento);

  const abas: { id: Aba; label: string }[] = [
    { id: "visitas", label: "Visitas & Stats" },
    { id: "pacientes", label: `Pacientes (${pacientes.length})` },
    { id: "profissionais", label: `Profissionais (${profissionais.length})` },
    { id: "mensagens", label: `Mensagens (${mensagens.length})` },
    { id: "logs", label: `Logs (${logs.length})` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center font-bold text-lg">A</div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Painel Administrativo</h1>
            <p className="text-xs text-gray-400">Calma mente · Administrador</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          Sair
        </Button>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-white border border-gray-200 rounded-xl p-1 w-full sm:w-fit shadow-sm">
          {abas.map((a) => (
            <button
              key={a.id}
              onClick={() => setAba(a.id)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                aba === a.id
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>

        {/* ─── Aba Visitas ─────────────────────────────────────────────────── */}
        {aba === "visitas" && (
          <div className="space-y-5">
            {/* Filtro de período */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Filtrar por período</h2>
              <div className="flex flex-wrap items-end gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Data inicial</Label>
                  <Input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className="w-40" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Data final</Label>
                  <Input type="date" value={fim} onChange={(e) => setFim(e.target.value)} className="w-40" />
                </div>
                <Button onClick={carregarStats} disabled={carregandoStats} className="bg-gray-800 hover:bg-gray-900">
                  {carregandoStats ? "Buscando..." : "Aplicar filtro"}
                </Button>
                {(inicio || fim) && (
                  <Button
                    variant="outline"
                    onClick={() => { setInicio(""); setFim(""); }}
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </div>

            {/* Cards de estatísticas */}
            {stats ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard label="Total de Visitas" valor={stats.total} cor="bg-white border-gray-200 text-gray-800" />
                <StatCard label="Visitas de Pacientes" valor={stats.pacientes} cor="bg-green-50 border-green-200 text-green-800" />
                <StatCard label="Visitas de Profissionais" valor={stats.profissionais} cor="bg-teal-50 border-teal-200 text-teal-800" />
                <StatCard label="Visitas Anônimas" valor={stats.anonimos} cor="bg-gray-50 border-gray-200 text-gray-600" />
                <StatCard label="Questionários Respondidos" valor={stats.questionarios} cor="bg-purple-50 border-purple-200 text-purple-800" />
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">Carregando estatísticas...</div>
            )}

            {/* Resumo textual */}
            {stats && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-700 mb-3">Resumo{(inicio || fim) ? " do período selecionado" : " geral"}</h2>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-700 shrink-0" />
                    <span><strong>{stats.total}</strong> visitas no total ao site</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-600 shrink-0" />
                    <span><strong>{stats.pacientes}</strong> visitas de pacientes autenticados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                    <span><strong>{stats.profissionais}</strong> visitas de profissionais autenticados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                    <span><strong>{stats.anonimos}</strong> visitas de usuários não identificados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                    <span><strong>{stats.questionarios}</strong> questionários de análise gratuita respondidos</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ─── Aba Pacientes ───────────────────────────────────────────────── */}
        {aba === "pacientes" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <Input
                value={buscaPac}
                onChange={(e) => setBuscaPac(e.target.value)}
                placeholder="Buscar por nome, CPF, e-mail, cidade..."
                className="w-full sm:max-w-sm"
              />
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={carregarPacientes} disabled={carregandoPac}>
                  {carregandoPac ? "Atualizando..." : "Atualizar"}
                </Button>
                <span className="text-sm text-gray-500">
                  {pacientesFiltrados.length} de {pacientes.length} paciente{pacientes.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {["Nome", "CPF", "E-mail", "Cidade / Estado", "Preferências", "Cadastrado em", ""].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {carregandoPac ? (
                      <tr><td colSpan={7} className="text-center py-8 text-gray-400">Carregando...</td></tr>
                    ) : pacientesFiltrados.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-8 text-gray-400">Nenhum paciente encontrado</td></tr>
                    ) : (
                      pacientesFiltrados.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-2 sm:px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{p.nome}</td>
                          <td className="px-2 sm:px-4 py-3 text-gray-500 font-mono text-xs whitespace-nowrap hidden sm:table-cell">{fmtCPF(p.cpf)}</td>
                          <td className="px-2 sm:px-4 py-3 text-gray-600 whitespace-nowrap hidden md:table-cell">{p.email}</td>
                          <td className="px-2 sm:px-4 py-3 text-gray-600 whitespace-nowrap hidden lg:table-cell">{p.cidade} / {p.estado}</td>
                          <td className="px-2 sm:px-4 py-3 hidden xl:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {(p.preferenciaBusca ?? []).map((pref) => (
                                <span key={pref} className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                                  {pref}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-gray-400 text-xs whitespace-nowrap hidden lg:table-cell">{fmt(p.criadoEm)}</td>
                          <td className="px-2 sm:px-4 py-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditandoPac(p)}
                              className="border-green-200 text-green-700 hover:bg-green-50 whitespace-nowrap"
                            >
                              Editar
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── Aba Profissionais ───────────────────────────────────────────── */}
        {aba === "profissionais" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <Input
                value={buscaProf}
                onChange={(e) => setBuscaProf(e.target.value)}
                placeholder="Buscar por nome, CPF, ramo, cidade..."
                className="w-full sm:max-w-sm"
              />
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={carregarProfissionais} disabled={carregandoProf}>
                  {carregandoProf ? "Atualizando..." : "Atualizar"}
                </Button>
                <span className="text-sm text-gray-500">
                  {profissionaisFiltrados.length} de {profissionais.length} profissional{profissionais.length !== 1 ? "is" : ""}
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {["Foto", "Nome", "CPF", "Ramo", "Cidade / Estado", "Status", "Vigência", "Atendimento", ""].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {carregandoProf ? (
                      <tr><td colSpan={9} className="text-center py-8 text-gray-400">Carregando...</td></tr>
                    ) : profissionaisFiltrados.length === 0 ? (
                      <tr><td colSpan={9} className="text-center py-8 text-gray-400">Nenhum profissional encontrado</td></tr>
                    ) : (
                      profissionaisFiltrados.map((p) => {
                        const ativo = p.status === "Ativo";
                        const dentro = p.vigenciaFim ? vigenciaAtiva(p.vigenciaFim) : false;
                        return (
                          <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-2 sm:px-4 py-3">
                              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-teal-100 flex items-center justify-center shrink-0">
                                {p.foto ? (
                                  <img src={p.foto} alt={p.nome} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-sm font-bold text-teal-600">{(p.nome ?? "?").charAt(0).toUpperCase()}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-2 sm:px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{p.nome ?? "—"}</td>
                            <td className="px-2 sm:px-4 py-3 text-gray-500 font-mono text-xs whitespace-nowrap hidden sm:table-cell">{p.cpf ? fmtCPF(p.cpf) : "—"}</td>
                            <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                              <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">{p.ramo ?? "—"}</span>
                            </td>
                            <td className="px-2 sm:px-4 py-3 text-gray-600 whitespace-nowrap hidden lg:table-cell">{p.cidade ?? "—"} / {p.estado ?? "—"}</td>
                            <td className="px-2 sm:px-4 py-3">
                              <Badge className={ativo
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                : "bg-gray-200 text-gray-600 hover:bg-gray-200"
                              }>
                                {p.status ?? "Inativo"}
                              </Badge>
                            </td>
                            <td className="px-2 sm:px-4 py-3 text-xs whitespace-nowrap hidden md:table-cell">
                              {p.vigenciaFim ? (
                                <span className={dentro ? "text-emerald-700 font-medium" : "text-red-500 font-medium"}>
                                  até {fmt(p.vigenciaFim)}
                                  {!dentro && " ⚠"}
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                            <td className="px-2 sm:px-4 py-3 text-gray-500 text-xs whitespace-nowrap hidden xl:table-cell">
                              {(p.atendimento ?? []).join(" · ") || "—"}
                            </td>
                            <td className="px-2 sm:px-4 py-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditandoProf(p)}
                                className="border-teal-200 text-teal-700 hover:bg-teal-50 whitespace-nowrap"
                              >
                                Editar
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* ─── Aba Mensagens ──────────────────────────────────────────────── */}
        {aba === "mensagens" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Input
                value={buscaMsg}
                onChange={(e) => setBuscaMsg(e.target.value)}
                placeholder="Buscar por título ou texto..."
                className="max-w-sm"
              />
              <Button variant="outline" size="sm" onClick={carregarMensagens} disabled={carregandoMsg}>
                {carregandoMsg ? "Atualizando..." : "Atualizar"}
              </Button>
              <Button
                size="sm"
                className="bg-[#5C8A3C] hover:bg-[#3A6624] text-white"
                onClick={() => setEditandoMsg("nova")}
              >
                + Nova Mensagem
              </Button>
              <span className="text-sm text-gray-500">
                {mensagensFiltradas.length} de {mensagens.length} mensagem{mensagens.length !== 1 ? "ns" : ""}
                {" · "}{mensagens.filter((m) => m.ativa).length} ativa{mensagens.filter((m) => m.ativa).length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {["", "Título", "Texto", "Status", "Cadastrada em", ""].map((h, i) => (
                        <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {carregandoMsg ? (
                      <tr><td colSpan={6} className="text-center py-8 text-gray-400">Carregando...</td></tr>
                    ) : mensagensFiltradas.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-8 text-gray-400">Nenhuma mensagem encontrada</td></tr>
                    ) : (
                      mensagensFiltradas.map((m) => (
                        <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-2xl">{m.icone}</td>
                          <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{m.titulo}</td>
                          <td className="px-2 sm:px-4 py-3 text-gray-500 w-full">
                            <p className="line-clamp-2 text-xs leading-relaxed">{m.texto}</p>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleAtiva(m)}
                              className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                                m.ativa
                                  ? "bg-[#EBF4E3] text-[#5C8A3C] hover:bg-[#D5ECC6]"
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              }`}
                            >
                              {m.ativa ? "Ativa" : "Inativa"}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{fmt(m.criadoEm)}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditandoMsg(m)}
                                className="border-[#5C8A3C]/30 text-[#5C8A3C] hover:bg-[#EBF4E3] whitespace-nowrap"
                              >
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => excluirMensagem(m.id)}
                                disabled={excluindoMsg === m.id}
                                className="border-red-200 text-red-500 hover:bg-red-50 whitespace-nowrap"
                              >
                                {excluindoMsg === m.id ? "..." : "Excluir"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* ─── Aba Logs ────────────────────────────────────────────────────── */}
        {aba === "logs" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={filtroEvento}
                  onChange={(e) => setFiltroEvento(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <option value="todos">Todos os eventos</option>
                  <option value="login_falhou">Login falhou</option>
                  <option value="acesso_negado">Acesso negado</option>
                  <option value="rate_limit">Rate limit</option>
                  <option value="csrf_bloqueado">CSRF bloqueado</option>
                </select>
                <span className="text-sm text-gray-400">{logsFiltrados.length} registro{logsFiltrados.length !== 1 ? "s" : ""}</span>
              </div>
              <Button variant="outline" size="sm" onClick={carregarLogs} disabled={carregandoLogs}>
                {carregandoLogs ? "Atualizando..." : "Atualizar"}
              </Button>
            </div>

            {carregandoLogs ? (
              <div className="text-center py-10 text-gray-400 text-sm">Carregando logs...</div>
            ) : logsFiltrados.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm bg-white border border-gray-200 rounded-xl">
                Nenhum evento de segurança registrado.
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wide">
                      <th className="px-2 sm:px-4 py-3 font-medium whitespace-nowrap">Data / Hora</th>
                      <th className="px-2 sm:px-4 py-3 font-medium">Evento</th>
                      <th className="px-2 sm:px-4 py-3 font-medium hidden sm:table-cell">IP</th>
                      <th className="px-2 sm:px-4 py-3 font-medium hidden md:table-cell">Rota</th>
                      <th className="px-2 sm:px-4 py-3 font-medium hidden lg:table-cell">Detalhe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {logsFiltrados.map((log, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-2 sm:px-4 py-3 text-gray-500 whitespace-nowrap font-mono text-xs">
                          {new Date(log.ts).toLocaleString("pt-BR")}
                        </td>
                        <td className="px-2 sm:px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            log.evento === "login_falhou"   ? "bg-yellow-100 text-yellow-800" :
                            log.evento === "acesso_negado" ? "bg-red-100 text-red-800" :
                            log.evento === "rate_limit"    ? "bg-orange-100 text-orange-800" :
                            "bg-purple-100 text-purple-800"
                          }`}>
                            {log.evento === "login_falhou"   ? "Login falhou" :
                             log.evento === "acesso_negado"  ? "Acesso negado" :
                             log.evento === "rate_limit"     ? "Rate limit" :
                             "CSRF bloqueado"}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-gray-600 font-mono text-xs hidden sm:table-cell">{log.ip ?? "—"}</td>
                        <td className="px-2 sm:px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{log.rota ?? "—"}</td>
                        <td className="px-2 sm:px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">{log.info ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modais de edição */}
      {editandoPac && (
        <ModalEditarPaciente
          paciente={editandoPac}
          onFechar={() => setEditandoPac(null)}
          onSalvo={(atualizado) => {
            setPacientes((prev) => prev.map((p) => p.id === atualizado.id ? atualizado : p));
            setEditandoPac(null);
          }}
        />
      )}
      {editandoProf && (
        <ModalEditarProfissional
          profissional={editandoProf}
          onFechar={() => setEditandoProf(null)}
          onSalvo={(atualizado) => {
            setProfissionais((prev) => prev.map((p) => p.id === atualizado.id ? atualizado : p));
            setEditandoProf(null);
          }}
        />
      )}
      {editandoMsg !== null && (
        <ModalMensagem
          mensagem={editandoMsg === "nova" ? null : editandoMsg}
          onFechar={() => setEditandoMsg(null)}
          onSalvo={(salva) => {
            setMensagens((prev) => {
              const existe = prev.find((m) => m.id === salva.id);
              return existe
                ? prev.map((m) => m.id === salva.id ? salva : m)
                : [salva, ...prev];
            });
            setEditandoMsg(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [adminCpf, setAdminCpf] = useState("");

  function carregarAdmin() {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((data) => {
        setAutenticado(!!data?.authenticated);
      })
      .catch(() => setAutenticado(false));
  }

  useEffect(() => { carregarAdmin(); }, []);

  if (autenticado === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Verificando acesso...</div>
      </div>
    );
  }

  if (!autenticado) {
    return <TelaLogin onLogado={carregarAdmin} />;
  }

  return <Dashboard adminCpf={adminCpf} onLogout={() => { setAutenticado(false); setAdminCpf(""); }} />;
}
