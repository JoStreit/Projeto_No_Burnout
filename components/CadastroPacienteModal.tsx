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
import { validarCPF, formatarCPF } from "@/lib/cpf";
import { useAuth } from "@/components/AuthProvider";

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onLoginClick?: () => void;
}

export default function CadastroPacienteModal({ aberto, onFechar, onLoginClick }: Props) {
  const { recarregar } = useAuth();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erros, setErros] = useState<{
    nome?: string;
    cpf?: string;
    senha?: string;
    confirmarSenha?: string;
    geral?: string;
  }>({});
  const [sucesso, setSucesso] = useState(false);
  const [nomeRegistrado, setNomeRegistrado] = useState("");
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
    if (senha.length < 6) novosErros.senha = "Mínimo de 6 caracteres";
    if (senha !== confirmarSenha) novosErros.confirmarSenha = "Senhas não conferem";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;

    setCarregando(true);
    try {
      const res = await fetch("/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cpf, senha }),
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
    setNome("");
    setCpf("");
    setSenha("");
    setConfirmarSenha("");
    setErros({});
    setSucesso(false);
    onFechar();
  }

  return (
    <Dialog open={aberto} onOpenChange={fechar}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-700">
            Cadastro de Paciente
          </DialogTitle>
        </DialogHeader>

        {!sucesso ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="nome-paciente">Nome completo</Label>
              <Input
                id="nome-paciente"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (erros.nome) setErros((prev) => ({ ...prev, nome: undefined }));
                }}
                placeholder="Ex: Maria da Silva"
                className={erros.nome ? "border-red-400" : ""}
              />
              {erros.nome && <p className="text-xs text-red-500">{erros.nome}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cpf-paciente">CPF</Label>
              <Input
                id="cpf-paciente"
                value={cpf}
                onChange={handleCpf}
                placeholder="000.000.000-00"
                maxLength={14}
                className={erros.cpf ? "border-red-400" : ""}
              />
              {erros.cpf && <p className="text-xs text-red-500">{erros.cpf}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="senha-paciente">Senha</Label>
              <Input
                id="senha-paciente"
                type="password"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  if (erros.senha) setErros((prev) => ({ ...prev, senha: undefined }));
                }}
                placeholder="Mínimo 6 caracteres"
                className={erros.senha ? "border-red-400" : ""}
              />
              {erros.senha && <p className="text-xs text-red-500">{erros.senha}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmar-senha">Confirmar senha</Label>
              <Input
                id="confirmar-senha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => {
                  setConfirmarSenha(e.target.value);
                  if (erros.confirmarSenha) setErros((prev) => ({ ...prev, confirmarSenha: undefined }));
                }}
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
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={carregando}
              >
                {carregando ? "Salvando..." : "Cadastrar"}
              </Button>
            </div>

            {onLoginClick && (
              <p className="text-center text-sm text-gray-500">
                Já tem conta?{" "}
                <button
                  type="button"
                  onClick={() => { fechar(); onLoginClick(); }}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Faça login
                </button>
              </p>
            )}
          </form>
        ) : (
          <div className="space-y-5 text-center py-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-3xl">🎉</span>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">Bem-vindo!</p>
              <p className="text-sm text-gray-500 mt-1">
                <strong>{nomeRegistrado}</strong> foi cadastrado e você já está logado.
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full" onClick={fechar}>
              Começar a usar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
