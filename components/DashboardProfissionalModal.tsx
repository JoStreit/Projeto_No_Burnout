"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/AuthProvider";

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

  // Auto-expirar se vigência passou
  useEffect(() => {
    if (!profissional || !aberto) return;
    if (profissional.status === "Ativo" && !vigenciaAtiva(profissional.vigenciaFim)) {
      atualizarStatus("Inativo");
    }
  }, [aberto, profissional]);

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
      if (!res.ok) {
        setErroStatus(data.erro);
      } else {
        await recarregarProfissional();
      }
    } catch {
      setErroStatus("Erro ao atualizar status");
    } finally {
      setAtualizando(false);
    }
  }

  if (!profissional) return null;

  const dentro = vigenciaAtiva(profissional.vigenciaFim);
  const ativo = profissional.status === "Ativo";

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-teal-700">
            Meu Perfil Profissional
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 overflow-y-auto pr-1">
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

            {/* Botão de alteração de status */}
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
            <Campo label="CPF" valor={profissional.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")} />
            <Campo label="Carteirinha" valor={profissional.carteirinha} />
            <Campo label="Ramo" valor={profissional.ramo} />
            <Campo label="Estado" valor={profissional.estado} />
            <Campo label="Cidade" valor={profissional.cidade} />
            <Campo label="E-mail" valor={profissional.email} />
            <Campo
              label="Atendimento"
              valor={profissional.atendimento.join(" · ")}
            />
            <Campo label="Cadastrado em" valor={formatarData(profissional.criadoEm)} />
          </div>
        </div>
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
