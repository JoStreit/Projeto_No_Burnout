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
import { ESTADOS, buscarCidadesPorEstado } from "@/lib/brasil";
import { useAuth } from "@/components/AuthProvider";

interface Props {
  aberto: boolean;
  onFechar: () => void;
}

type Erros = {
  nome?: string;
  email?: string;
  estado?: string;
  cidade?: string;
  preferenciaBusca?: string;
  geral?: string;
};

const OPCOES_ESTADO = ESTADOS.map((e) => ({
  value: e.uf,
  label: e.uf,
  sublabel: e.nome,
}));

export default function EditarPerfilPacienteModal({ aberto, onFechar }: Props) {
  const { paciente, recarregarPaciente } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [presencial, setPresencial] = useState(false);
  const [remoto, setRemoto] = useState(false);
  const [abrangenciaRemoto, setAbrangenciaRemoto] = useState<"Brasil" | "Estado" | "">("");

  const [opcoesCidades, setOpcoesCidades] = useState<{ value: string; label: string }[]>([]);
  const [carregandoCidades, setCarregandoCidades] = useState(false);
  const [erros, setErros] = useState<Erros>({});
  const [carregando, setCarregando] = useState(false);

  // Pré-preencher campos com dados do paciente
  useEffect(() => {
    if (aberto && paciente) {
      setNome(paciente.nome);
      setEmail(paciente.email);
      setEstado(paciente.estado);
      setCidade(paciente.cidade);

      if (paciente.preferenciaBusca === "Presencial") {
        setPresencial(true);
        setRemoto(false);
        setAbrangenciaRemoto("");
      } else if (paciente.preferenciaBusca === "RemotoBrasil") {
        setPresencial(false);
        setRemoto(true);
        setAbrangenciaRemoto("Brasil");
      } else if (paciente.preferenciaBusca === "RemoToEstado") {
        setPresencial(false);
        setRemoto(true);
        setAbrangenciaRemoto("Estado");
      } else {
        setPresencial(false);
        setRemoto(false);
        setAbrangenciaRemoto("");
      }
    }
  }, [aberto, paciente]);

  // Carregar cidades ao mudar estado
  useEffect(() => {
    if (!estado) {
      setOpcoesCidades([]);
      return;
    }
    setCarregandoCidades(true);
    buscarCidadesPorEstado(estado)
      .then((lista) => setOpcoesCidades(lista.map((c) => ({ value: c, label: c }))))
      .finally(() => setCarregandoCidades(false));
  }, [estado]);

  function limparErro(campo: keyof Erros) {
    setErros((prev) => ({ ...prev, [campo]: undefined }));
  }

  function validar(): boolean {
    const novos: Erros = {};
    if (!nome.trim()) novos.nome = "Nome é obrigatório";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      novos.email = "E-mail inválido";
    if (!estado) novos.estado = "Selecione um estado";
    if (!cidade) novos.cidade = "Selecione uma cidade";

    if (!presencial && !remoto) {
      novos.preferenciaBusca = "Selecione pelo menos uma preferência de busca";
    } else if (remoto && !abrangenciaRemoto) {
      novos.preferenciaBusca = "Selecione a abrangência da busca remota";
    }

    setErros(novos);
    return Object.keys(novos).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!paciente) return;
    if (!validar()) return;

    let preferenciaBusca: "Presencial" | "RemotoBrasil" | "RemoToEstado" | undefined;
    if (presencial) preferenciaBusca = "Presencial";
    else if (remoto && abrangenciaRemoto === "Brasil") preferenciaBusca = "RemotoBrasil";
    else if (remoto && abrangenciaRemoto === "Estado") preferenciaBusca = "RemoToEstado";

    setCarregando(true);
    try {
      const res = await fetch(`/api/pacientes/${paciente.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          estado: estado.trim(),
          cidade: cidade.trim(),
          preferenciaBusca,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErros({ geral: data.erro });
      } else {
        await recarregarPaciente();
        onFechar();
      }
    } catch {
      setErros({ geral: "Erro ao conectar com o servidor" });
    } finally {
      setCarregando(false);
    }
  }

  function fechar() {
    setErros({});
    onFechar();
  }

  return (
    <Dialog open={aberto} onOpenChange={fechar}>
      <DialogContent className="max-w-md max-h-[92vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-green-700">
            Editar Perfil
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto pr-1">
          {/* Nome */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-pac-nome">Nome completo</Label>
            <Input
              id="edit-pac-nome"
              value={nome}
              onChange={(e) => { setNome(e.target.value); limparErro("nome"); }}
              placeholder="Ex: Maria da Silva"
              className={erros.nome ? "border-red-400" : ""}
            />
            {erros.nome && <p className="text-xs text-red-500">{erros.nome}</p>}
          </div>

          {/* E-mail */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-pac-email">E-mail</Label>
            <Input
              id="edit-pac-email"
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
              onChange={(v) => {
                setEstado(v);
                setCidade("");
                limparErro("estado");
              }}
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
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="edit-pac-presencial"
                  checked={presencial}
                  onCheckedChange={(checked) => {
                    setPresencial(!!checked);
                    if (checked) { setRemoto(false); setAbrangenciaRemoto(""); }
                    limparErro("preferenciaBusca");
                  }}
                />
                <label htmlFor="edit-pac-presencial" className="text-sm cursor-pointer">Presencial</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="edit-pac-remoto"
                  checked={remoto}
                  onCheckedChange={(checked) => {
                    setRemoto(!!checked);
                    if (checked) { setPresencial(false); }
                    else { setAbrangenciaRemoto(""); }
                    limparErro("preferenciaBusca");
                  }}
                />
                <label htmlFor="edit-pac-remoto" className="text-sm cursor-pointer">Remoto</label>
              </div>
            </div>
            {remoto && (
              <div className="ml-4 flex gap-4 mt-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit-pac-brasil"
                    checked={abrangenciaRemoto === "Brasil"}
                    onCheckedChange={(checked) => {
                      setAbrangenciaRemoto(checked ? "Brasil" : "");
                      limparErro("preferenciaBusca");
                    }}
                  />
                  <label htmlFor="edit-pac-brasil" className="text-sm cursor-pointer">Brasil (nacional)</label>
                </div>
                {estado && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="edit-pac-estado"
                      checked={abrangenciaRemoto === "Estado"}
                      onCheckedChange={(checked) => {
                        setAbrangenciaRemoto(checked ? "Estado" : "");
                        limparErro("preferenciaBusca");
                      }}
                    />
                    <label htmlFor="edit-pac-estado" className="text-sm cursor-pointer">{estado} (meu estado)</label>
                  </div>
                )}
              </div>
            )}
            {erros.preferenciaBusca && (
              <p className="text-xs text-red-500">{erros.preferenciaBusca}</p>
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
              {carregando ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
