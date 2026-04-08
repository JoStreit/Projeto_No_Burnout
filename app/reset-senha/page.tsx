"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ResetSenhaForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const tipo = params.get("tipo") ?? "paciente";

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!token) setErro("Link inválido. Solicite um novo e-mail de redefinição.");
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (novaSenha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);
    try {
      const res = await fetch("/api/auth/resetar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaSenha }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.erro);
      } else {
        setSucesso(true);
      }
    } catch {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  const cor = tipo === "profissional" ? "teal" : "green";
  const btnClass = `w-full ${cor === "teal" ? "bg-teal-600 hover:bg-teal-700" : "bg-green-600 hover:bg-green-700"}`;

  return (
    <div className="min-h-screen bg-[#f4f7f2] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#eaf2e7] flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Nova senha</h1>
          <p className="text-sm text-gray-500 mt-1">
            {tipo === "profissional" ? "Área do Profissional" : "Área do Paciente"}
          </p>
        </div>

        {sucesso ? (
          <div className="space-y-4 text-center">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-700 font-medium">Senha redefinida com sucesso!</p>
              <p className="text-sm text-green-600 mt-1">Você já pode fazer login com sua nova senha.</p>
            </div>
            <Button className={btnClass} onClick={() => router.push("/")}>
              Ir para o início
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="nova-senha">Nova senha</Label>
              <Input
                id="nova-senha"
                type="password"
                value={novaSenha}
                onChange={(e) => { setNovaSenha(e.target.value); setErro(""); }}
                placeholder="Mín. 8 caracteres"
                disabled={!token}
              />
              <p className="text-xs text-gray-400">Mínimo 8 caracteres, 1 maiúscula e 1 número.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmar-senha">Confirmar senha</Label>
              <Input
                id="confirmar-senha"
                type="password"
                value={confirmar}
                onChange={(e) => { setConfirmar(e.target.value); setErro(""); }}
                placeholder="Repita a senha"
                disabled={!token}
              />
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2">
                <p className="text-sm text-red-600">{erro}</p>
              </div>
            )}

            <Button type="submit" className={btnClass} disabled={carregando || !token}>
              {carregando ? "Salvando..." : "Redefinir senha"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetSenhaPage() {
  return (
    <Suspense>
      <ResetSenhaForm />
    </Suspense>
  );
}
