"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validarCPF, formatarCPF } from "@/lib/cpf";
import { ESTADOS, buscarCidadesPorEstado } from "@/lib/brasil";
import { useAuth } from "@/components/AuthProvider";

const RAMOS = ["Fisioterapeuta", "Nutricionista", "Psicólogo", "Personal Trainer"];

const CONSELHO: Record<string, string> = {
  Nutricionista: "CRN",
  "Psicólogo": "CRP",
  "Personal Trainer": "CREF",
  Fisioterapeuta: "CREFITO",
};

const OPCOES_ESTADO = ESTADOS.map((e) => ({
  value: e.uf,
  label: e.uf,
  sublabel: e.nome,
}));

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onLoginClick?: () => void;
}

type Erros = {
  nome?: string;
  cpf?: string;
  carteirinha?: string;
  ramo?: string;
  estado?: string;
  cidade?: string;
  email?: string;
  atendimento?: string;
  senha?: string;
  confirmarSenha?: string;
  geral?: string;
};

function redimensionarImagem(file: File, maxSize = 400): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w > h) { if (w > maxSize) { h = Math.round(h * maxSize / w); w = maxSize; } }
      else { if (h > maxSize) { w = Math.round(w * maxSize / h); h = maxSize; } }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.src = url;
  });
}

