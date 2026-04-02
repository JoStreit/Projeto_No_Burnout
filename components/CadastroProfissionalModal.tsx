"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validarCPF, formatarCPF } from "@/lib/cpf";

const RAMOS = ["Fisioterapeuta", "Nutricionista", "Psicólogo", "Personal Trainer"];

interface Props {
  aberto: boolean;
  onFechar: () => void;
}

export default function CadastroProfissionalModal({ aberto, onFechar }: Props) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [ramo, setRamo] = useState("");
  const [cidade, setCidade] = useState("");
  const [erros, setErros] = useState<{
    nome?: string;
    cpf?: string;
    ramo?: string;
    cidade?: string;
    geral?: string;
  }>({});
  const [sucesso, setSucesso] = useState(false);
  const [nomeRegistrado, setNomeRegistrado] = useState("");
  const [ramoRegistrado, setRamoRegistrado] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleCpf(e: React.ChangeEvent<HTMLInputElement>) {
    setCpf(formatarCPF(e.target.value));
    if (erros.cpf) setErros((prev) => ({ ...prev, cpf: undefined }));
  }

  function validar(): boolean {
    const novosErros: typeof erros = {};
    if (!nome.trim()) novosErros.nome = "Nome é obrigatório";
    const cpfLimpo = cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) {
      novosErros.cpf = "CPF deve ter 11 dígitos";
    } else if (!validarCPF(cpf)) {
      novosErros.cpf = "CPF inválido";
    }
    if (!ramo) novosErros.ramo = "Selecione um ramo";
    if (!cidade.trim()) novosErros.cidade = "Cidade é obrigatória";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;

    setCarregando(true);
    try {
      const res = await fetch("/api/profissionais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cpf, ramo, cidade }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErros({ geral: data.erro });
      } else {
        setNomeRegistrado(nome);
        setRamoRegistrado(ramo);
        setSucesso(true);
      }
    } catch {
      setErros({ geral: "Erro ao conectar com o servidor" });
    } finally {
      setCarregando(false);
    }
  }

  function fechar() {
    setNome("");
    setCpf("");
    setRamo("");
    setCidade("");
    setErros({});
    setSucesso(false);
    onFechar();
  }

  return (
    <Dialog open={aberto} onOpenChange={fechar}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-violet-700">
            Cadastro de Profissional
          </DialogTitle>
        </DialogHeader>

        {!sucesso ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="nome-prof">Nome completo</Label>
              <Input
                id="nome-prof"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (erros.nome) setErros((prev) => ({ ...prev, nome: undefined }));
                }}
                placeholder="Ex: Dr. João Oliveira"
                className={erros.nome ? "border-red-400" : ""}
              />
              {erros.nome && <p className="text-xs text-red-500">{erros.nome}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cpf-prof">CPF</Label>
              <Input
                id="cpf-prof"
                value={cpf}
                onChange={handleCpf}
                placeholder="000.000.000-00"
                maxLength={14}
                className={erros.cpf ? "border-red-400" : ""}
              />
              {erros.cpf && <p className="text-xs text-red-500">{erros.cpf}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Ramo de atuação</Label>
              <Select
                value={ramo}
                onValueChange={(val) => {
                  setRamo(val ?? "");
                  if (erros.ramo) setErros((prev) => ({ ...prev, ramo: undefined }));
                }}
              >
                <SelectTrigger className={erros.ramo ? "border-red-400" : ""}>
                  <SelectValue placeholder="Selecione o ramo" />
                </SelectTrigger>
                <SelectContent>
                  {RAMOS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {erros.ramo && <p className="text-xs text-red-500">{erros.ramo}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cidade-prof">Cidade</Label>
              <Input
                id="cidade-prof"
                value={cidade}
                onChange={(e) => {
                  setCidade(e.target.value);
                  if (erros.cidade) setErros((prev) => ({ ...prev, cidade: undefined }));
                }}
                placeholder="Ex: São Paulo"
                className={erros.cidade ? "border-red-400" : ""}
              />
              {erros.cidade && <p className="text-xs text-red-500">{erros.cidade}</p>}
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
                className="flex-1 bg-violet-600 hover:bg-violet-700"
                disabled={carregando}
              >
                {carregando ? "Salvando..." : "Cadastrar"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-5 text-center py-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center">
                <span className="text-3xl">🎉</span>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                Profissional cadastrado!
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <strong>{nomeRegistrado}</strong> ({ramoRegistrado}) foi cadastrado com sucesso.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => { setSucesso(false); setNome(""); setCpf(""); setRamo(""); setCidade(""); }}
              >
                Novo cadastro
              </Button>
              <Button className="bg-violet-600 hover:bg-violet-700" onClick={fechar}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
