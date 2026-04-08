"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { useAuth } from "@/components/AuthProvider";
import { ESTADOS, buscarCidadesPorEstado } from "@/lib/brasil";

const OPCOES_ESTADO = ESTADOS.map((e) => ({
  value: e.uf,
  label: e.uf,
  sublabel: e.nome,
}));

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function vigenciaAtiva(vigenciaFim: string): boolean {
  return new Date() <= new Date(vigenciaFim);
}

interface Props {
  aberto: boolean;
  onFechar: () => void;
}

export default function DashboardProfissionalModal({ aberto, onFechar }: Props) {
  const { profissional, recarregarProfissional } = useAuth();
  const [atualizando, setAtualizando] = useState(false);
  const [erroStatus, setErroStatus] = useState("");

  // Modo de edição
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [email, setEmail] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const inputFotoRef = useRef<HTMLInputElement>(null);
  const [atendOnline, setAtendOnline] = useState(false);
  const [atendPresencial, setAtendPresencial] = useState(false);
  const [opcoesCidades, setOpcoesCidades] = useState<{ value: string; label: string }[]>([]);
  const [carregandoCidades, setCarregandoCidades] = useState(false);
  const [erroEdicao, setErroEdicao] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Auto-expirar se vigência passou
  useEffect(() => {
    if (!profissional || !aberto) return;
    if (profissional.status === "Ativo" && !vigenciaAtiva(profissional.vigenciaFim)) {
      atualizarStatus("Inativo");
    }
  }, [aberto, profissional]);

  // Pré-preencher form ao entrar em modo edição
  useEffect(() => {
    if (editando && profissional) {
      setNome(profissional.nome);
      setEstado(profissional.estado);
      setCidade(profissional.cidade);
      setEmail(profissional.email);
      setFoto(profissional.foto ?? null);
      setAtendOnline(profissional.atendimento.includes("Online"));
      setAtendPresencial(profissional.atendimento.includes("Presencial"));
      setErroEdicao("");
    }
  }, [editando, profissional]);

  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const maxSize = 400;
      let w = img.width; let h = img.height;
      if (w > h) { if (w > maxSize) { h = Math.round(h * maxSize / w); w = maxSize; } }
      else { if (h > maxSize) { w = Math.round(w * maxSize / h); h = maxSize; } }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      setFoto(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.src = url;
    e.target.value = "";
  }

  // Carregar cidades ao mudar estado
  useEffect(() => {
    if (!estado) { setOpcoesCidades([]); return; }
    setCarregandoCidades(true);
    buscarCidadesPorEstado(estado)
      .then((lista) => setOpcoesCidades(lista.map((c) => ({ value: c, label: c }))))
      .finally(() => setCarregandoCidades(false));
  }, [estado]);

  async function atualizarStatus(novoStatus: "Ativo" | "Inativo") {
    if (!profissional) return;
    setAtualizando(true);
    setErroStatus("");
    try {
      const res = await fetch(`/api/profissionais/${profissional.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });
      const data = await res.json();
      if (!res.ok) setErroStatus(data.erro);
      else await recarregarProfissional();
    } catch {
      setErroStatus("Erro ao atualizar status");
    } finally {
      setAtualizando(false);
    }
  }

  async function salvarEdicao(e: React.FormEvent) {
    e.preventDefault();
    if (!profissional) return;
    if (!nome.trim()) { setErroEdicao("Nome é obrigatório"); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErroEdicao("E-mail inválido"); return; }
    if (!estado) { setErroEdicao("Selecione um estado"); return; }
    if (!cidade) { setErroEdicao("Selecione uma cidade"); return; }
    if (!atendOnline && !atendPresencial) { setErroEdicao("Selecione ao menos uma modalidade de atendimento"); return; }

    const atendimento: string[] = [];
    if (atendOnline) atendimento.push("Online");
    if (atendPresencial) atendimento.push("Presencial");

    setSalvando(true);
    setErroEdicao("");
    try {
      const res = await fetch(`/api/profissionais/${profissional.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome.trim(), estado, cidade, atendimento, email: email.trim(), foto: foto ?? undefined }),
      });
      const data = await res.json();
      if (!res.ok) setErroEdicao(data.erro);
      else {
        await recarregarProfissional();
        setEditando(false);
      }
    } catch {
      setErroEdicao("Erro ao conectar com o servidor");
    } finally {
      setSalvando(false);
    }
  }

  if (!profissional) return null;

  const dentro = vigenciaAtiva(profissional.vigenciaFim);
  const ativo = profissional.status === "Ativo";

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-xl font-bold text-teal-700">
              {editando ? "Editar Perfil" : "Meu Perfil Profissional"}
            </DialogTitle>
            {!editando && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditando(true)}
                className="border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                Editar Perfil
              </Button>
            )}
          </div>
        </DialogHeader>

        {editando ? (
          <form onSubmit={salvarEdicao} className="flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Foto */}
            <div className="space-y-1.5">
              <Label>Foto de perfil</Label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => inputFotoRef.current?.click()}
                  className="w-20 h-20 rounded-full border-2 border-dashed border-teal-300 flex items-center justify-center overflow-hidden bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer shrink-0"
                >
                  {foto ? (
                    <img src={foto} alt="Foto" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">📷</span>
                  )}
                </button>
                <div className="text-sm text-gray-500">
                  <p>Clique para {foto ? "trocar" : "adicionar"} foto</p>
                  <p className="text-xs text-gray-400">JPG, PNG ou WEBP</p>
                  {foto && (
                    <button type="button" onClick={() => setFoto(null)} className="text-xs text-red-500 hover:text-red-700 mt-1">
                      Remover foto
                    </button>
                  )}
                </div>
              </div>
              <input ref={inputFotoRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dp-nome">Nome completo</Label>
              <Input
                id="dp-nome"
                value={nome}
                onChange={(e) => { setNome(e.target.value); setErroEdicao(""); }}
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dp-email">E-mail</Label>
              <Input
                id="dp-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErroEdicao(""); }}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Combobox
                options={OPCOES_ESTADO}
                value={estado}
                onChange={(v) => { setEstado(v); setCidade(""); setErroEdicao(""); }}
                placeholder="Selecione o estado"
                searchPlaceholder="Buscar por sigla ou nome..."
              />
            </div>

            <div className="space-y-1.5">
              <Label>Cidade</Label>
              <Combobox
                options={opcoesCidades}
                value={cidade}
                onChange={(v) => { setCidade(v); setErroEdicao(""); }}
                placeholder={
                  !estado ? "Selecione um estado primeiro"
                  : carregandoCidades ? "Carregando cidades..."
                  : "Digite para buscar a cidade"
                }
                searchPlaceholder="Digite o nome da cidade..."
                disabled={!estado || carregandoCidades}
                emptyText="Nenhuma cidade encontrada."
              />
            </div>

            <div className="space-y-2">
              <Label>Modalidade de Atendimento</Label>
              <div className="flex flex-col sm:flex-row sm:gap-6 gap-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <Checkbox
                    checked={atendOnline}
                    onCheckedChange={(v) => { setAtendOnline(v === true); setErroEdicao(""); }}
                  />
                  <span className="text-sm font-medium">Online</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <Checkbox
                    checked={atendPresencial}
                    onCheckedChange={(v) => { setAtendPresencial(v === true); setErroEdicao(""); }}
                  />
                  <span className="text-sm font-medium">Presencial</span>
                </label>
              </div>
            </div>

            {erroEdicao && (
              <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2">
                <p className="text-sm text-red-600">{erroEdicao}</p>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setEditando(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700" disabled={salvando}>
                {salvando ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Foto do perfil */}
            {profissional.foto && (
              <div className="flex justify-center">
                <img
                  src={profissional.foto}
                  alt={profissional.nome}
                  className="w-24 h-24 rounded-full object-cover border-4 border-teal-100 shadow"
                />
              </div>
            )}

            {/* Status + Vigência */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Status</span>
                <Badge
                  className={
                    ativo
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-200"
                  }
                >
                  {profissional.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Vigência</span>
                <span className={`font-medium ${dentro ? "text-emerald-700" : "text-red-600"}`}>
                  {formatarData(profissional.vigenciaInicio)} → {formatarData(profissional.vigenciaFim)}
                  {!dentro && " (expirada)"}
                </span>
              </div>

              <div className="pt-1">
                {ativo ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => atualizarStatus("Inativo")}
                    disabled={atualizando}
                  >
                    {atualizando ? "Aguarde..." : "Desativar cadastro"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className={`w-full ${dentro ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-300 cursor-not-allowed"}`}
                    onClick={() => dentro && atualizarStatus("Ativo")}
                    disabled={atualizando || !dentro}
                    title={!dentro ? "Vigência expirada — não é possível reativar" : ""}
                  >
                    {atualizando ? "Aguarde..." : dentro ? "Ativar cadastro" : "Vigência expirada"}
                  </Button>
                )}
                {erroStatus && <p className="text-xs text-red-500 mt-1 text-center">{erroStatus}</p>}
                {!dentro && !ativo && (
                  <p className="text-xs text-gray-400 mt-1 text-center">
                    Para reativar, renove sua vigência com o suporte.
                  </p>
                )}
              </div>
            </div>

            {/* Dados do perfil */}
            <div className="space-y-3">
              <Campo label="Nome" valor={profissional.nome} />
              <Campo label="CPF" valor={profissional.cpf} />
              <Campo label="Carteirinha" valor={profissional.carteirinha} />
              <Campo label="Ramo" valor={profissional.ramo} />
              <Campo label="Estado" valor={profissional.estado} />
              <Campo label="Cidade" valor={profissional.cidade} />
              <Campo label="E-mail" valor={profissional.email} />
              <Campo label="Atendimento" valor={profissional.atendimento.join(" · ")} />
              <Campo label="Cadastrado em" valor={formatarData(profissional.criadoEm)} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500 shrink-0 w-28">{label}</span>
      <span className="text-sm font-medium text-gray-800 text-right">{valor}</span>
    </div>
  );
}
