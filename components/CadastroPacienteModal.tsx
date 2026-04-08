"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { validarCPF, formatarCPF } from "@/lib/cpf";
import { ESTADOS, buscarCidadesPorEstado } from "@/lib/brasil";
import { useAuth } from "@/components/AuthProvider";

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onLoginClick?: () => void;
}

type Erros = {
  nome?: string;
  cpf?: string;
  email?: string;
  estado?: string;
  cidade?: string;
  preferenciaBusca?: string;
  senha?: string;
  confirmarSenha?: string;
  geral?: string;
};

const OPCOES_ESTADO = ESTADOS.map((e) => ({
  value: e.uf,
  label: e.uf,
  sublabel: e.nome,
}));

export default function CadastroPacienteModal({ aberto, onFechar, onLoginClick }: Props) {
  const { recarregarPaciente: recarregar } = useAuth();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [presencial, setPresencial] = useState(false);
  const [remoto, setRemoto] = useState(false);
  const [abrangenciaRemoto, setAbrangenciaRemoto] = useState<"Brasil" | "Estado" | "">("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [opcoesCidades, setOpcoesCidades] = useState<{ value: string; label: string }[]>([]);
  const [carregandoCidades, setCarregandoCidades] = useState(false);

  const [erros, setErros] = useState<Erros>({});
  const [sucesso, setSucesso] = useState(false);
  const [nomeRegistrado, setNomeRegistrado] = useState("");
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

    if (!email.trim()) novos.email = "E-mail é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) novos.email = "E-mail inválido";

    if (!estado) novos.estado = "Selecione um estado";
    if (!cidade) novos.cidade = "Selecione uma cidade";

    if (!presencial && !remoto) {
      novos.preferenciaBusca = "Selecione pelo menos uma preferência de busca";
    } else if (remoto && !abrangenciaRemoto) {
      novos.preferenciaBusca = "Selecione a abrangência da busca remota";
    }

    if (senha.length < 6) novos.senha = "Mínimo de 6 caracteres";
    if (senha !== confirmarSenha) novos.confirmarSenha = "Senhas não conferem";

    setErros(novos);
    return Object.keys(novos).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;

    setCarregando(true);

    const preferenciaBusca: ("Presencial" | "RemotoBrasil" | "RemoToEstado")[] = [];
    if (presencial) preferenciaBusca.push("Presencial");
    if (remoto && abrangenciaRemoto === "Brasil") preferenciaBusca.push("RemotoBrasil");
    if (remoto && abrangenciaRemoto === "Estado") preferenciaBusca.push("RemoToEstado");

    try {
      const res = await fetch("/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cpf, email, estado, cidade, senha, preferenciaBusca }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErros({ geral: data.erro });
      } else {
        setNomeRegistrado(nome);
        await recarregar();
        setSucesso(true);
      }
    } catch {
      setErros({ geral: "Erro ao conectar com o servidor" });
    } finally {
      setCarregando(false);
    }
  }

  function fechar() {
    setNome(""); setCpf(""); setEmail(""); setEstado("");
    setCidade(""); setSenha(""); setConfirmarSenha("");
    setPresencial(false); setRemoto(false); setAbrangenciaRemoto("");
    setErros({}); setSucesso(false); setOpcoesCidades([]);
    onFechar();
  }

  return (
    <Dialog open={aberto} onOpenChange={fechar}>
      <DialogContent className="max-w-md max-h-[92vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-green-700">
            Cadastro de Paciente
          </DialogTitle>
        </DialogHeader>

        {!sucesso ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Nome */}
            <div className="space-y-1.5">
              <Label htmlFor="pac-nome">Nome completo</Label>
              <Input
                id="pac-nome"
                value={nome}
                onChange={(e) => { setNome(e.target.value); limparErro("nome"); }}
                placeholder="Ex: Maria da Silva"
                className={erros.nome ? "border-red-400" : ""}
              />
              {erros.nome && <p className="text-xs text-red-500">{erros.nome}</p>}
            </div>

            {/* CPF */}
            <div className="space-y-1.5">
              <Label htmlFor="pac-cpf">CPF</Label>
              <Input
                id="pac-cpf"
                value={cpf}
                onChange={handleCpf}
                placeholder="000.000.000-00"
                maxLength={14}
                className={erros.cpf ? "border-red-400" : ""}
              />
              {erros.cpf && <p className="text-xs text-red-500">{erros.cpf}</p>}
            </div>

            {/* E-mail */}
            <div className="space-y-1.5">
              <Label htmlFor="pac-email">E-mail</Label>
              <Input
                id="pac-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); limparErro("email"); }}
                placeholder="Ex: maria@email.com"
                className={erros.email ? "border-red-400" : ""}
              />
              {erros.email && <p className="text-xs text-red-500">{erros.email}</p>}
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
                  !estado
                    ? "Selecione um estado primeiro"
                    : carregandoCidades
                    ? "Carregando cidades..."
                    : "Digite para buscar a cidade"
                }
                searchPlaceholder="Digite o nome da cidade..."
                disabled={!estado || carregandoCidades}
                error={!!erros.cidade}
                emptyText="Nenhuma cidade encontrada."
              />
              {erros.cidade && <p className="text-xs text-red-500">{erros.cidade}</p>}
            </div>

            {/* Preferência de Busca */}
            <div className="space-y-2">
              <Label>Preferência de Busca</Label>
              <div className="flex flex-col sm:flex-row sm:gap-6 gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="pac-presencial"
                    checked={presencial}
                    onCheckedChange={(checked) => {
                      setPresencial(!!checked);
                      limparErro("preferenciaBusca");
                    }}
                  />
                  <label htmlFor="pac-presencial" className="text-sm cursor-pointer">Presencial</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="pac-remoto"
                    checked={remoto}
                    onCheckedChange={(checked) => {
                      setRemoto(!!checked);
                      if (!checked) setAbrangenciaRemoto("");
                      limparErro("preferenciaBusca");
                    }}
                  />
                  <label htmlFor="pac-remoto" className="text-sm cursor-pointer">Remoto</label>
                </div>
              </div>
              {remoto && (
                <div className="ml-4 flex flex-col sm:flex-row sm:gap-4 gap-3 mt-1">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="pac-brasil"
                      checked={abrangenciaRemoto === "Brasil"}
                      onCheckedChange={(checked) => {
                        setAbrangenciaRemoto(checked ? "Brasil" : "");
                        limparErro("preferenciaBusca");
                      }}
                    />
                    <label htmlFor="pac-brasil" className="text-sm cursor-pointer">Brasil (nacional)</label>
                  </div>
                  {estado && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="pac-estado"
                        checked={abrangenciaRemoto === "Estado"}
                        onCheckedChange={(checked) => {
                          setAbrangenciaRemoto(checked ? "Estado" : "");
                          limparErro("preferenciaBusca");
                        }}
                      />
                      <label htmlFor="pac-estado" className="text-sm cursor-pointer">{estado} (meu estado)</label>
                    </div>
                  )}
                </div>
              )}
              {erros.preferenciaBusca && (
                <p className="text-xs text-red-500">{erros.preferenciaBusca}</p>
              )}
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <Label htmlFor="pac-senha">Senha</Label>
              <Input
                id="pac-senha"
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
              <Label htmlFor="pac-confirmar">Confirmar senha</Label>
              <Input
                id="pac-confirmar"
                type="password"
                value={confirmarSenha}
                onChange={(e) => { setConfirmarSenha(e.target.value); limparErro("confirmarSenha"); }}
                placeholder="Repita a senha"
                className={erros.confirmarSenha ? "border-red-400" : ""}
              />
              {erros.confirmarSenha && (
                <p className="text-xs text-red-500">{erros.confirmarSenha}</p>
              )}
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
                className="flex-1 bg-green-600 hover:bg-green-700"
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
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Faça login
                </button>
              </p>
            )}
          </form>
        ) : (
          <div className="space-y-5 text-center py-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-3xl">🎉</span>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">Bem-vindo!</p>
              <p className="text-sm text-gray-500 mt-1">
                <strong>{nomeRegistrado}</strong> foi cadastrado e você já está logado.
              </p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 w-full" onClick={fechar}>
              Começar a usar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