export default function CadastroProfissionalModal({ aberto, onFechar, onLoginClick }: Props) {
  const { recarregarProfissional } = useAuth();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [carteirinha, setCarteirinha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [ramo, setRamo] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [email, setEmail] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const inputFotoRef = useRef<HTMLInputElement>(null);
  const [atendOnline, setAtendOnline] = useState(false);
  const [atendPresencial, setAtendPresencial] = useState(false);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [opcoesCidades, setOpcoesCidades] = useState<{ value: string; label: string }[]>([]);
  const [carregandoCidades, setCarregandoCidades] = useState(false);

  const [erros, setErros] = useState<Erros>({});
  const [sucesso, setSucesso] = useState(false);
  const [nomeRegistrado, setNomeRegistrado] = useState("");
  const [ramoRegistrado, setRamoRegistrado] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!estado) {
      setOpcoesCidades([]);
      setCidade("");
      return;
    }
    setCarregandoCidades(true);
    setCidade("");
    buscarCidadesPorEstado(estado)
      .then((lista) => setOpcoesCidades(lista.map((c) => ({ value: c, label: c }))))
      .finally(() => setCarregandoCidades(false));
  }, [estado]);

  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await redimensionarImagem(file);
    setFoto(base64);
    e.target.value = "";
  }

  function formatarTelefone(v: string): string {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
    return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
  }

  function limparErro(campo: keyof Erros) {
    setErros((prev) => ({ ...prev, [campo]: undefined }));
  }

  function handleCpf(e: React.ChangeEvent<HTMLInputElement>) {
    setCpf(formatarCPF(e.target.value));
    limparErro("cpf");
  }

  function validar(): boolean {
    const novos: Erros = {};
    if (!nome.trim()) novos.nome = "Nome é obrigatório";

    const cpfLimpo = cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) novos.cpf = "CPF deve ter 11 dígitos";
    else if (!validarCPF(cpf)) novos.cpf = "CPF inválido";

    if (!carteirinha.trim()) novos.carteirinha = "Número da carteirinha é obrigatório";
    if (!ramo) novos.ramo = "Selecione um ramo";
    if (!estado) novos.estado = "Selecione um estado";
    if (!cidade) novos.cidade = "Selecione uma cidade";

    if (!email.trim()) novos.email = "E-mail é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) novos.email = "E-mail inválido";

    if (!atendOnline && !atendPresencial)
      novos.atendimento = "Selecione ao menos uma modalidade";

    if (senha.length < 6) novos.senha = "Mínimo de 6 caracteres";
    if (senha !== confirmarSenha) novos.confirmarSenha = "Senhas não conferem";

    setErros(novos);
    return Object.keys(novos).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;

    const atendimento: string[] = [];
    if (atendOnline) atendimento.push("Online");
    if (atendPresencial) atendimento.push("Presencial");

    setCarregando(true);
    try {
      const res = await fetch("/api/profissionais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cpf, carteirinha, ramo, estado, cidade, email, telefone: telefone || undefined, atendimento, foto: foto ?? undefined, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErros({ geral: data.erro });
      } else {
        setNomeRegistrado(nome);
        setRamoRegistrado(ramo);
        await recarregarProfissional();
        setSucesso(true);
      }
    } catch {
      setErros({ geral: "Erro ao conectar com o servidor" });
    } finally {
      setCarregando(false);
    }
  }

  function fechar() {
    setNome(""); setCpf(""); setCarteirinha(""); setTelefone(""); setRamo("");
    setEstado(""); setCidade(""); setEmail(""); setFoto(null);
    setAtendOnline(false); setAtendPresencial(false);
    setSenha(""); setConfirmarSenha("");
    setErros({}); setSucesso(false); setOpcoesCidades([]);
    onFechar();
  }

  return (
    <Dialog open={aberto} onOpenChange={fechar}>
      <DialogContent className="max-w-md max-h-[92vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-teal-700">
            Cadastro de Profissional
          </DialogTitle>
        </DialogHeader>

        {!sucesso ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto pr-1">

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

            {/* Nome */}
            <div className="space-y-1.5">
              <Label htmlFor="prof-nome">Nome completo</Label>
              <Input
                id="prof-nome"
                value={nome}
                onChange={(e) => { setNome(e.target.value); limparErro("nome"); }}
                placeholder="Ex: Dr. João Oliveira"
                className={erros.nome ? "border-red-400" : ""}
              />
              {erros.nome && <p className="text-xs text-red-500">{erros.nome}</p>}
            </div>

            {/* CPF */}
            <div className="space-y-1.5">
              <Label htmlFor="prof-cpf">CPF</Label>
              <Input
                id="prof-cpf"
                value={cpf}
                onChange={handleCpf}
                placeholder="000.000.000-00"
                maxLength={14}
                className={erros.cpf ? "border-red-400" : ""}
              />
              {erros.cpf && <p className="text-xs text-red-500">{erros.cpf}</p>}
            </div>

            {/* Ramo */}
            <div className="space-y-1.5">
              <Label>Ramo de atuação</Label>
              <Select
                value={ramo}
                onValueChange={(val) => { setRamo(val ?? ""); setCarteirinha(""); limparErro("ramo"); limparErro("carteirinha"); }}
              >
                <SelectTrigger className={erros.ramo ? "border-red-400" : ""}>
                  <SelectValue placeholder="Selecione o ramo" />
                </SelectTrigger>
                <SelectContent>
                  {RAMOS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {erros.ramo && <p className="text-xs text-red-500">{erros.ramo}</p>}
            </div>

            {/* Registro no Conselho */}
            <div className="space-y-1.5">
              <Label htmlFor="prof-carteirinha">
                {ramo ? `Número do ${CONSELHO[ramo]}` : "Número de registro no conselho"}
              </Label>
              <Input
                id="prof-carteirinha"
                value={carteirinha}
                onChange={(e) => { setCarteirinha(e.target.value); limparErro("carteirinha"); }}
                placeholder={
                  ramo
                    ? `Ex: ${CONSELHO[ramo]}-${ramo === "Fisioterapeuta" ? "2/123456-F" : ramo === "Personal Trainer" ? "033289-G/SP" : ramo === "Psicólogo" ? "06/123456" : "3 12345"}`
                    : "Selecione o ramo primeiro"
                }
                disabled={!ramo}
                className={erros.carteirinha ? "border-red-400" : ""}
              />
              {erros.carteirinha && <p className="text-xs text-red-500">{erros.carteirinha}</p>}
            </div>

            {/* Estado */}
            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Combobox
                options={OPCOES_ESTADO}
                value={estado}
                onChange={(v) => { setEstado(v); limparErro("estado"); }}
                placeholder="Selecione o estado"
                searchPlaceholder="Buscar por sigla ou nome..."
                error={!!erros.estado}
              />
              {erros.estado && <p className="text-xs text-red-500">{erros.estado}</p>}
            </div>

            {/* Cidade */}
            <div className="space-y-1.5">
              <Label>Cidade</Label>
              <Combobox
                options={opcoesCidades}
                value={cidade}
                onChange={(v) => { setCidade(v); limparErro("cidade"); }}
                placeholder={
                  !estado ? "Selecione um estado primeiro"
                  : carregandoCidades ? "Carregando cidades..."
                  : "Digite para buscar a cidade"
                }
                searchPlaceholder="Digite o nome da cidade..."
                disabled={!estado || carregandoCidades}
                error={!!erros.cidade}
                emptyText="Nenhuma cidade encontrada."
              />
              {erros.cidade && <p className="text-xs text-red-500">{erros.cidade}</p>}
            </div>

            {/* E-mail */}
            <div className="space-y-1.5">
              <Label htmlFor="prof-email">E-mail</Label>
              <Input
                id="prof-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); limparErro("email"); }}
                placeholder="Ex: joao@clinica.com"
                className={erros.email ? "border-red-400" : ""}
              />
              {erros.email && <p className="text-xs text-red-500">{erros.email}</p>}
            </div>

            {/* Telefone */}
            <div className="space-y-1.5">
              <Label htmlFor="prof-telefone">Telefone <span className="text-stone-400 font-normal">(opcional)</span></Label>
              <Input
                id="prof-telefone"
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>

            {/* Atendimento */}
            <div className="space-y-2">
              <Label>Modalidade de Atendimento</Label>
              <div className="flex flex-col sm:flex-row sm:gap-6 gap-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <Checkbox
                    checked={atendOnline}
                    onCheckedChange={(v) => {
                      setAtendOnline(v === true);
                      limparErro("atendimento");
                    }}
                  />
                  <span className="text-sm font-medium">Online</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <Checkbox
                    checked={atendPresencial}
                    onCheckedChange={(v) => {
                      setAtendPresencial(v === true);
                      limparErro("atendimento");
                    }}
                  />
                  <span className="text-sm font-medium">Presencial</span>
                </label>
              </div>
              {erros.atendimento && (
                <p className="text-xs text-red-500">{erros.atendimento}</p>
              )}
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <Label htmlFor="prof-senha">Senha</Label>
              <Input
                id="prof-senha"
                type="password"
                value={senha}
                onChange={(e) => { setSenha(e.target.value); limparErro("senha"); }}
                placeholder="Mínimo 6 caracteres"
                className={erros.senha ? "border-red-400" : ""}
              />
              {erros.senha && <p className="text-xs text-red-500">{erros.senha}</p>}
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-1.5">
              <Label htmlFor="prof-confirmar">Confirmar senha</Label>
              <Input
                id="prof-confirmar"
                type="password"
                value={confirmarSenha}
                onChange={(e) => { setConfirmarSenha(e.target.value); limparErro("confirmarSenha"); }}
                placeholder="Repita a senha"
                className={erros.confirmarSenha ? "border-red-400" : ""}
              />
              {erros.confirmarSenha && <p className="text-xs text-red-500">{erros.confirmarSenha}</p>}
            </div>

            {erros.geral && (
              <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2">
                <p className="text-sm text-red-600">{erros.geral}</p>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={fechar}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700"
                disabled={carregando}
              >
                {carregando ? "Salvando..." : "Cadastrar"}
              </Button>
            </div>

            {onLoginClick && (
              <p className="text-center text-sm text-gray-500 pb-1">
                Já tem conta?{" "}
                <button
                  type="button"
                  onClick={() => { fechar(); onLoginClick(); }}
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  Fazer login
                </button>
              </p>
            )}
          </form>
        ) : (
          <div className="space-y-5 text-center py-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
                <span className="text-3xl">🎉</span>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">Profissional cadastrado!</p>
              <p className="text-sm text-gray-500 mt-1">
                <strong>{nomeRegistrado}</strong> ({ramoRegistrado}) foi cadastrado com sucesso.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setSucesso(false);
                  setNome(""); setCpf(""); setCarteirinha(""); setRamo("");
                  setEstado(""); setCidade(""); setEmail("");
                  setAtendOnline(false); setAtendPresencial(false);
                  setOpcoesCidades([]);
                }}
              >
                Novo cadastro
              </Button>
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={fechar}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
