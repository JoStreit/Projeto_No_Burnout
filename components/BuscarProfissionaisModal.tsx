"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";

const RAMOS = ["Fisioterapeuta", "Nutricionista", "Psicólogo", "Personal Trainer"];

interface Profissional {
  id: string;
  nome: string;
  ramo: string;
  cidade: string;
  estado: string;
}

interface Props {
  aberto: boolean;
  onFechar: () => void;
  ramoInicial?: string;
}

const COR_RAMO: Record<string, string> = {
  Fisioterapeuta: "bg-teal-100 text-teal-700",
  Nutricionista: "bg-green-100 text-green-700",
  "Psicólogo": "bg-purple-100 text-purple-700",
  "Personal Trainer": "bg-orange-100 text-orange-700",
};

export default function BuscarProfissionaisModal({ aberto, onFechar, ramoInicial }: Props) {
  const { paciente } = useAuth();
  const [ramo, setRamo] = useState(ramoInicial ?? "");
  const [cidadeManual, setCidadeManual] = useState("");
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [carregando, setCarregando] = useState(false);

  const temPreferencia = !!paciente?.preferenciaBusca;

  function labelAbrangencia(): string {
    if (!paciente?.preferenciaBusca) return "";
    if (paciente.preferenciaBusca === "Presencial") return `Buscando em: ${paciente.cidade}`;
    if (paciente.preferenciaBusca === "RemotoBrasil") return "Buscando em: Todo o Brasil";
    if (paciente.preferenciaBusca === "RemoToEstado") return `Buscando em: ${paciente.estado}`;
    return "";
  }

  const buscar = useCallback(async () => {
    setCarregando(true);
    try {
      const params = new URLSearchParams();
      if (ramo) params.set("ramo", ramo);

      if (paciente?.preferenciaBusca === "Presencial") {
        params.set("cidade", paciente.cidade);
      } else if (paciente?.preferenciaBusca === "RemoToEstado") {
        params.set("estado", paciente.estado);
      } else if (!paciente?.preferenciaBusca && cidadeManual.trim()) {
        params.set("cidade", cidadeManual.trim());
      }
      // RemotoBrasil: sem filtro geográfico

      const res = await fetch(`/api/profissionais?${params.toString()}`);
      const data = await res.json();
      setProfissionais(data);
    } catch {
      setProfissionais([]);
    } finally {
      setCarregando(false);
    }
  }, [ramo, cidadeManual, paciente]);

  useEffect(() => {
    if (aberto) buscar();
  }, [aberto, buscar]);

  function fechar() {
    setRamo(ramoInicial ?? "");
    setCidadeManual("");
    onFechar();
  }

  return (
    <Dialog open={aberto} onOpenChange={fechar}>
      <DialogContent className="max-w-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Buscar Profissionais
          </DialogTitle>
        </DialogHeader>

        {/* Badge de abrangência */}
        {temPreferencia && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-700">
            {paciente?.preferenciaBusca === "RemotoBrasil" ? (
              <span>🌎 {labelAbrangencia()}</span>
            ) : (
              <span>📍 {labelAbrangencia()}</span>
            )}
          </div>
        )}

        {/* Filtros */}
        <div className={`grid gap-3 ${temPreferencia ? "grid-cols-1" : "grid-cols-2"}`}>
          <div className="space-y-1.5">
            <Label>Ramo de atuação</Label>
            <Select value={ramo} onValueChange={(v) => setRamo(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os ramos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os ramos</SelectItem>
                {RAMOS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!temPreferencia && (
            <div className="space-y-1.5">
              <Label>Cidade</Label>
              <Input
                value={cidadeManual}
                onChange={(e) => setCidadeManual(e.target.value)}
                placeholder="Ex: São Paulo"
              />
            </div>
          )}
        </div>

        <Button
          onClick={buscar}
          className="bg-green-600 hover:bg-green-700 w-full"
          disabled={carregando}
        >
          {carregando ? "Buscando..." : "Buscar"}
        </Button>

        {/* Resultados */}
        <div className="flex-1 overflow-y-auto space-y-2 mt-1">
          {carregando ? (
            <div className="text-center py-8 text-gray-400 text-sm">Buscando...</div>
          ) : profissionais.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              Nenhum profissional encontrado com esses filtros.
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-2">
                {profissionais.length} profissional{profissionais.length !== 1 ? "is" : ""} encontrado{profissionais.length !== 1 ? "s" : ""}
              </p>
              {profissionais.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{p.nome}</p>
                    <p className="text-xs text-gray-500 mt-0.5">📍 {p.cidade}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${COR_RAMO[p.ramo] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {p.ramo}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
