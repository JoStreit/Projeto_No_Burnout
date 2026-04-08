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

export default function LoginModal({ aberto, onFechar, onCadastrar }: Props) {
  const { recarregarPaciente: recarregar } = useAuth();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Esqueci minha senha
  const [telaEsqueci, setTelaEsqueci] = useState(false);
  const [cpfReset, setCpfReset] = useState("");
  const [erroReset, setErroReset] = useState("");
  const [sucessoReset, setSucessoReset] = useState(false);
  const [carregandoReset, setCarregandoReset] = useState(false);

  async function handleEsqueciSenha(e: React.FormEvent) {
    e.preventDefault();
    setErroReset("");
    if (!validarCPF(cpfReset)) { setErroReset("CPF inválido"); return; }
    setCarregandoReset(true);
    try {
      await fetch("/api/auth/esqueci-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf: cpfReset, tipo: "paciente" }),
      });
      setSucessoReset(true);
    } catch {
      setErroReset("Erro ao conectar com o servidor");
    } finally {
      setCarregandoReset(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!validarCPF(cpf)) {
      setErro("CPF inválido");
      return;
    }
    if (!senha) {
      setErro("Informe sua senha");
      return;
    }

    setCarregando(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, senha }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.erro);
      } else {
        await recarregar();
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
    setTelaEsqueci(false); setCpfReset(""); setErroReset(""); setSucessoReset(false);
    onFechar();
  }

  return (
    <Dialog open={aberto} onOpenChange={fechar}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            {telaEsqueci ? "Recuperar senha" : "Entrar na sua conta"}
          </DialogTitle>
        </DialogHeader>

        {telaEsqueci ? (
          sucessoReset ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
                Se o CPF estiver cadastrado, você receberá um e-mail com o link de redefinição em breve.
              </div>
              <Button variant="outline" className="w-full" onClick={() => { setTelaEsqueci(false); setSucessoReset(false); }}>
                Voltar ao login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleEsqueciSenha} className="space-y-4">
              <p className="text-sm text-gray-500">Informe seu CPF cadastrado e enviaremos um link para redefinir sua senha.</p>
              <div className="space-y-1.5">
                <Label htmlFor="reset-cpf">CPF</Label>
                <Input
                  id="reset-cpf"
                  value={cpfReset}
                  onChange={(e) => { setCpfReset(formatarCPF(e.target.value)); setErroReset(""); }}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
              {erroReset && (
                <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  <p className="text-sm text-red-600">{erroReset}</p>
                </div>
              )}
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={carregandoReset}>
                {carregandoReset ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
              <button type="button" onClick={() => setTelaEsqueci(false)} className="w-full text-sm text-gray-400 hover:text-gray-600">
                Voltar ao login
              </button>
            </form>
          )
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-cpf">CPF</Label>
                <Input
                  id="login-cpf"
                  value={cpf}
                  onChange={(e) => { setCpf(formatarCPF(e.target.value)); setErro(""); }}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-senha">Senha</Label>
                  <button
                    type="button"
                    onClick={() => setTelaEsqueci(true)}
                    className="text-xs text-green-600 hover:text-green-700"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <Input
                  id="login-senha"
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

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={carregando}>
                {carregando ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            {onCadastrar && (
              <p className="text-center text-sm text-gray-500">
                Não tem conta?{" "}
                <button onClick={() => { fechar(); onCadastrar(); }} className="text-green-600 hover:text-green-700 font-medium">
                  Cadastre-se gratuitamente
                </button>
              </p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
