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
import { formatarCPF, validarCPF } from "@/lib/cpf";
import { useAuth } from "@/components/AuthProvider";

interface Props {
  aberto: boolean;
  onFechar: () => void;
  onCadastrar?: () => void;
}

export default function LoginProfissionalModal({ aberto, onFechar, onCadastrar }: Props) {
  const { recarregarProfissional } = useAuth();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!validarCPF(cpf)) { setErro("CPF inválido"); return; }
    if (!senha) { setErro("Informe sua senha"); return; }

    setCarregando(true);
    try {
      const res = await fetch("/api/auth/login-profissional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, senha }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.erro);
      } else {
        await recarregarProfissional();
        fechar();
      }
    } catch {
      setErro("Erro ao conectar com o servidor");
    } finally {
      setCarregando(false);
    }
  }

  function fechar() {
    setCpf(""); setSenha(""); setErro("");
    onFechar();
  }

  return (
    <Dialog open={aberto} onOpenChange={fechar}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-violet-700">
            Área do Profissional
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="lprof-cpf">CPF</Label>
            <Input
              id="lprof-cpf"
              value={cpf}
              onChange={(e) => { setCpf(formatarCPF(e.target.value)); setErro(""); }}
              placeholder="000.000.000-00"
              maxLength={14}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lprof-senha">Senha</Label>
            <Input
              id="lprof-senha"
              type="password"
              value={senha}
              onChange={(e) => { setSenha(e.target.value); setErro(""); }}
              placeholder="••••••"
            />
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2">
              <p className="text-sm text-red-600">{erro}</p>
            </div>
          )}

          <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        {onCadastrar && (
          <p className="text-center text-sm text-gray-500">
            Ainda não é cadastrado?{" "}
            <button
              onClick={() => { fechar(); onCadastrar(); }}
              className="text-violet-600 hover:text-violet-700 font-medium"
            >
              Cadastre-se
            </button>
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
