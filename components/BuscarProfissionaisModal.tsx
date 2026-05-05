"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Fisioterapeuta:    "bg-teal-100 text-teal-700",
  Nutricionista:     "bg-green-100 text-green-700",
  "Psicólogo":       "bg-purple-100 text-purple-700",
  "Personal Trainer":"bg-orange-100 text-orange-700",
};

export default function BuscarProfissionaisModal({ aberto, onFechar, ramoInicial }: Props) {
  const { paciente } = useAuth();
  const [ramo, setRamo]                   = useState(ramoInicial ?? "");
  const [presencial, setPresencial]       = useState(false);
  const [remoto, setRemoto]               = useState(false);
  const [abrangencia, setAbrangencia]     = useState<"Brasil" | "Estado" | "">("");
  const [busca, setBusca]                 = useState("");
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [totalProfissionais, setTotalProfissionais] = useState(0);
  const [carregando, setCarregando]       = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [pagina, setPagina]               = useState(1);
  const LIMIT = 10;

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
    if (presencial && remoto && abrangencia === "Brasil") return "Presencial (sua cidade) + Remoto (Brasil)";
    if (presencial && remoto && abrangencia === "Estado") return `Presencial + Remoto em ${paciente?.estado ?? "seu estado"}`;
    if (presencial && remoto) return "Presencial (sua cidade) + Remoto";
    if (presencial) return `Buscando em: ${paciente?.cidade ?? "sua cidade"}`;
    if (remoto && abrangencia === "Brasil") return "Buscando em: Todo o Brasil";
    if (remoto && abrangencia === "Estado") return `Buscando em: ${paciente?.estado ?? "seu estado"}`;
    return "";
  }

  function buildParams(page: number) {
    const params = new URLSearchParams();
    if (ramo) params.set("ramo", ramo);
    if (presencial && !remoto && paciente?.cidade) params.set("cidade", paciente.cidade);
    else if (remoto && !presencial && abrangencia === "Estado" && paciente?.estado) params.set("estado", paciente.estado);
    params.set("limit", String(LIMIT));
    params.set("page", String(page));
    return params;
  }

  const buscar = useCallback(async () => {
    setCarregando(true);
    setPagina(1);
    try {
      const params = new URLSearchParams();
      if (ramo) params.set("ramo", ramo);
      if (presencial && !remoto && paciente?.cidade) params.set("cidade", paciente.cidade);
      else if (remoto && !presencial && abrangencia === "Estado" && paciente?.estado) params.set("estado", paciente.estado);
      params.set("limit", String(LIMIT));
      params.set("page", "1");
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

  async function carregarMais() {
    const proxPagina = pagina + 1;
    setCarregandoMais(true);
    try {
      const res = await fetch(`/api/profissionais?${buildParams(proxPagina).toString()}`);
      const json = await res.json();
      setProfissionais((prev) => [...prev, ...(json.data ?? [])]);
      setTotalProfissionais(json.total ?? 0);
      setPagina(proxPagina);
    } catch {
      // mantém lista atual
    } finally {
      setCarregandoMais(false);
    }
  }

  useEffect(() => {
    if (aberto) buscar();
  }, [aberto, buscar]);

  function fechar() {
    setRamo(ramoInicial ?? "");
    setPresencial(false);
    setRemoto(false);
    setAbrangencia("");
    setBusca("");
    setProfissionais([]);
    setTotalProfissionais(0);
    setPagina(1);
    onFechar();
  }

  const label = labelAbrangencia();
  const profissionaisFiltrados = busca.trim()
    ? profissionais.filter((p) =>
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.cidade.toLowerCase().includes(busca.toLowerCase())
      )
    : profissionais;

  return (
    <Dialog open={aberto} onOpenChange={fechar}>
      <DialogContent className="max-w-3xl max-h-[96vh] flex flex-col bg-[#FFFDF0] border-0 p-0 overflow-hidden gap-0">

        {/* ─── Cabeçalho ───────────────────────────────────────────────── */}
        <div className="bg-[#5C8A3C] px-6 pt-6 pb-5">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Buscar Profissionais
            </DialogTitle>
            <p className="text-white/70 text-sm mt-1">
              Encontre o profissional ideal para o seu momento
            </p>
          </DialogHeader>
        </div>

        {/* ─── Filtros ─────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-stone-100 px-6 py-4 space-y-4">

          {/* Campo de busca */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome do profissional ou cidade..."
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-stone-200 bg-[#FFFDF0] text-stone-700 placeholder-stone-400 focus:outline-none focus:border-[#5C8A3C]/50 focus:ring-1 focus:ring-[#5C8A3C]/20 transition"
            />
            {busca && (
              <button
                onClick={() => setBusca("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* Especialidade */}
            <div className="bg-[#EBF4E3] rounded-xl p-3 space-y-2">
              <p className="text-xs font-bold text-[#5C8A3C] uppercase tracking-widest">Especialidade</p>
              <div className="flex gap-1.5 flex-wrap">
                {["", ...RAMOS].map((r) => (
                  <button
                    key={r || "todos"}
                    onClick={() => setRamo(r)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                      ramo === r
                        ? "bg-[#5C8A3C] text-white shadow-sm"
                        : "bg-white border border-[#5C8A3C]/20 text-stone-600 hover:border-[#5C8A3C]/50 hover:text-[#5C8A3C]"
                    }`}
                  >
                    {r || "Todos"}
                  </button>
                ))}
              </div>
            </div>

            {/* Modalidade */}
            <div className="bg-[#F5EDD0] rounded-xl p-3 space-y-2">
              <p className="text-xs font-bold text-[#7A5C2E] uppercase tracking-widest">Modalidade</p>
              <div className="flex gap-1.5 flex-wrap items-center">
                <button
                  onClick={() => setPresencial(!presencial)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
                    presencial
                      ? "bg-[#7A5C2E] text-white shadow-sm"
                      : "bg-white border-[#7A5C2E]/20 text-stone-600 hover:border-[#7A5C2E]/50 hover:text-[#7A5C2E]"
                  }`}
                >
                  Presencial
                </button>
                <button
                  onClick={() => { setRemoto(!remoto); if (remoto) setAbrangencia(""); }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
                    remoto
                      ? "bg-[#7A5C2E] text-white shadow-sm"
                      : "bg-white border-[#7A5C2E]/20 text-stone-600 hover:border-[#7A5C2E]/50 hover:text-[#7A5C2E]"
                  }`}
                >
                  Remoto
                </button>
                {remoto && (
                  <>
                    <button
                      onClick={() => setAbrangencia(abrangencia === "Brasil" ? "" : "Brasil")}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
                        abrangencia === "Brasil"
                          ? "bg-[#7A5C2E] text-white shadow-sm"
                          : "bg-white border-[#7A5C2E]/20 text-stone-600 hover:border-[#7A5C2E]/50 hover:text-[#7A5C2E]"
                      }`}
                    >
                      Brasil
                    </button>
                    {paciente?.estado && (
                      <button
                        onClick={() => setAbrangencia(abrangencia === "Estado" ? "" : "Estado")}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
                          abrangencia === "Estado"
                            ? "bg-[#7A5C2E] text-white shadow-sm"
                            : "bg-white border-[#7A5C2E]/20 text-stone-600 hover:border-[#7A5C2E]/50 hover:text-[#7A5C2E]"
                        }`}
                      >
                        {paciente.estado}
                      </button>
                    )}
                  </>
                )}
              </div>
              {label && (
                <p className="text-xs text-[#7A5C2E] font-medium flex items-center gap-1">
                  <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {label}
                </p>
              )}
            </div>
          </div>

          {/* Botão buscar */}
          <button
            onClick={buscar}
            disabled={carregando}
            className="w-full bg-[#5C8A3C] hover:bg-[#3A6624] text-white text-sm font-semibold py-2.5 rounded-xl shadow-sm shadow-[#5C8A3C]/20 transition-all duration-200 disabled:opacity-60"
          >
            {carregando ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {/* ─── Resultados ──────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {carregando ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-2 border-[#5C8A3C]/20 border-t-[#5C8A3C] rounded-full animate-spin" />
              <p className="text-sm text-stone-400">Buscando profissionais...</p>
            </div>
          ) : profissionaisFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
              <div className="w-14 h-14 rounded-full bg-[#EBF4E3] flex items-center justify-center mb-1">
                <svg className="w-7 h-7 text-[#5C8A3C]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-stone-500 text-sm font-medium">Nenhum profissional encontrado</p>
              <p className="text-stone-400 text-xs">Tente ajustar os filtros ou a busca</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-stone-400 mb-3">
                {busca.trim()
                  ? `${profissionaisFiltrados.length} resultado${profissionaisFiltrados.length !== 1 ? "s" : ""} para "${busca}"`
                  : totalProfissionais > profissionais.length
                    ? `Exibindo ${profissionais.length} de ${totalProfissionais} profissionais`
                    : `${profissionais.length} profissional${profissionais.length !== 1 ? "is" : ""} encontrado${profissionais.length !== 1 ? "s" : ""}`}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profissionaisFiltrados.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-stone-100 hover:border-[#5C8A3C]/30 hover:shadow-md hover:shadow-[#5C8A3C]/5 transition-all duration-200 p-4 flex flex-col gap-3"
                  >
                    {/* Avatar + nome + ramo */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#EBF4E3] border border-[#5C8A3C]/15 flex items-center justify-center shrink-0 overflow-hidden">
                        {p.foto ? (
                          <img src={p.foto} alt={p.nome} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-[#5C8A3C]">
                            {p.nome.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#3B2A14] text-sm leading-tight truncate">{p.nome}</p>
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${COR_RAMO[p.ramo] ?? "bg-stone-100 text-stone-600"}`}>
                          {p.ramo}
                        </span>
                      </div>
                    </div>

                    {/* Localização + modalidades */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <svg className="w-3.5 h-3.5 shrink-0 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {p.cidade}, {p.estado}
                      </div>
                      {p.atendimento?.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap">
                          {p.atendimento.map((a) => (
                            <span key={a} className="text-xs bg-[#EBF4E3] text-[#5C8A3C] font-medium px-2 py-0.5 rounded-full">
                              {a}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Contatos */}
                    <div className="flex flex-col gap-1.5 pt-2.5 border-t border-stone-100">
                      <a
                        href={`mailto:${p.email}`}
                        className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#5C8A3C] transition-colors"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {p.email}
                      </a>
                      {p.telefone && (
                        <a
                          href={`https://wa.me/55${p.telefone.replace(/\D/g, "")}?text=${encodeURIComponent("Olá, cheguei até você através do Calma mente. Gostaria de marcar uma avaliação/consulta.")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#5C8A3C] transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {p.telefone}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {profissionais.length < totalProfissionais && !busca.trim() && (
                <button
                  onClick={carregarMais}
                  disabled={carregandoMais}
                  className="mt-4 w-full py-2.5 rounded-xl border border-[#5C8A3C]/30 text-[#5C8A3C] text-sm font-semibold hover:bg-[#EBF4E3] transition-colors disabled:opacity-60"
                >
                  {carregandoMais
                    ? "Carregando..."
                    : `Ver mais ${Math.min(LIMIT, totalProfissionais - profissionais.length)} profissionais`}
                </button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
