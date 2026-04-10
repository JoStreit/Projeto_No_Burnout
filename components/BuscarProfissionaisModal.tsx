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
  email: string;
  telefone?: string;
  atendimento: string[];
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
  const [totalProfissionais, setTotalProfissionais] = useState(0);
  const [carregando, setCarregando] = useState(false);

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
    if (presencial && remoto && abrangencia === "Brasil") return "🌎 Presencial (sua cidade) + Remoto (Brasil)";
    if (presencial && remoto && abrangencia === "Estado") return `📍 Presencial + Remoto em ${paciente?.estado ?? "seu estado"}`;
    if (presencial && remoto) return "📍 Presencial (sua cidade) + Remoto";
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
      // Quando ambos marcados, ou remoto Brasil: sem filtro de localização
      if (presencial && !remoto && paciente?.cidade) params.set("cidade", paciente.cidade);
      else if (remoto && !presencial && abrangencia === "Estado" && paciente?.estado) params.set("estado", paciente.estado);

      const res = await fetch(`/api/profissionais?${params.toString()}`);
      const json = await res.json();
      setProfissionais(json.data ?? []);
      setTotalProfissionais(json.total ?? 0);
    } catch {
      setProfissionais([]);
      setTotalProfissionais(0);
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
      <DialogContent className="max-w-3xl max-h-[96vh] flex flex-col bg-[#faf9f7]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#3b4f38]">
            Buscar Profissionais
          </DialogTitle>
        </DialogHeader>

        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* Modalidade */}
          <div className="rounded-lg border border-[#4a6741]/30 bg-[#eaf2e7] px-4 py-3 space-y-2">
            <p className="text-xs font-bold text-[#4a6741] uppercase tracking-widest">Modalidade</p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={presencial} onCheckedChange={(v) => setPresencial(!!v)} />
                <span className="text-sm">Presencial</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={remoto}
                  onCheckedChange={(v) => {
                    setRemoto(!!v);
                    if (!v) setAbrangencia("");
                  }}
                />
                <span className="text-sm">Remoto</span>
              </label>
              {remoto && (
                <div className="ml-6 flex flex-col gap-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={abrangencia === "Brasil"} onCheckedChange={(v) => setAbrangencia(v ? "Brasil" : "")} />
                    <span className="text-xs text-stone-600">Brasil (nacional)</span>
                  </label>
                  {paciente?.estado && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={abrangencia === "Estado"} onCheckedChange={(v) => setAbrangencia(v ? "Estado" : "")} />
                      <span className="text-xs text-stone-600">{paciente.estado} (meu estado)</span>
                    </label>
                  )}
                </div>
              )}
              {label && (
                <p className="text-xs text-[#4a6741] font-semibold pt-1">
                  {label}
                </p>
              )}
            </div>
          </div>

          {/* Ramo + Buscar */}
          <div className="flex flex-col gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm text-stone-700">Ramo de atuação</Label>
              <Select value={ramo} onValueChange={(v) => setRamo(v ?? "")}>
                <SelectTrigger className="bg-white">
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
              className="bg-[#4a6741] hover:bg-[#3d5836] w-full mt-auto rounded-lg font-semibold"
              disabled={carregando}
            >
              {carregando ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </div>

        {/* Resultados */}
        <div className="flex-1 overflow-y-auto space-y-2 mt-1 pr-1">
          {carregando ? (
            <div className="text-center py-10 text-stone-400 text-sm">Buscando...</div>
          ) : profissionais.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-sm">
              Nenhum profissional encontrado com esses filtros.
            </div>
          ) : (
            <>
              <p className="text-xs text-stone-400 mb-1">
                {totalProfissionais > profissionais.length
                  ? `Exibindo ${profissionais.length} de ${totalProfissionais} profissionais`
                  : `${profissionais.length} profissional${profissionais.length !== 1 ? "is" : ""} encontrado${profissionais.length !== 1 ? "s" : ""}`}
              </p>
              {profissionais.map((p) => (
                <div
                  key={p.id}
                  className="flex items-start gap-3 bg-white border border-stone-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Avatar */}
                  <div className="w-13 h-13 rounded-full overflow-hidden shrink-0 bg-[#eaf2e7] flex items-center justify-center border border-[#4a6741]/15" style={{ width: 52, height: 52 }}>
                    {p.foto ? (
                      <img src={p.foto} alt={p.nome} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-[#4a6741]">
                        {p.nome.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Dados */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="font-bold text-stone-800 text-sm leading-snug">{p.nome}</p>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 ${COR_RAMO[p.ramo] ?? "bg-stone-100 text-stone-600"}`}>
                        {p.ramo}
                      </span>
                    </div>

                    <div className="mt-1.5 flex flex-col gap-0.5">
                      <p className="text-xs text-stone-500 flex items-center gap-1">
                        <span>📍</span>
                        {p.cidade} — {p.estado}
                      </p>
                      <a href={`mailto:${p.email}`} className="text-xs text-stone-600 hover:text-[#4a6741] hover:underline flex items-center gap-1">
                        <span>✉️</span>
                        {p.email}
                      </a>
                      {p.telefone && (
                        <a href={`tel:${p.telefone.replace(/\D/g, "")}`} className="text-xs text-stone-600 hover:text-[#4a6741] hover:underline flex items-center gap-1">
                          <span>📞</span>
                          {p.telefone}
                        </a>
                      )}
                    </div>

                    {p.atendimento?.length > 0 && (
                      <div className="mt-2 flex gap-1.5 flex-wrap">
                        {p.atendimento.map((a) => (
                          <span key={a} className="text-xs border border-stone-200 text-stone-500 bg-white px-2 py-0.5 rounded-full">
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
