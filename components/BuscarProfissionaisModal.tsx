"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";

const RAMOS = ["Fisioterapeuta", "Nutricionista", "Psicólogo", "Personal Trainer"];

interface Profissional {
  id: string;
  nome: string;
  ramo: string;
  cidade: string;
  estado: string;
  foto?: string;
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
  const [presencial, setPresencial] = useState(false);
  const [remoto, setRemoto] = useState(false);
  const [abrangencia, setAbrangencia] = useState<"Brasil" | "Estado" | "">("");
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [carregando, setCarregando] = useState(false);

  // Inicializa filtros a partir da preferência salva do paciente
  useEffect(() => {
    if (!aberto || !paciente) return;
    const pref = paciente.preferenciaBusca ?? [];
    setPresencial(pref.includes("Presencial"));
    setRemoto(pref.includes("RemotoBrasil") || pref.includes("RemoToEstado"));
    if (pref.includes("RemotoBrasil")) setAbrangencia("Brasil");
    else if (pref.includes("RemoToEstado")) setAbrangencia("Estado");
    else setAbrangencia("");
  }, [aberto, paciente]);

  function labelAbrangencia(): string {
    if (presencial && remoto) return "🌎 Buscando em: Todo o Brasil (presencial + remoto)";
    if (presencial) return `📍 Buscando em: ${paciente?.cidade ?? "sua cidade"}`;
    if (remoto && abrangencia === "Brasil") return "🌎 Buscando em: Todo o Brasil";
    if (remoto && abrangencia === "Estado") return `📍 Buscando em: ${paciente?.estado ?? "seu estado"}`;
    return "";
  }

  const buscar = useCallback(async () => {
    setCarregando(true);
    try {
      const params = new URLSearchParams();
      if (ramo) params.set("ramo", ramo);

      // Se ambos marcados: sem filtro geográfico (mostra todos)
      if (presencial && !remoto && paciente?.cidade) {
        params.set("cidade", paciente.cidade);
      } else if (remoto && !presencial && abrangencia === "Estado" && paciente?.estado) {
        params.set("estado", paciente.estado);
      }

      const res = await fetch(`/api/profissionais?${params.toString()}`);
      const data = await res.json();
      setProfissionais(data);
    } catch {
      setProfissionais([]);
    } finally {
      setCarregando(false);
    }
  }, [ramo, presencial, remoto, abrangencia, paciente]);

  useEffect(() => {
    if (aberto) buscar();
  }, [aberto, buscar]);

  function fechar() {
    setRamo(ramoInicial ?? "");
    setPresencial(false);
    setRemoto(false);
    setAbrangencia("");
    onFechar();
  }

  const label = labelAbrangencia();

  return (
    <Dialog open={aberto} onOpenChange={fechar}>
      <DialogContent className="max-w-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-green-700">
            Buscar Profissionais
          </DialogTitle>
        </DialogHeader>

        {/* Filtro de modalidade */}
        <div className="rounded-xl border border-green-100 bg-green-50 p-3 space-y-2">
          <Label className="text-xs font-semibold text-green-800 uppercase tracking-wide">Modalidade</Label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={presencial}
                onCheckedChange={(v) => {
                  setPresencial(!!v);
                  if (v) { setRemoto(false); setAbrangencia(""); }
                }}
              />
              <span className="text-sm font-medium">Presencial</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={remoto}
                onCheckedChange={(v) => {
                  setRemoto(!!v);
                  if (v) { setPresencial(false); }
                  else { setAbrangencia(""); }
                }}
              />
              <span className="text-sm font-medium">Remoto</span>
            </label>
          </div>

          {remoto && (
            <div className="ml-4 flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={abrangencia === "Brasil"}
                  onCheckedChange={(v) => setAbrangencia(v ? "Brasil" : "")}
                />
                <span className="text-sm">Brasil (nacional)</span>
              </label>
              {paciente?.estado && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={abrangencia === "Estado"}
                    onCheckedChange={(v) => setAbrangencia(v ? "Estado" : "")}
                  />
                  <span className="text-sm">{paciente.estado} (meu estado)</span>
                </label>
              )}
            </div>
          )}

          {label && (
            <p className="text-xs text-green-700 font-medium pt-1">{label}</p>
          )}
        </div>

        {/* Filtro de ramo */}
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
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-teal-100 flex items-center justify-center">
                    {p.foto ? (
                      <img src={p.foto} alt={p.nome} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg text-teal-500 font-bold leading-none">
                        {p.nome.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{p.nome}</p>
                    <p className="text-xs text-gray-500 mt-0.5">📍 {p.cidade}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${COR_RAMO[p.ramo] ?? "bg-gray-100 text-gray-600"}`}>
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
