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
        body: JSON.stringify({ cpf: cpfReset, tipo: "profissional" }),
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
    setTelaEsqueci(false); setCpfReset(""); setErroReset(""); setSucessoReset(false);
    onFechar();
  }

  return (
    <Dialog open={aberto} onOpenChange={fechar}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-teal-700">
            {telaEsqueci ? "Recuperar senha" : "Área do Profissional"}
          </DialogTitle>
        </DialogHeader>

        {telaEsqueci ? (
          sucessoReset ? (
            <div className="space-y-4">
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm text-teal-700">
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
                <Label htmlFor="reset-cpf-prof">CPF</Label>
                <Input
                  id="reset-cpf-prof"
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
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={carregandoReset}>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="lprof-senha">Senha</Label>
                  <button
                    type="button"
                    onClick={() => setTelaEsqueci(true)}
                    className="text-xs text-teal-600 hover:text-teal-700"
                  >
                    Esqueci minha senha
                  </button>
                </div>
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

              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={carregando}>
                {carregando ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            {onCadastrar && (
              <p className="text-center text-sm text-gray-500">
                Ainda não é cadastrado?{" "}
                <button onClick={() => { fechar(); onCadastrar(); }} className="text-teal-600 hover:text-teal-700 font-medium">
                  Cadastre-se
                </button>
              </p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
